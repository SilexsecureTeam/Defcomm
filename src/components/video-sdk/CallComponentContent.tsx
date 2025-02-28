import React, { useState, useContext, useEffect, useMemo } from "react"; 
import logo from "../../assets/logo.png";
import CallSummary from "../Chat/CallSummary";
import CallInfo from "../Chat/CallInfo";
import CallControls from "../Chat/CallControls";
import { sendMessageUtil } from "../../utils/chat/sendMessageUtil";
import { onFailure } from "../../utils/notifications/OnFailure";
import { onSuccess } from "../../utils/notifications/OnSuccess";
import { createMeeting } from "./Api";
import { FaSpinner } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useSendMessageMutation } from "../../hooks/useSendMessageMutation";
import { axiosClient } from "../../services/axios-client";

const CallComponentContent = ({ meetingId, setMeetingId }: any) => {
    const [isMeetingActive, setIsMeetingActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
    const [isRinging, setIsRinging] = useState(true);
    const [callDuration, setCallDuration] = useState(0);
    const [isInitiator, setIsInitiator] = useState(false);
    const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);

    const { authDetails } = useContext(AuthContext);
    const { selectedChatUser } = useContext(ChatContext);
    const messageData = selectedChatUser?.chat_meta;
    const client = axiosClient(authDetails?.access_token);
    const sendMessageMutation = useSendMessageMutation(client);

    const { join, leave, participants, localMicOn, toggleMic } = useMeeting({
        onMeetingJoined: () => {
            console.log("✅ onMeetingJoined Triggered");
            setIsLoading(false);
            setIsMeetingActive(true);
            onSuccess({ message: "Call Started", success: "You have successfully joined the interview" });

            if (!localMicOn) toggleMic();
        },
        onMeetingLeft: () => {
            console.log("❌ onMeetingLeft Triggered");
            setIsMeetingActive(false);
            setCallDuration(0);
            setIsRinging(true);
            if (callTimer) clearInterval(callTimer);
        },
        onParticipantJoined: (participant) => {
            console.log("✅ New participant joined:", participant);
            setIsRinging(false);

            // Start call duration only if it's not already running
            if (!callTimer) {
                const timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
                setCallTimer(timer);
            }
        },
        onParticipantLeft: () => {
            console.log("⚠ Participant Left");
            if (Object.keys(participants).length <= 1) {
                setIsRinging(true);
                if (callTimer) {
                    clearInterval(callTimer);
                    setCallTimer(null);
                }
            }
        },
        onError: (error) => {
            onFailure({ message: "Technical Error", error: error?.message || "An error occurred" });
        },
    });

    // Create Meeting
    const handleCreateMeeting = async () => {
        setIsCreatingMeeting(true);
        try {
            const newMeetingId = await createMeeting();
            if (!newMeetingId) throw new Error("No meeting ID returned.");

            setMeetingId(newMeetingId);
            setIsInitiator(true);
            console.log("Meeting Created:", newMeetingId);
        } catch (error) {
            onFailure({ message: "Meeting Creation Failed", error: error.message });
        } finally {
            setIsCreatingMeeting(false);
        }
    };

    // Start Call (for initiator)
    const handleStartCall = async () => {
        if (!meetingId) {
            onFailure({ message: "Meeting ID Error", error: "Meeting ID is missing." });
            return;
        }

        setIsLoading(true);
        try {
            console.log("Joining as Initiator...");
            join(); // Initiator joins first

            setTimeout(async () => {
                console.log("Sending Call Invite...");
                await sendMessageUtil({
                    client,
                    message: `CALL_INVITE:${meetingId}`,
                    file: null,
                    chat_user_type: messageData.chat_user_type,
                    chat_user_id: messageData.chat_user_id,
                    chat_id: messageData.chat_id,
                    sendMessageMutation,
                });
                console.log("Call Invite Sent!");
            }, 1000); // Small delay to ensure initiator is inside
        } catch (error: any) {
            console.error("❌ Error joining meeting:", error);
            onFailure({
                message: "Meeting Join Failed",
                error: error.message || "Something went wrong while joining the meeting.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Join Meeting (for invited participant)
    const handleJoinMeeting = () => {
        if (!meetingId) {
            onFailure({ message: "Meeting ID Error", error: "Meeting ID is missing." });
            return;
        }
        setIsLoading(true);
        join();
    };

    // Memoize participant count
    
    useEffect(() => {
        const participantCount = [...participants?.values()].length;
        console.log("Participants Count:", participantCount);

        if (isMeetingActive) {
            setIsRinging(participantCount < 2);
        }

        return () => {
            if (callTimer) clearInterval(callTimer);
        };
    }, [participantCount, isMeetingActive, participants]);

    return (
        <div className="w-96 py-10 flex flex-col items-center mt-4 md:mt-0">
            <CallSummary callSummary={isMeetingActive ? null : { duration: callDuration, caller: authDetails?.user?.name || "Unknown" }} />

            {!isMeetingActive ? (
                <>
                    {!meetingId ? (
                        <button onClick={handleCreateMeeting} className="bg-oliveLight hover:oliveDark text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                            Initiate Call {isCreatingMeeting && <FaSpinner className="animate-spin" />}
                        </button>
                    ) : isInitiator ? (
                        <button onClick={handleStartCall} className="bg-blue-600 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                            Start Call {isLoading && <FaSpinner className="animate-spin" />}
                        </button>
                    ) : (
                        <button onClick={handleJoinMeeting} className="bg-green-600 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                            Join Call {isLoading && <FaSpinner className="animate-spin" />}
                        </button>
                    )}
                </>
            ) : (
                <>
                    {isRinging && <p className="text-gray-500 text-lg font-semibold">Ringing...</p>}
                    <CallInfo callerName={authDetails?.user?.name || "Unknown"} callDuration={callDuration} />
                    <CallControls />
                    <button onClick={() => { 
                        console.log("Leaving Meeting...");
                        leave();
                        setIsMeetingActive(false);
                        setCallDuration(0);
                        setMeetingId(null); // Prevent initiator from resetting
                    }} className="bg-red-500 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                        <MdCallEnd /> End Call
                    </button>
                </>
            )}

            <div className="relative mt-8 text-gray-700 font-medium">
                <p className="absolute right-3 z-10 top-[-2px]">Secured by</p>
                <img src={logo} alt="Defcomm Icon" className="relative w-40 filter invert" />
            </div>
        </div>
    );
};

export default CallComponentContent;
            

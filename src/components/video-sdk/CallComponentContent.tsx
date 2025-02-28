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
import { useMeeting } from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useSendMessageMutation } from "../../hooks/useSendMessageMutation";
import { axiosClient } from "../../services/axios-client";

const CallComponentContent = ({ meetingId, setMeetingId }: any) => {
    const [isMeetingActive, setIsMeetingActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
    const [isRinging, setIsRinging] = useState(true);
    const [other, setOther] = useState(null);
    const [me, setMe] = useState(null);
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

            // Ensure the microphone is turned on
            if (!localMicOn) {
                console.log("🔊 Toggling mic on...");
                toggleMic();
            }
        },
        onMeetingLeft: () => {
            console.log("🔴 Meeting Left");
            setIsMeetingActive(false);
            setIsRinging(false);
            setCallDuration(0);
            if (callTimer) clearInterval(callTimer);
        },
        onParticipantJoined: (participant) => {
            console.log("✅ New participant joined:", participant);
            setIsRinging(false);

            // Ensure call timer starts only once
            if (!callTimer) {
                const timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
                setCallTimer(timer);
            }

            // Debug: Check if audio track exists
            console.log("🔊 Audio Track Received:", participant.audioTrack);

            // Play the participant's audio if available
            if (participant.audioTrack) {
                const audio = new Audio();
                audio.srcObject = new MediaStream([participant.audioTrack]);
                audio.play().catch((err) => console.error("❌ Audio Play Error:", err));
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

    useEffect(() => {
        // Ensure microphone is turned on when the meeting starts
        if (isMeetingActive && !localMicOn) {
            console.log("🔊 Enabling microphone manually...");
            toggleMic();
        }
    }, [isMeetingActive, localMicOn]);

    useEffect(() => {
        console.log("Participants Count:", [...participants.values()].length);

        if (isMeetingActive) {
            setIsRinging([...participants.values()].length < 2);
        }

        return () => {
            if (callTimer) clearInterval(callTimer);
        };
    }, [participants, isMeetingActive]);

    // Create Meeting
    const handleCreateMeeting = async () => {
        setIsCreatingMeeting(true);
        try {
            const newMeetingId = await createMeeting();
            if (!newMeetingId) throw new Error("No meeting ID returned.");

            setMeetingId(newMeetingId);
            setIsInitiator(true);
            console.log("Meeting Created:", newMeetingId);
        } catch (error: any) {
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
            join();

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
            }, 1000);
        } catch (error: any) {
            console.error("❌ Error joining meeting:", error);
            onFailure({ message: "Meeting Join Failed", error: error.message || "Something went wrong." });
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
                    <CallInfo callerName={authDetails?.user?.name || "Unknown"} callDuration={callDuration} />
                    <CallControls />
                    <button onClick={leave} className="bg-red-500 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                        <MdCallEnd /> End Call
                    </button>
                </>
            )}
        </div>
    );
};

export default CallComponentContent;
>
    );
};

export default CallComponentContent;
                       

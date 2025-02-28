import React, { useState, useContext, useEffect } from "react";
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
    const [isInitiator, setIsInitiator] = useState(false); // Track initiator status

    const { authDetails } = useContext(AuthContext);
    const { selectedChatUser } = useContext(ChatContext);
    const messageData = selectedChatUser?.chat_meta;
    const client = axiosClient(authDetails?.access_token);
    const sendMessageMutation = useSendMessageMutation(client);

    const { join, leave, participants } = useMeeting({
        onMeetingJoined: () => {
            onSuccess({ message: "Call Started", success: "You have successfully joined the interview" });
            setIsLoading(false);
            setIsMeetingActive(true);
        },
        onMeetingLeft: () => {
            setIsMeetingActive(false);
            setCallDuration(0);
            
        },
        onError: (error) => {
            onFailure({ message: "Technical Error", error: error?.message || "An error occurred" });
        },
    });

    // Step 1: Create Meeting (But don't join yet)
    const handleCreateMeeting = async () => {
        setIsCreatingMeeting(true);
        try {
            const newMeetingId = await createMeeting();
            if (!newMeetingId) throw new Error("No meeting ID returned.");

            setMeetingId(newMeetingId);
            setIsInitiator(true); // Mark user as initiator
            console.log("Meeting Created:", newMeetingId);
        } catch (error) {
            onFailure({ message: "Meeting Creation Failed", error: error.message });
        } finally {
            setIsCreatingMeeting(false);
        }
    };

    // Step 2: Start Call (Send Invite & Join)
    const handleStartCall = async () => {
        if (!meetingId) {
            onFailure({ message: "Meeting ID Error", error: "Meeting ID is missing." });
            return;
        }

        setIsLoading(true);
        try {
            console.log("Starting Call with ID:", meetingId);

            // Send Invite Message **before joining**
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

            join(); // Now join the meeting
        } catch (error: any) {
            console.error("❌ Error joining meeting:", error);
            onFailure({
                message: "Meeting Join Failed",
                error: error.message || "Something went wrong while joining the meeting.",
            });
            setIsLoading(false);
        }
    };

    // Step 3: Join Meeting (For other users)
    const handleJoinMeeting = () => {
        if (!meetingId) {
            onFailure({ message: "Meeting ID Error", error: "Meeting ID is missing." });
            return;
        }
        setIsLoading(true);
        join();
    };

   useEffect(() => {
    let callTimer: NodeJS.Timeout | null = null;

    if (isMeetingActive) {
        const participantCount = [...participants?.values()]?.length;

        if (participantCount >= 2) { // Ensure at least 2 participants
            setIsRinging(false);
            callTimer = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        } else {
            setIsRinging(true);
        }
    }

    return () => {
        if (callTimer) clearInterval(callTimer);
    };
}, [isMeetingActive, participants]);


    return (
        <div className="w-96 py-10 flex flex-col items-center mt-4 md:mt-0">
            <CallSummary callSummary={isMeetingActive ? null : { duration: callDuration, caller: authDetails?.user?.name || "Unknown" }} />

            {!isMeetingActive ? (
                <>
                    {!meetingId ? (
                        // Step 1: Create Meeting
                        <button onClick={handleCreateMeeting} className="bg-oliveLight hover:oliveDark text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                            Initiate Call {isCreatingMeeting && <FaSpinner className="animate-spin" />}
                        </button>
                    ) : isInitiator ? (
                        // Step 2: Start Call (Only for Initiator)
                        <button onClick={handleStartCall} className="bg-blue-600 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                            Start Call {isLoading && <FaSpinner className="animate-spin" />}
                        </button>
                    ) : (
                        // Step 3: Join Call (For other users)
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
                    <button onClick={() => {setMeetingId(null); leave()}} className="bg-red-500 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
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

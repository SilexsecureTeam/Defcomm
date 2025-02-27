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

const CallComponentContent = ({ meetingId, setMeetingId }) => {
    const [isMeetingActive, setIsMeetingActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [isRinging, setIsRinging] = useState(true);
    const [showCallSummary, setShowCallSummary] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);

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
            setShowCallSummary(false);
        },
        onMeetingLeft: () => {
            setIsMeetingActive(false);
            setCallDuration(0);
            setShowCallSummary(true);
            setTimerStarted(false);
        },
        onError: (error) => {
            onFailure({ message: "Technical Error", error: error?.message || "An error occurred" });
        },
    });

    useEffect(() => {
        let callTimer = null;

        if (isMeetingActive) {
            const participantCount = Object.keys(participants).length;
            if (participantCount > 1) {
                setIsRinging(false);
                setTimerStarted(true);
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

    const handleCreateMeeting = async () => {
        setIsCreatingMeeting(true);
        try {
            const newMeetingId = await createMeeting();
            if (!newMeetingId) throw new Error("No meeting ID returned.");
            setMeetingId(newMeetingId);
        } catch (error) {
            onFailure({ message: "Meeting Creation Failed", error: error.message });
        } finally {
            setIsCreatingMeeting(false);
        }
    };

    const handleJoinMeeting = async () => {
        setIsLoading(true);
        if (!meetingId) {
            onFailure({ message: "Meeting ID Error", error: "Meeting ID is missing." });
            return;
        }
        try {
            await sendMessageUtil({
                client,
                message: `CALL_INVITE:${meetingId}`,
                file: null,
                chat_user_type: messageData.chat_user_type,
                chat_user_id: messageData.chat_user_id,
                chat_id: messageData.chat_id,
                sendMessageMutation,
            });

            join();
        } catch (error) {
            setIsLoading(false);
            console.error("❌ Error handling meeting:", error);
            onFailure({
                message: "Meeting Start/Join Failed",
                error: error.message || "Something went wrong while starting/joining the meeting.",
            });
        }
    };

    return (
        <div className="w-96 py-10 flex flex-col items-center mt-4 md:mt-0">
            {showCallSummary && <CallSummary callSummary={{ duration: callDuration, caller: authDetails?.user?.name || "Unknown" }} />}

            {!isMeetingActive ? (
                <>
                    {!meetingId ? (
                        <button onClick={handleCreateMeeting} className="bg-oliveLight hover:oliveDark text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                            Initiate Call {isCreatingMeeting && <FaSpinner className="animate-spin" />}
                        </button>
                    ) : (
                        <button onClick={handleJoinMeeting} className="bg-green-600 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                            Start Call {isLoading && <FaSpinner className="animate-spin" />}
                        </button>
                    )}
                </>
            ) : (
                <>
                    {isRinging && <p className="text-gray-500 text-lg font-semibold">Ringing...</p>}
                    {timerStarted && <CallInfo callerName={authDetails?.user?.name || "Unknown"} callDuration={callDuration} />}
                    <CallControls />
                    <button onClick={leave} className="bg-red-500 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
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

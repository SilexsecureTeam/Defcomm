import React, { useState, useContext, useEffect } from "react";
import logo from "../../assets/logo.png";
import CallSummary from "../Chat/CallSummary";

import { sendMessageUtil } from "../../utils/chat/sendMessageUtil";
import { onFailure } from "../../utils/notifications/OnFailure";
import { onSuccess } from "../../utils/notifications/OnSuccess";
import { createMeeting } from "./Api";
import { FaSpinner } from "react-icons/fa";
import { useMeeting } from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useSendMessageMutation } from "../../hooks/useSendMessageMutation";
import { axiosClient } from "../../services/axios-client";
import ParticipantMedia from "./ParticipantMedia";
import Receiver from "./Receiver";

const CallComponentContent = ({ meetingId, setMeetingId }: any) => {
    const [isMeetingActive, setIsMeetingActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
    const [isRinging, setIsRinging] = useState(true);
    const [callDuration, setCallDuration] = useState(0);
    const [isInitiator, setIsInitiator] = useState(false);
    const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [other, setOther] = useState(null);
    const [me, setMe] = useState(null);
    const { authDetails } = useContext(AuthContext);
    const { selectedChatUser } = useContext(ChatContext);
    const messageData = selectedChatUser?.chat_meta;
    const client = axiosClient(authDetails?.access_token);
    const sendMessageMutation = useSendMessageMutation(client);

    const { join, participants, localMicOn, toggleMic, leave } = useMeeting({
        onMeetingJoined: () => {
            console.log("✅ onMeetingJoined Triggered");
            setIsLoading(false);
            setIsMeetingActive(true);
            setShowSummary(false);
            onSuccess({ message: "Call Started", success: "You have successfully joined the call" });

            if (!localMicOn) toggleMic();
        },
        onMeetingLeft: () => {
            console.log("❌ Meeting Left");
            setIsMeetingActive(false);
            setShowSummary(true);
            if (callTimer) {
                clearInterval(callTimer);
                setCallDuration(0); // Reset call duration
                setCallTimer(null);
            }

        },
        onParticipantJoined: (participant) => {
            console.log("✅ New participant joined:", participant);
            setIsRinging(false);

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

    const getMe = () => {
        const speakerParticipants = [...participants.values()].find(
            (current) => Number(current.id) === Number(authDetails?.user?.id)
        );
        console.log(speakerParticipants)
        setMe(speakerParticipants);
    };

    const getOther = () => {
        const speakerParticipants = [...participants.values()].find(
            (current) => Number(current.id) !== Number(authDetails?.user?.id)
        );
        console.log(speakerParticipants)
        setOther(speakerParticipants)
    };
    const handleLeave = () => {
        leave();
        setShowSummary(true);
        clearInterval(callTimer);
        setCallTimer(null);
    }
    // Ensure participant audio plays
    useEffect(() => {

        if (participants && isMeetingActive) {
            getMe(), getOther();
        }
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
            setIsLoading(false);
            console.error("❌ Error joining meeting:", error);
            onFailure({
                message: "Meeting Join Failed",
                error: error.message || "Something went wrong while joining the meeting.",
            });
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

    useEffect(() => {
        const participantCount = [...participants.values()].length;
        console.log("Participants Count:", participantCount);
        setIsRinging(participantCount < 2);
    }, [participants]);

    useEffect(() => {
        if (isMeetingActive && !localMicOn) {
            toggleMic();
        }
    }, [isMeetingActive, localMicOn]);


    return (
        <div className="w-96 py-10 flex flex-col items-center mt-4 md:mt-0">
            {showSummary && (
                <CallSummary callSummary={{ duration: callDuration, caller: authDetails?.user?.name || "Unknown" }} />
            )}

            {!isMeetingActive ? (
                <>
                    {!meetingId ? (
                        <button onClick={handleCreateMeeting} className="bg-oliveLight hover:oliveDark text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                            Initiate Call {isCreatingMeeting && <FaSpinner className="animate-spin" />}
                        </button>
                    ) : isInitiator ? (
                        <button onClick={handleStartCall} className="bg-green-600 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
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
                    <div className="flex flex-col gap-2 items-center">
                        {other && <Receiver participantId={other?.id} />}
                        {me && <ParticipantMedia participantId={me?.id} auth={authDetails} isRinging={isRinging} callDuration={callDuration} handleLeave={handleLeave} />}


                    </div>

                </>
            )}

            <img src={logo} alt="Defcomm Icon" className="w-40 mt-8 filter invert" />
        </div>
    );
};

export default CallComponentContent;

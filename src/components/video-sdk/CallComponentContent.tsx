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
import { useMeeting } from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useSendMessageMutation } from "../../hooks/useSendMessageMutation";
import { axiosClient } from "../../services/axios-client";
import ParticipantMedia from "./ParticipantMedia";

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
    const [isMicEnabled, setIsMicEnabled] = useState(true);
    const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
    const { join, leave, participants, localMicOn, toggleMic } = useMeeting({
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
            (current) => current.id === authDetails?.user?.role
        );
        console.log(speakerParticipants)
        setMe(speakerParticipants);
    };

    const getOther = () => {
        const speakerParticipants = [...participants.values()].find(
            (current) => current.id !== authDetails?.user?.role
        );
        console.log(speakerParticipants)
        setOther(speakerParticipants)
    };

    // Ensure participant audio plays
    useEffect(() => {
        // participants.forEach((participant) => {
        //     if (participant.audioTrack) {
        //         console.log("🎤 Attaching audio track:", participant.audioTrack);
        //         const audio = document.createElement("audio");
        //         audio.srcObject = new MediaStream([participant.audioTrack]);
        //         audio.autoplay = true;
        //         audio.muted = false;
        //         document.body.appendChild(audio);
        //     }
        // });
if(isMeetingActive){
    getMe(), getOther();
}
    }, [isMeetingActive]);

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
                    <div className="flex items-center flex-wrap">
                    <ParticipantMedia participantId={me?.id} auth={authDetails} setIsMicEnabled={setIsMicEnabled} isMicEnabled={isMicEnabled} />}
                    <ParticipantMedia participantId={other?.id} auth={authDetails} setIsMicEnabled={setIsMicEnabled} isMicEnabled={isMicEnabled} />
                    
                    </div>
                    {isRinging && <p className="text-gray-500 text-lg font-semibold">Ringing...</p>}
                    <CallInfo callerName={authDetails?.user?.name || "Unknown"} callDuration={callDuration} />
                    <CallControls
                        isMuted={isMicEnabled}
                        toggleMute={setIsMicEnabled}
                        isSpeakerOn={isSpeakerEnabled} 
                        toggleSpeaker={()=>setIsSpeakerEnabled(!isSpeakerEnabled)} 
                    />

                    <button onClick={() => { leave(); setShowSummary(true); }} className="bg-red-500 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                        <MdCallEnd /> End Call
                    </button>
                </>
            )}

            <img src={logo} alt="Defcomm Icon" className="w-40 mt-8 filter invert" />
        </div>
    );
};

export default CallComponentContent;

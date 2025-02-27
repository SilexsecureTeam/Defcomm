import React, { useState, useContext, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import { createMeeting, getAuthToken } from "./Api";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
} from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import logo from "../../assets/logo.png";
import CallSummary from "../Chat/CallSummary";
import CallInfo from "../Chat/CallInfo";
import CallControls from "../Chat/CallControls";
import { sendMessageUtil } from "../../utils/chat/sendMessageUtil";
import { axiosClient } from "../../services/axios-client";
import { useSendMessageMutation } from "../../hooks/useSendMessageMutation";
import { onFailure } from "../../utils/notifications/OnFailure";

const CallComponent = ({ initialMeetingId }: { initialMeetingId?: string }) => {
  const [meetingId, setMeetingId] = useState<string | null>(initialMeetingId || null);
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callSummary, setCallSummary] = useState<{ caller: string; duration: number } | null>(null);

  const { authDetails } = useContext(AuthContext);
  const { selectedChatUser } = useContext(ChatContext);
  const messageData = selectedChatUser?.chat_meta;

  const client = axiosClient(authDetails?.access_token);
  const sendMessageMutation = useSendMessageMutation(client);

  return (
    <MeetingProvider
      config={{
        meetingId: meetingId || "",
        micEnabled: !isMuted,
        name: authDetails?.user?.name || `User-${authDetails?.user?.id}`,
        participantId: authDetails?.user?.id || `random-${Math.random()}`,
      }}
      token={getAuthToken()}
    >
      <CallComponentContent
        meetingId={meetingId}
        setMeetingId={setMeetingId}
        isMeetingActive={isMeetingActive}
        setIsMeetingActive={setIsMeetingActive}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isSpeakerOn={isSpeakerOn}
        setIsSpeakerOn={setIsSpeakerOn}
        callDuration={callDuration}
        setCallDuration={setCallDuration}
        callSummary={callSummary}
        setCallSummary={setCallSummary}
        selectedChatUser={selectedChatUser}
        authDetails={authDetails}
        messageData={messageData}
        client={client}
        sendMessageMutation={sendMessageMutation}
      />
    </MeetingProvider>
  );
};

const CallComponentContent = ({
  meetingId,
  setMeetingId,
  isMeetingActive,
  setIsMeetingActive,
  isLoading,
  setIsLoading,
  isMuted,
  setIsMuted,
  isSpeakerOn,
  setIsSpeakerOn,
  callDuration,
  setCallDuration,
  callSummary,
  setCallSummary,
  authDetails,
  selectedChatUser,
  messageData,
  client,
  sendMessageMutation,
}: any) => {
  const meeting = useMeeting({
    onParticipantJoined: (participant) => {
      console.log("🔹 Participant joined:", participant);
    },
    onParticipantLeft: (participant) => {
      console.log("🔸 Participant left:", participant);
    },
  });

  const participants = meeting?.participants || {};
  const numParticipants = Object.keys(participants).length;

  useEffect(() => {
    let callTimer: NodeJS.Timeout | null = null;

    if (numParticipants >= 2) {
      callTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }

    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [numParticipants]);

  const handleToggleMeeting = async () => {
    if (isMeetingActive) {
      setCallSummary({
        duration: callDuration,
        caller: authDetails?.user?.name || "Unknown",
      });
      setMeetingId(null);
      setIsMeetingActive(false);
      setCallDuration(0);
    } else {
      setIsLoading(true);
      try {
        let newMeetingId = meetingId;

        if (!newMeetingId) {
          newMeetingId = await createMeeting();

          if (!newMeetingId) {
            onFailure({ message: "Meeting Creation Failed", error: "No meeting ID was returned." });
            setIsLoading(false);
            return;
          }

          console.log("✅ Meeting created with ID:", newMeetingId);

          if (!messageData || !sendMessageUtil) {
            onFailure({ message: "Failed to Send Invite", error: "Missing chat data or sendMessageUtil." });
            setIsLoading(false);
            return;
          }

          console.log("📨 Sending meeting invite...");
          await sendMessageUtil({
            client,
            message: `CALL_INVITE:${newMeetingId}`,
            file: null,
            chat_user_type: messageData.chat_user_type,
            chat_user_id: messageData.chat_user_id,
            chat_id: messageData.chat_id,
            sendMessageMutation,
          });
        } else {
          console.log(`🔗 Joining existing meeting: ${newMeetingId}`);
        }

        setMeetingId(newMeetingId);
        setIsMeetingActive(true);
        setCallSummary(null);
      } catch (error: any) {
        console.error("❌ Error handling meeting:", error);
        onFailure({
          message: "Meeting Start/Join Failed",
          error: error.message || "Something went wrong while starting/joining the meeting.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-96 py-10 flex flex-col items-center mt-4 md:mt-0">
      <CallSummary callSummary={callSummary} />

      {!isMeetingActive ? (
        <p className="text-gray-700 text-center font-medium">
          You can place a call to <br />
          <small className="text-xs text-gray-500">{selectedChatUser?.contact_name}</small>
        </p>
      ) : (
        <CallInfo callerName={authDetails?.user?.name || "Unknown"} callDuration={callDuration} />
      )}

      <p className="text-gray-700 text-center font-medium mt-2">
        {numParticipants === 0
          ? "Waiting for the other user to join..."
          : numParticipants === 1
          ? "You are in the call alone."
          : `Call Duration: ${callDuration}s`}
      </p>

      <CallControls
        isMuted={isMuted}
        isSpeakerOn={isSpeakerOn}
        toggleMute={() => setIsMuted((prev) => !prev)}
        toggleSpeaker={() => setIsSpeakerOn((prev) => !prev)}
      />

      <div className="relative mt-8 text-gray-700 font-medium">
        <p className="absolute right-3 z-10 top-[-2px]">Secured by</p>
        <img src={logo} alt="Defcomm Icon" className="relative w-40 filter invert" />
      </div>

      <button
        onClick={handleToggleMeeting}
        className={`${
          isMeetingActive ? "bg-red-500" : "bg-green-600"
        } text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2`}
      >
        {isLoading ? (
          <FaSpinner size={24} className="animate-spin" />
        ) : isMeetingActive ? (
          <>
            <MdCallEnd className="text-lg" /> End Call
          </>
        ) : meetingId ? (
          "Join Call"
        ) : (
          "Start Call"
        )}
      </button>
    </div>
  );
};

export default CallComponent;

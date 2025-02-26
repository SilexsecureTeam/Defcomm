import React, { useState, useContext, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import { createMeeting, getAuthToken } from "./Api";
import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import logo from "../../assets/logo.png";
import CallSummary from "../Chat/CallSummary";
import CallInfo from "../Chat/CallInfo";
import CallControls from "../Chat/CallControls";

function CallComponent() {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callSummary, setCallSummary] = useState<{ caller: string; duration: number } | null>(null);
  const { authDetails } = useContext(AuthContext);
  const { selectedChatUser } = useContext(ChatContext);

  useEffect(() => {
    let callTimer: NodeJS.Timeout | null = null;

    if (isMeetingActive) {
      callTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [isMeetingActive]);

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
        const newMeetingId = await createMeeting();
        setMeetingId(newMeetingId);
        setIsMeetingActive(true);
        setCallSummary(null);
      } catch (error) {
        console.error("Failed to create meeting:", error);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-96 py-10 flex flex-col items-center mt-4 md:mt-0">
      <CallSummary callSummary={callSummary} />
      {!isMeetingActive ? <p className="text-gray-700 text-center font-medium">You can place a call to <br/> <small className="text-xs text-gray-500">{selectedChatUser?.contact_name}</small></p> : <CallInfo callerName={authDetails?.user?.name || "Unknown"} callDuration={callDuration} />}
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
        className={`${isMeetingActive ? "bg-red-500" : "bg-green-600"} text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2`}
      >
        {isLoading ? (
          <FaSpinner size={24} className="animate-spin" />
        ) : isMeetingActive ? (
          <>
            <MdCallEnd className="text-lg" /> End Call
          </>
        ) : (
          "Start Call"
        )}
      </button>

      {isMeetingActive && meetingId && (
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: !isMuted,
            name: authDetails?.user?.name || "You",
          }}
          token={getAuthToken()}
        >
          <MeetingConsumer>
            {({ join }) => <button onClick={join} className="hidden"></button>}
          </MeetingConsumer>
        </MeetingProvider>
      )}
    </div>
  );
}

export default CallComponent;

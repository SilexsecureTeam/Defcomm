import React, { useState, useContext, useRef, useEffect } from "react";
// @ts-ignore
import logo from "../../../assets/logo.png";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { MeetingContext } from "../../../context/MeetingContext";
import { useMeeting } from "@videosdk.live/react-sdk";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import audioController from "../../../utils/audioController";
import ParticipantMedia from "./ParticipantMedia";
import CallSetupPanel from "./CallSetupPanel";
import { formatCallDuration } from "../../../utils/formmaters";
import useChat from "../../../hooks/useChat";

const CallComponentContent = ({ meetingId, setMeetingId }: any) => {
  const { authDetails } = useContext(AuthContext);
  const { selectedChatUser, callMessage, setCallMessage } =
    useContext(ChatContext);
  const { setProviderMeetingId } = useContext(MeetingContext);
  const { updateCallLog } = useChat();

  const [callDuration, setCallDuration] = useState(0);
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [isRinging, setIsRinging] = useState(true);
  const [other, setOther] = useState(null);
  const [me, setMe] = useState(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const callTimer = useRef<NodeJS.Timeout | null>(null);
  const callStartRef = useRef<number | null>(null);

  const { join, leave, participants, localMicOn, toggleMic } = useMeeting({
    onMeetingJoined: () => {
      setIsMeetingActive(true);
      onSuccess({ message: "Call Started", success: "Joined successfully." });
      // ✅ Mark call as ongoing if it hasn't been set already
      setCallMessage((prev) => {
        if (prev?.status !== "on") {
          return { ...prev, status: "on" };
        }
        return prev;
      });
      if (!localMicOn) toggleMic();
    },
    onMeetingLeft: () => {
      setIsMeetingActive(false);
      if (callTimer.current) clearInterval(callTimer.current);
    },
    onParticipantJoined: () => {
      setIsRinging(false);
      setCallMessage((prev) => ({ ...prev, status: "on" }));
      audioController.stopRingtone();

      if (!callStartRef.current) {
        callStartRef.current = Date.now();
        callTimer.current = setInterval(() => {
          const now = Date.now();
          const duration = Math.floor((now - callStartRef.current!) / 1000);
          setCallDuration(duration);
        }, 1000);
      }
    },
    onParticipantLeft: () => {
      const count = [...participants.values()].length;
      if (count <= 1) handleLeave();
    },
    onError: (err) => onFailure({ message: "Call Error", error: err.message }),
  });

  const handleLeave = async () => {
    if (callTimer.current) {
      clearInterval(callTimer.current);
      callTimer.current = null;
    }

    try {
      await updateCallLog.mutateAsync({
        mss_id: callMessage?.mss_id,
        duration: formatCallDuration(callDuration),
      } as any);

      onSuccess({
        message: "Call Ended",
        success: "You have successfully left the call",
      });
    } finally {
      leave();
      setIsMeetingActive(false);
      setMeetingId(null);
      audioController.stopRingtone();
      setCallMessage(null);
      setIsInitiator(false);
      setProviderMeetingId(null);
      setShowSummary(true);
    }
  };

  useEffect(() => {
    if (participants && isMeetingActive) {
      const myParticipant = [...participants.values()].find(
        (p) => Number(p.id) === Number(authDetails?.user?.id)
      );
      const otherParticipant = [...participants.values()].find(
        (p) => Number(p.id) !== Number(authDetails?.user?.id)
      );
      setMe(myParticipant);
      setOther(otherParticipant);
    }
  }, [participants, isMeetingActive]);

  return (
    <div className="flex flex-col items-center bg-olive p-5">
      <div className="relative w-full">
        {/* Setup Panel - stays mounted, just hidden when meeting is active */}
        <div className={isMeetingActive ? "hidden" : ""}>
          <CallSetupPanel
            meetingId={meetingId}
            setMeetingId={setMeetingId}
            setCallDuration={setCallDuration}
            join={join}
            setShowSummary={setShowSummary}
            showSummary={showSummary}
            callDuration={callDuration}
            isInitiator={isInitiator}
            setIsInitiator={setIsInitiator}
          />
        </div>

        {/* Participant Media - stays mounted, just hidden when not active */}
        <div className={!isMeetingActive ? "hidden" : ""}>
          {me && (
            <ParticipantMedia
              participantId={me.id}
              auth={authDetails}
              isRinging={isRinging}
              callDuration={callDuration}
              handleLeave={handleLeave}
              participant={other}
              isInitiator={true}
            />
          )}
        </div>
      </div>

      <img src={logo} alt="Defcomm Icon" className="w-40 mt-8 filter invert" />
    </div>
  );
};

export default CallComponentContent;

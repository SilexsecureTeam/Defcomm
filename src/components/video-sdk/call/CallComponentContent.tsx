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
import CallPiP from "./CallPiP";

const CallComponentContent = ({ meetingId, setMeetingId }: any) => {
  const { authDetails } = useContext(AuthContext);
  const { selectedChatUser, callMessage, setCallMessage } =
    useContext(ChatContext);
  const { updateCallLog } = useChat();
  const [showSummary, setShowSummary] = useState(false);
  const { setProviderMeetingId } = useContext(MeetingContext);
  const [isPiPMode, setIsPiPMode] = useState(false);

  const [callDuration, setCallDuration] = useState(0);
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [isRinging, setIsRinging] = useState(true);
  const [other, setOther] = useState(null);
  const [me, setMe] = useState(null);

  const callTimer = useRef(null);
  const callStartRef = useRef(null);

  const { join, leave, participants, localMicOn, toggleMic } = useMeeting({
    onMeetingJoined: () => {
      setIsMeetingActive(true);
      onSuccess({ message: "Call Started", success: "Joined successfully." });
      if (!localMicOn) toggleMic();
    },
    onMeetingLeft: () => {
      setIsMeetingActive(false);
      if (callTimer.current) clearInterval(callTimer.current);
    },
    onParticipantJoined: () => {
      setIsRinging(false);
      setCallMessage((prev) => ({
        ...prev,
        status: "on",
      }));
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
      setProviderMeetingId(null);
      setShowSummary(true);
    }
  };

  useEffect(() => {
    if (participants && isMeetingActive) {
      const me = [...participants.values()].find(
        (p) => Number(p.id) === Number(authDetails?.user?.id)
      );
      const other = [...participants.values()].find(
        (p) => Number(p.id) !== Number(authDetails?.user?.id)
      );
      setMe(me);
      setOther(other);
    }
  }, [participants, isMeetingActive]);

  return (
    <div className="flex flex-col items-center bg-olive p-5">
      <>
        {!isPiPMode ? (
          <div className="flex flex-col items-center bg-olive p-5">
            {!isMeetingActive ? (
              <CallSetupPanel
                meetingId={meetingId}
                setMeetingId={setMeetingId}
                setCallDuration={setCallDuration}
                join={join}
                showSummary={showSummary}
                callDuration={callDuration}
              />
            ) : (
              me && (
                <ParticipantMedia
                  participantId={me.id}
                  auth={authDetails}
                  isRinging={isRinging}
                  callDuration={callDuration}
                  handleLeave={handleLeave}
                  participant={other}
                  isInitiator={true}
                  setIsPiPMode={setIsPiPMode} // Pass this prop
                />
              )
            )}
            <img
              src={logo}
              alt="Defcomm Icon"
              className="w-40 mt-8 filter invert"
            />
          </div>
        ) : (
          <CallPiP
            callDuration={callDuration}
            onRestore={() => setIsPiPMode(false)}
            onEnd={handleLeave}
          />
        )}
      </>
    </div>
  );
};

export default CallComponentContent;

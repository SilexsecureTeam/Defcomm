import React, { useState, useContext, useRef, useEffect } from "react";
// @ts-ignore
import logo from "../../../assets/logo.png";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { MeetingContext } from "../../../context/MeetingContext";
import { useMeeting } from "@videosdk.live/react-sdk";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { onPrompt } from "../../../utils/notifications/onPrompt";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import audioController from "../../../utils/audioController";
import callerTone from "../../../assets/audio/caller.mp3";
import ParticipantMedia from "./ParticipantMedia";
import CallSetupPanel from "./CallSetupPanel";
import { formatCallDuration } from "../../../utils/formmaters";
import useChat from "../../../hooks/useChat";
import { useQueryClient } from "@tanstack/react-query";

const CallComponentContent = ({ meetingId, setMeetingId }: any) => {
  const { authDetails } = useContext<any>(AuthContext);
  const {
    callMessage,
    setCallMessage,
    callDuration,
    setCallDuration,
    setModalTitle,
  } = useContext(ChatContext);
  const { setProviderMeetingId } = useContext(MeetingContext);
  const { updateCallLog } = useChat();
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [isRinging, setIsRinging] = useState(true);
  const [other, setOther] = useState<any | null>(null);
  const [me, setMe] = useState<any | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const callTimer = useRef<NodeJS.Timeout | null>(null);
  const callStartRef = useRef<number | null>(null);
  const ringTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callLogUpdatedRef = useRef(false);
  const queryClient = useQueryClient();

  const { join, leave, participants, localMicOn, toggleMic } = useMeeting({
    onMeetingJoined: () => {
      setIsMeetingActive(true);
      onSuccess({ message: "Call Started", success: "Joined successfully." });
      audioController.playRingtone(callerTone);
      if (!localMicOn) toggleMic();
    },
    onMeetingLeft: () => {
      setIsMeetingActive(false);
      if (callTimer.current) clearInterval(callTimer.current);
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
      callStartRef.current = null;
      setIsRinging(false);
    },
    onParticipantJoined: () => {
      setIsRinging(false);
      setCallMessage((prev) => ({ ...prev, status: "on" }));
      audioController.stopRingtone();

      if (ringTimeoutRef.current) {
        clearTimeout(ringTimeoutRef.current);
        ringTimeoutRef.current = null;
      }

      if (!callStartRef.current) {
        callStartRef.current = Date.now();
        callTimer.current = setInterval(() => {
          const now = Date.now();
          const duration = Math.floor((now - callStartRef.current!) / 1000);
          setCallDuration(duration);
          setModalTitle(formatCallDuration(duration));
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
    console.log("Leaving call...", callDuration);

    if (callTimer.current) clearInterval(callTimer.current);

    const isMissed = callDuration === 0;
    const newState = isMissed ? "miss" : "pick";
    const newDuration = formatCallDuration(callDuration);

    // derive the mss id from possible callMessage shapes
    const mssId = callMessage?.id || null;

    // --- LOCAL CACHE UPDATE: mark message as 'pick' / 'miss' in any cached convo that contains it ---
    try {
      if (mssId) {
        // get all cached queries that start with ["chatMessages", ...]
        // getQueriesData returns [[queryKey, data], ...]
        const cached = queryClient.getQueriesData(["chatMessages"]);

        if (Array.isArray(cached)) {
          cached.forEach(([queryKey, data]) => {
            try {
              // queryKey is an array like ["chatMessages", "<contact_key>"]
              if (!Array.isArray(queryKey) || queryKey[0] !== "chatMessages")
                return;

              // Only update keys that look like your convo caches and have data
              queryClient.setQueryData(queryKey, (old: any) => {
                if (!old || !old.data || !Array.isArray(old.data)) return old;
                const found = old.data.some((m: any) => m.id_en === mssId);
                if (!found) return old;
                return {
                  ...old,
                  data: old.data.map((m: any) =>
                    m.id_en === mssId
                      ? {
                          ...m,
                          call_state: newState,
                          call_duration: newDuration,
                        }
                      : m
                  ),
                };
              });
            } catch (err) {
              console.warn(
                "chatMessages cache update inner fail for key",
                queryKey,
                err
              );
            }
          });
        } else {
          console.debug("No cached chatMessages found to update");
        }
      } else {
        console.debug(
          "No mssId found on callMessage; skipping local cache update"
        );
      }
    } catch (err) {
      console.warn("Failed to update chatMessages cache after call end:", err);
    }

    // 👇 Prevent double logging from both parties (server-side)
    if (!callLogUpdatedRef.current && callMessage?.id) {
      try {
        await updateCallLog.mutateAsync({
          mss_id: callMessage?.id,
          call_duration: newDuration,
          call_state: isMissed ? "miss" : "pick",
          recieve_user_id: callMessage?.user_id,
        } as any);

        callLogUpdatedRef.current = true; // mark as logged

        if (isMissed) {
          onPrompt({
            title: "Call Missed",
            message: "No response from the other user. You have left the call.",
          });
        } else {
          onSuccess({
            message: "Call Ended",
            success: "You have successfully left the call.",
          });
        }
      } catch (error) {
        console.warn("Call log update failed:", error);
      }
    }

    // Clean up regardless
    try {
      leave();
    } catch (e) {
      console.warn("leave() threw:", e);
    }
    setIsMeetingActive(false);
    setMeetingId(null);
    audioController.stopRingtone();
    setCallMessage(null);
    setIsInitiator(false);
    setProviderMeetingId(null);
    setShowSummary(true);
  };

  useEffect(() => {
    // Auto-leave after 10s if I initiated the call, it's still ringing, and no one has joined yet.
    if (isInitiator && isRinging && !callStartRef.current) {
      ringTimeoutRef.current = setTimeout(() => {
        console.warn("Auto-leaving call due to no response after 10s");
        handleLeave(); // this will mark as missed
      }, 30000); // 30 seconds
    }

    return () => {
      if (ringTimeoutRef.current) {
        clearTimeout(ringTimeoutRef.current);
      }
    };
  }, [isInitiator, isRinging, callMessage]);

  // Set `me` and `other` participants
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
        {!isMeetingActive ? (
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
        ) : (
          me && (
            <ParticipantMedia
              participantId={me?.id}
              auth={authDetails}
              isRinging={isRinging}
              callDuration={callDuration}
              handleLeave={handleLeave}
              participant={other}
              isInitiator={true}
            />
          )
        )}
      </div>

      <img src={logo} alt="Defcomm Icon" className="w-40 mt-8 filter invert" />
    </div>
  );
};

export default CallComponentContent;

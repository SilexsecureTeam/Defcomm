import { useEffect, useMemo, useRef, useContext, useState } from "react";
import { useMeeting, Constants } from "@videosdk.live/react-sdk";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { MeetingContext } from "../context/MeetingContext";
import { onFailure } from "../utils/notifications/OnFailure";
import { extractErrorMessage } from "../utils/formmaters";
import audioController from "../utils/audioController";
import messageSound from "../assets/audio/message.mp3";

export default function useConferenceParticipants() {
  const { authDetails } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    conference,
    setConference,
    me,
    setMe,
    isScreenSharing,
    setIsScreenSharing,
    setShowConference,
    providerMeetingId,
  } = useContext(MeetingContext);

  const [recordingStartedAt, setRecordingStartedAt] = useState(null);
  const [recordingTimer, setRecordingTimer] = useState("00:00");

  const joinedParticipantsRef = useRef(new Set());
  const removedParticipantsRef = useRef(new Set());

  const {
    participants,
    leave,
    join,
    enableScreenShare,
    disableScreenShare,
    presenterId,
    startRecording,
    stopRecording,
    recordingState,
  } = useMeeting({
    onMeetingLeft: () => {
      setConference(null);
      setShowConference(false);
      setIsScreenSharing(false);
      setMe(null);
      joinedParticipantsRef.current.clear();
      removedParticipantsRef.current.clear();
      navigate("/dashboard/conference");
    },
    onParticipantJoined: (participant) => {
      const id = participant.id;
      if (!joinedParticipantsRef.current.has(id)) {
        joinedParticipantsRef.current.add(id);
        audioController.playRingtone(messageSound);
        toast.info(
          `${participant.displayName || "A participant"} has joined the meeting`
        );
      }
    },
    onParticipantLeft: (participant) => {
      if (removedParticipantsRef.current.has(participant.id)) {
        toast.info(
          `${
            participant.displayName || "A participant"
          } was removed from the meeting`
        );
        removedParticipantsRef.current.delete(participant.id);
      } else {
        toast.info(
          `${participant.displayName || "A participant"} just left the meeting`
        );
      }
    },
    onPresenterChanged: (newPresenterId) => {
      if (!newPresenterId) {
        toast.info("Screen sharing has stopped.");
        setIsScreenSharing(false);
        return;
      }
      const presenter = participants.get(newPresenterId);
      const isSelf = Number(newPresenterId) === Number(me?.id);
      toast.info(
        isSelf
          ? "You started sharing your screen."
          : `${
              presenter?.displayName || "A participant"
            } started sharing their screen.`
      );
      audioController.playRingtone(messageSound);
      setIsScreenSharing(true);
    },
    onRecordingStateChanged: ({ status }) => {
      if (status === Constants.recordingEvents.RECORDING_STARTING) {
        toast.info("Recording is starting...");
      } else if (status === Constants.recordingEvents.RECORDING_STARTED) {
        toast.success("Recording started.");
        setRecordingStartedAt(Date.now());
      } else if (status === Constants.recordingEvents.RECORDING_STOPPING) {
        toast.info("Recording is stopping...");
      } else if (status === Constants.recordingEvents.RECORDING_STOPPED) {
        toast.success("Recording stopped.");
        setRecordingStartedAt(null);
        setRecordingTimer("00:00");
      }
    },
    onError: (error) => {
      onFailure({
        message: "Technical Error",
        error: extractErrorMessage(error) || "An error occurred",
      });
    },
  });

  useEffect(() => {
    if (conference && providerMeetingId) {
      if (participants) {
        participants.forEach((p) => joinedParticipantsRef.current.add(p.id));
      }
      join();
    } else {
      navigate("/dashboard/conference");
    }
  }, [conference]);

  const remoteParticipants = useMemo(() => {
    if (!participants) return [];
    return [...participants.values()].filter(
      (p) => String(p.id) !== String(authDetails?.user?.id)
    );
  }, [participants, authDetails?.user?.id]);

  useEffect(() => {
    if (participants && conference) {
      const currentUser = [...participants.values()].find(
        (p) => String(p.id) === String(authDetails?.user?.id)
      );
      setMe(currentUser);
    }
  }, [participants, conference, authDetails?.user?.id]);

  useEffect(() => {
    let interval;
    if (recordingStartedAt) {
      interval = setInterval(() => {
        const elapsed = Date.now() - recordingStartedAt;
        const totalSeconds = Math.floor(elapsed / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        setRecordingTimer(`${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recordingStartedAt]);

  return {
    participants,
    me,
    remoteParticipants,
    join,
    leave,
    enableScreenShare,
    disableScreenShare,
    startRecording,
    stopRecording,
    presenterId,
    recordingState,
    isScreenSharing,
    recordingStartedAt,
    recordingTimer,
    setRecordingTimer,
    setRecordingStartedAt,
    joinedParticipantsRef,
    removedParticipantsRef,
  };
}

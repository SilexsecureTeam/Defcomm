import { useEffect, useMemo, useRef, useContext, useState } from "react";
import { useMeeting, Constants } from "@videosdk.live/react-sdk";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MeetingContext } from "../context/MeetingContext";
import { onFailure } from "../utils/notifications/OnFailure";
import { extractErrorMessage } from "../utils/formmaters";
import audioController from "../utils/audioController";
import messageSound from "../assets/audio/message.mp3";
import startRecordSound from "../assets/audio/radio-button.mp3";
import { onPrompt } from "../utils/notifications/onPrompt";
import { onSuccess } from "../utils/notifications/OnSuccess";

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
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);
  const [recordingTimer, setRecordingTimer] = useState("00:00");

  const joinedParticipantsRef = useRef(new Set());
  const removedParticipantsRef = useRef(new Set());
  const leftParticipantsRef = useRef(new Set());

  const recordingStateHandledRef = useRef(null);

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
    onSpeakerChanged,
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
        onPrompt({
          title: "Participant joined!",
          message: `${
            participant?.displayName || "A participant"
          } is now in the meeting`,
        });
      }
    },
    onParticipantLeft: (participant) => {
      if (leftParticipantsRef.current.has(participant.id)) return; // ignore duplicates
      leftParticipantsRef.current.add(participant.id);

      if (removedParticipantsRef.current.has(participant.id)) {
        onPrompt({
          title: "Participant Removed!",
          message: `${
            participant.displayName || "A participant"
          } has been removed from the meeting`,
        });
        removedParticipantsRef.current.delete(participant.id);
      } else {
        onPrompt({
          title: "Participant Left!",
          message: `${
            participant.displayName || "A participant"
          } has left the meeting`,
        });
      }
    },
    onPresenterChanged: (newPresenterId) => {
      if (!newPresenterId) {
        onPrompt({
          title: "Screen Sharing Stopped!",
          message: "The participant has stopped sharing their screen",
        });
        setIsScreenSharing(false);
        return;
      }

      const presenter = participants?.get(newPresenterId);
      const presenterName = presenter?.displayName || "A participant";
      const isSelf = Number(newPresenterId) === Number(me?.id);

      onPrompt({
        message: "Screen Sharing Started!",
        success: isSelf
          ? "You are now sharing your screen"
          : `${presenterName} has started sharing their screen`,
      });

      audioController.playRingtone(messageSound);
      setIsScreenSharing(true);
    },
    onSpeakerChanged: (speakerId) => {
      if (speakerId) {
        setActiveSpeakerId(speakerId);
      }
    },
    onRecordingStateChanged: ({ status }) => {
      if (recordingStateHandledRef.current === status) return; // ignore duplicates
      recordingStateHandledRef.current = status;

      if (status === Constants.recordingEvents.RECORDING_STARTING) {
        onPrompt({
          title: "Recording Starting",
          message: "The recording process is initializing",
        });
      } else if (status === Constants.recordingEvents.RECORDING_STARTED) {
        audioController.playRingtone(startRecordSound);
        setRecordingStartedAt(Date.now());
        onSuccess({
          message: "Recording Started",
          success: "The meeting is now being recorded",
        });
      } else if (status === Constants.recordingEvents.RECORDING_STOPPING) {
        onPrompt({
          title: "Recording Stopping",
          message: "The recording process is ending",
        });
      } else if (status === Constants.recordingEvents.RECORDING_STOPPED) {
        audioController.playRingtone(startRecordSound);
        setRecordingStartedAt(null);
        setRecordingTimer("00:00");
        onSuccess({
          message: "Recording Stopped",
          success: "The meeting recording has ended",
        });
      }

      // reset after 1s so state changes are captured again
      setTimeout(() => {
        recordingStateHandledRef.current = null;
      }, 1000);
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
    activeSpeakerId,
  };
}

import ParticipantVideo from "../components/video-sdk/conference/ParticipantVideo";
import ScreenShareDisplay from "../components/video-sdk/conference/ScreenShareDisplay";
import PictureInPicture from "../components/video-sdk/conference/PictureInPicture";
import ConferenceControl from "../components/video-sdk/conference/ConferenceControl";
import RecordingControlButton from "../components/video-sdk/conference/RecordingControlButton";

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useContext, useEffect, useRef } from "react";
import { useMeeting, Constants } from "@videosdk.live/react-sdk";
import { AuthContext } from "../context/AuthContext";
import { MeetingContext } from "../context/MeetingContext";
import { onFailure } from "../utils/notifications/OnFailure";
import { extractErrorMessage } from "../utils/formmaters";
import audioController from "../utils/audioController";
import joinSound from "../assets/audio/join.mp3";
import { toast } from "react-toastify";

const ConferenceRoom = () => {
  const { authDetails } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

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

  const [maximizedParticipantId, setMaximizedParticipantId] = useState(null);
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
        audioController.playRingtone(joinSound);
        toast.info(
          `${participant.displayName || "A participant"} has joined the meeting`
        );
      }
    },
    onParticipantLeft: (participant) => {
      if (removedParticipantsRef.current.has(participant.id)) {
        toast.info(`${participant.displayName || "A participant"} was removed from the meeting`);
        removedParticipantsRef.current.delete(participant.id);
      } else {
        toast.info(`${participant.displayName || "A participant"} just left the meeting`);
      }
    },
    onError: (error) => {
      onFailure({
        message: "Technical Error",
        error: extractErrorMessage(error) || "An error occurred",
      });
    },
    onPresenterChanged: (newPresenterId) => {
      const presenter = participants.get(newPresenterId);
      if (!newPresenterId) {
        toast.info("Screen sharing has stopped.");
        setIsScreenSharing(false);
        return;
      }
      const isSelf = Number(newPresenterId) === Number(me?.id);
      toast.info(
        isSelf
          ? "You started sharing your screen."
          : `${presenter?.displayName || "A participant"} started sharing their screen.`
      );
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
  });

  useEffect(() => {
    if (conference && providerMeetingId) {
      join();
      // Register already-joined participants after join
      setTimeout(() => {
        if (participants) {
          participants.forEach((p) => joinedParticipantsRef.current.add(p.id));
        }
      }, 500);
    } else {
      navigate("/dashboard/conference");
    }
  }, [conference]);

  const remoteParticipants = useMemo(() => {
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

  const handleLeaveMeeting = async () => {
    try {
      await leave();
    } catch (error) {
      onFailure({
        message: "Leave Error",
        error: error.message || "Could not leave the meeting.",
      });
    }
  };

  const handleScreenShare = async () => {
    if (!me?.id) return;
    if (presenterId && presenterId !== me.id) {
      const presenter = participants.get(presenterId);
      toast.info(
        `${presenter?.displayName || "Another participant"} is currently sharing.`
      );
      return;
    }
    try {
      if (isScreenSharing && presenterId === me.id) {
        await disableScreenShare();
        setIsScreenSharing(false);
      } else {
        await enableScreenShare();
        setIsScreenSharing(true);
      }
    } catch (error) {
      onFailure({
        message: "Screen Share Error",
        error: error.message || "Could not start screen sharing.",
      });
    }
  };

  const toggleRecording = () => {
    const isRecording =
      recordingState === Constants.recordingEvents.RECORDING_STARTED;
    const config = {
      layout: { type: "GRID", priority: "SPEAKER", gridSize: 4 },
      theme: "DARK",
      mode: "video-and-audio",
      quality: "high",
      orientation: "landscape",
    };
    const transcription = {
      enabled: true,
      summary: {
        enabled: true,
        prompt:
          "Write summary in sections like Title, Agenda, Speakers, Action Items, Outlines, Notes and Summary",
      },
    };
    isRecording ? stopRecording() : startRecording(null, null, config, transcription);
  };

  useEffect(() => {
    let interval;
    if (recordingStartedAt) {
      interval = setInterval(() => {
        const elapsedMs = Date.now() - recordingStartedAt;
        const totalSeconds = Math.floor(elapsedMs / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        setRecordingTimer(`${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recordingStartedAt]);

  return (
    <>
      {pathname === "/dashboard/conference/room" ? (
        <div className="flex flex-col flex-1 p-6 text-white bg-transparent min-h-screen relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 gap-2">
            <div>
              <p className="text-lg font-semibold">
                {conference?.title || "Conference"}
              </p>
              {recordingStartedAt && (
                <p className="text-sm text-red-500 mt-1">
                  ● Recording {recordingTimer}
                </p>
              )}
            </div>
            <button className="bg-[#5C7C2A] text-white text-sm px-2 md:px-4 py-2 rounded-md">
              + Invite Member
            </button>
          </div>

          {/* Screen Share */}
          {presenterId && (
            <div className="w-full h-[60vh] mb-6 bg-black rounded-md p-2">
              <ScreenShareDisplay
                participantId={presenterId}
                isUser={Number(me?.id) === Number(presenterId)}
              />
            </div>
          )}

          {/* Participant Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-8">
            {me && (
              <ParticipantVideo
                participantId={me.id}
                label="You"
                isMaximized={maximizedParticipantId === me.id}
                onToggleMaximize={() =>
                  setMaximizedParticipantId((prev) =>
                    prev === me.id ? null : me.id
                  )
                }
              />
            )}
            {remoteParticipants.length > 0 ? (
              remoteParticipants.map((participant) => (
                <ParticipantVideo
                  removedParticipantsRef={removedParticipantsRef}
                  key={participant.id}
                  participantId={participant.id}
                  label={participant.displayName || "Guest"}
                  isMaximized={maximizedParticipantId === participant.id}
                  onToggleMaximize={() =>
                    setMaximizedParticipantId((prev) =>
                      prev === participant.id ? null : participant.id
                    )
                  }
                />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-400">
                Waiting for participants to join...
              </p>
            )}
          </div>

          <ConferenceControl
            handleLeaveMeeting={handleLeaveMeeting}
            handleScreenShare={handleScreenShare}
            isScreenSharing={isScreenSharing}
            me={me}
          />
          <RecordingControlButton
            toggleRecording={toggleRecording}
            recordingState={recordingState}
            recordingTimer={recordingTimer}
          />
        </div>
      ) : (
        conference &&
        providerMeetingId && (
          <PictureInPicture
            maximizedParticipantId={maximizedParticipantId}
            me={me}
            remoteParticipants={remoteParticipants}
            handleLeaveMeeting={handleLeaveMeeting}
          />
        )
      )}
    </>
  );
};

export default ConferenceRoom;

import useConferenceParticipants from "../hooks/useConferenceParticipants";
import ParticipantVideo from "../components/video-sdk/conference/ParticipantVideo";
import ScreenShareDisplay from "../components/video-sdk/conference/ScreenShareDisplay";
import PictureInPicture from "../components/video-sdk/conference/PictureInPicture";
import ConferenceControl from "../components/video-sdk/conference/ConferenceControl";
import RecordingControlButton from "../components/video-sdk/conference/RecordingControlButton";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { Constants } from "@videosdk.live/react-sdk";
import { MeetingContext } from "../context/MeetingContext";

const ConferenceRoom = () => {
  const { pathname } = useLocation();
  const { conference } = useContext(MeetingContext);
  const [maximizedParticipantId, setMaximizedParticipantId] = useState(null);

  const {
    me,
    remoteParticipants,
    presenterId,
    recordingState,
    isScreenSharing,
    recordingStartedAt,
    recordingTimer,
    leave,
    enableScreenShare,
    disableScreenShare,
    startRecording,
    stopRecording,
    removedParticipantsRef,
  } = useConferenceParticipants();

  const handleLeaveMeeting = async () => {
    try {
      await leave();
    } catch (error) {
      console.error("Leave error", error);
    }
  };

  const handleScreenShare = async () => {
    if (!me?.id) return;
    if (presenterId && presenterId !== me.id) return;
    try {
      if (isScreenSharing && presenterId === me.id) {
        await disableScreenShare();
      } else {
        await enableScreenShare();
      }
    } catch (error) {
      console.error("Screen share error", error);
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
    isRecording
      ? stopRecording()
      : startRecording(null, null, config, transcription);
  };

  return pathname === "/dashboard/conference/room" ? (
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

      {/* Participants */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-8">
        {me && (
          <ParticipantVideo
            participantId={me.id}
            key={me?.id}
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
          remoteParticipants.map((p, idx) => (
            <ParticipantVideo
              removedParticipantsRef={removedParticipantsRef}
              key={p.id || idx}
              participantId={p.id}
              label={p.displayName || "Guest"}
              isMaximized={maximizedParticipantId === p.id}
              onToggleMaximize={() =>
                setMaximizedParticipantId((prev) =>
                  prev === p.id ? null : p.id
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
      {Number(conference?.user_id) === Number(me?.id) && (
        <RecordingControlButton
          toggleRecording={toggleRecording}
          recordingState={recordingState}
          recordingTimer={recordingTimer}
        />
      )}
    </div>
  ) : (
    <PictureInPicture
      removedParticipantsRef={removedParticipantsRef}
      maximizedParticipantId={maximizedParticipantId}
      me={me}
      remoteParticipants={remoteParticipants}
      handleLeaveMeeting={handleLeaveMeeting}
    />
  );
};

export default ConferenceRoom;

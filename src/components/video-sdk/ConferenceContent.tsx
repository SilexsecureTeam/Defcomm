import React, { useState, useMemo, useContext } from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { FaPhoneSlash, FaMicrophoneSlash, FaVideoSlash, FaVolumeUp, FaCog, FaSpinner } from "react-icons/fa";
import { ChatContext } from "../../context/ChatContext"; // Adjust path as needed
import { onFailure } from "../../utils/notifications/OnFailure";
import { onSuccess } from "../../utils/notifications/OnSuccess";
import { extractErrorMessage } from '../../utils/formmaters'

const ParticipantVideo = ({ participantId, label }: { participantId: string; label: string }) => {
  const { webcamStream, webcamOn } = useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return null;
  }, [webcamStream, webcamOn]);

  return (
    <div className="aspect-square bg-black rounded-lg flex items-center justify-center relative">
      {videoStream ? (
        <ReactPlayer
          playing
          muted
          controls={false}
          pip={false}
          url={videoStream}
          width="100%"
          height="100%"
          className="rounded-lg object-cover"
        />
      ) : (
        <div className="text-white">No Video</div>
      )}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 rounded text-xs">{label}</div>
    </div>
  );
};
const ConferenceContent = ({ meetingId, setMeetingId }: any) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const { participants, localParticipant, toggleMic, toggleWebcam, leave, join } = useMeeting();

  const remoteParticipants = useMemo(() => {
    return Object.values(participants).filter((p) => p.id !== localParticipant?.id);
  }, [participants, localParticipant]);

  const handleJoinMeeting = async () => {

    setJoinError(null); // reset error on retry
    setIsLoading(true);

    try {
      await join();
      setIsJoined(true);
    } catch (error) {
      setIsJoined(false); // ✅ ensure not joined on error
      console.error("Failed to join meeting:", error);
      setJoinError(extractErrorMessage(error) || "Unknown error occurred");
      onFailure({ message: "Meeting Error", error: extractErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveMeeting = () => {
    leave();
    setIsJoined(false);
    setMeetingId("");
    setJoinError(null);
  };

  // If not joined, or join failed, show join screen
  if (!isJoined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-transparent text-white p-6">
        <h2 className="text-2xl font-semibold mb-6">Enter Meeting ID to Join</h2>
        <input
          type="text"
          placeholder="Paste Meeting ID here"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          className="text-black px-4 py-2 rounded-md w-full max-w-sm mb-4"
        />
        {joinError && <p className="mb-4 text-red-500">{joinError}</p>}
        <button
          onClick={handleJoinMeeting}
          disabled={isLoading}
          className="bg-[#5C7C2A] px-6 py-3 rounded-md text-white font-bold hover:bg-[#4e6220] disabled:opacity-50"
        >
          {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Join Meeting"}
        </button>
      </div>
    );
  }

  // Render conference UI only if joined and no error
  return (
    <div className="flex flex-col flex-1 p-6 text-white bg-transparent min-h-screen">
      {/* Meeting Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-lg font-semibold">Nation Security Council Meeting</p>
          <p className="text-sm text-red-500 mt-1">● Recording 00:45:53</p>
        </div>
        <button className="bg-[#5C7C2A] text-white text-sm px-4 py-2 rounded-md">
          + Invite Member
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 flex-grow">
        {localParticipant && <ParticipantVideo participantId={localParticipant.id} label="You" />}

        {remoteParticipants.length > 0 ? (
          remoteParticipants.map((participant) => (
            <ParticipantVideo
              key={participant.id}
              participantId={participant.id}
              label={participant.name || "Guest"}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">Waiting for participants to join...</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-8 text-2xl">
        <button
          className={`text-gray-500 hover:text-white ${localParticipant?.audioEnabled ? "" : "opacity-50"}`}
          onClick={() => toggleMic()}
          aria-label="Toggle Microphone"
        >
          <FaMicrophoneSlash />
        </button>
        <button
          className={`text-gray-500 hover:text-white ${localParticipant?.videoEnabled ? "" : "opacity-50"}`}
          onClick={() => toggleWebcam()}
          aria-label="Toggle Camera"
        >
          <FaVideoSlash />
        </button>
        <button
          className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-700"
          onClick={handleLeaveMeeting}
          aria-label="Leave Meeting"
        >
          <FaPhoneSlash />
        </button>
        <button className="text-gray-500 hover:text-white" aria-label="Volume Control">
          <FaVolumeUp />
        </button>
        <button className="text-gray-500 hover:text-white" aria-label="Settings">
          <FaCog />
        </button>
      </div>
    </div>
  );
};


export default ConferenceContent;

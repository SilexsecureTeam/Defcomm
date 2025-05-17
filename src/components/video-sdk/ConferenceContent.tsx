import React, { useState, useMemo, useContext, useEffect } from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import {
  FaPhone,
  FaMicrophoneSlash,
  FaVideoSlash,
  FaVolumeUp,
  FaCog,
  FaSpinner,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { onFailure } from "../../utils/notifications/OnFailure";
import { extractErrorMessage } from "../../utils/formmaters";
import logo from "../../assets/logo-icon.png";
import { createMeeting } from "./Api";
import ParticipantVideo from './ParticipantVideo';
/*const ParticipantVideo = ({
  participantId,
  label,
}: {
  participantId: string;
  label: string;
}) => {
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
    <div className="aspect-square bg-gray-200 flex items-center justify-center relative">
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
        <img
          src={logo}
          alt="Participant"
          className="w-16 h-16 md:w-32 md:h-32 opacity-90 filter invert"
        />
      )}
      <div className="absolute bottom-2 left-2 bg-gray-700 bg-opacity-50 px-2 rounded text-xs">
        {label}
      </div>
    </div>
  );
};*/

const ConferenceContent = ({ meetingId, setMeetingId }: any) => {
  const { authDetails } = useContext(AuthContext);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [me, setMe] = useState<any>(null);
  const [isInitiator, setIsInitiator] = useState(false);

  const { participants, toggleMic, toggleWebcam, leave, join } = useMeeting();

  const remoteParticipants = useMemo(() => {
    return [...participants.values()].filter(
      (p) => Number(p.id) !== Number(authDetails?.user?.id)
    );
  }, [participants, authDetails?.user?.id]);

  useEffect(() => {
    if (participants && isJoined) {
      const currentUser = [...participants.values()].find(
        (p) => Number(p.id) === Number(authDetails?.user?.id)
      );
      setMe(currentUser);
    }
  }, [participants, isJoined, authDetails?.user?.id]);

  const handleCreateMeeting = async () => {
    setIsCreatingMeeting(true);
    try {
      const newMeetingId = await createMeeting();
      if (!newMeetingId) throw new Error("No meeting ID returned.");
      setMeetingId(newMeetingId);
      setIsInitiator(true);
    } catch (error: any) {
      onFailure({ message: "Meeting Creation Failed", error: error.message });
    } finally {
      setIsCreatingMeeting(false);
    }
  };

  const handleJoinMeeting = async () => {
    setJoinError(null);
    setIsLoading(true);
    try {
      await join();
      setIsJoined(true);
    } catch (error: any) {
      setIsJoined(false);
      const message = extractErrorMessage(error) || "Unknown error occurred";
      setJoinError(message);
      onFailure({ message: "Meeting Error", error: message });
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
        <div className="flex gap-4">
          <button
            onClick={handleJoinMeeting}
            disabled={isLoading}
            className="bg-[#5C7C2A] px-6 py-3 rounded-md text-white font-bold hover:bg-[#4e6220] disabled:opacity-50"
          >
            {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Join Meeting"}
          </button>
          <button
            onClick={handleCreateMeeting}
            disabled={isCreatingMeeting}
            className="bg-oliveGreen px-6 py-3 rounded-md text-white font-bold hover:bg-olive disabled:opacity-50"
          >
            {isCreatingMeeting ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              "Start New Conference"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-6 text-white bg-transparent min-h-screen relative">
      {/* Meeting Header */}
      <div className="flex justify-between items-center mb-6 gap-2">
        <div>
          <p className="text-lg font-semibold">Nation Security Council Meeting</p>
          <p className="text-sm text-red-500 mt-1">● Recording 00:45:53</p>
        </div>
        <button className="bg-[#5C7C2A] text-white text-sm px-4 py-2 rounded-md">
          + Invite Member
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 flex-grow">
        {me && <ParticipantVideo participantId={me.id} label="You" />}
        {remoteParticipants.length > 0 ? (
          remoteParticipants.map((participant) => (
            <ParticipantVideo
              key={participant.id}
              participantId={participant.id}
              label={participant.name || "Guest"}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">
            Waiting for participants to join...
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="sticky bottom-0 bg-black/70 flex justify-center items-center gap-8 text-2xl py-4">
        <button
          className="text-gray-500 hover:text-white"
          onClick={() => toggleMic()}
          aria-label="Toggle Microphone"
        >
          <FaMicrophoneSlash />
        </button>
        <button
          className="text-gray-500 hover:text-white"
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
          <FaPhone />
        </button>
        <button
          className="text-gray-500 hover:text-white"
          aria-label="Volume Control"
        >
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
      

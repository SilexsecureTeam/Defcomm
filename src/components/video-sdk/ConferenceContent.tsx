import React, { useState, useMemo, useContext, useEffect } from "react";
import {
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import {
  FaPhone,
  FaMicrophoneSlash,
  FaMicrophone,
  FaVideoSlash,
  FaVideo,
  FaVolumeUp,
  FaCog,
  FaSpinner,
  FaDesktop,
  FaStopCircle,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { onFailure } from "../../utils/notifications/OnFailure";
import { extractErrorMessage } from "../../utils/formmaters";
import { createMeeting } from "./Api";
import ParticipantVideo from "./ParticipantVideo";
import ScreenShareDisplay from "./ScreenShareDisplay";
import { toast } from "react-toastify";

const ConferenceContent = ({ meetingId, setMeetingId }: { meetingId: string; setMeetingId: (id: string) => void }) => {
  const { authDetails } = useContext(AuthContext);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [me, setMe] = useState<any>(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const { webcamOn, micOn } = useParticipant(me?.id ?? "", {});

  const {
    participants,
    toggleMic,
    toggleWebcam,
    leave,
    join,
    enableScreenShare,
    disableScreenShare,
  } = useMeeting({
    onParticipantJoined: (participant) => {
      toast.success(`${participant.displayName || "A participant"} has joined the meeting`);
    },
    onParticipantLeft: (participant) => {
      toast.success(`${participant.displayName || "A participant"} just left the meeting`);
    },
    onError: (error) => {
      onFailure({
        message: "Technical Error",
        error: extractErrorMessage(error) || "An error occurred",
      });
    },
    onPresenterChanged: (presenter) => {
      toast.info(`${presenter?.displayName || "A participant"} is presenting`);
      setIsScreenSharing(!!presenter);
    },
  });

  const remoteParticipants = useMemo(() => {
    return [...participants.values()].filter(
      (p) => Number(p.id) !== Number(authDetails?.user?.id)
    );
  }, [participants, authDetails?.user?.id]);

  const screenSharingParticipants = useMemo(() => {
    return [...participants.values()].filter((p) => p.screenShareEnabled);
  }, [participants]);

  useEffect(() => {
    if (participants && isJoined) {
      const currentUser = [...participants.values()].find(
        (p) => String(p.id) === String(authDetails?.user?.id)
      );
      setMe(currentUser);
      if (currentUser) setIsScreenSharing(currentUser.screenShareEnabled);
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
    setIsLoading(true);
    try {
      await join();
      setIsJoined(true);
    } catch (error: any) {
      setIsJoined(false);
      const message = extractErrorMessage(error) || "Unknown error occurred";
      onFailure({ message: "Meeting Error", error: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveMeeting = () => {
    leave();
    setIsJoined(false);
    setMeetingId("");
    setIsScreenSharing(false);
  };

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      await disableScreenShare();
      setIsScreenSharing(false);
    } else {
      try {
        await enableScreenShare();
        setIsScreenSharing(true);
      } catch (error: any) {
        onFailure({
          message: "Screen Share Error",
          error: error.message || "Could not start screen sharing.",
        });
      }
    }
  };

  if (!isJoined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-transparent text-white p-6">
        <h2 className="text-2xl font-semibold mb-6">Enter Meeting ID to Join</h2>
        <input
          type="text"
          placeholder="Paste Meeting ID here"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          className="p-3 border border-gray-300 placeholder:text-gray-300 bg-transparent rounded-md w-full max-w-sm mb-4"
        />
        <div className="flex gap-4 text-sm">
          <button
            onClick={handleJoinMeeting}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-[#5C7C2A] p-2 md:px-6 md:py-3 rounded-md text-white font-bold hover:bg-[#4e6220] disabled:opacity-50"
          >
            Join Meeting {isLoading && <FaSpinner className="animate-spin mx-auto" />}
          </button>
          <button
            onClick={handleCreateMeeting}
            disabled={isCreatingMeeting}
            className="flex items-center justify-center gap-2 bg-oliveGreen p-2 md:px-6 md:py-3 rounded-md text-white font-bold hover:bg-olive disabled:opacity-50"
          >
            Start New Conference
            {isCreatingMeeting && <FaSpinner className="animate-spin mx-auto" />}
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
          <p className="text-lg font-semibold">
            {meetingId || "Nation Security Council Meeting"}
          </p>
          <p className="text-sm text-red-500 mt-1">● Recording 00:45:53</p>
        </div>
        <button className="bg-[#5C7C2A] text-white text-sm px-4 py-2 rounded-md">
          + Invite Member
        </button>
      </div>

      {/* Screen Share Display */}
      {screenSharingParticipants.length > 0 && (
        <div className="w-full h-[60vh] mb-6 bg-black rounded-md p-2">
          {screenSharingParticipants.map((p) => (
            <ScreenShareDisplay key={p.id} participantId={p.id} />
          ))}
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8 flex-grow">
        {me && <ParticipantVideo key={me.id} participantId={me.id} label="You" />}
        {remoteParticipants.length > 0 ? (
          remoteParticipants.map((participant) => (
            <ParticipantVideo
              key={participant.id}
              participantId={participant.id}
              label={participant?.displayName || "Guest"}
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
          className={`text-gray-500 hover:text-white ${micOn ? "text-white" : ""}`}
          onClick={() => toggleMic()}
          aria-label="Toggle Microphone"
        >
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <button
          className={`text-gray-500 hover:text-white ${webcamOn ? "text-white" : ""}`}
          onClick={() => toggleWebcam()}
          aria-label="Toggle Camera"
        >
          {webcamOn ? <FaVideo /> : <FaVideoSlash />}
        </button>

        <button
          className={`text-gray-500 hover:text-white ${isScreenSharing ? "text-green-400" : ""}`}
          onClick={handleScreenShare}
          aria-label={isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}
          title={isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}
        >
          {isScreenSharing ? <FaStopCircle /> : <FaDesktop />}
        </button>

        <button
          className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-700"
          onClick={handleLeaveMeeting}
          aria-label="Leave Meeting"
        >
          <FaPhone />
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
        

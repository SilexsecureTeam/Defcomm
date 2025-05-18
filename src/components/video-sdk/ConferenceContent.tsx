import React, { useState, useMemo, useContext, useEffect } from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import {
  FaPhone,
  FaMicrophoneSlash,
  FaMicrophone,
  FaVideoSlash,
  FaVideo,
  FaVolumeUp,
  FaCog,
  FaSpinner,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { onFailure } from "../../utils/notifications/OnFailure";
import { extractErrorMessage } from "../../utils/formmaters";
import { createMeeting } from "./Api";
import ParticipantVideo from './ParticipantVideo';
import { toast } from "react-toastify";

const ConferenceContent = ({ meetingId, setMeetingId }: any) => {
  const { authDetails } = useContext(AuthContext);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [me, setMe] = useState<any>(null);
  const [isInitiator, setIsInitiator] = useState(false);

  const { webcamOn, micOn } =
    useParticipant(me?.id);
  const { participants, toggleMic, toggleWebcam, leave, join } = useMeeting({
    onParticipantJoined: (participant) => {
      console.log(participant)
      if (participant.displayName) {
        toast.success(`${participant.displayName} has joined the meeting`);
      } else {
        toast.success(`A participant has joined`);
      }
    },
    onParticipantLeft: (participant) => {
      if (participant.displayName) {
        toast.success(`${participant.displayName} just left the meeting`);
      } else {
        toast.success(`A participant just left the meeting`);
      }
    },
    onError: (error) => {
      onFailure({
        message: "Technical Error",
        error: extractErrorMessage(error) || "An error occurred",
      });
    },
  });


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
            {isCreatingMeeting &&
              <FaSpinner className="animate-spin mx-auto" />
            }
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
          <p className="text-lg font-semibold">{meetingId || "Nation Security Council Meeting"}</p>
          <p className="text-sm text-red-500 mt-1">● Recording 00:45:53</p>
        </div>
        <button className="bg-[#5C7C2A] text-white text-sm px-4 py-2 rounded-md">
          + Invite Member
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 flex-grow">
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
          className={`text-gray-500 hover:text-white ${micOn ? "text-white" : "text-gray-500"}`}
          onClick={() => toggleMic()}
          aria-label="Toggle Microphone"
        >
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <button
          className={`text-gray-500 hover:text-white ${webcamOn ? "text-white" : "text-gray-500"}`}
          onClick={() => toggleWebcam()}
          aria-label="Toggle Camera"
        >
         {webcamOn ? <FaVideo /> : <FaVideoSlash />}
        </button>
        <button
          className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-700"
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


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
import { MeetingContext } from "../../context/MeetingContext";
import { onFailure } from "../../utils/notifications/OnFailure";
import { extractErrorMessage } from "../../utils/formmaters";
import { createMeeting } from "./Api";
import ParticipantVideo from "./ParticipantVideo";
import ScreenShareDisplay from "./ScreenShareDisplay";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CgMaximizeAlt } from "react-icons/cg";

const ConferenceContent = ({ meetingId, setMeetingId }: { meetingId: string; setMeetingId: (id: string) => void }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);
  const {
    setProviderMeetingId,
    conference, setConference,
    me, setMe, isScreenSharing,
    setIsScreenSharing
  } = useContext(MeetingContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [maximizedParticipantId, setMaximizedParticipantId] = useState(null);
  const { webcamOn, micOn } = useParticipant(me?.id ?? "", {});

  const {
    participants,
    toggleMic,
    toggleWebcam,
    leave,
    join,
    enableScreenShare,
    disableScreenShare,
    presenterId,
  } = useMeeting({
    onParticipantJoined: (participant) => {
      toast.info(`${participant.displayName || "A participant"} has joined the meeting`);
    },
    onParticipantLeft: (participant) => {
      toast.info(`${participant.displayName || "A participant"} just left the meeting`);
    },
    onError: (error) => {
      onFailure({
        message: "Technical Error",
        error: extractErrorMessage(error) || "An error occurred",
      });
    },
    onPresenterChanged: (presenterId) => {
      if (presenterId) {
        const presenter = participants.get(presenterId);
        const isSelf = Number(presenter?.id) === Number(me?.id);

        if (isSelf) {
          toast.info("You started sharing your screen.");
        } else {
          toast.info(`${presenter?.displayName || "A participant"} started sharing their screen.`);
        }

        setIsScreenSharing(true);
      } else {
        toast.info("Screen sharing stopped.");
        setIsScreenSharing(false);
      }
    },
  });

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

  const handleCreateMeeting = async () => {
    setIsCreatingMeeting(true);
    try {
      const newMeetingId = await createMeeting();
      if (!newMeetingId) throw new Error("No meeting ID returned.");
      setMeetingId(newMeetingId);
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
      setConference(true);
    } catch (error: any) {
      setConference(false);
      const message = extractErrorMessage(error) || "Unknown error occurred";
      onFailure({ message: "Meeting Error", error: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveMeeting = () => {
    leave();
    setConference(false);
    setMeetingId("");
    setProviderMeetingId(null)
    setIsScreenSharing(false);
  };

  const handleScreenShare = async () => {
    if (!me?.id) return;

    // If someone else is presenting
    if (presenterId && presenterId !== me.id) {
      const presenter = participants.get(presenterId);
      toast.info(`${presenter?.displayName || "Another participant"} is currently sharing.`);
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
    } catch (error: any) {
      onFailure({
        message: "Screen Share Error",
        error: error.message || "Could not start screen sharing.",
      });
    }
  };

  if (!conference) {
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
    pathname === "/dashboard/conference" ? (<div className="flex flex-col flex-1 p-6 text-white bg-transparent min-h-screen relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-2">
        <div>
          <p className="text-lg font-semibold">{meetingId}</p>
          <p className="text-sm text-red-500 mt-1">● Recording 00:45:53</p>
        </div>
        <button className="bg-[#5C7C2A] text-white text-sm px-4 py-2 rounded-md">
          + Invite Member
        </button>
      </div>

      {/* Screen Share */}
      {presenterId && (
        <div className="w-full h-[60vh] mb-6 bg-black rounded-md p-2">
          <ScreenShareDisplay participantId={presenterId} isUser={Number(me?.id) === Number(presenterId)} />
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-8">
        {me && <ParticipantVideo
          participantId={me.id}
          label="You"
          isMaximized={maximizedParticipantId === me.id}
          onToggleMaximize={() =>
            setMaximizedParticipantId((prev) => (prev === me.id ? null : me.id))
          }
        />}
        {remoteParticipants.length > 0 ? (
          remoteParticipants.map((participant) => (
            <ParticipantVideo
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

      {/* Controls */}
      <div className="sticky bottom-0 bg-black/70 flex justify-center items-center gap-8 text-2xl py-4 z-10">
        <button onClick={()=>toggleMic()} aria-label="Toggle Microphone" className={`text-gray-500 hover:text-white ${micOn ? "text-white" : ""}`}>
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <button onClick={()=>toggleWebcam()} aria-label="Toggle Camera" className={`text-gray-500 hover:text-white ${webcamOn ? "text-white" : ""}`}>
          {webcamOn ? <FaVideo /> : <FaVideoSlash />}
        </button>

        <button
          disabled={presenterId && presenterId !== me?.id}
          className={`hidden md:block text-gray-500 hover:text-white ${isScreenSharing && presenterId === me?.id ? "text-green-400" : ""
            } ${presenterId && presenterId !== me?.id ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleScreenShare}
          aria-label={isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}
        >
          {isScreenSharing && presenterId === me?.id ? <FaStopCircle /> : <FaDesktop />}
        </button>

        <button onClick={handleLeaveMeeting} className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-700" aria-label="Leave Meeting">
          <FaPhone />
        </button>

        <button className="text-gray-500 hover:text-white" aria-label="Volume Control">
          <FaVolumeUp />
        </button>
        <button className="text-gray-500 hover:text-white" aria-label="Settings">
          <FaCog />
        </button>
      </div>
    </div>) : (
      <motion.div
  className="fixed bottom-4 right-4 w-48 h-48 z-[10000] bg-black rounded-lg overflow-hidden shadow-lg group transition-all"
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.8, opacity: 0 }}
  whileHover={{ scale: 1.02 }}
  transition={{ type: "spring", stiffness: 200, damping: 20 }}
>
  {/* Mini video display */}
  <div className="relative flex-1 w-full h-full aspect-square">
    <ParticipantVideo
      participantId={maximizedParticipantId || me?.id}
      label={
        maximizedParticipantId === me?.id || !maximizedParticipantId
          ? "You"
          : remoteParticipants.find((p) => p.id === maximizedParticipantId)?.displayName || "Participant"
      }
      isMaximized
      onToggleMaximize={() => {}}
    />

    {/* Hover controls */}
    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex flex-col gap-3 items-center justify-end transition-opacity duration-300 pb-4">
      <button
        onClick={() => navigate("/dashboard/conference")}
        className="bg-white/80 hover:bg-white text-black p-2 rounded-full shadow"
        title="Back to full view"
      >
        <CgMaximizeAlt size={18} />
      </button>
      <button
        onClick={handleLeaveMeeting}
        className="mt-3 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-md text-lg"
        title="End Call"
      >
        <FaPhone size={20} />
      </button>
    </div>
  </div>

  {/* Hidden audio */}
  <div style={{ display: "none" }}>
    {[me, ...remoteParticipants].map((participant) => (
      <ParticipantVideo
        key={participant.id}
        participantId={participant.id}
        label=""
        isMaximized={false}
        onToggleMaximize={() => {}}
        audioOnly
      />
    ))}
  </div>
</motion.div>
    )

  );
};

export default ConferenceContent;

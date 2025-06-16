import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useParticipant,
  useMeeting,
  usePubSub,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { FaVideo, FaVideoSlash, FaExpand, FaCompress } from "react-icons/fa";
import { AiOutlineAudioMuted, AiOutlineAudio } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { motion } from "framer-motion";
//@ts-ignore
import logo from "../../../assets/logo-icon.png";
import { FaHandPaper } from "react-icons/fa";
import { toast } from "react-toastify";

const ParticipantVideo = ({
  participantId,
  label,
  isMaximized,
  onToggleMaximize,
  key = 0,
  removedParticipantsRef
}: {
  participantId: string;
  label: string;
  isMaximized: boolean;
  key?: number | string;
  onToggleMaximize: () => void;
  removedParticipantsRef: any;
}) => {
  const { webcamStream, micStream, remove, disableMic, webcamOn, micOn, isLocal } =
    useParticipant(participantId);
  const { messages } = usePubSub("HAND_RAISE");
  const [handRaised, setHandRaised] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const micRef = useRef(null);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return null;
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current.muted = isLocal;
        micRef.current
          .play()
          .catch((err) => console.error("Mic play error", err));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micOn, micStream, isLocal]);
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.message?.id === participantId) {
      setHandRaised(!!latestMessage?.message?.raised);
    }
  }, [messages, participantId]);

  return (
    <motion.div
      key={key}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative bg-gray-200 rounded overflow-hidden ${isMaximized
          ? "col-span-full row-span-full w-full h-[60vh]"
          : "aspect-square"
        }`}
    >
      <audio ref={micRef} autoPlay playsInline />

      {/* Video or fallback avatar */}
      {videoStream ? (
        <ReactPlayer
          playing
          muted={!isSpeakerEnabled}
          controls={false}
          pip={false}
          url={videoStream}
          width="100%"
          height="100%"
          className="rounded-lg object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <img
            src={logo}
            alt="Avatar"
            className="w-16 h-16 opacity-70 filter invert"
          />
        </div>
      )}

      {/* Name label */}
      <div title={label} className="truncate max-w-[70%] absolute bottom-2 left-2 text-xs px-2 py-1 bg-gray-700 bg-opacity-50 rounded text-white">
        {label}
      </div>

      {/* Maximize / Minimize */}
      <button
        onClick={onToggleMaximize}
        className="absolute bottom-2 right-2 p-1 bg-gray-800 text-white rounded"
        aria-label={isMaximized ? "Minimize" : "Maximize"}
      >
        {isMaximized ? <FaCompress size={14} /> : <FaExpand size={14} />}
      </button>

      {handRaised && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute top-8 left-2 p-1 bg-yellow text-black rounded-full shadow"
        >
          <FaHandPaper size={24} title="Hand Raised" />
        </motion.div>
      )}
      {/* Participant Options Menu */}
      {!isLocal && (
        <div className="absolute top-2 left-2">
          <div className="relative">
            <button
              className="p-1 bg-gray-800 text-white rounded hover:bg-gray-700"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <BsThreeDotsVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute z-10 mt-1 bg-white text-black rounded shadow">
                <button
                  onClick={() => {
                    disableMic(); // Mutes the specific participant
                    setShowMenu(false);
                  }}
                  className="block w-full text-left truncate px-4 py-2 text-xs hover:bg-gray-100"
                >
                  Mute {label?.split(" ")[0]}
                </button>
                <button
                  onClick={() => {
                    remove(); // Mutes the specific participant
                    removedParticipantsRef.current.add(participantId);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left truncate px-4 py-2 text-xs hover:bg-gray-100"
                >
                  Remove {label?.split(" ")[0]}
                </button>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Mic & Cam Controls (UI Only) */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          className={`p-1 rounded ${webcamOn ? "bg-green-600" : "bg-red-600"}`}
          aria-label={webcamOn ? "Turn off webcam" : "Turn on webcam"}
        >
          {webcamOn ? <FaVideo size={14} /> : <FaVideoSlash size={14} />}
        </button>
        <button
          className={`p-1 rounded ${micOn ? "bg-green-600" : "bg-red-600"}`}
          aria-label={micOn ? "Mute mic" : "Unmute mic"}
        >
          {micOn ? (
            <AiOutlineAudio size={14} />
          ) : (
            <AiOutlineAudioMuted size={14} />
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ParticipantVideo;

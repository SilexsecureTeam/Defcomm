import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParticipant, useMeeting } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import {
  FaVideo,
  FaVideoSlash,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import {
  AiOutlineAudioMuted,
  AiOutlineAudio,
} from "react-icons/ai";
import { motion } from "framer-motion";
import logo from "../../assets/logo-icon.png";

const ParticipantVideo = ({
  participantId,
  label,
}: {
  participantId: string;
  label: string;
}) => {
  const { webcamStream, micStream, webcamOn, micOn, isLocal } =
    useParticipant(participantId);
  const { toggleMic, toggleWebcam } = useMeeting();
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);

  const micRef = useRef<HTMLAudioElement | null>(null);

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
        micRef.current.play().catch((err) => console.error("Mic play error", err));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micOn, micStream, isLocal]);

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative bg-gray-700 rounded overflow-hidden
        ${isMaximized ? "col-span-2 w-full" : "aspect-square"}
      `}
      style={{
        gridColumn: isMaximized ? "span 2 / span 2" : undefined,
        gridRow: isMaximized ? "span 2 / span 2" : undefined, // double row span
      }}
    >
      <audio ref={micRef} autoPlay playsInline />

      {/* Video or Fallback */}
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
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <img
            src={logo}
            alt="Avatar"
            className="w-16 h-16 opacity-70 filter invert"
          />
        </div>
      )}

      {/* Overlay Controls */}
      <div className="absolute bottom-2 left-2 text-xs px-2 py-1 bg-gray-700 bg-opacity-50 rounded text-white">
        {label}
      </div>

      {/* Controls bottom right */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button
          onClick={() => setIsMaximized((prev) => !prev)}
          className="p-1 bg-gray-800 text-white rounded"
          aria-label={isMaximized ? "Minimize" : "Maximize"}
        >
          {isMaximized ? <FaCompress size={14} /> : <FaExpand size={14} />}
        </button>
        <button
          onClick={toggleWebcam}
          className={`p-1 rounded ${webcamOn ? "bg-green-600" : "bg-red-600"}`}
          aria-label={webcamOn ? "Turn off webcam" : "Turn on webcam"}
        >
          {webcamOn ? <FaVideo size={14} /> : <FaVideoSlash size={14} />}
        </button>
        <button
          onClick={toggleMic}
          className={`p-1 rounded ${micOn ? "bg-green-600" : "bg-red-600"}`}
          aria-label={micOn ? "Mute mic" : "Unmute mic"}
        >
          {micOn ? <AiOutlineAudio size={14} /> : <AiOutlineAudioMuted size={14} />}
        </button>
      </div>
    </motion.div>
  );
};

export default ParticipantVideo;

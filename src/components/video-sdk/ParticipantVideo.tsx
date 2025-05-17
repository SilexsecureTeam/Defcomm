import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
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
import logo from "../../assets/logo-icon.png";
import { AuthContext } from "../../context/AuthContext";

const ParticipantVideo = ({ participantId, label }: { participantId: string; label: string }) => {
  const { webcamStream, micStream, webcamOn, micOn, isLocal } = useParticipant(participantId);
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
    <div className={`relative bg-gray-700 rounded
        ${isMaximized ? "col-span-2 row-span-1 w-full h-full" : "aspect-square"}
        transition-all duration-300 ease-in-out
      `}
      style={{
        // fallback for grid span if tailwind col-span-2 etc. aren't enough in your layout
        gridColumn: isMaximized ? "span 2 / span 2" : undefined,
        gridRow: isMaximized ? "span 1 / span 1" : undefined,
      }}>
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
          <img src={logo} alt="Avatar" className="w-16 h-16 opacity-70 filter invert" />
        </div>
      )}

      {/* Overlay Controls */}
      <div className="absolute bottom-2 left-2 text-xs px-2 py-1 bg-gray-700 bg-opacity-50 rounded text-white">
        {label}
      </div>

      <div className="absolute top-2 right-2 flex gap-2">
        <button onClick={() => setIsMaximized((prev) => !prev)} className="p-1 bg-gray-800 text-white rounded">
          {isMaximized ? <FaCompress size={14} /> : <FaExpand size={14} />}
        </button>
        <button onClick={toggleWebcam} className={`p-1 rounded ${webcamOn ? "bg-green-600" : "bg-red-600"}`}>
          {webcamOn ? <FaVideo size={14} /> : <FaVideoSlash size={14} />}
        </button>
        <button onClick={toggleMic} className={`p-1 rounded ${micOn ? "bg-green-600" : "bg-red-600"}`}>
          {micOn ? <AiOutlineAudio size={14} /> : <AiOutlineAudioMuted size={14} />}
        </button>
      </div>
    </div>
  );
};

export default ParticipantVideo;
        

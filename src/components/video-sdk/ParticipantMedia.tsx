import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import mainLogoTwo from "../../assets/logo-icon.png";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

interface ParticipantProps {
  participantId: string;
  auth: any;
  isMicEnabled: boolean;
  setIsMicEnabled: any;
}

const ParticipantMedia= ({ participantId, auth, isMicEnabled, setIsMicEnabled }:ParticipantProps) => {
  const micRef = useRef<HTMLAudioElement | null>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
   setIsMicEnabled(micOn);
  }, [micOn])
  
  const toggleMic = () => {
    setIsMicEnabled(!isMicEnabled);
  };

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current.play().catch((error) => console.error("Audio play error:", error));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <li className="w-20 h-20 relative bg-black/80 rounded-[10px] flex justify-center items-center">
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn ? (
        <ReactPlayer
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted
          playing
          url={videoStream}
          height="100%"
          width="100%"
          className="rounded-md"
        />
      ) : (
        <img className="rounded-md" src={mainLogoTwo} alt="User Avatar" />
      )}
      <div
        onClick={toggleMic}
        className={`absolute cursor-pointer hover:scale-105 duration-100 flex items-center justify-center left-2 bottom-2 ${
          isMicEnabled ? "bg-green" : "bg-red-700"
        } rounded-full h-[20px] w-[20px]`}
      >
        {isMicEnabled ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />}
      </div>
    </li>
  );
};

export default ParticipantMedia;

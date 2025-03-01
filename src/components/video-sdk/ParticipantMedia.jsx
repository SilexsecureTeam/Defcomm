import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import mainLogoTwo from "../../assets/logo-icon.png";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import CallInfo from "../Chat/CallInfo";
import CallControls from "../Chat/CallControls";

const ParticipantMedia = ({ participantId, auth, isRinging, callDuration, handleLeave }) => {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal } = useParticipant(participantId);
  const { toggleMic, toggleWebcam } = useMeeting();
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);

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
        micRef.current.muted = isLocal; // Only mute self, others should hear
        micRef.current.play().catch((error) => console.error("Audio play error:", error));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn, isLocal]);

  return (
    <div className="flex flex-col items-center">
      <figure className="w-20 h-20 relative bg-black/80 rounded-[10px] flex justify-center items-center">
        <audio ref={micRef} autoPlay playsInline muted={isLocal} />
        {webcamOn ? (
          <ReactPlayer
            playsinline
            pip={false}
            light={false}
            controls={false}
            muted={!isSpeakerEnabled}
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
          onClick={toggleWebcam}
          className={`absolute cursor-pointer hover:scale-105 duration-100 flex items-center justify-center left-2 bottom-2 ${
            webcamOn ? "bg-green" : "bg-red-700"
          } rounded-full h-[24px] w-[24px]`}
        >
          {micOn ? <FaVideo size={16} /> : <FaVideoSlash size={16} />}
        </div>
      </figure>
      <CallInfo callerName={auth?.user?.name || "Unknown"} callDuration={callDuration} />
      <CallControls isMuted={micOn} toggleMute={toggleMic} isSpeakerOn={isSpeakerEnabled} />
      <button onClick={handleLeave} className="bg-red-500 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
        <MdCallEnd /> End Call
      </button>
    </div>
  );
};

export default ParticipantMedia;

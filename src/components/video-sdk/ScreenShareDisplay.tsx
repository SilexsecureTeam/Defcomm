import React, { useMemo, useState } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { FaExpand, FaCompress, FaThumbtack } from "react-icons/fa";

const ScreenShareDisplay = ({ participantId, isUser }: { participantId: string, isUser: boolean }) => {
  const { screenShareStream, screenShareOn, displayName } = useParticipant(participantId);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const screenStream = useMemo(() => {
    if (screenShareOn && screenShareStream) {
      const stream = new MediaStream();
      stream.addTrack(screenShareStream.track);
      return stream;
    }
    return null;
  }, [screenShareOn, screenShareStream]);

  if (!screenStream) return null;

  return (
    <div className={`relative w-full h-full bg-black rounded-lg overflow-hidden ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Overlay: Participant Name + Pin + Fullscreen */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-4 py-2 bg-black bg-opacity-50 z-10">
        <span className="text-white font-semibold">{isUser ? "You" : (displayName || "Presenter")}</span>
        <div className="flex items-center gap-3">
          <button title="Pin Screen" className="text-white opacity-70 hover:opacity-100">
            <FaThumbtack />
          </button>
          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="text-white opacity-70 hover:opacity-100"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Player */}
      <ReactPlayer
        playsinline
        playing
        muted
        controls={false}
        url={screenStream}
        width="100%"
        height="100%"
        className="object-contain"
        onError={(err) => console.error("Screen share error:", err)}
      />
    </div>
  );
};

export default ScreenShareDisplay;

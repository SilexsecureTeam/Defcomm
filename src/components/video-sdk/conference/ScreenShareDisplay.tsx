import React, { useMemo, useRef, useState, useEffect } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import {
  FaExpand,
  FaCompress,
  FaSearchPlus,
  FaSearchMinus,
} from "react-icons/fa";

// Clamp utility
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const ScreenShareDisplay = ({
  participantId,
  isUser,
}: {
  participantId: string;
  isUser: boolean;
}) => {
  const { screenShareStream, screenShareOn, displayName } =
    useParticipant(participantId);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const screenStream = useMemo(() => {
    if (screenShareOn && screenShareStream) {
      const stream = new MediaStream();
      stream.addTrack(screenShareStream.track);
      return stream;
    }
    return null;
  }, [screenShareOn, screenShareStream]);

  if (!screenStream) return null;

  // Clamp position to stay within bounds based on zoom
  const clampPosition = (pos: { x: number; y: number }) => {
    if (!containerRef.current || zoom <= 1) return { x: 0, y: 0 };

    const bounds = containerRef.current.getBoundingClientRect();
    const limitX = ((zoom - 1) * bounds.width) / 2;
    const limitY = ((zoom - 1) * bounds.height) / 2;

    return {
      x: clamp(pos.x, -limitX, limitX),
      y: clamp(pos.y, -limitY, limitY),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom === 1) return;
    setDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || zoom === 1 || !dragStartRef.current) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;

    const clamped = clampPosition({ x: newX, y: newY });
    setPosition(clamped);
  };

  const handleMouseUp = () => setDragging(false);

  const handleZoom = (delta: number) => {
    setZoom((prevZoom) => {
      const newZoom = clamp(prevZoom + delta, 1, 3);
      const newPos = newZoom === 1 ? { x: 0, y: 0 } : clampPosition(position);
      setPosition(newPos);
      return newZoom;
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black rounded-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-4 py-2 bg-black bg-opacity-50 z-20">
        <span className="text-white font-semibold">
          {isUser ? "You" : displayName || "Presenter"}
        </span>
        <button
          onClick={() => setIsFullscreen((prev) => !prev)}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="text-white text-xl hover:text-lime-400"
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>

      {/* Zoom and pan area */}
      <div
        className="absolute inset-0 flex justify-center items-center"
        style={{
          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
            position.y / zoom
          }px)`,
          transformOrigin: "center center",
          transition: dragging ? "none" : "transform 0.2s ease-out",
          cursor: zoom > 1 ? "grab" : "default",
        }}
      >
        <ReactPlayer
          playsinline
          playing
          muted
          controls={false}
          url={screenStream}
          width="100%"
          height="100%"
          className="object-contain pointer-events-none"
          onError={(err) => console.error("Screen share error:", err)}
        />
      </div>

      {/* Zoom Controls (Bottom Center) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-4 bg-black bg-opacity-50 px-5 py-2 rounded-full">
        <button
          onClick={() => handleZoom(0.1)}
          className="text-white text-2xl p-3 hover:bg-white hover:text-black rounded-full transition"
          title="Zoom In"
        >
          <FaSearchPlus />
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="text-white text-2xl p-3 hover:bg-white hover:text-black rounded-full transition"
          title="Zoom Out"
        >
          <FaSearchMinus />
        </button>
      </div>
    </div>
  );
};

export default ScreenShareDisplay;

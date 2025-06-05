import React, { useState, useEffect } from "react";
import { Constants } from "@videosdk.live/react-sdk";
import { FaCircle, FaStopCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const EDGE_MARGIN = 16;

const RecordingControlButton = ({ toggleRecording, recordingState, recordingTimer }) => {
  const isRecording = recordingState === Constants.recordingEvents.RECORDING_STARTED;

  // Position state, default bottom-right corner
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });

  // Update position if window resizes (keep it inside viewport)
  useEffect(() => {
    const handleResize = () => {
      setPosition(pos => ({
        x: Math.min(pos.x, window.innerWidth - 80),
        y: Math.min(pos.y, window.innerHeight - 80),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDragEnd = (_, info) => {
    const { x, y } = info.point;
    const { innerWidth, innerHeight } = window;

    // Snap horizontally to closest edge (left or right)
    const snapX = x < innerWidth / 2 ? EDGE_MARGIN : innerWidth - EDGE_MARGIN - 64; // 64 is approx button width
    // Keep vertical position as is, but constrain to viewport
    const snapY = Math.min(Math.max(y, EDGE_MARGIN), innerHeight - EDGE_MARGIN - 64);

    setPosition({ x: snapX, y: snapY });
  };

  return (
    <>
      <AnimatePresence>
        {isRecording && (
          <motion.div
            key="recording-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ position: "fixed", left: position.x + 12, top: position.y - 30, pointerEvents: "none" }}
            className="text-xs text-red-600 font-semibold bg-white/90 backdrop-blur rounded-full px-3 py-1 shadow-md border border-red-300 select-none"
          >
            ● Recording {recordingTimer}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        drag
        dragMomentum={false}
        dragConstraints={{ left: EDGE_MARGIN, right: window.innerWidth - EDGE_MARGIN - 64, top: EDGE_MARGIN, bottom: window.innerHeight - EDGE_MARGIN - 64 }}
        onDragEnd={handleDragEnd}
        animate={{ x: position.x, y: position.y }}
        whileTap={{ scale: 0.9 }}
        transition={isRecording ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" } : { duration: 0.2 }}
        className={`fixed w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 cursor-grab active:cursor-grabbing ${
          isRecording ? "bg-red-600 border-red-400" : "bg-green-600 border-green-400"
        } hover:brightness-110 focus:outline-none`}
        title={isRecording ? "Stop Recording" : "Start Recording"}
        style={{ touchAction: "none" }} // Helps mobile dragging
        onClick={toggleRecording}
      >
        {isRecording ? (
          <FaStopCircle className="w-7 h-7 text-white" />
        ) : (
          <FaCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </>
  );
};

export default RecordingControlButton;

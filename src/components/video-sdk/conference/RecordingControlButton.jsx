import React, { useRef, useEffect, useState } from "react";
import { Constants } from "@videosdk.live/react-sdk";
import { FaCircle, FaStopCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const EDGE_MARGIN = 16;

const RecordingControlButton = ({ toggleRecording, recordingState, recordingTimer }) => {
  const isRecording = recordingState === Constants.recordingEvents.RECORDING_STARTED;

  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Snap to nearest edge on drag end
  const handleDragEnd = (_, info) => {
    const { x, y } = info.point;
    const { innerWidth, innerHeight } = window;

    const snapX =
      x < innerWidth / 2 ? -innerWidth / 2 + EDGE_MARGIN : innerWidth / 2 - EDGE_MARGIN;
    const snapY =
      y < innerHeight / 2 ? -innerHeight / 2 + EDGE_MARGIN : innerHeight / 2 - EDGE_MARGIN;

    // If user drags into center zone, prevent snap (stick to closest edge only)
    const centerMargin = 100;
    const centerX = Math.abs(x - innerWidth / 2) < centerMargin;
    const centerY = Math.abs(y - innerHeight / 2) < centerMargin;

    setPosition({
      x: centerX ? position.x : snapX,
      y: centerY ? position.y : snapY,
    });
  };

  return (
    <motion.div
      ref={containerRef}
      className="fixed z-50 flex flex-col items-end space-y-2 cursor-grab active:cursor-grabbing"
      style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      drag
      dragMomentum={false}
      dragElastic={0.3}
      onDragEnd={handleDragEnd}
      animate={position}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 font-medium bg-white/90 backdrop-blur rounded-full px-3 py-1 shadow-md border border-red-300"
        >
          ● Recording {recordingTimer}
        </motion.div>
      )}

      <motion.button
        onClick={toggleRecording}
        whileTap={{ scale: 0.95 }}
        animate={
          isRecording
            ? { scale: [1, 1.1, 1] }
            : { scale: 1 }
        }
        transition={
          isRecording
            ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
            : { duration: 0.2 }
        }
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 shadow-xl border-2 ${
          isRecording
            ? "bg-red-600 border-red-400"
            : "bg-green-600 border-green-400"
        } hover:brightness-110`}
        title={isRecording ? "Stop Recording" : "Start Recording"}
      >
        {isRecording ? (
          <FaStopCircle className="w-7 h-7 text-white" />
        ) : (
          <FaCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </motion.div>
  );
};

export default RecordingControlButton;

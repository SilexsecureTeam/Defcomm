import React, { useRef, useState } from "react";
import { Constants } from "@videosdk.live/react-sdk";
import { FaCircle, FaStopCircle, FaGripLines } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const RecordingControlButton = ({
  toggleRecording,
  recordingState,
  recordingTimer,
}) => {
  const isRecording =
    recordingState === Constants.recordingEvents.RECORDING_STARTED;
  const constraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setTimeout(() => setIsDragging(false), 100);
  const handleClick = (e) => {
    e.preventDefault();
    if (!isDragging) toggleRecording();
  };

  const formatTimer = (timer) => {
    if (!timer) return "00:00";
    const minutes = Math.floor(timer / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timer % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={constraintsRef}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="absolute bottom-6 right-6 flex flex-col items-end space-y-2 pointer-events-auto cursor-grab active:cursor-grabbing"
      >
        {/* Recording Timer */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-xl px-3 py-1 shadow-lg border border-red-300"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
              <span className="text-xs font-semibold text-gray-800">
                Recording
              </span>
              <span className="text-xs font-mono font-bold text-red-600">
                {recordingTimer}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <div className="relative">
          {/* Drag Handle */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute -top-6 left-1/2 transform -translate-x-1/2"
              >
                <FaGripLines className="text-gray-400 text-sm" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulsing Ring */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full border-2 border-red-400"
              />
            )}
          </AnimatePresence>

          {/* Button */}
          <motion.button
            onClick={handleClick}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300
              ${
                isRecording
                  ? "bg-red-600 border-red-400 text-white"
                  : "bg-green-600 border-green-400 text-white"
              }`}
            title={isRecording ? "Stop Recording" : "Start Recording"}
          >
            {isRecording ? (
              <FaStopCircle className="w-5 h-5" />
            ) : (
              <FaCircle className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute -bottom-10 right-0 transform bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-md"
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RecordingControlButton;

import React, { useRef } from "react";
import { Constants } from "@videosdk.live/react-sdk";
import { FaCircle, FaStopCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const RecordingControlButton = ({ toggleRecording, recordingState, recordingTimer }) => {
  const isRecording = recordingState === Constants.recordingEvents.RECORDING_STARTED;
  const constraintsRef = useRef(null);

  return (
    <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none">
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.2}
        dragConstraints={constraintsRef}
        className="absolute bottom-6 right-6 flex flex-col items-end space-y-2 cursor-grab active:cursor-grabbing pointer-events-auto"
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
          } hover:brightness-110 active:scale-95`}
          title={isRecording ? "Stop Recording" : "Start Recording"}
        >
          {isRecording ? (
            <FaStopCircle className="w-7 h-7 text-white" />
          ) : (
            <FaCircle className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RecordingControlButton;
                      

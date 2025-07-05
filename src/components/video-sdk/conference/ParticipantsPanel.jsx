import { motion, AnimatePresence } from "framer-motion";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaHandPaper,
} from "react-icons/fa";

const ParticipantsPanel = ({ participants, raisedHands, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed right-4 bottom-20 w-64 max-h-[60vh] overflow-y-auto bg-white border border-gray-300 shadow-md rounded-md p-4 z-50"
    >
      <div className="flex justify-between items-center mb-2 border-b pb-2">
        <h3 className="text-oliveLight font-semibold">Participants</h3>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-600 text-xs font-medium"
        >
          Close
        </button>
      </div>
      <ul className="space-y-2 text-gray-800 text-sm">
        {[...participants.keys()].map((id) => {
          const participant = participants.get(id);
          const isRaised = raisedHands.find((u) => u.id === id);
          return (
            <li key={id} className="flex items-center justify-between">
              <span className="truncate">
                {participant.displayName || "Unnamed"}
              </span>
              <div className="flex items-center gap-2">
                {participant.micOn ? (
                  <FaMicrophone className="text-green-500" />
                ) : (
                  <FaMicrophoneSlash className="text-gray-400" />
                )}
                {participant.webcamOn ? (
                  <FaVideo className="text-green-500" />
                ) : (
                  <FaVideoSlash className="text-gray-400" />
                )}
                {isRaised && <FaHandPaper className="text-yellow" />}
              </div>
            </li>
          );
        })}
      </ul>
    </motion.div>
  </AnimatePresence>
);

export default ParticipantsPanel;

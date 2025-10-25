import { motion, AnimatePresence } from "framer-motion";
import { useContext, useMemo } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaHandPaper,
  FaCrown,
  FaUserSlash,
} from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import { MeetingContext } from "../../../context/MeetingContext";

const ParticipantsPanel = ({ participants, raisedHands, onClose }) => {
  const { authDetails } = useContext(AuthContext);
  const { conference } = useContext(MeetingContext);

  const allParticipants = useMemo(() => {
    if (!participants) return [];
    return [...participants.values()];
  }, [participants]);

  const iAmHost =
    String(authDetails?.user?.id) === String(conference?.creator_id);

  // 🔇 Host or self can toggle mic
  const handleToggleMic = async (participant) => {
    if (!participant) return;
    const isSelf = String(participant.id) === String(authDetails?.user?.id);

    // Only host can mute others; participant can only mute/unmute self
    if (iAmHost || isSelf) {
      try {
        if (participant.micOn && participant.muteMic) {
          await participant.muteMic();
        } else if (!participant.micOn && isSelf && participant.unmuteMic) {
          // Only allow unmute for self
          await participant.unmuteMic();
        }
      } catch (error) {
        console.error("Mic toggle failed:", error);
      }
    }
  };

  // 🔇 Mute all (host only)
  const handleMuteAll = async () => {
    if (!iAmHost) return;
    try {
      for (const participant of allParticipants) {
        const isSelf = String(participant.id) === String(authDetails?.user?.id);
        if (!isSelf && participant.micOn && participant.muteMic) {
          await participant.muteMic();
        }
      }
    } catch (error) {
      console.error("Failed to mute all participants:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="fixed right-4 bottom-20 w-72 max-h-[50vh] overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-2xl p-4 pt-0 z-50"
      >
        {/* Header */}
        <div className="sticky top-0 pt-4 bg-white flex justify-between items-center mb-3 border-b pb-2">
          <h3 className="text-oliveLight font-semibold text-sm uppercase tracking-wide">
            Participants ({allParticipants.length})
          </h3>
          <div className="flex items-center gap-2">
            {iAmHost && (
              <button
                onClick={handleMuteAll}
                className="text-xs text-gray-600 hover:text-red-500 transition flex items-center gap-1"
                title="Mute all participants"
              >
                <FaUserSlash className="text-red-400" />
                <span>Mute All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-600 text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* List */}
        <ul className="space-y-2 text-gray-800 text-sm">
          {allParticipants.map((participant) => {
            const isRaised = raisedHands.some((u) => u.id === participant.id);
            const isHost =
              String(participant.id) === String(conference?.creator_id);
            const isSelf =
              String(participant.id) === String(authDetails?.user?.id);

            return (
              <li
                key={participant.id}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  isSelf ? "bg-oliveLight/10" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {isHost && <FaCrown className="text-yellow" title="Host" />}
                  <span className="truncate font-medium">
                    {participant.displayName || "Anonymous"}
                  </span>
                  {isSelf && (
                    <span className="text-[11px] text-gray-400">(You)</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Mic toggle (same icon) */}
                  <button
                    onClick={() => handleToggleMic(participant)}
                    disabled={!iAmHost && !isSelf}
                    className={`p-1 rounded transition ${
                      !iAmHost && !isSelf
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    title={
                      participant.micOn
                        ? "Click to mute"
                        : isSelf
                        ? "Click to unmute"
                        : "Mic off"
                    }
                  >
                    {participant.micOn ? (
                      <FaMicrophone className="text-green-500" />
                    ) : (
                      <FaMicrophoneSlash className="text-red-500" />
                    )}
                  </button>

                  {/* Camera indicator */}
                  {participant.webcamOn ? (
                    <FaVideo className="text-green-500" title="Camera On" />
                  ) : (
                    <FaVideoSlash
                      className="text-gray-400"
                      title="Camera Off"
                    />
                  )}

                  {/* Hand raised */}
                  {isRaised && (
                    <FaHandPaper
                      className="text-yellow-400"
                      title="Hand Raised"
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};

export default ParticipantsPanel;

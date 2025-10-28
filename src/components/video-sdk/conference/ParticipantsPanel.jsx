import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useMemo, useState } from "react";
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

  const [refresh, setRefresh] = useState(0);

  // 🔄 Force re-render when mic/cam state changes
  useEffect(() => {
    const unsubscribers = [];

    participants?.forEach((participant) => {
      const handleStreamUpdate = () => setRefresh((r) => r + 1);

      participant.on("stream-enabled", handleStreamUpdate);
      participant.on("stream-disabled", handleStreamUpdate);

      unsubscribers.push(() => {
        participant.off("stream-enabled", handleStreamUpdate);
        participant.off("stream-disabled", handleStreamUpdate);
      });
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [participants]);

  const allParticipants = useMemo(() => {
    if (!participants) return [];
    return [...participants.values()];
  }, [participants, refresh]);

  const iAmHost =
    String(authDetails?.user?.id) === String(conference?.creator_id);

  const handleToggleMic = async (participant) => {
    if (!participant) return;
    const isSelf = String(participant.id) === String(authDetails?.user?.id);

    if (iAmHost || isSelf) {
      try {
        if (participant.micOn) {
          await participant.disableMic();
        } else if (!participant.micOn && isSelf) {
          await participant.enableMic();
        }
      } catch (error) {
        console.error("Mic toggle failed:", error);
      }
    }
  };

  const handleMuteAll = async () => {
    if (!iAmHost) return;
    participants.forEach((participant) => {
      participant?.disableMic();
    });
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
        <div className="sticky top-0 pt-4 bg-white flex justify-between items-center mb-3 border-b pb-2">
          <h3 className="text-oliveLight font-semibold text-sm uppercase tracking-wide">
            Participants ({allParticipants.length})
          </h3>
          <div className="flex items-center gap-2">
            {iAmHost && (
              <button
                onClick={handleMuteAll}
                className="text-xs text-gray-600 hover:text-red-500 transition flex items-center gap-1"
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

                  {participant.webcamOn ? (
                    <FaVideo className="text-green-500" title="Camera On" />
                  ) : (
                    <FaVideoSlash
                      className="text-gray-400"
                      title="Camera Off"
                    />
                  )}

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

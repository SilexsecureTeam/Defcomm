import { useContext, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdExpandLess, MdExpandMore, MdMic } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";
import { CommContext } from "../../context/CommContext";
import { AuthContext } from "../../context/AuthContext";
import { formatLocalTime } from "../../utils/formmaters";
import AudioVisualizer from "../charts/AudioVisualizer";

const CommLogPanel = () => {
  const { walkieMessages } = useContext(CommContext);
  const { authDetails } = useContext(AuthContext);
  const currentUserId = authDetails?.user?.id;

  const [expanded, setExpanded] = useState(false);
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const [alertUser, setAlertUser] = useState(null);

  const [isPlayingId, setIsPlayingId] = useState(null);

  const logEndRef = useRef(null);
  const lastMsgCount = useRef(0);
  const audioRef = useRef(null);

  // Auto-scroll when expanded
  useEffect(() => {
    if (expanded) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [walkieMessages, expanded]);

  // Detect new message when collapsed
  useEffect(() => {
    if (
      !expanded &&
      walkieMessages.length > lastMsgCount.current &&
      lastMsgCount.current !== 0
    ) {
      const latest = walkieMessages[walkieMessages.length - 1];
      const latestUser = latest.display_name || latest.user_name || "Unknown";
      setAlertUser(latestUser);
      setNewMessageAlert(true);
    }
    lastMsgCount.current = walkieMessages.length;
  }, [walkieMessages, expanded, currentUserId]);

  // Stop alert if expanded
  useEffect(() => {
    if (expanded) {
      setNewMessageAlert(false);
      setAlertUser(null);
    }
  }, [expanded]);

  // Play / Pause audio
  const handlePlayPause = (msg, index) => {
    if (!msg.record) return;

    if (isPlayingId === index) {
      audioRef.current.pause();
      setIsPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(`${import.meta.env.VITE_BASE_URL}${msg.record}`);
    audioRef.current = audio;
    setIsPlayingId(index);
    audio.play();

    audio.onended = () => {
      setIsPlayingId(null);
      audioRef.current = null;
    };
  };

  return (
    <div className="w-full mb-3 rounded-lg border border-lime-500/40 overflow-hidden backdrop-blur-lg bg-black/40 shadow-[0_0_20px_rgba(0,255,0,0.15)]">
      {/* Header */}
      <div
        className={`flex justify-between items-center px-3 py-1 cursor-pointer border-b border-lime-500/30 ${
          newMessageAlert
            ? "bg-lime-900/50 animate-pulse"
            : "bg-gradient-to-r from-lime-800/50 to-lime-900/50"
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-xs text-lime-300 tracking-wide font-mono">
          COMMS LOG ({walkieMessages.length})
        </span>
        {expanded ? (
          <MdExpandLess className="text-lime-300" />
        ) : (
          <MdExpandMore className="text-lime-300" />
        )}
      </div>

      {/* Visualizer */}
      <div className="p-2 flex justify-center bg-black/10 relative overflow-hidden">
        <AudioVisualizer
          audioRef={audioRef}
          width={250}
          height={50}
          fillColor={newMessageAlert ? "#9acd32" : "#7fff00"}
          strokeColor="rgba(0,255,0,0.2)"
        />

        {/* HUD name overlay */}
        <AnimatePresence>
          {alertUser && !expanded && (
            <motion.span
              key={alertUser}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.9, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center 
                         text-lime-300 font-bold text-sm tracking-widest pointer-events-none 
                         drop-shadow-[0_0_4px_rgba(144,238,144,0.6)]"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              {alertUser.toUpperCase()}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Logs */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="logList"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "170px", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-y-auto px-3 py-2 text-xs space-y-2"
          >
            {walkieMessages.length === 0 ? (
              <p className="text-gray-400 italic">Awaiting transmission...</p>
            ) : (
              walkieMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-2 p-2 rounded-md border border-lime-400/20 ${
                    i === walkieMessages.length - 1 && isPlayingId === i
                      ? "bg-gradient-to-r from-lime-600/20 to-green-800/10 animate-pulse"
                      : "bg-gradient-to-r from-gray-800/30 to-gray-900/20"
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-green-700 text-black text-[0.7rem] font-bold shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                    {(msg.user_name || "?").charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-lime-300 font-semibold">
                        {msg.display_name}
                      </span>

                      <span className="text-gray-400 text-[0.65rem]">
                        {msg.time || formatLocalTime()}
                      </span>
                    </div>
                    <p className="text-gray-200 break-words">
                      {msg.text ? (
                        msg.text
                      ) : (
                        <div className="flex items-center gap-2 text-lime-200">
                          <button
                            onClick={() => handlePlayPause(msg, i)}
                            className="p-1 rounded-full border border-lime-400 hover:bg-lime-500 hover:text-black transition"
                          >
                            {isPlayingId === i ? (
                              <FaPause size={12} />
                            ) : (
                              <FaPlay size={12} />
                            )}
                          </button>
                          <MdMic size={12} />
                          Voice message
                        </div>
                      )}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={logEndRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommLogPanel;

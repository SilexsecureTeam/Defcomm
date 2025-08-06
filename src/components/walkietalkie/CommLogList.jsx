import { motion } from "framer-motion";
import { MdMic } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";
import { formatLocalTime } from "../../utils/formmaters";

const CommLogList = ({
  walkieMessages,
  isPlayingId,
  handlePlayPause,
  audioRef,
  logEndRef,
}) => {
  return (
    <div className="overflow-y-auto px-3 py-2 text-xs space-y-2">
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
              <div className="flex justify-between gap-2">
                <span
                  title={msg?.display_name}
                  className="text-lime-300 font-semibold truncate"
                >
                  {msg?.display_name || "Anonymous"}
                </span>
                <span className="flex-shrink-0 text-gray-400 text-[0.65rem]">
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
    </div>
  );
};

export default CommLogList;

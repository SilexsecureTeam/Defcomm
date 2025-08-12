import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContext } from "../../context/ChatContext";
import { parseHtml } from "../../utils/formmaters";
import CustomAudioMessage from "../Chat/CustomAudioMessage";
import ChatFilePreview from "../Chat/ChatFilePreview";
import ChatCallInvite from "../Chat/ChatCallInvite";

const GroupMessage = ({ msg, sender, showAvatar, isLastInGroup }) => {
  const { chatVisibility, setShowCall, setMeetingId, showToggleSwitch } =
    useContext(ChatContext);

  const [isVisible, setIsVisible] = useState(chatVisibility || false);
  const [userToggled, setUserToggled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_LENGTH = 120;

  useEffect(() => {
    if (chatVisibility && userToggled) {
      setIsVisible(chatVisibility);
      setUserToggled(false);
    } else {
      setIsVisible(chatVisibility);
    }
  }, [chatVisibility, userToggled]);

  const handleAcceptCall = () => {
    setShowCall(true);
    setMeetingId(msg?.message?.split("CALL_INVITE:")[1]);
  };

  return (
    <div
      className={`flex flex-col ${
        msg?.is_my_chat === "yes" ? "items-end" : "items-start"
      }`}
    >
      {/* Avatar & Name */}
      {showAvatar && msg?.is_my_chat !== "yes" && (
        <div className="flex items-center gap-2 mb-1 pl-1">
          {sender?.avatar && (
            <img
              src={sender.avatar}
              alt={sender.name}
              className="w-8 h-8 rounded-full object-cover shadow-sm"
            />
          )}
          <span className="text-xs font-medium text-gray-500">
            {sender.name}
          </span>
        </div>
      )}

      {/* Toggle Switch */}
      {showToggleSwitch && (
        <div className="flex items-center gap-2 mb-1">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isVisible}
              onChange={() => {
                setIsVisible(!isVisible);
                setUserToggled(true);
              }}
            />
            <div
              className={`w-10 h-5 rounded-full transition-all peer-checked:bg-emerald-500 bg-gray-300`}
            >
              <motion.div
                className="absolute top-0 bottom-0 left-[2px] my-auto w-4 h-4 bg-white rounded-full shadow-sm"
                layout
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                animate={{ x: isVisible ? 20 : 0 }}
              />
            </div>
          </label>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`relative p-3 rounded-2xl max-w-[75%] shadow-sm text-sm leading-relaxed ${
          msg?.is_my_chat === "yes"
            ? "bg-emerald-600 text-white rounded-br-sm"
            : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
        }`}
      >
        <AnimatePresence mode="wait">
          {isVisible ? (
            <motion.div
              key="message-content"
              initial={{ opacity: 0.6, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.6, scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {msg?.type === "audio" ? (
                <CustomAudioMessage />
              ) : msg?.is_file === "yes" && msg?.message ? (
                <ChatFilePreview
                  isMyChat={msg?.is_my_chat}
                  fileType={msg?.message?.split(".")[1]}
                  fileUrl={`${import.meta.env.VITE_BASE_URL}secure/${
                    msg?.message
                  }`}
                  fileName={msg?.file_name}
                />
              ) : msg?.message?.startsWith("CALL_INVITE") ? (
                <ChatCallInvite
                  msg={msg}
                  isMyChat={msg?.is_my_chat === "yes"}
                  onAcceptCall={handleAcceptCall}
                  status={
                    (Date.now() - new Date(msg?.updated_at).getTime()) / 1000 <=
                    30
                      ? "Ringing..."
                      : "Call Ended"
                  }
                  caller={sender?.name}
                />
              ) : (
                <div>
                  {msg?.message?.length > MAX_LENGTH && !isExpanded ? (
                    <>
                      {msg?.message.slice(0, MAX_LENGTH)}...
                      <button
                        className="text-xs text-emerald-200 ml-1"
                        onClick={() => setIsExpanded(true)}
                      >
                        Read More
                      </button>
                    </>
                  ) : (
                    parseHtml(msg?.message)
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hidden-message"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.5 }}
              transition={{ duration: 0.15 }}
              onClick={() => !showToggleSwitch && setIsVisible(true)}
              className="cursor-pointer text-gray-400 select-none"
            >
              {"*".repeat(Math.min(msg.message?.length || 4, 200))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timestamp inside bubble */}
        <span
          className={`absolute bottom-1 right-3 text-[10px] ${
            msg?.is_my_chat === "yes" ? "text-emerald-100" : "text-gray-400"
          }`}
        >
          {new Date(msg?.updated_at).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Space after message group */}
      {isLastInGroup && <div className="mb-2" />}
    </div>
  );
};

export default GroupMessage;

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

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const isMine = msg?.is_my_chat === "yes";

  // New color palette for the military theme
  const COLORS = {
    mine: "#556B2F", // A dark, muted green
    theirs: "#1E2A1E", // A slightly darker, muted green
    text: "#E0E0E0", // Off-white for readability on dark backgrounds
    muted: "#8A9188", // A light gray-green for timestamps and muted text
    brass: "#B49E69", // A subtle gold/brass accent color
  };

  return (
    <div
      className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
      style={{ padding: "4px 0" }} // Added padding for better spacing
    >
      {/* Avatar & Sender */}
      {showAvatar && (
        <div
          className={`flex items-center gap-2 mb-2 ${
            !isMine ? "pl-1" : "pr-1 flex-row-reverse"
          }`}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm"
            style={{
              backgroundColor: isMine ? COLORS.mine : COLORS.theirs,
              color: COLORS.text,
              border: `1px solid ${COLORS.brass}`,
            }}
          >
            {getInitials(sender?.member_name || `U${msg?.user_id}`)}
          </div>
          <span
            className="text-xs font-semibold"
            style={{ color: COLORS.muted }}
          >
            {isMine ? "You" : sender?.member_name || `User ${msg?.user_id}`}
          </span>
        </div>
      )}

      {/* Toggle Switch */}
      {showToggleSwitch && (
        <div
          className={`flex items-center gap-2 mb-1 ${isMine ? "pl-1" : "pr-1"}`}
        >
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
              className="w-10 h-5 rounded-full relative transition-all"
              style={{
                backgroundColor: isVisible ? COLORS.brass : COLORS.muted,
              }}
            >
              <motion.div
                className="absolute top-0 bottom-0 left-[2px] my-auto w-4 h-4 bg-white rounded-full shadow"
                layout
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                animate={{ x: isVisible ? 20 : 0 }}
              />
            </div>
          </label>
        </div>
      )}

      {/* Message bubble */}
      <div
        className="relative p-3 max-w-[75%] shadow-md text-sm leading-relaxed rounded-xl"
        style={{
          backgroundColor: isMine ? COLORS.mine : COLORS.theirs,
          color: COLORS.text,
          border: `1px solid ${COLORS.muted}`,
          borderTopRightRadius: isMine ? "4px" : "12px",
          borderTopLeftRadius: isMine ? "12px" : "4px",
        }}
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
                  isMyChat={isMine}
                  onAcceptCall={handleAcceptCall}
                  status={
                    (Date.now() - new Date(msg?.updated_at).getTime()) / 1000 <=
                    30
                      ? "Ringing..."
                      : "Call Ended"
                  }
                  caller={sender?.member_name}
                />
              ) : (
                <div>
                  {msg?.message?.length > MAX_LENGTH && !isExpanded ? (
                    <>
                      {msg?.message.slice(0, MAX_LENGTH)}...
                      <button
                        className="text-xs ml-1 font-medium"
                        style={{ color: COLORS.brass }}
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
              style={{
                color: COLORS.muted,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {"*".repeat(Math.min(msg.message?.length || 4, 200))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timestamp */}
      <div
        className={`mt-1 text-[10px] ${
          isMine ? "text-right pr-1" : "text-left pl-1"
        }`}
        style={{ color: COLORS.muted }}
      >
        {new Date(msg?.updated_at).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {isLastInGroup && <div className="mb-3" />}
    </div>
  );
};

export default GroupMessage;

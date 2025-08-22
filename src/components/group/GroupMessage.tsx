import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

import {
  COLORS,
  resolveTaggedUsers,
  safeString,
} from "../../utils/chat/messageUtils";
import AvatarRow from "./AvatarRow";
import { groupMessageType } from "../../utils/types/chat";
import ToggleSwitch from "../ToggleSwitch";
import MessageContent from "./MessageContent";
import TaggedRow from "./TaggedRow";

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

// Gesture tuning
const SWIPE_TRIGGER_PX = 72; // distance to trigger reply
const SWIPE_MAX_VISUAL = 120; // cap visual offset
const DIRECTION_LOCK_RATIO = 0.3; // horizontal must dominate vertical

function GroupMessage({
  msg,
  sender = {} as any,
  showAvatar = true,
  isLastInGroup = false,
  participants = [],
}) {
  const { authDetails } = useContext(AuthContext);
  const chatCtx = useContext(ChatContext);
  const {
    chatVisibility,
    setShowCall,
    setMeetingId,
    showToggleSwitch,
    setReplyTo,
  } = chatCtx;

  const [isVisible, setIsVisible] = useState(Boolean(chatVisibility));
  const [userToggled, setUserToggled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // swipe state
  const startRef = useRef<any>(null);
  const lastDeltaRef = useRef(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // sync context -> local only when user hasn't toggled
    if (!userToggled) setIsVisible(Boolean(chatVisibility));
  }, [chatVisibility, userToggled]);

  useEffect(() => {
    // reset expanded when message changes
    setIsExpanded(false);
  }, [msg?.id, msg?.updated_at]);

  const isMine = useMemo(() => msg?.is_my_chat === "yes", [msg]);
  const taggedUsers = useMemo(
    () => resolveTaggedUsers(msg, participants),
    [msg, participants]
  );

  const messageText = useMemo(() => safeString(msg?.message), [msg]);

  const handleAcceptCall = useCallback(() => {
    setShowCall(true);
    // defensive split
    const parts = (msg?.message || "").split("CALL_INVITE:");
    if (parts.length > 1) setMeetingId(parts[1]);
  }, [msg, setMeetingId, setShowCall]);

  const toggleVisibility = useCallback(() => {
    setIsVisible((v) => !v);
    setUserToggled(true);
  }, []);

  const timeLabel = useMemo(
    () => timeFormatter.format(new Date(msg?.updated_at || Date.now())),
    [msg]
  );

  // reply handler (calls context if available)
  const doReply = useCallback(() => {
    console.log("[reply] message:", msg);
    setReplyTo(msg);
  }, [setReplyTo, msg]);

  // Pointer handlers for entire bubble
  const onPointerDown = useCallback((e) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    lastDeltaRef.current = 0;
    setIsDragging(true);
    try {
      if (e.pointerId && e.target.setPointerCapture)
        e.target.setPointerCapture(e.pointerId);
    } catch (err) {
      /* ignore capture errors on some browsers */
    }
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      if (!startRef.current) return;
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      lastDeltaRef.current = dx;

      // direction lock: horizontal should dominate vertical
      if (Math.abs(dx) < Math.abs(dy) * (1 + DIRECTION_LOCK_RATIO)) {
        setOffsetX(0);
        return;
      }

      // allow only intended swipe direction: right for others, left for mine
      const allowed = isMine ? dx < 0 : dx > 0;
      const visual = allowed
        ? Math.max(Math.min(dx, SWIPE_MAX_VISUAL), -SWIPE_MAX_VISUAL)
        : 0;
      setOffsetX(visual);
    },
    [isMine]
  );

  const onPointerUp = useCallback(
    (e) => {
      setIsDragging(false);
      const dx = lastDeltaRef.current || 0;
      startRef.current = null;
      lastDeltaRef.current = 0;

      // decide whether to trigger reply: require correct direction + threshold
      if (!isMine && dx >= SWIPE_TRIGGER_PX) {
        // others: swipe right => reply
        doReply();
      } else if (isMine && dx <= -SWIPE_TRIGGER_PX) {
        // mine: swipe left => reply
        doReply();
      }

      // reset visual offset
      setOffsetX(0);
    },
    [isMine, doReply]
  );

  return (
    <div
      className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
      style={{ padding: "4px 0", position: "relative" }}
    >
      <AvatarRow
        isMine={isMine}
        showAvatar={showAvatar}
        senderName={sender?.member_name}
        authName={authDetails?.user?.name}
      />

      {showToggleSwitch && (
        <div
          className={`flex items-center gap-2 mb-1 ${isMine ? "pl-1" : "pr-1"}`}
        >
          <ToggleSwitch
            isChecked={isVisible}
            onToggle={toggleVisibility}
            infoLabel={
              isMine
                ? "Toggle my message visibility"
                : "Toggle message visibility"
            }
          />
        </div>
      )}

      <div
        className="relative p-0 max-w-[75%] shadow-none text-sm leading-relaxed"
        style={{ width: "fit-content" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`message-content-${msg?.id ?? Math.random()}`}
            initial={{ opacity: 0.6, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1, x: offsetX }}
            exit={{ opacity: 0.6, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{
              touchAction: "pan-y",
              userSelect: isDragging ? "none" : "auto",
              display: "block",
            }}
            className={`relative`}
          >
            {/* The actual bubble (kept visually same as before) */}
            <div
              className="p-3 pr-5 pb-3 rounded-xl shadow-md"
              style={{
                backgroundColor: isMine ? COLORS.mine : COLORS.theirs,
                color: COLORS.text,
                border: `1px solid ${COLORS.muted}`,
                borderTopRightRadius: isMine ? "4px" : "12px",
                borderTopLeftRadius: isMine ? "12px" : "4px",
              }}
              onClick={() => {
                if (!showToggleSwitch) toggleVisibility();
              }}
              title={!showToggleSwitch ? "click to show" : "toggle to show"}
            >
              <MessageContent
                msg={msg}
                isVisible={isVisible}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                participants={participants}
                onAcceptCall={handleAcceptCall}
                isMine={isMine}
              />
              <TaggedRow taggedUsers={taggedUsers} isMine={isMine} />
            </div>

            {/* read receipts for mine */}
            {isMine && (
              <span className="ml-1 absolute bottom-1 right-1">
                {msg?.is_read === "yes" ? (
                  <IoCheckmarkDone size={14} className="text-oliveHover" />
                ) : (
                  <IoCheckmark size={14} className="text-gray-400" />
                )}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className={`mt-1 text-[10px] ${
          isMine ? "text-right pr-1" : "text-left pl-1"
        }`}
        style={{ color: COLORS.muted }}
      >
        {timeLabel}
      </div>

      {isLastInGroup && <div className="mb-3" />}
    </div>
  );
}

GroupMessage.propTypes = groupMessageType;
export default React.memo(GroupMessage);

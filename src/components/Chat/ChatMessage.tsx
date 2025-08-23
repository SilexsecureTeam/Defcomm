import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomAudioMessage from "./CustomAudioMessage";
import ChatFilePreview from "./ChatFilePreview";
import ChatCallInvite from "./ChatCallInvite";
import { ChatContext } from "../../context/ChatContext";
import { parseHtml } from "../../utils/formmaters";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import {
  DIRECTION_LOCK_RATIO,
  ReplyPreview,
  resolveTaggedUsers,
  SWIPE_MAX_VISUAL,
  SWIPE_TRIGGER_PX,
} from "../../utils/chat/messageUtils";
import { AuthContext } from "../../context/AuthContext";
const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

const ChatMessage = ({
  msg,
  selectedChatUser,
  messagesById = new Map(),
  messageRefs = null, // optional useRef(Map) passed from parent list
}) => {
  const {
    chatVisibility,
    setShowCall,
    setMeetingId,
    showToggleSwitch,
    setReplyTo,
    scrollToMessage,
  } = useContext(ChatContext);

  const { authDetails } = useContext(AuthContext) as any;

  const [isVisible, setIsVisible] = useState(Boolean(chatVisibility));
  const [userToggled, setUserToggled] = useState(false); // Tracks manual toggle
  const [isExpanded, setIsExpanded] = useState(false);

  // swipe / drag state
  const startRef = useRef<any>(null);
  const lastDeltaRef = useRef(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!userToggled) setIsVisible(Boolean(chatVisibility));
  }, [chatVisibility, userToggled]);

  useEffect(() => {
    // if message changes, collapse expanded text
    setIsExpanded(false);
  }, [msg?.id, msg?.updated_at]);

  const isMine = useMemo(() => msg?.is_my_chat === "yes", [msg]);

  const taggedUsers = useMemo(
    () => resolveTaggedUsers(msg, selectedChatUser),
    [msg, selectedChatUser]
  );

  const handleAcceptCall = useCallback(
    (m) => {
      setShowCall(true);
      setMeetingId(m?.message?.split("CALL_INVITE:")[1]);
    },
    [setShowCall, setMeetingId]
  );

  // Reply action (from swipe)
  const doReply = useCallback(() => {
    if (typeof setReplyTo === "function")
      setReplyTo({
        ...msg,
        contact_id: selectedChatUser?.contact_id,
        contact_id_encrypt: selectedChatUser?.contact_id_encrypt,
        contact_name: selectedChatUser?.contact_name,
        user_type: "user",
      });
  }, [msg, setReplyTo]);

  // Pointer handlers
  const onPointerDown = useCallback((e) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    lastDeltaRef.current = 0;
    setIsDragging(true);
    try {
      if (e.pointerId && e.target.setPointerCapture)
        e.target.setPointerCapture(e.pointerId);
    } catch (err) {
      /* ignore */
    }
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      if (!startRef.current) return;
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      lastDeltaRef.current = dx;

      // direction lock: horizontal must dominate vertical
      if (Math.abs(dx) < Math.abs(dy) * (1 + DIRECTION_LOCK_RATIO)) {
        setOffsetX(0);
        return;
      }

      // allowed swipe: right for others (reply), left for mine
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

      // trigger reply if threshold met
      if (!isMine && dx >= SWIPE_TRIGGER_PX) {
        doReply();
      } else if (isMine && dx <= -SWIPE_TRIGGER_PX) {
        doReply();
      }

      setOffsetX(0);
    },
    [isMine, doReply]
  );

  // Resolve replied message (if any) — same logic as GroupMessage
  const repliedMsg = useMemo(() => {
    const tag = msg?.tag_mess;
    if (!tag) return null;
    if (!messagesById || typeof messagesById.get !== "function") return null;
    const found = messagesById.get(tag);
    if (found) return found;
    return null;
  }, [msg, messagesById]);

  const MAX_LENGTH = 100;

  // stable key used for this message DOM node
  const messageKey = useMemo(() => {
    return String(msg?.id);
  }, [msg]);

  // attach/unregister DOM node in parent's messageRefs map
  const attachRef = useCallback(
    (el) => {
      try {
        const map = messageRefs?.current;
        if (!map) return;
        if (el) map.set(messageKey, el);
        else map.delete(messageKey);
      } catch (err) {
        // ignore
      }
    },
    [messageKey, messageRefs]
  );

  return (
    <div
      className={`flex flex-col ${
        isMine ? "items-end" : "items-start"
      } space-y-1 text-sm`}
    >
      {/* Toggle Switch */}
      {showToggleSwitch && (
        <div className="flex items-center gap-2">
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
              className={`w-10 h-5 rounded-full relative transition-all ${
                isMine
                  ? "bg-oliveDark peer-checked:bg-oliveGreen"
                  : "bg-gray-300 peer-checked:bg-oliveGreen"
              }`}
            >
              <motion.div
                className="absolute top-0 bottom-0 left-[2px] my-auto w-4 h-4 bg-white rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                animate={{ x: isVisible ? 19 : 0 }}
              />
            </div>
          </label>
        </div>
      )}

      {/* Message bubble container (attachRef used for scroll & highlight) */}
      <div
        className="relative p-0 max-w-[75%] text-sm leading-relaxed"
        style={{ width: "fit-content" }}
        ref={attachRef}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={
              msg?.client_id ??
              msg?.id ??
              `tmp-${msg?.tempIdx ?? Math.random()}`
            }
            layout
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
            className="relative"
          >
            <div
              ref={attachRef}
              className={`p-2 pr-3 pb-4 rounded-xl shadow-md ${
                isMine ? "bg-oliveDark text-white" : "bg-white text-black"
              }`}
              style={{
                border: `1px solid rgba(255,255,255,0.04)`,
                borderTopRightRadius: isMine ? "4px" : "12px",
                borderTopLeftRadius: isMine ? "12px" : "4px",
              }}
              onClick={() => {
                if (!showToggleSwitch) setIsVisible((v) => !v);
              }}
              title={
                !showToggleSwitch &&
                (isVisible ? "click to show" : "toggle to show")
              }
            >
              {/* Reply preview */}
              {msg?.tag_mess && (
                <ReplyPreview
                  target={repliedMsg}
                  participants={[
                    {
                      member_id: selectedChatUser?.contact_id,
                      member_id_encrpt: selectedChatUser?.contact_id_encrypt,
                      member_name: selectedChatUser?.contact_name,
                    },
                  ]}
                  myId={authDetails?.user_enid ?? authDetails?.user?.id ?? null}
                  onPreviewClick={(target) => {
                    const key = target?.id;

                    if (key && typeof scrollToMessage === "function")
                      console.log(key);
                    scrollToMessage(key);
                  }}
                  type="user"
                />
              )}

              <div>
                <AnimatePresence mode="wait">
                  {isVisible ? (
                    <motion.div
                      key="content-visible"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                    >
                      {msg?.mss_type === "audio" ? (
                        <CustomAudioMessage msg={msg} />
                      ) : msg?.is_file === "yes" && msg?.message ? (
                        <ChatFilePreview
                          isMyChat={msg?.is_my_chat}
                          fileType={(msg?.message || "").split(".").pop()}
                          fileUrl={`${import.meta.env.VITE_BASE_URL}secure/${
                            msg?.message
                          }`}
                          fileName={msg?.file_name}
                        />
                      ) : msg?.message?.startsWith?.("CALL_INVITE") ? (
                        (() => {
                          const callTimestamp = new Date(
                            msg?.updated_at
                          ).getTime();
                          const currentTime = Date.now();
                          const timeDifference =
                            (currentTime - callTimestamp) / 1000;
                          return (
                            <ChatCallInvite
                              msg={msg}
                              isMyChat={isMine}
                              onAcceptCall={() => handleAcceptCall(msg)}
                              status={
                                timeDifference <= 30
                                  ? "Ringing..."
                                  : "Call Ended"
                              }
                              caller={selectedChatUser?.contact_name}
                            />
                          );
                        })()
                      ) : (
                        <div>
                          {msg?.message?.length > MAX_LENGTH && !isExpanded ? (
                            <>
                              {msg?.message.slice(0, MAX_LENGTH)}...
                              <button
                                className="text-oliveHover ml-1"
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
                      key="content-hidden"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      onClick={() => {
                        if (!showToggleSwitch) setIsVisible(true);
                      }}
                      className={`${
                        showToggleSwitch ? "" : "cursor-pointer"
                      } w-full max-w-60 md:max-w-80 rounded-md flex items-center justify-center relative font-bold tracking-widest break-all`}
                      title={
                        !showToggleSwitch ? "click to show" : "toggle to show"
                      }
                    >
                      {msg?.message
                        ? "*".repeat(Math.min(msg.message.length, 300))
                        : "****"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* read receipts */}
              {isMine && (
                <span className="ml-1 absolute bottom-1 right-1">
                  {msg?.is_read === "yes" ? (
                    <IoCheckmarkDone size={14} className="text-oliveHover" />
                  ) : (
                    <IoCheckmark size={14} className="text-gray-400" />
                  )}
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Message Timestamp */}
      <div className="text-xs text-gray-500">
        {timeFormatter.format(new Date(msg?.updated_at || Date.now()))}
      </div>
    </div>
  );
};

export default React.memo(ChatMessage);

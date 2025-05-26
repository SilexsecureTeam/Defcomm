import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useContext } from "react";
import { usePubSub } from "@videosdk.live/react-sdk";
import { AuthContext } from "../../../context/AuthContext";
import { getTimeAgo } from "../../../utils/formmaters";
import { FiSend } from "react-icons/fi";

const CallMessagingModal = ({ isOpen, onClose }) => {
  const { authDetails } = useContext(AuthContext);
  const meId = authDetails?.user?.id;
  const { publish, messages } = usePubSub("CALL_CHAT");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (message.trim()) {
      publish({
        id: meId,
        name: authDetails?.user?.name,
        text: message,
        timestamp: new Date().toISOString(),
      });
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 max-h-[55vh] bg-oliveLight rounded-t-2xl z-50 shadow-xl flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b font-semibold text-lg">
              <span className="text-lg font-bold">Call Chat</span>
              <button
                onClick={onClose}
                className="text-red-500 text-sm hover:text-red-600"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.length === 0 && (
                <p className="text-center text-gray-500">No messages yet. Say hello 👋</p>
              )}
              {messages.map((msg, i) => {
                const isMe = msg.message.id === meId;
                const timeAgo = getTimeAgo(new Date(msg.message.timestamp), {
                  addSuffix: true,
                });

                return (
                  <div
                    key={i}
                    className={`rounded-lg px-3 py-2 w-max max-w-[80%] text-sm ${
                      isMe
                        ? "ml-auto bg-oliveDark text-white"
                        : "mr-auto bg-white text-black border"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                      <strong>{isMe ? "You" : msg.message.name}</strong>
                      <span>{timeAgo}</span>
                    </div>
                    <div>{msg.message.text}</div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex border-t p-3 gap-2 bg-oliveLight">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Enter to send)"
                rows={1}
                className="flex-1 text-sm px-4 py-2 border rounded-full resize-none bg-transparent text-gray-300 focus:outline-none focus:ring-2 focus:ring-oliveDark"
              />
              <button
                onClick={sendMessage}
                className="bg-oliveDark hover:bg-oliveDarker text-white p-3 rounded-full transition-colors"
                title="Send Message"
              >
                <FiSend className="text-lg" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CallMessagingModal;

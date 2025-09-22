import React, {
  useEffect,
  useMemo,
  useRef,
  useContext,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import { getFormattedDate } from "../../utils/formmaters";
import ChatMessage from "./ChatMessage";
import { ChatContext } from "../../context/ChatContext";

const ChatMessageList = ({
  desktop = false,
  messages = [],
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  messagesContainerRef,
}) => {
  const location = useLocation();
  const chatUserData = location?.state;
  const { registerMessageRefs } = useContext(ChatContext);

  const messageRefs = useRef(new Map());
  const scrollContainerRef = useRef(null);

  // Group messages by date (sorted ASC)
  const groupMessagesByDate = (messages) => {
    if (!messages) return {};
    const sorted = [...messages].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    return sorted.reduce((acc, msg) => {
      const dateKey = new Date(msg.created_at).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(msg);
      return acc;
    }, {});
  };

  // Lookup map for reply/tag resolution
  const messagesById = useMemo(() => {
    const map = new Map();
    (messages || [])?.forEach((m) => {
      if (m?.id) map.set(String(m.id), m);
    });
    return map;
  }, [messages]);

  useEffect(() => {
    if (typeof registerMessageRefs === "function") {
      registerMessageRefs(messageRefs);
    }
  }, [registerMessageRefs]);

  const groupedMessages = groupMessagesByDate(messages);

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || isFetchingNextPage) return;

    if (container.scrollTop <= 100 && hasNextPage) {
      const prevHeight = container.scrollHeight;
      fetchNextPage().then(() => {
        // Maintain scroll position after loading more
        requestAnimationFrame(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - prevHeight + container.scrollTop;
        });
      });
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!messages?.length)
    return <p className="text-gray-500 text-center">No messages yet.</p>;

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto px-4 space-y-6"
    >
      {/* Loader at top */}
      {isFetchingNextPage && (
        <div className="text-center py-3 text-gray-500 text-sm">
          Loading more messages...
        </div>
      )}
      {Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
        <div key={dateKey} className="relative">
          {/* Sticky date header */}
          <div
            className={`sticky z-50 ${
              desktop ? "top-0" : "-top-4"
            } flex justify-center py-1 w-max pointer-events-none mx-auto`}
          >
            <span
              className={`px-3 py-1 text-xs rounded-full shadow-sm border ${
                desktop
                  ? "text-gray-500 border-gray-800"
                  : "text-gray-700 border-gray-300"
              }`}
            >
              {getFormattedDate(dayMessages[0].updated_at)}
            </span>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {dayMessages.map((msg, index) => {
              const nextMsg = dayMessages[index + 1];
              const isLastMessageFromUser =
                msg.is_my_chat !== "yes" &&
                (!nextMsg || nextMsg.is_my_chat === "yes");

              return (
                <ChatMessage
                  key={msg.id ?? index}
                  msg={msg}
                  selectedChatUser={chatUserData}
                  isLastMessageFromUser={isLastMessageFromUser}
                  messagesById={messagesById}
                  messageRefs={messageRefs}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessageList;

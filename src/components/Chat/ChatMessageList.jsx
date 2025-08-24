import React, { useEffect, useMemo, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { getFormattedDate } from "../../utils/formmaters";
import ChatMessage from "./ChatMessage";
import { ChatContext } from "../../context/ChatContext";

const ChatMessageList = ({ desktop = false, messages = [] }) => {
  const location = useLocation();
  const chatUserData = location?.state;
  const { registerMessageRefs } = useContext(ChatContext);

  // Refs map for scroll-to-message (registered with ChatContext)
  const messageRefs = useRef(new Map());

  if (!messages?.data?.length)
    return <p className="text-gray-500 text-center">No messages yet.</p>;

  // Group messages by date (keeps original order within date)
  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, msg) => {
      const dateKey = new Date(msg.updated_at).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(msg);
      return acc;
    }, {});
  };

  // build lookup map for quick tag_mess resolution
  const messagesById = useMemo(() => {
    const map = new Map();
    (messages?.data || []).forEach((m) => {
      if (m?.id) map.set(String(m.id), m);
    });
    return map;
  }, [messages]);

  useEffect(() => {
    if (typeof registerMessageRefs === "function") {
      registerMessageRefs(messageRefs);
    }
  }, [registerMessageRefs]);

  const groupedMessages = groupMessagesByDate(messages.data);

  return Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
    <div key={dateKey} className="relative">
      {/* Sticky date header for this day */}
      <div
        className={`sticky z-50 ${
          desktop ? "top-0" : "top-0"
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

      {/* Messages of this day */}
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
  ));
};

export default ChatMessageList;

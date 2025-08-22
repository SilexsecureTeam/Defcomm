import React, { useEffect, useMemo, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { getFormattedDate } from "../../utils/formmaters";
import ChatMessage from "./ChatMessage";
import { ChatContext } from "../../context/ChatContext";

const ChatMessageList = ({ messages }) => {
  const location = useLocation();
  const chatUserData = location?.state;
  const { registerMessageRefs } = useContext(ChatContext);

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

  // Build a lookup map for fast tag_mess resolution:
  // key -> message, where key is client_id || id_en || id
  const messagesById = useMemo(() => {
    const map = new Map();
    (messages?.data || []).forEach((m) => {
      if (m?.client_id) map.set(String(m.client_id), m);
      if (m?.id_en) map.set(String(m.id_en), m);
      if (m?.id) map.set(String(m.id), m);
    });
    return map;
  }, [messages]);

  // Refs map for scroll-to-message (registered with ChatContext)
  const messageRefs = useRef(new Map());
  useEffect(() => {
    if (typeof registerMessageRefs === "function") {
      registerMessageRefs(messageRefs);
      // debug: you can remove this console after verifying behavior
      // console.debug("registered messageRefs for chat list", messageRefs);
    }
    // keep dependency to registerMessageRefs stable
  }, [registerMessageRefs]);

  const groupedMessages = groupMessagesByDate(messages.data);

  return Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
    <div key={dateKey} className="relative">
      {/* Sticky date header for this day */}
      <div className="sticky top-40 flex justify-center py-1">
        <span className="px-3 py-1 text-xs rounded-full shadow-sm text-gray-700 border border-gray-300">
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
              key={msg.client_id ?? msg.id ?? index}
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

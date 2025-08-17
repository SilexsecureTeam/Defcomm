import React, { useState, useRef, useEffect, useContext } from "react";
import { MdCall } from "react-icons/md";
import { FaSpinner } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import SEOHelmet from "../../../engine/SEOHelmet";
import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";
import useChat from "../../../hooks/useChat";
import ChatMessage from "../ChatMessage"; // Import the new Message component
import { getFormattedDate } from "../../../utils/formmaters";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const ChatInterface = () => {
  const {
    selectedChatUser,
    setSelectedChatUser,
    setShowCall,
    setMessages,
    setMeetingId,
    typingUsers,
  } = useContext(ChatContext);
  const { fetchChatMessages } = useChat();
  const messageRef = useRef(null);

  const location = useLocation();
  const chatUserData = location?.state;

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chatMessages", chatUserData?.contact_id_encrypt],
    queryFn: () => fetchChatMessages(chatUserData?.contact_id_encrypt),
    enabled: !!chatUserData?.contact_id,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setMessages(messages);
    if (messages?.chat_meta && chatUserData) {
      setSelectedChatUser((prev) => {
        if (!prev) return prev; // 🔴 Prevents overwriting null
        return { ...prev, chat_meta: messages.chat_meta };
      });
    }
    if (messages?.data && messageRef.current) {
      messageRef.current?.lastElementChild?.scrollIntoView();
    }
  }, [messages]);

  const renderMessages = () => {
    if (!messages?.data?.length) return;
    <p className="text-gray-200 text-center">No messages yet.</p>;

    let lastDate = null;

    return messages.data.map((msg, index) => {
      const formattedDate = getFormattedDate(msg.updated_at);
      const showDateHeader = lastDate !== formattedDate;
      lastDate = formattedDate;

      // 👉 Find next message
      const nextMsg = messages.data[index + 1];

      // 👉 It's the last message from user if:
      // - it's NOT my message
      // - and either there is no next message OR the next one is my message
      const isLastMessageFromUser =
        msg.is_my_chat !== "yes" && (!nextMsg || nextMsg.is_my_chat === "yes");

      return (
        <React.Fragment key={msg.id}>
          {showDateHeader && (
            <div className="flex items-center justify-center gap-2 my-4 text-gray-500 text-sm font-medium">
              <div className="flex-1 border-t border-gray-400"></div>
              <span>{formattedDate}</span>
              <div className="flex-1 border-t border-gray-400"></div>
            </div>
          )}
          <ChatMessage
            msg={msg}
            selectedChatUser={chatUserData}
            isLastMessageFromUser={isLastMessageFromUser}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex-1 relative gap-4 h-full">
      <SEOHelmet title="Secure Chat" />
      <div
        ref={messageRef}
        className="w-full h-full overflow-y-auto flex flex-col space-y-4 p-4 pb-20"
      >
        {selectedChatUser ? (
          isLoading ? (
            <div className="h-20 flex justify-center items-center text-oliveGreen gap-2">
              <FaSpinner className="animate-spin text-2xl" /> Loading Messages
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">
              Failed to load messages. Please try again.
            </p>
          ) : (
            <>
              {renderMessages()}

              {/* 🔹 Typing indicator as a new bubble */}
              {typingUsers[chatUserData?.contact_id] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start space-x-1"
                >
                  <div className="p-2 rounded-lg bg-white text-black shadow-md flex items-center space-x-1 max-w-40">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                  </div>
                </motion.div>
              )}
            </>
          )
        ) : (
          <p className="text-center text-lg font-bold mt-10">
            Select a chat to start messaging.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;

import React, { useRef, useEffect, useContext } from "react";
import { MdCall } from "react-icons/md";
import { FaSpinner } from "react-icons/fa6";
import { FaCog } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import SEOHelmet from "../engine/SEOHelmet";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import useChat from "../hooks/useChat";

import SendMessage from "../components/Chat/SendMessage";
import CallInterface from "../components/Chat/CallInterface";
import ChatMessage from "../components/Chat/ChatMessage";
import { getFormattedDate } from "../utils/formmaters";
import { motion } from "framer-motion";

const ChatInterface = () => {
  const {
    selectedChatUser,
    setSelectedChatUser,
    setShowCall,
    setShowSettings,
    typingUsers,
    setModalTitle,
  } = useContext(ChatContext);
  const { fetchChatMessages } = useChat();
  const messageRef = useRef(null);

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chatMessages", selectedChatUser?.contact_id_encrypt],
    queryFn: () => fetchChatMessages(selectedChatUser?.contact_id_encrypt),
    enabled: !!selectedChatUser?.contact_id,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (messages?.chat_meta && selectedChatUser) {
      setSelectedChatUser((prev) => ({
        ...prev,
        chat_meta: messages.chat_meta,
      }));
    }

    if (messages?.data && messageRef.current) {
      messageRef.current?.lastElementChild?.scrollIntoView();
    }
  }, [messages]);

  const renderMessages = () => {
    if (!messages?.data?.length)
      return <p className="text-gray-500 text-center">No messages yet.</p>;

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
            selectedChatUser={selectedChatUser}
            isLastMessageFromUser={isLastMessageFromUser}
          />
        </React.Fragment>
      );
    });
  };
  return (
    <div className="relative flex flex-col lg:flex-row gap-4 h-full">
      <SEOHelmet title="Secure Chat" />

      {selectedChatUser && (
        <div className="lg:hidden sticky top-0 z-50 flex justify-between items-center bg-oliveDark text-white p-4">
          <div>
            <h2 className="text-lg font-semibold capitalize">
              {selectedChatUser.contact_name || "Chat"}
            </h2>
            {typingUsers[Number(selectedChatUser?.contact_id)] && (
              <div className="text-green-400 text-xs">Typing...</div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowCall(true);
                setModalTitle("Place a Call");
              }}
            >
              <MdCall size={24} />
            </button>
            <button
              onClick={() => {
                setShowSettings(true);
              }}
            >
              <FaCog size={24} />
            </button>
          </div>
        </div>
      )}

      <div className="relative w-full lg:w-2/3 flex-1 h-96 md:h-[70vh] bg-[#d0eb8e] pt-4 transition-all duration-300">
        <div
          ref={messageRef}
          className="flex-1 overflow-y-auto w-full h-full flex flex-col space-y-4 p-4 pb-10"
        >
          {selectedChatUser ? (
            isLoading ? (
              <div className="h-20 flex justify-center items-center text-oliveDark gap-2">
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
                {typingUsers[selectedChatUser?.contact_id] && (
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
            <p className="text-oliveDark text-center text-lg font-bold mt-10">
              Select a chat to start messaging.
            </p>
          )}
        </div>
        {selectedChatUser && <SendMessage messageData={messages?.chat_meta} />}
      </div>
      {selectedChatUser && (
        <div className="w-max hidden lg:block">
          <CallInterface
            setShowCall={setShowCall}
            setShowSettings={setShowSettings}
          />
        </div>
      )}
    </div>
  );
};
export default ChatInterface;

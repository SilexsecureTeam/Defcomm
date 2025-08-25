import React, { useRef, useEffect, useContext } from "react";
import { MdCall } from "react-icons/md";
import { FaSpinner } from "react-icons/fa6";
import { FaCog } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import SEOHelmet from "../engine/SEOHelmet";
import { ChatContext } from "../context/ChatContext";
import useChat from "../hooks/useChat";

import SendMessage from "../components/Chat/SendMessage";
import CallInterface from "../components/Chat/CallInterface";
import ChatMessageList from "../components/Chat/ChatMessageList";
import { IoArrowBack } from "react-icons/io5";

const ChatInterface = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chatUserData = location?.state;

  const { setShowCall, setShowSettings, typingUsers, setModalTitle } =
    useContext(ChatContext);

  const { fetchChatMessages } = useChat();

  const messageRef = useRef(null);
  const messagesEndRef = useRef(null);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers[Number(chatUserData?.contact_id)]]);

  const COLORS = {
    headerBg: "#3B3B3B",
    headerText: "#FFFFFF",
    avatarBg: "#556B2F",
    surface: "#d0eb8e",
    track: "#F5F5F5",
    thumb: "#A9A9A9",
  };

  return (
    <div className="flex flex-col h-[80vh] text-black shadow-lg">
      <SEOHelmet title="Secure Chat" />

      {/* HEADER */}
      <div className="p-4 flex items-center justify-between border-b bg-oliveDark">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 rounded-full hover:bg-gray-700/60 transition"
          title="Back"
        >
          <IoArrowBack size={22} color={COLORS.headerText} />
        </button>

        <div className="flex items-center gap-4 min-w-0 flex-1">
          {chatUserData && (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0"
              style={{ backgroundColor: COLORS.avatarBg, color: "#FFF" }}
            >
              {chatUserData?.contact_name?.charAt(0) || "?"}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2
                className="text-base md:text-lg font-semibold truncate"
                style={{ color: COLORS.headerText }}
                title={chatUserData?.contact_name ?? "Chat"}
              >
                {chatUserData?.contact_name || "Chat"}
              </h2>
              {typingUsers[Number(chatUserData?.contact_id)] && (
                <small className="text-green-400 text-xl leading-none">●</small>
              )}
            </div>
            {typingUsers[Number(chatUserData?.contact_id)] && (
              <div className="text-green-400 text-[10px]">Typing…</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowCall(true);
              setModalTitle("Place a Call");
            }}
            className="p-2 rounded-full hover:bg-gray-700/60 transition"
            title="Call"
          >
            <MdCall size={22} color={COLORS.headerText} />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full hover:bg-gray-700/60 transition"
            title="Settings"
          >
            <FaCog size={20} color={COLORS.headerText} />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div
        ref={messageRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4"
        style={{ backgroundColor: COLORS.surface }}
      >
        {chatUserData ? (
          isLoading ? (
            <div className="h-full flex justify-center items-center text-gray-700 gap-2">
              <FaSpinner className="animate-spin text-2xl" /> Loading messages…
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">
              Failed to load messages. Please try again.
            </p>
          ) : (
            <>
              <ChatMessageList messages={messages} />
              {typingUsers[chatUserData?.contact_id] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="p-2 rounded-lg bg-white text-black shadow-md flex items-center gap-1 max-w-40">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </>
          )
        ) : (
          <div className="h-full flex justify-center items-center">
            <p className="text-oliveDark text-lg font-semibold">
              Select a chat to start messaging.
            </p>
          </div>
        )}
      </div>
      {chatUserData && (
        <div className="border-t border-gray-300">
          <SendMessage
            messageData={messages?.chat_meta}
            scrollRef={messageRef}
            messagesEndRef={messagesEndRef}
          />
        </div>
      )}

      {chatUserData && (
        <div className="hidden lg:block border-l border-gray-300">
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

import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import GroupChatDetails from "../components/dashboard/GroupChatDetails";
import useGroups from "../hooks/useGroup";
import useChat from "../hooks/useChat";
import SendMessage from "../components/Chat/SendMessage";

const GroupChatInterface = () => {
  const { groupId } = useParams();
  const { authDetails } = useContext(AuthContext);
  const userId = authDetails?.user?.id;

  const { useFetchGroupInfo } = useGroups();
  const { fetchGroupChatMessages } = useChat();

  const { data: groupInfo } = useFetchGroupInfo(groupId);

  const {
    data: messages = [],
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["groupMessages", groupId],
    queryFn: () => fetchGroupChatMessages(groupId),
    enabled: !!groupId,
  });

  const [newMessage, setNewMessage] = useState("");
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // TODO: send message API call
    setNewMessage("");
    refetchMessages();
  };

  const messageVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex flex-col h-[60vh] bg-gray-50">
      {/* HEADER */}
      <div className="bg-oliveDark text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-[#233554] flex items-center justify-center font-bold text-lg">
            {groupInfo?.group_meta?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {groupInfo?.group_meta?.name}
            </h2>
            <p className="text-sm opacity-70">
              {groupInfo?.data?.length} members
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowGroupInfo(true)}
          className="p-2 rounded-full hover:bg-[#233554] transition"
        >
          <Users className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {isMessagesLoading ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
          </div>
        ) : (
          <AnimatePresence>
            {messages?.data?.length > 0 ? (
              messages?.data?.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={messageVariants}
                  className={`flex ${
                    msg.senderId === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md p-3 rounded-xl shadow-md ${
                      msg.senderId === userId
                        ? "bg-[#00B4D8] text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                    }`}
                  >
                    <p className={`font-semibold text-xs mb-1 opacity-80`}>
                      {groupInfo?.data?.find((m) => m.id === msg.senderId)
                        ?.name || msg.senderId}
                    </p>
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-[10px] block text-right opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500 italic">Start the conversation!</p>
              </div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR - FIXED */}
      <SendMessage messageData={messages?.chat_meta} />

      {/* GROUP INFO MODAL */}
      <GroupChatDetails
        groupInfo={groupInfo}
        showGroupInfo={showGroupInfo}
        setShowGroupInfo={setShowGroupInfo}
      />
    </div>
  );
};

export default GroupChatInterface;

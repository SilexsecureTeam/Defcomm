import React, { useState, useRef, useEffect, useContext } from "react";
import { MdCall } from "react-icons/md";
import { FaSpinner } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import SEOHelmet from "../../../engine/SEOHelmet";
import { ChatContext } from "../../../context/ChatContext";
import useChat from "../../../hooks/useChat";
import CallComponent from "../../video-sdk/CallComponent";
import Modal from "../../modal/Modal";
import ChatMessage from "../ChatMessage"; // Import the new Message component
import { FaCog } from "react-icons/fa";
import Settings from "../../../pages/Settings";

const ChatInterface = () => {
    const {
        selectedChatUser, setSelectedChatUser,
        setShowCall,
        setMessages,
        setMeetingId } = useContext(ChatContext);
    const { fetchChatMessages, usePusherChat } = useChat();
    const messageRef = useRef(null);

    // Fetch messages
    // Fetch messages for the selected user
    const { data: messages, isLoading, error } = useQuery({
        queryKey: ["chatMessages", selectedChatUser?.contact_id],
        queryFn: () => fetchChatMessages(selectedChatUser?.contact_id),
        staleTime: Infinity,        // 👈 Never mark data as stale
        refetchOnWindowFocus: false, // 👈 Prevent refetch when tab becomes active
    });

    // Setup real-time Pusher listener
    usePusherChat((newMessage) => {
        if (!selectedChatUser?.contact_id) return;

        const senderId = newMessage?.sender_id;

        // If the new message is from the user we're chatting with, scroll down
        if (senderId === selectedChatUser?.contact_id) {
            messageRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
        }
    });

    useEffect(() => {
        setMessages(messages)
        if (messages?.chat_meta && selectedChatUser) {
            setSelectedChatUser((prev) => {
                if (!prev) return prev; // 🔴 Prevents overwriting null
                return { ...prev, chat_meta: messages.chat_meta };
            });
        }
        if (messages?.data && messageRef.current) {
            messageRef.current?.lastElementChild?.scrollIntoView();
        }
    }, [messages]);

    const handleAcceptCall = (msg) => {
        setMeetingId(msg?.message?.slice("CALL_INVITE:".length));
        setShowCall(true);
    };

    return (
        <div className="flex-1 relative gap-4 h-full">
            <SEOHelmet title="Secure Chat" />
            <div ref={messageRef} className="w-full h-full overflow-y-auto flex flex-col space-y-4 p-4 pb-20">
                {selectedChatUser ? (
                    isLoading ? (
                        <div className="h-20 flex justify-center items-center text-oliveGreen gap-2">
                            <FaSpinner className="animate-spin text-2xl" /> Loading Messages
                        </div>
                    ) : error ? (
                        <p className="text-red-500 text-center">Failed to load messages. Please try again.</p>
                    ) : messages?.data?.length > 0 ? (
                        messages?.data.map((msg) => (
                            <ChatMessage key={msg?.id} msg={msg} selectedChatUser={selectedChatUser} handleAcceptCall={handleAcceptCall} />
                        ))
                    ) : (
                        <p className="text-gray-200 text-center">No messages yet.</p>
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

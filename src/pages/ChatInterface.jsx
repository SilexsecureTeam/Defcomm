import React, { useState, useRef, useEffect, useContext } from "react";
import { MdAttachFile, MdOutlineEmojiEmotions, MdCall, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import CustomAudioMessage from "../components/Chat/CustomAudioMessage";
import CallInterface from "../components/Chat/CallInterface";
import useChat from "../hooks/useChat";
import SEOHelmet from "../engine/SEOHelmet";
import { ChatContext } from "../context/ChatContext";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa6";
import SendMessage from "../components/Chat/SendMessage";
import ChatFilePreview from "../components/Chat/ChatFilePreview";
import call from "../assets/call.png";
import { FaCog } from "react-icons/fa";
import CallComponent from "../components/video-sdk/CallComponent";
import ChatCallInvite from "../components/Chat/ChatCallInvite";
import MeetingVid from "../components/video-sdk/MeetingVid";
const ChatInterface = () => {
    const { selectedChatUser, setSelectedChatUser } = useContext(ChatContext);
    const [showCall, setShowCall] = useState(false);
    const [meetingId, setMeetingId] = useState(false);
    const { fetchChatMessages } = useChat();
    const messageRef = useRef(null);
    // Fetch messages using React Query
    const { data: messages, isLoading, error } = useQuery({
        queryKey: ["chatMessages", selectedChatUser?.contact_id],
        queryFn: () => fetchChatMessages(selectedChatUser?.contact_id),
        refetchOnWindowFocus: true,
        refetchInterval: 5000,
        enabled: !!selectedChatUser?.contact_id, // Only fetch if chat is selected
    });

    useEffect(() => {
        if (messages?.chat_meta) {
            setSelectedChatUser((prev) => {
                return { ...prev, chat_meta: messages.chat_meta };
            });
        }
        if (messages?.data && messageRef.current) {
            messageRef.current.scrollTo({ top: messageRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages]);


    // Format the date for messages
    const getFormattedDate = (dateString) => {
        const messageDate = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return "Today";
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return messageDate.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        }
    };

    const handleAcceptCall = (msg) => {
        setMeetingId(msg?.message?.slice("CALL_INVITE:".length));
        console.log(msg?.message?.slice("CALL_INVITE:".length))
        setShowCall(true); // This will open the CallComponent
    };
    

    return (
        <div className="relative flex flex-col lg:flex-row gap-4 h-full">
            {/* SEO Content */}
            <SEOHelmet title="Secure Chat" />

            {/* Header for Small Screens */}
            <div className="lg:hidden sticky top-0 z-50 flex justify-between items-center bg-oliveDark text-white p-4">
                <h2 className="text-lg font-semibold">Chat</h2>
                <button onClick={() => setShowCall(true)}>
                    <MdCall size={24} />
                </button>
            </div>

            {/* Chat Section */}
            <div className="relative w-full lg:w-2/3 flex-1 h-[80vh] bg-[#d0eb8e] pt-4 transition-all duration-300">
                <div ref={messageRef} className="flex-1 overflow-y-auto w-full h-full flex flex-col space-y-4 p-4 pb-10">
                    {selectedChatUser ? (
                        isLoading ? (
                            <div className="h-20 flex justify-center items-center text-oliveDark gap-2">
                                <FaSpinner className="animate-spin text-2xl" /> Loading Messages
                            </div>
                        ) : error ? (
                            <p className="text-red-500 text-center">Failed to load messages. Please try again.</p>
                        ) : messages?.data?.length > 0 ? (
                            (() => {
                                let lastDate = null;
                                return messages?.data.map((msg) => {
                                    const formattedDate = getFormattedDate(msg?.updated_at);
                                    const showDateHeader = lastDate !== formattedDate;
                                    lastDate = formattedDate;

                                    return (
                                        <React.Fragment key={msg?.id}>
                                            {showDateHeader && (
                                                <div className="flex items-center justify-center gap-2 my-4 text-gray-500 text-sm font-medium">
                                                    <div className="flex-1 border-t border-gray-400"></div>
                                                    <span>{formattedDate}</span>
                                                    <div className="flex-1 border-t border-gray-400"></div>
                                                </div>
                                            )}
                                            <div className={msg?.is_my_chat === "yes" ? "self-end" : msg?.is_my_chat === "system" ? "text-center text-gray-500" : "self-start"}>
                                                <div className={msg?.is_my_chat === "yes" ? "self-end" : "self-start"}>
                                                    <div className={msg?.is_my_chat === "yes" ? "bg-oliveDark text-white p-2 rounded-lg shadow-md w-max max-w-60 break-all" : "bg-white p-2 rounded-lg shadow-md w-max max-w-60 break-all"}>
                                                        {msg?.type === "audio" ? (
                                                            <CustomAudioMessage />
                                                        ) : msg?.is_file === "yes" && msg?.message ? (
                                                            <ChatFilePreview
                                                                isMyChat={msg?.is_my_chat}
                                                                fileType={msg?.message?.split(".")[1]} // e.g., "image/png", "application/pdf" msg?.file_type
                                                                fileUrl={`${import.meta.env.VITE_BASE_URL}secure/${msg?.message}`} // The file URL
                                                                fileName={msg?.file_name} // The file name
                                                            />
                                                        ) : (
                                                            msg?.message.startsWith("CALL_INVITE") ? (
                                                                (() => {
                                                                    const callTimestamp = new Date(msg?.updated_at).getTime();
                                                                    const currentTime = Date.now();
                                                                    const timeDifference = (currentTime - callTimestamp) / 1000; // in seconds

                                                                    return (
                                                                        <ChatCallInvite
                                                                            isMyChat={msg?.is_my_chat === "yes"} // Ensure you pass a valid comparison
                                                                            onAcceptCall={() => handleAcceptCall(msg)} // Define `handleAcceptCall`
                                                                            status={timeDifference <= 30 ? "Ringing..." : "Call Ended"}
                                                                            caller={selectedChatUser?.contact_name} // Assuming `sender_name` exists
                                                                        />
                                                                    );
                                                                })()
                                                            ) : (
                                                                msg?.message
                                                            )


                                                        )}
                                                    </div>

                                                    <div className={`${msg?.is_my_chat === "yes" ? "text-right" : "text-left"} text-xs mt-1`}>
                                                        {new Date(msg?.updated_at).toLocaleTimeString("en-GB", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                });
                            })()
                        ) : (
                            <p className="text-gray-500 text-center">No messages yet.</p>
                        )
                    ) : (
                        <p className="text-oliveDark text-center text-lg font-bold mt-10">
                            Select a chat to start messaging.
                        </p>
                    )}
                </div>

                {/* Input Section */}
                {selectedChatUser && (
                    <SendMessage messageData={messages?.chat_meta} />
                )}
            </div>

            {/* Call Interface (Desktop) */}
            {selectedChatUser && (
                <div className="w-max hidden lg:block">
                    {/* <CallInterface /> */}
                    <MeetingVid />
                </div>
            )
            }

            {/* Call Interface (Mobile) */}
            <AnimatePresence>
                {showCall && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="w-80 h-max fixed top-4 inset-0 bg-white bg-opacity-90 flex justify-center items-center ml-auto z-[100]"
                    >
                        <CallComponent initialMeetingId={meetingId} />
                        <button className="absolute top-4 right-4 text-white bg-red-500 p-2 rounded-full" onClick={() => setShowCall(false)}>
                            <MdClose size={24} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatInterface;

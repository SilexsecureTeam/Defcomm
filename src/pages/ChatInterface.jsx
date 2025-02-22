import React, { useEffect, useState, useRef } from "react";
import { MdAttachFile, MdOutlineEmojiEmotions, MdCall, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import CustomAudioMessage from "../components/Chat/CustomAudioMessage";
import { messages } from "../utils/dummies";
import CallInterface from "../components/Chat/CallInterface";

const ChatInterface = () => {
    const [showCall, setShowCall] = useState(false);
    const messageRef=useRef(null)
    useEffect(()=>{
        if(messageRef.current){
            messageRef.current.scrollTop=messageRef.current.scrollHeight;
        }
    },[])
    return (
        <div className="relative flex flex-col lg:flex-row gap-4 h-full p-4">
            {/* Header for Small Screens */}
            <div className="lg:hidden sticky top-0 z-50 flex justify-between items-center bg-oliveDark text-white p-4">
                <h2 className="text-lg font-semibold">Chat</h2>
                <button onClick={() => setShowCall(true)}>
                    <MdCall size={24} />
                </button>
            </div>

            {/* Chat Section */}
            <div
                className="relative w-full lg:w-2/3 h-full bg-[#d0eb8e] pt-4 transition-all duration-300"
            >
                <div ref={messageRef} className="flex-1 overflow-y-auto w-full h-screen flex flex-col space-y-4 p-4 pb-10">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={msg.sender === "self" ? "self-end" : msg.sender === "system" ? "text-center text-gray-500" : "self-start"}
                        >{msg.sender === "system" ? (
                            <div className="flex items-center justify-center gap-2 my-2">
                                <div className="flex-1 border-t border-gray-500"></div>
                                <span className="text-gray-500 text-sm font-medium">{msg.text}</span>
                                <div className="flex-1 border-t border-gray-500"></div>
                            </div>
                        ) : (
                            <div
                                className={msg.sender === "self" ? "self-end" : "self-start"}
                            >
                                <div
                                    className={
                                        msg.sender === "self"
                                            ? "bg-oliveDark text-white p-2 rounded-lg shadow-md"
                                            : "bg-white p-2 rounded-lg shadow-md"
                                    }
                                >
                                    {msg.type === "audio" ? <CustomAudioMessage /> : msg.text}
                                </div>
                                {msg.time && (
                                    <div className={`${msg.sender === "self" ? "text-right" : "text-left"} text-xs mt-1`}>{msg.time}</div>
                                )}
                            </div>
                        )}

                        </div>
                    ))}
                </div>
                <div className="sticky bottom-0 w-full h-16 bg-oliveLight flex gap-2 p-4 items-center text-white">
                    <MdAttachFile size={24} className="flex-shrink-0" />
                    <MdOutlineEmojiEmotions size={24} className="flex-shrink-0" />
                    <textarea
                        placeholder="Write a message..."
                        className="flex-1 p-2 pt-6 bg-transparent border-none outline-none resize-y leading-none text-base"
                    ></textarea>
                </div>
            </div>

            {/* Call Interface (Desktop) */}
            <div className="w-1/3 hidden lg:block">
                <CallInterface />
            </div>

            {/* Call Interface (Mobile) */}
            <AnimatePresence>
                {showCall && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="w-80 h-max fixed lg:hidden top-4 inset-0 bg-white bg-opacity-90 flex justify-center items-center ml-auto z-[100]"
                    >
                        <CallInterface />
                        <button
                            className="absolute top-4 right-4 text-white bg-red-500 p-2 rounded-full"
                            onClick={() => setShowCall(false)}
                        >
                            <MdClose size={24} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatInterface;

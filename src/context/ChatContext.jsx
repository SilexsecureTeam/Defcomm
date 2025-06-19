import React, { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // Retrieve and parse stored boolean value
  const initialVisibility =
    JSON.parse(sessionStorage.getItem("chatVisibility")) ?? false;
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [callType, setCallType] = useState("video");
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [chatVisibility, setChatVisibility] = useState(initialVisibility);
  const [showCall, setShowCall] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [callMessage, setCallMessage] = useState("");
  const [messages, setMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState({}); // key = userId, value = true/false
  // Store the boolean value correctly when it changes
  useEffect(() => {
    sessionStorage.setItem("chatVisibility", JSON.stringify(chatVisibility));
  }, [chatVisibility]);

  //     useEffect(()=>{
  // console.log(selectedChatUser)
  //     },[selectedChatUser])

  return (
    <ChatContext.Provider
      value={{
        selectedChatUser,
        setSelectedChatUser,
        setChatVisibility,
        chatVisibility,
        showCall,
        setShowCall,
        showSettings,
        setShowSettings,
        callMessage,
        setCallMessage,
        messages,
        setMessages,
        file,
        setFile,
        message,
        setMessage,
        callType,
        setCallType,
        typingUsers,
        setTypingUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

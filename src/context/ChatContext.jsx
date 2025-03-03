import React, { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    // Retrieve and parse stored boolean value
    const initialVisibility = JSON.parse(sessionStorage.getItem("chatVisibility")) ?? false;

    const [selectedChatUser, setSelectedChatUser] = useState(null);
    const [chatVisibility, setChatVisibility] = useState(initialVisibility);

    // Store the boolean value correctly when it changes
    useEffect(() => {
        sessionStorage.setItem("chatVisibility", JSON.stringify(chatVisibility));
    }, [chatVisibility]);

    return (
        <ChatContext.Provider value={{ 
            selectedChatUser, 
            setSelectedChatUser, 
            setChatVisibility, 
            chatVisibility 
        }}>
            {children}
        </ChatContext.Provider>
    );
};

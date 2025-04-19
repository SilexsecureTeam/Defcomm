import React, { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    // Retrieve and parse stored boolean value
    const initialVisibility = JSON.parse(sessionStorage.getItem("chatVisibility")) ?? false;

    const [selectedChatUser, setSelectedChatUser] = useState(null);
    const [chatVisibility, setChatVisibility] = useState(initialVisibility);
    const [showCall, setShowCall] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [meetingId, setMeetingId] = useState(false);
    // Store the boolean value correctly when it changes
    useEffect(() => {
        sessionStorage.setItem("chatVisibility", JSON.stringify(chatVisibility));
    }, [chatVisibility]);

//     useEffect(()=>{
// console.log(selectedChatUser)
//     },[selectedChatUser])


    return (
        <ChatContext.Provider value={{ 
            selectedChatUser, 
            setSelectedChatUser, 
            setChatVisibility, 
            chatVisibility,
            showCall, setShowCall,
            showSettings, setShowSettings,
            meetingId, setMeetingId

        }}>
            {children}
        </ChatContext.Provider>
    );
};

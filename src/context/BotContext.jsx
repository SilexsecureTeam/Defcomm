import React, { createContext, useState, useEffect } from "react";

export const BotContext = createContext();

export const BotProvider = ({ children }) => {
   
    const [selectedBotChat, setSelectedBotChat] = useState(null);
    const [selectedBotReference, setSelectedBotReference] = useState(null);
   

    return (
        <BotContext.Provider value={{ 
            selectedBotChat, 
            setSelectedBotChat,
            setSelectedBotReference,
            selectedBotReference
        }}>
            {children}
        </BotContext.Provider>
    );
};

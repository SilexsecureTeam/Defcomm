import React, { createContext, useState, useEffect } from "react";

export const BotContext = createContext();

export const BotProvider = ({ children }) => {
   
    const [selectedBotChat, setSelectedBotChat] = useState(null);
   

    return (
        <BotContext.Provider value={{ 
            selectedBotChat, 
            setSelectedBotChat
        }}>
            {children}
        </BotContext.Provider>
    );
};

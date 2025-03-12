import React, {useContext, useEffect, useRef} from 'react'
import { Botmessages } from '../../utils/dummies'
import BotChatMessages from './BotChatMessages'
import { BotContext } from "../../context/BotContext"; // Import Bot Context
const ChatInterface = () => {
    const { selectedBotChat } = useContext(BotContext); // Use context 
    const messageRef = useRef(null);
    const isLoading=false;
    const error =false;

     useEffect(() => {
            if (Botmessages && messageRef.current) {
                messageRef.current?.lastElementChild?.scrollIntoView();
            }
        }, [Botmessages]);

    return (
        <div ref={messageRef} className="flex-1 overflow-y-auto w-full h-full flex flex-col space-y-4 p-4 pb-10">
            {
                isLoading ? (
                    <div className="h-20 flex justify-center items-center text-oliveDark gap-2">
                        <FaSpinner className="animate-spin text-2xl" /> Loading Messages
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">Failed to load messages. Please try again.</p>
                ) : Botmessages?.length > 0 ? (
                    Botmessages.map((msg) => (
                        <BotChatMessages key={msg?.id} msg={msg} selectedChatUser={selectedBotChat} />
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No messages yet.</p>
                )}
        </div>
    )
}

export default ChatInterface
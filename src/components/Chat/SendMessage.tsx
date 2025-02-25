import React, { useState, useContext } from "react";
import { MdAttachFile, MdOutlineEmojiEmotions } from "react-icons/md";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../services/axios-client";
import { AuthContext } from "../../context/AuthContext";

interface MessageData {
    chat_user_id: string;
    chat_user_type: string;
    chat_id: string;
}

interface SendMessageProps {
    messageData: MessageData;
}

function SendMessage({ messageData }: SendMessageProps) {
    const { authDetails } = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const queryClient = useQueryClient();
    const client = axiosClient(authDetails?.access_token);

    // Mutation to send messages
    const { mutate: sendMessage, isPending: sending } = useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await client.post("/user/chat/messages/send", formData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["chatMessages", messageData.chat_user_id]);
            setMessage("");
            setFile(null);
        },
        onError: (error) => {
            console.error("Failed to send message:", error);
            alert("Failed to send message. Please try again.");
        },
    });

    const handleSendMessage = () => {
        if (!message.trim() && !file) return; // Prevent empty message submission

        const formData = new FormData();
        if (file) {
            formData.append("message", file);
            formData.append("is_file", "yes");
        } else {
            formData.append("message", message);
            formData.append("is_file", "no");
        }

        formData.append("current_chat_user_type", messageData.chat_user_type);
        formData.append("current_chat_user", messageData.chat_user_id);
        formData.append("chat_id", messageData.chat_id);

        sendMessage(formData);
    };

    return (
        <div className="sticky bottom-0 w-full h-16 bg-oliveLight flex gap-2 p-4 items-center text-white">
            
            {/* File Upload */}
            <label htmlFor="fileUpload" className="cursor-pointer">
                <MdAttachFile size={24} className="flex-shrink-0" />
                <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
            </label>

            {/* Emoji Icon */}
            <MdOutlineEmojiEmotions size={24} className="flex-shrink-0" />

            {/* Message Input */}
            <textarea
                placeholder="Write a message..."
                className="flex-1 p-2  bg-transparent border-none outline-none resize-none leading-none text-base"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={1}
            />

            {/* Send Button */}
            <button
                className="bg-oliveDark px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={sending}
            >
                {sending ? (
                    <FaSpinner size={20} className="animate-spin" />
                ) : (
                    <FaPaperPlane size={20} />
                )}
            </button>
        </div>
    );
}

export default SendMessage;

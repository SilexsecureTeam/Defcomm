import React from "react";
import { MdCall } from "react-icons/md";

interface ChatCallInviteProps {
    isMyChat: boolean; // If true, the user initiated the call; otherwise, they received it
    onAcceptCall: () => void; // Function to handle call acceptance
    status: "Ringing..." | "Call Ended"; // Current call status
    caller: string; // Name of the caller
}

function ChatCallInvite({ isMyChat, onAcceptCall, status, caller }: ChatCallInviteProps) {
    return (
        <div className={`flex flex-wrap items-center gap-3 p-3 rounded-lg w-full shadow-md font-medium text-sm ${isMyChat ? "bg-oliveLight text-white self-end" : "bg-gray-100 text-black self-start"}`}>
            <MdCall size={24} className={`text-${status === "Ringing..." ? "green" : "red"}-500`} />
            <div className="flex flex-col">
                <span className="truncate">
                    {isMyChat
                        ? status === "Ringing..." 
                            ? "You are calling..."
                            : "You called"
                        : status === "Ringing..." 
                            ? `${caller} is calling...` 
                            : `${caller} called`}
                </span>
                <span className={`text-xs ${status === "Ringing..." ? "text-green-600" : "text-red-500"}`}>
                    {status}
                </span>
            </div>
            {/* Show "Accept" button only if the user is NOT the caller */}
            {status === "Ringing..." && (
                <button
                    onClick={onAcceptCall}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                   {isMyChat ? "Join" : "Accept"}
                </button>
            )}
        </div>
    );
}

export default ChatCallInvite;

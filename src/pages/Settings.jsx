import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Settings = () => {
    const {chatVisibility, setChatVisibility} = useContext(ChatContext);

    return (
        <div className="w-80 min-h-32 bg-white shadow-lg rounded-lg p-4 mt-4">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Settings</h2>

            {/* Chat Visibility Toggle */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Chat Visibility</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={chatVisibility}
                        onChange={() => setChatVisibility(!chatVisibility)}
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 relative transition-all">
                        <div
                            className={`absolute w-4 h-4 bg-white rounded-full shadow-md transition-all top-0 bottom-0 m-auto ${
                                chatVisibility ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                    </div>
                </label>
            </div>
        </div>
    );
};

export default Settings;

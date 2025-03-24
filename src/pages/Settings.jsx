import React, { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import MessageSettings from "../components/settings/MessageSettings";

const Settings = () => {
    const [setting, setSetting] = useState("message")

    const features = [
        { label: "Notification", key: "notification" },
        { label: "Set 2FA", key: "2FA" },
        { label: "Message Reading Pattern", key: "message" },
    ]

    return (
        <div className="w-full max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 md:flex">
            {/* Sidebar */}
            <div className="w-full md:w-1/3 border-r p-4">
                <h3 className="text-gray-700 font-semibold mb-4">PROFILE</h3>
                <div className="space-y-4">
                    {
                        features?.map((feature) => (
                            <div onClick={() => setSetting(feature.key)} key={feature?.key} className={`cursor-pointer flex items-center gap-4 ${setting === feature?.key ? "border-l-4 border-green-500 pl-1" : ""}`}>
                                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div>
                                    <h4 className="text-gray-800 font-medium">{feature?.label}</h4>
                                    <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="w-full md:w-2/3 flex-1 p-4">
                    {setting === "message" && <MessageSettings />}
                    {setting !== "message" && <div className="w-full" />}
            </div>

        </div>
    );
};

export default Settings;
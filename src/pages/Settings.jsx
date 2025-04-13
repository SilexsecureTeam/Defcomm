import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageSettings from "../components/settings/MessageSettings";
import Profile from "./Profile";

const Settings = () => {
    const [setting, setSetting] = useState("message");

    const features = [
        { label: "Profile", key: "profile" },
        { label: "Notification", key: "notification" },
        { label: "Set 2FA", key: "2FA" },
        { label: "Message Reading Pattern", key: "message" },
    ];

    return (
        <div className="relative w-full md:w-[700px] lg:w-full h-[80vh] mx-auto bg-white shadow-md p-3 md:p-6 md:flex overflow-y-auto">
            {/* Sidebar */}
            <div className="w-full md:w-max border-b border-r-0 md:border-r md:border-b-0 p-4 md:sticky md:top-0 overflow-y-auto">
                <h3 className="text-gray-700 font-semibold mb-4">PROFILE</h3>
                <div className="space-y-4">
                    {features.map((feature) => (
                        <motion.div
                            key={feature.key}
                            onClick={() => setSetting(feature.key)}
                            className={`cursor-pointer p-2 flex items-center gap-2 transition-all ${
                                setting === feature.key ? "border-l-4 border-olive bg-gray-200/30" : ""
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div 
                                className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full"
                                animate={{ rotate: setting === feature.key ? 360 : 0 }}
                                transition={{ duration: 0.5 }}
                            />
                            <div>
                                <h4 className="text-sm text-gray-800 font-medium">{feature.label}</h4>
                                <p className="text-gray-500 text-sm mt-1">Lorem ipsum dolor sit amet</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full md:w-2/3 flex-1 p-4 ">
                <AnimatePresence mode="wait">
                    {setting === "message" ? (
                        <motion.div
                            key={setting?.key}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MessageSettings />
                        </motion.div>
                    ) : setting === "profile" ? (
                        <motion.div
                            key={setting?.key}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Profile />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="emptyView"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-32 flex items-center justify-center text-gray-500"
                        >
                            Select a setting to view details
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Settings;

import React, { useContext, useState } from "react";
import { IoShieldCheckmark } from "react-icons/io5";
import { MdMarkChatUnread, MdMoreVert } from "react-icons/md";
import {
  FaDesktop,
  FaWaveSquare,
  FaWifi,
  FaVolumeUp,
  FaSignal,
} from "react-icons/fa";
import { PiChatCircleTextBold } from "react-icons/pi";
import { RiBatteryChargeFill } from "react-icons/ri";
import { IoMdFlame } from "react-icons/io";

import useComm from "../../hooks/useComm";
import useCommChannel from "../../hooks/useCommChannel"; // ⬅️ Import the hook
import AudioVisualizer from "../charts/AudioVisualizer";
import { AuthContext } from "../../context/AuthContext";
import { CommContext } from "../../context/CommContext";

// Utility to generate dark HSL color
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 20%)`;
};

const Broadcast = () => {
  const { authDetails } = useContext(AuthContext);
  const {
    setActiveChannel,
    activeChannel,
    isCommActive,
    connectingChannelId,
    setConnectingChannelId,
  } = useContext(CommContext); // ⬅️ added isCommActive
  const { getChannelList } = useComm();
  const { data: channels, isLoading, isError } = getChannelList;

  const token = authDetails?.access_token;

  useCommChannel({
    channelId: activeChannel?.id,
    token,
    onTransmit: (data) => {
      console.log("Transmitting:", data);
    },
    onStatus: (data) => {
      console.log("Status update:", data);
    },
  });

  const handleChannelClick = (channel) => {
    setActiveChannel(channel);
    setConnectingChannelId(channel.id); // 🆕 Show connecting state
  };

  if (isLoading)
    return <p className="text-center py-10">Loading channels...</p>;
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">Failed to load channels.</p>
    );

  return (
    <div className="p-2">
      {/* Broadcast Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <IoMdFlame size={20} className="text-oliveGreen" />
          <h1 className="text-lg font-semibold">
            Secure Walkie Talkie Broadcast
          </h1>
        </div>
        <MdMoreVert
          size={20}
          className="text-gray-400 cursor-pointer ml-auto"
        />
      </div>

      {channels?.map((item) => {
        const isActive = activeChannel?.id === item.id;

        return (
          <div
            key={item.id}
            onClick={() => handleChannelClick(item)}
            className={`mb-4 cursor-pointer bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-medium flex min-h-24 shadow-md overflow-hidden ${
              isActive ? "ring-2 ring-green-600" : ""
            }`}
          >
            {/* Colored Sidebar */}
            <div
              className="w-12 min-h-full flex flex-col justify-between items-center p-2 text-white"
              style={{ backgroundColor: stringToColor(item.name) }}
            >
              <span></span>
              <IoShieldCheckmark size={18} />
            </div>

            {/* Main Section */}
            <section className="p-3 flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{item.name}</span>
                  {isActive && (
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: isCommActive ? "#dcfce7" : "#fef9c3",
                        color: isCommActive ? "#166534" : "#92400e",
                      }}
                    >
                      {connectingChannelId === item.id && !isCommActive
                        ? "Connecting..."
                        : isCommActive
                        ? "Connected"
                        : ""}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 overflow-x-auto">
                  <MdMarkChatUnread className="size-4 hover:text-green-600" />
                  <FaDesktop className="size-4 hover:text-green-600" />
                  <FaWaveSquare className="size-4 hover:text-green-600" />
                  <PiChatCircleTextBold className="size-4 hover:text-green-600" />
                  <FaWifi className="size-4 hover:text-green-600" />
                  <FaVolumeUp className="size-4 hover:text-green-600" />
                  <RiBatteryChargeFill className="size-4 hover:text-green-600" />
                  <FaSignal className="size-4 text-red-600" />
                </div>
              </div>

              {/* Visualizer */}
              <div className="mt-3">
                <AudioVisualizer progress={50} width={200} />
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
};
export default Broadcast;

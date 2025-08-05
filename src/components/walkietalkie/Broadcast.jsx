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
import AudioVisualizer from "../charts/AudioVisualizer";
import { CommContext } from "../../context/CommContext";
import { stringToColor } from "../../utils/formmaters";
import Modal from "../modal/Modal";
import AddUsersToMeeting from "../dashboard/AddUsersToMeeting";
import LoaderCard from "./LoaderCard";
import EmptyState from "./EmptyState";

const Broadcast = () => {
  const {
    setActiveChannel,
    activeChannel,
    isCommActive,
    connectingChannelId,
    setConnectingChannelId,
  } = useContext(CommContext);

  const { getChannelList, getInvitedChannelList } = useComm();
  const { data: channels, isLoading, isError, refetch } = getChannelList;
  const { data: invitedChannels } = getInvitedChannelList;

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const handleChannelClick = (channel) => {
    const id = channel.id || channel.channel_id; // fallback for invited
    setConnectingChannelId(id);
    setActiveChannel({ ...channel, id }); // ensure activeChannel always has `id`
  };

  const handleInviteClick = (e, channel) => {
    e.stopPropagation();
    setSelectedChannel(channel);
    setShowInviteModal(true);
  };

  // Combine channels and invitedChannels while avoiding duplicates
  const combinedChannels = [
    ...(channels || []),
    ...(invitedChannels?.filter(
      (inv) => !(channels || []).some((ch) => ch.id === inv.channel_id)
    ) || []),
  ];

  return (
    <div className="p-2">
      {/* Header */}
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

      {/* Loading */}
      {isLoading && <LoaderCard />}

      {/* Error */}
      {isError && (
        <div className="text-center py-10">
          <p className="text-red-600 mb-2">Failed to load channels.</p>
          <button
            onClick={() => refetch()}
            className="text-sm px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Retry
          </button>
        </div>
      )}

      {/* Channel List */}
      {!isLoading && !isError && combinedChannels.length === 0 && (
        <EmptyState
          title="No Channels Available"
          description="You haven't joined or created any broadcast channels yet. Once available, they'll show up here."
        />
      )}
      {!isLoading &&
        !isError &&
        combinedChannels.map((item) => {
          const isActive = activeChannel?.frequency === item.frequency;
          const isInvited = invitedChannels?.some(
            (inv) => inv.channel_id === (item.id || item.channel_id)
          );

          return (
            <div
              key={item.id}
              onClick={() => handleChannelClick(item)}
              className={`relative mb-4 cursor-pointer bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-medium flex min-h-24 shadow-md overflow-hidden ${
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

              {/* Main Content */}
              <section className="p-3 flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{item.name}</span>
                    {/* Invite Badge and Button */}
                    {isInvited ? (
                      <div className="absolute bottom-2 right-2 flex gap-2 items-center">
                        <span className="cursor-none text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full shadow">
                          Invited
                        </span>
                      </div>
                    ) : (
                      <div className="absolute bottom-2 right-2">
                        <button
                          onClick={(e) => handleInviteClick(e, item)}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        >
                          Invite
                        </button>
                      </div>
                    )}

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

                <div className="mt-3">
                  <AudioVisualizer progress={50} width={200} />
                </div>
              </section>
            </div>
          );
        })}

      {/* Invite Modal */}
      {showInviteModal && selectedChannel && (
        <Modal
          isOpen={showInviteModal}
          closeModal={() => setShowInviteModal(false)}
        >
          <AddUsersToMeeting selectedMeeting={selectedChannel} mode="channel" />
        </Modal>
      )}
    </div>
  );
};

export default Broadcast;

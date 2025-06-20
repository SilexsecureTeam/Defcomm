import React, { useEffect, useContext } from "react";
import { MdCall } from "react-icons/md";
import callerTone from "../../assets/audio/caller.mp3";
import receiverTone from "../../assets/audio/receiver.mp3";
import audioController from "../../utils/audioController";
import { ChatContext } from "../../context/ChatContext";

interface ChatCallInviteProps {
  msg: any;
  isMyChat: boolean;
  onAcceptCall: () => void;
  status: "Ringing..." | "Call Ended";
  caller: string;
}

function ChatCallInvite({
  msg,
  isMyChat,
  onAcceptCall,
  status,
  caller,
}: ChatCallInviteProps) {
  const { callMessage } = useContext(ChatContext);

  const isCallActive =
    callMessage?.id === msg?.id && callMessage?.status === "on";

  useEffect(() => {
    if (status === "Ringing...") {
      const ringtone = isMyChat ? callerTone : receiverTone;
      audioController.playRingtone(ringtone, true);
    } else {
      audioController.stopRingtone();
    }

    return () => {
      audioController.stopRingtone();
    };
  }, [status, isMyChat]);

  return (
    <div
      className={`flex flex-wrap items-center gap-3 p-3 rounded-lg w-full shadow-md font-medium text-sm ${
        isMyChat
          ? "bg-oliveLight text-white self-end"
          : "bg-gray-100 text-black self-start"
      }`}
    >
      <MdCall
        size={24}
        className={`text-${status === "Ringing..." ? "green" : "red"}-500`}
      />
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
        <span
          className={`text-xs ${
            isCallActive
              ? "text-green-600"
              : status === "Ringing..."
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {isCallActive ? "Call Ongoing" : status}
        </span>
      </div>

      {/* Button: Accept or Join only if not already active */}
      {status === "Ringing..." && !isCallActive && (
        <button
          onClick={onAcceptCall}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
        >
          {isMyChat ? "Join" : "Accept"}
        </button>
      )}

      {/* Button: Return to ongoing call */}
      {isCallActive && (
        <button className="bg-olive/80 hover:bg-olive text-white px-3 py-1 rounded text-sm">
          Return
        </button>
      )}
    </div>
  );
}

export default ChatCallInvite;

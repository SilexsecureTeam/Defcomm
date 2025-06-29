import React, { useEffect, useContext } from "react";
import { MdCall, MdCallMissed, MdCallEnd } from "react-icons/md";
// @ts-ignore
import callerTone from "../../assets/audio/caller.mp3";
// @ts-ignore
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
    Number(callMessage?.msg_id) === Number(msg?.id) &&
    callMessage?.status === "on";

  const callState = msg?.call_state || "ringing"; // fallback to ringing

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
  }, [callState, status, isMyChat]);

  const getStatusText = () => {
    if (callState === "pick") return "Call Ended";
    if (callState === "miss") return "Missed Call";
    return status;
  };

  const getMessageText = () => {
    if (callState === "miss")
      return isMyChat ? "You missed the call" : `${caller} missed your call`;
    if (callState === "pick")
      return isMyChat ? "You picked the call" : `${caller} picked the call`;
    return isMyChat
      ? status === "Ringing..."
        ? "You are calling..."
        : "You called"
      : status === "Ringing..."
      ? `${caller} is calling...`
      : `${caller} called`;
  };

  const getIcon = () => {
    if (callState === "miss")
      return <MdCallMissed size={24} className="text-red-500" />;
    if (callState === "pick")
      return <MdCallEnd size={24} className="text-green-500" />;
    return (
      <MdCall
        size={24}
        className={`text-${status === "Ringing..." ? "green" : "red"}-500`}
      />
    );
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-3 p-3 rounded-lg w-full shadow-md font-medium text-sm ${
        isMyChat
          ? "bg-oliveLight text-white self-end"
          : "bg-gray-100 text-black self-start"
      }`}
    >
      {getIcon()}
      <div className="flex flex-col">
        <span className="truncate">{getMessageText()}</span>
        <span
          className={`text-xs ${
            callState === "pick"
              ? "text-green-600"
              : callState === "miss"
              ? "text-red-500"
              : isCallActive
              ? "text-green-600"
              : "text-gray-500"
          }`}
        >
          {isCallActive ? "Call Ongoing" : getStatusText()}
        </span>
        {/* Show call duration if picked */}
        {callState === "pick" && msg.call_duration && (
          <span className="text-xs text-gray-600">
            Duration: {msg.call_duration}
          </span>
        )}
      </div>

      {/* Show Join/Accept if ringing and not already active */}
      {callState === "ringing" && status === "Ringing..." && !isCallActive && (
        <button
          onClick={onAcceptCall}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
        >
          {isMyChat ? "Join" : "Accept"}
        </button>
      )}

      {/* Show Return if ongoing */}
      {isCallActive && (
        <button className="bg-olive/80 hover:bg-olive text-white px-3 py-1 rounded text-sm">
          Return
        </button>
      )}
    </div>
  );
}

export default ChatCallInvite;

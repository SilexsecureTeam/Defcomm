import { useContext, useEffect, useState, useRef } from "react";
import { MdMarkChatUnread } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { FaBroadcastTower, FaMicrophoneAlt } from "react-icons/fa";
import military from "../../assets/military.png";
import AudioVisualizer from "../charts/AudioVisualizer";
import InitComm from "./InitComm";
import { CommContext } from "../../context/CommContext";
import VoiceRecordButton from "./VoiceRecordButton";
import { formatLocalTime } from "../../utils/formmaters";
import CommLogPanel from "./CommLogPanel";

const CommInterface = () => {
  const {
    isCommActive,
    activeChannel,
    connectingChannelId,
    currentSpeaker,
    leaveChannel,
    walkieMessages, // <-- assuming from context
  } = useContext(CommContext);

  const [seconds, setSeconds] = useState(0);
  const logEndRef = useRef(null);

  // Auto-scroll to latest log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [walkieMessages]);

  // Timer for connection time
  useEffect(() => {
    let timer;
    if (isCommActive && activeChannel && !connectingChannelId) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isCommActive, activeChannel, connectingChannelId]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isCommActive && !activeChannel && !connectingChannelId) {
    return <InitComm />;
  }

  if (connectingChannelId) {
    return (
      <div className="bg-black text-white h-full w-full flex flex-col justify-center items-center">
        <div className="loader border-4 border-oliveLight border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        <p className="mt-4 text-sm text-gray-300">
          Connecting to {activeChannel?.name || "channel"}...
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-oliveLight min-h-full w-full min-w-[320px] max-w-[400px] py-4 px-4 text-white flex flex-col items-center"
      style={{
        background: `linear-gradient(to bottom, #36460A 10%, #000000 65%)`,
      }}
    >
      {/* Channel Header */}
      <div className="bg-oliveHover w-full mt-6 px-3 py-1 rounded-3xl">
        <div className="flex items-center justify-between bg-lightGreen text-black p-2 rounded-md">
          <span className="font-semibold flex items-center gap-2">
            <MdMarkChatUnread size={20} /> {activeChannel?.name}
          </span>
          <div className="flex items-center gap-3">
            <span>{formatTime(seconds)}</span>
            <button
              onClick={leaveChannel}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full shadow"
            >
              End
            </button>
          </div>
        </div>
      </div>

      {/* Timestamp & Logo */}
      <p className="self-start text-sm mt-4 flex items-center gap-2">
        <img
          src={military}
          alt="military"
          className="w-8 h-8 p-1 bg-white rounded-full"
        />
        <sup>{formatLocalTime()}</sup>
      </p>

      {/* Main Display */}
      <div className="self-stretch flex justify-end items-center gap-2 my-6 transition-all duration-300">
        <div>
          {currentSpeaker ? (
            <>
              <p className="text-xs text-lime-400 flex items-center gap-1">
                <FaMicrophoneAlt size={14} /> {currentSpeaker.name}
              </p>
              <p className="text-lg text-white">Now Speaking...</p>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <FaBroadcastTower size={14} /> Channel Standby
              </p>
              <p className="text-xs text-gray-500">No active transmission</p>
            </>
          )}
        </div>

        <figure className="w-24 h-32 rounded-3xl bg-gradient-to-b to-gray-400 from-oliveGreen text-xs font-medium flex flex-col items-center justify-center p-2 py-4 shadow-lg border border-oliveLight">
          <p className="font-bold text-gray-100">{activeChannel?.frequency}</p>
          <small
            className={`text-lg mt-1 ${
              currentSpeaker ? "text-lime-800" : "text-gray-600"
            }`}
          >
            MHz
          </small>
        </figure>
      </div>

      {/* Live / Idle Visualizer */}
      <CommLogPanel />

      {/* Group Info */}
      <div className="flex items-center gap-3 my-4">
        <div className="mt-3 relative flex justify-center w-[77px]">
          <div className="w-10 h-10 bg-green-600 rounded-full border border-oliveHover absolute bottom-0 right-0"></div>
          <div className="w-9 h-9 bg-gray-600 rounded-full border border-gray-400 absolute bottom-3 left-0"></div>
          <div className="w-9 h-9 bg-gray-400 rounded-full border border-gray-400 absolute top-0"></div>
          <div className="w-8 h-8 bg-gray-300 flex items-center justify-center text-black rounded-full border border-gray-400 absolute -bottom-5 left-3">
            <FiPlus size={12} />
          </div>
        </div>

        <div>
          <p className="text-sm mt-1">Emergency Situation Room</p>
          <p className="text-xs text-gray-400">+ 70 Live *************</p>
        </div>
      </div>

      {/* Voice Record */}
      {activeChannel?.channel_id && (
        <VoiceRecordButton channelId={activeChannel.channel_id} />
      )}
      <p className="text-xs mt-2">Tap to talk</p>
    </div>
  );
};

export default CommInterface;

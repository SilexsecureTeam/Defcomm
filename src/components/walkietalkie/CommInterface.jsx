import { useContext, useEffect, useState, useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { FaBroadcastTower, FaMicrophoneAlt } from "react-icons/fa";
import military from "../../assets/military.png";
import InitComm from "./InitComm";
import { CommContext } from "../../context/CommContext";
import VoiceRecordButton from "./VoiceRecordButton";
import { formatLocalTime } from "../../utils/formmaters";
import CommLogPanel from "./CommLogPanel";
import CommHeader from "./CommHeader";

const CommInterface = () => {
  const {
    isCommActive,
    activeChannel,
    connectingChannelId,
    currentSpeaker,
    walkieMessages,
  } = useContext(CommContext);

  const [seconds, setSeconds] = useState(0);
  const logEndRef = useRef(null);

  // Auto-scroll to latest log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [walkieMessages]);

  if (!isCommActive && !activeChannel && !connectingChannelId) {
    return <InitComm />;
  }

  if (connectingChannelId) {
    return (
      <div className="bg-black text-white min-w-[320px] max-w-[400px] flex flex-col justify-center items-center min-h-96">
        <div className="loader border-4 border-oliveLight border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        <p className="mt-4 text-sm text-gray-300">
          Connecting to {activeChannel?.name || "channel"}...
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-oliveLight min-h-full w-80  md:w-96 py-4 px-4 text-white flex flex-col items-center"
      style={{
        background: `linear-gradient(to bottom, #36460A 10%, #000000 65%)`,
      }}
    >
      {/* Channel Header */}
      <CommHeader />

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
          <p className="font-bold text-gray-100 text-[10px]">
            {activeChannel?.frequency}
          </p>
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
          <p className="text-sm mt-1">
            {activeChannel?.description || "Emergency Situation Room"}
          </p>
          <p className="text-xs text-gray-400">+ 70 Live *************</p>
        </div>
      </div>

      {/* Voice Record */}
      {activeChannel?.channel_id && (
        <VoiceRecordButton channelId={activeChannel.channel_id} />
      )}
    </div>
  );
};

export default CommInterface;

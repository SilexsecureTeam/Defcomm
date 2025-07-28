import {
  FaPhone,
  FaMicrophoneSlash,
  FaMicrophone,
  FaVideoSlash,
  FaVideo,
  FaCog,
  FaDesktop,
  FaStopCircle,
  FaHandPaper,
  FaRegHandPaper,
  FaCommentDots,
  FaUsers,
  FaSmile,
} from "react-icons/fa";

import { useState } from "react";

const ToolbarControls = ({
  micOn,
  webcamOn,
  toggleMic,
  toggleWebcam,
  presenterId,
  myId,
  isScreenSharing,
  handleScreenShare,
  handleLeaveMeeting,
  handleRaiseHand,
  handRaised,
  showParticipants,
  setShowParticipants,
  setShowSettings,
  setShowChatModal,
  hasNewMessage,
  chatCount,
  participantCount,
  sendReaction, // ✅ callback from ConferenceControl
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const emojiList = ["👍", "😂", "👏", "❤️", "😮"];

  return (
    <div className="sticky mt-auto bottom-0 bg-black/70 flex flex-wrap justify-center items-center gap-4 px-3 py-3 text-xl sm:text-2xl z-10">
      {/* MIC */}
      <button
        onClick={() => toggleMic()}
        className={`text-gray-500 hover:text-white ${
          micOn ? "text-white" : ""
        }`}
      >
        {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
      </button>

      {/* CAM */}
      <button
        onClick={() => toggleWebcam()}
        className={`text-gray-500 hover:text-white ${
          webcamOn ? "text-white" : ""
        }`}
      >
        {webcamOn ? <FaVideo /> : <FaVideoSlash />}
      </button>

      {/* SCREEN SHARE */}
      <button
        disabled={presenterId && presenterId !== myId}
        onClick={handleScreenShare}
        className={`hidden md:block text-gray-500 hover:text-white ${
          isScreenSharing && presenterId === myId ? "text-green-400" : ""
        } ${
          presenterId && presenterId !== myId
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isScreenSharing && presenterId === myId ? (
          <FaStopCircle />
        ) : (
          <FaDesktop />
        )}
      </button>

      {/* PARTICIPANTS */}
      <button
        onClick={() => setShowParticipants((prev) => !prev)}
        className="relative text-gray-500 hover:text-white"
      >
        <FaUsers />
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {participantCount}
        </span>
      </button>

      {/* END CALL */}
      <button
        onClick={handleLeaveMeeting}
        className="bg-red-500 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-red-700"
      >
        <FaPhone />
      </button>

      {/* HAND RAISE */}
      <button
        onClick={handleRaiseHand}
        className="text-gray-500 hover:text-white"
      >
        {!handRaised ? <FaRegHandPaper /> : <FaHandPaper />}
      </button>

      {/* SETTINGS */}
      {/*<button
        onClick={() => setShowSettings(true)}
        className="text-gray-500 hover:text-white"
      >
        <FaCog />
      </button>*/}

      {/* CHAT */}
      <button
        onClick={() => setShowChatModal(true)}
        className="relative text-gray-500 hover:text-white"
      >
        <FaCommentDots />
        {hasNewMessage && (
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
            {chatCount}
          </span>
        )}
      </button>

      {/* 😄 REACTIONS TOGGLE */}
      <div className="relative">
        <button
          onClick={() => setShowReactions((prev) => !prev)}
          className="text-gray-500 hover:text-white"
          title="Reactions"
        >
          <FaSmile />
        </button>

        {showReactions && (
          <div className="absolute bottom-14 right-0 md:left-1/2 transform md:-translate-x-1/2 w-max max-w-80 bg-white text-black rounded-lg shadow-lg px-3 py-2 flex justify-center gap-2 overflow-x-auto z-50">
            {emojiList.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  sendReaction(emoji);
                  setShowReactions(false);
                }}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolbarControls;

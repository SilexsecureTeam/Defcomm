import { useState, useContext, useEffect } from 'react';
import {
  FaPhone, FaMicrophoneSlash, FaMicrophone, FaVideoSlash,
  FaVideo, FaCog, FaDesktop, FaStopCircle, FaHandPaper,
  FaRegHandPaper, FaCommentDots
} from "react-icons/fa";
import { useMeeting, useParticipant, usePubSub } from "@videosdk.live/react-sdk";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { toast } from 'react-toastify';

import CallMessagingModal from "./CallMessagingModal";

const ConferenceControl = ({ handleLeaveMeeting, handleScreenShare, isScreenSharing, me }) => {
  const { toggleMic, toggleWebcam, presenterId } = useMeeting();
  const { webcamOn, micOn } = useParticipant(me?.id ?? "", {});
  const { publish, messages: handMessages } = usePubSub("HAND_RAISE");
  const { messages: chatMessages } = usePubSub("CALL_CHAT");

  const [handRaised, setHandRaised] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);

  const { authDetails } = useContext(AuthContext);
  const { setShowSettings } = useContext(ChatContext);

  const myId = me?.id;
  const latestChatMessage = chatMessages[chatMessages.length - 1];

  const handleRaiseHand = () => {
    const newRaiseState = !handRaised;
    publish({
      name: authDetails?.user?.name,
      id: myId,
      raised: newRaiseState,
      timestamp: new Date().toISOString(),
    });
    setHandRaised(newRaiseState);
  };

  // Handle hand raise toast notifications
  useEffect(() => {
    if (handMessages.length) {
      const latest = handMessages[handMessages.length - 1];
      const { id, name, raised } = latest.message;
      if (id === myId) {
        setHandRaised(raised);
      } else if (raised) {
        toast.info(`${name || "Someone"} raised their hand ✋`);
      }
    }
  }, [handMessages, myId]);

  // Detect new incoming message when chat is closed
  useEffect(() => {
    if (
      !showChatModal &&
      latestChatMessage &&
      latestChatMessage.message?.id !== myId &&
      latestChatMessage.id !== lastSeenMessageId
    ) {
      setHasNewMessage(true);
    }
  }, [chatMessages, showChatModal, myId, lastSeenMessageId, latestChatMessage]);

  // Reset red dot and mark latest message as seen
  useEffect(() => {
    if (showChatModal && latestChatMessage) {
      setHasNewMessage(false);
      setLastSeenMessageId(latestChatMessage.id);
    }
  }, [showChatModal, latestChatMessage]);

  return (
    <>
      <div className="sticky mt-auto bottom-0 bg-black/70 flex justify-center items-center gap-8 text-2xl py-4 z-10">
        <button onClick={() => toggleMic()} className={`text-gray-500 hover:text-white ${micOn ? "text-white" : ""}`}>
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <button onClick={() => toggleWebcam()} className={`text-gray-500 hover:text-white ${webcamOn ? "text-white" : ""}`}>
          {webcamOn ? <FaVideo /> : <FaVideoSlash />}
        </button>
        <button
          disabled={presenterId && presenterId !== myId}
          onClick={handleScreenShare}
          className={`hidden md:block text-gray-500 hover:text-white ${
            isScreenSharing && presenterId === myId ? "text-green-400" : ""
          } ${presenterId && presenterId !== myId ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isScreenSharing && presenterId === myId ? <FaStopCircle /> : <FaDesktop />}
        </button>
        <button onClick={handleLeaveMeeting} className="flex-shrink-0 bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-700">
          <FaPhone />
        </button>
        <button onClick={handleRaiseHand} className="text-yellow-400 hover:text-yellow-500">
          {!handRaised ? <FaRegHandPaper /> : <FaHandPaper />}
        </button>
        <button onClick={() => setShowSettings(true)} className="text-gray-500 hover:text-white">
          <FaCog />
        </button>
        <button onClick={() => setShowChatModal(true)} className="relative text-gray-500 hover:text-white">
          <FaCommentDots />
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-ping" />
          )}
        </button>
      </div>

      <CallMessagingModal isOpen={showChatModal} onClose={() => setShowChatModal(false)} />
    </>
  );
};

export default ConferenceControl;

import { useState, useContext, useEffect } from "react";
import {
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { toast } from "react-toastify";
import audioController from "../../../utils/audioController";
import messageSound from "../../../assets/audio/message.mp3";
import { motion, AnimatePresence } from "framer-motion";

import ToolbarControls from "./ToolbarControls";
import ParticipantsPanel from "./ParticipantsPanel";
import RaisedHandsPanel from "./RaisedHandsPanel";
import CallMessagingModal from "./CallMessagingModal";

const AUTO_LOWER_TIMEOUT = 60000;

const ConferenceControl = ({
  handleLeaveMeeting,
  handleScreenShare,
  isScreenSharing,
  me,
}) => {
  const { toggleMic, toggleWebcam, presenterId, participants } = useMeeting();
  const { webcamOn, micOn } = useParticipant(me?.id ?? "", {});
  const { publish, messages: handMessages } = usePubSub("HAND_RAISE");
  const { messages: chatMessages } = usePubSub("CALL_CHAT");
  const { publish: publishReaction, messages: reactionMessages } =
    usePubSub("CALL_REACTION");

  const [handRaised, setHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);
  const [showRaisedPanel, setShowRaisedPanel] = useState(true);
  const [activeReaction, setActiveReaction] = useState(null);

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

    if (newRaiseState) {
      setTimeout(() => {
        publish({
          name: authDetails?.user?.name,
          id: myId,
          raised: false,
          timestamp: new Date().toISOString(),
        });
        setHandRaised(false);
      }, AUTO_LOWER_TIMEOUT);
    }
  };

  const sendReaction = (emoji) => {
    const name = authDetails?.user?.name || "Someone";
    publishReaction({
      id: myId,
      name,
      emoji,
      timestamp: new Date().toISOString(),
    });

    setActiveReaction({ emoji, name });
    setTimeout(() => setActiveReaction(null), 3000);
  };

  useEffect(() => {
    if (handMessages.length) {
      const latest = handMessages[handMessages.length - 1];
      const { id, name, raised, timestamp } = latest.message;

      if (id === myId) {
        setHandRaised(raised);
      } else {
        setRaisedHands((prev) => {
          const already = prev.some((u) => u.id === id);
          if (raised && !already) {
            toast.info(`${name || "Someone"} raised their hand ✋`, {
              toastId: `hand-${prev.id}`, // prevent duplicate toasts
              className: "hand-raise-toast",
              autoClose: 2000,
              pauseOnHover: false,
              closeButton: false,
              hideProgressBar: true,
            });

            audioController.playRingtone(messageSound);
            return [...prev, { id, name, timestamp }];
          } else if (!raised) {
            return prev.filter((p) => p.id !== id);
          }
          return prev;
        });
      }
    }
  }, [handMessages, myId]);

  useEffect(() => {
    if (
      !showChatModal &&
      latestChatMessage &&
      latestChatMessage.message?.id !== myId &&
      latestChatMessage.id !== lastSeenMessageId
    ) {
      setHasNewMessage(true);
      audioController.playRingtone(messageSound);
    }
  }, [chatMessages, showChatModal, myId, lastSeenMessageId, latestChatMessage]);

  useEffect(() => {
    if (showChatModal && latestChatMessage) {
      setHasNewMessage(false);
      setLastSeenMessageId(latestChatMessage.id);
    }
  }, [showChatModal, latestChatMessage]);

  useEffect(() => {
    if (reactionMessages.length) {
      const latest = reactionMessages[reactionMessages.length - 1];
      const { emoji, id, name } = latest.message;
      const isMe = id === myId;
      setActiveReaction({ emoji, name: isMe ? "You" : name });
      setTimeout(() => setActiveReaction(null), 3000);
    }
  }, [reactionMessages, myId]);

  const lastSeenIndex = chatMessages.findIndex(
    (m) => m.id === lastSeenMessageId
  );
  const chatCount = chatMessages
    .slice(lastSeenIndex + 1)
    .filter((m) => m.message?.id !== myId).length;

  return (
    <>
      <ToolbarControls
        micOn={micOn}
        webcamOn={webcamOn}
        toggleMic={toggleMic}
        toggleWebcam={toggleWebcam}
        presenterId={presenterId}
        myId={myId}
        isScreenSharing={isScreenSharing}
        handleScreenShare={handleScreenShare}
        handleLeaveMeeting={handleLeaveMeeting}
        handleRaiseHand={handleRaiseHand}
        handRaised={handRaised}
        showParticipants={showParticipants}
        setShowParticipants={setShowParticipants}
        setShowSettings={setShowSettings}
        setShowChatModal={setShowChatModal}
        hasNewMessage={hasNewMessage}
        sendReaction={sendReaction}
        chatCount={chatCount}
        participantCount={[...participants.keys()].length}
      />

      <AnimatePresence>
        {activeReaction && (
          <motion.div
            key={activeReaction.emoji + activeReaction.name}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -60, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.5 }}
            transition={{ duration: 0.8 }}
            className="fixed bottom-40 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none"
          >
            <div className="text-6xl">{activeReaction.emoji}</div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 text-white bg-black/60 rounded px-3 py-1 text-sm shadow-lg"
            >
              {activeReaction.name}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showParticipants && (
        <ParticipantsPanel
          participants={participants}
          raisedHands={raisedHands}
          onClose={() => setShowParticipants(false)}
        />
      )}

      <RaisedHandsPanel
        raisedHands={raisedHands}
        showPanel={showRaisedPanel}
        onMinimize={() => setShowRaisedPanel(false)}
        onExpand={() => setShowRaisedPanel(true)}
      />

      <CallMessagingModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />
    </>
  );
};

export default ConferenceControl;

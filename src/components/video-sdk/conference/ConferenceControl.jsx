import { useState, useContext, useEffect } from "react";
import {
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import audioController from "../../../utils/audioController";
import messageSound from "../../../assets/audio/message.mp3";
import { motion, AnimatePresence } from "framer-motion";
import ToolbarControls from "./ToolbarControls";
import ParticipantsPanel from "./ParticipantsPanel";
import RaisedHandsPanel from "./RaisedHandsPanel";
import CallMessagingModal from "./CallMessagingModal";
import { onPrompt } from "../../../utils/notifications/onPrompt";

const AUTO_LOWER_TIMEOUT = 60000;

const ConferenceControl = ({
  handleLeaveMeeting,
  handleScreenShare,
  isScreenSharing,
  remoteParticipants,
  me,
}) => {
  const { toggleMic, toggleWebcam, presenterId, participants } = useMeeting();
  const { webcamOn, micOn, displayName } = useParticipant(me?.id ?? "", {});
  const { publish, messages: handMessages } = usePubSub("HAND_RAISE");
  const { messages: chatMessages } = usePubSub("CALL_CHAT");
  const { publish: publishReaction, messages: reactionMessages } =
    usePubSub("REACTION");

  const [handRaised, setHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);
  const [showRaisedPanel, setShowRaisedPanel] = useState(true);
  const [activeReactions, setActiveReactions] = useState([]);

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
    handleReceiveFlyingEmoji(emoji, "You"); // Show locally
    publishReaction(
      "reaction",
      { persist: false },
      { emoji, name: displayName }
    );
    setShowReactions(false);
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
            onPrompt({
              title: "Hand Raised",
              message: `${name || "Someone"} raised their hand ✋`,
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

  const handleReceiveFlyingEmoji = (emoji, name) => {
    const id = Math.random().toString(36).substring(2, 9); // unique key
    setActiveReactions((prev) => [...prev, { emoji, id, name }]);
    setTimeout(() => {
      setActiveReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  usePubSub("REACTION", {
    onMessageReceived: (msg) => {
      // msg is the object you just showed
      // Assuming your sent reaction has { emoji, name } inside payload
      const { payload, senderName } = msg;
      const emoji = payload?.emoji;
      const name = senderName || "Anonymous";

      if (name !== displayName) handleReceiveFlyingEmoji(emoji, name);
    },
  });

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
        {activeReactions.map(({ id, emoji, name }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{
              opacity: [1, 1, 0],
              y: -100 - Math.random() * 80,
              scale: [1, 1.4, 1],
              x: (Math.random() - 0.5) * 100,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="fixed bottom-40 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none"
          >
            <div className="text-5xl">{emoji}</div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 text-white bg-black/50 rounded px-3 py-1 text-xs shadow-lg"
            >
              {name}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {showParticipants && (
        <ParticipantsPanel
          participants={[me, ...remoteParticipants]}
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

import { useState, useContext, useEffect } from "react";
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
} from "react-icons/fa";
import {
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import { toast } from "react-toastify";
import CallMessagingModal from "./CallMessagingModal";
import audioController from "../../../utils/audioController";
import messageSound from "../../../assets/audio/message.mp3";

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

  const [handRaised, setHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
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
            toast.info(`${name || "Someone"} raised their hand ✋`);
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

  return (
    <>
      {/* Bottom Toolbar */}
      <div className="sticky mt-auto bottom-0 bg-black/70 flex flex-wrap justify-center items-center gap-4 px-3 py-3 text-xl sm:text-2xl z-10">
        <button
          onClick={() => toggleMic()}
          className={`text-gray-500 hover:text-white ${micOn ? "text-white" : ""}`}
        >
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <button
          onClick={() => toggleWebcam()}
          className={`text-gray-500 hover:text-white ${webcamOn ? "text-white" : ""}`}
        >
          {webcamOn ? <FaVideo /> : <FaVideoSlash />}
        </button>
        <button
          disabled={presenterId && presenterId !== myId}
          onClick={handleScreenShare}
          className={`hidden md:block text-gray-500 hover:text-white ${
            isScreenSharing && presenterId === myId ? "text-green-400" : ""
          } ${
            presenterId && presenterId !== myId ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isScreenSharing && presenterId === myId ? <FaStopCircle /> : <FaDesktop />}
        </button>
        <button
          onClick={() => setShowParticipants((prev) => !prev)}
          className="text-gray-500 hover:text-white"
        >
          <FaUsers />
        </button>
        <button
          onClick={handleLeaveMeeting}
          className="bg-red-500 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-red-700"
        >
          <FaPhone />
        </button>
        <button
          onClick={handleRaiseHand}
          className="text-yellow-400 hover:text-yellow-500"
        >
          {!handRaised ? <FaRegHandPaper /> : <FaHandPaper />}
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="text-gray-500 hover:text-white"
        >
          <FaCog />
        </button>
        <button
          onClick={() => setShowChatModal(true)}
          className="relative text-gray-500 hover:text-white"
        >
          <FaCommentDots />
          {hasNewMessage && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
              {chatMessages.length}
            </span>
          )}
        </button>
      </div>

      {/* Participants Panel */}
      {showParticipants && (
        <div className="fixed right-4 bottom-20 w-64 max-h-[60vh] overflow-y-auto bg-white border border-gray-300 shadow-md rounded-md p-4 z-40">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-black font-semibold">Participants</h3>
            <button
              onClick={() => setShowParticipants(false)}
              className="text-gray-400 hover:text-red-500 text-xs"
            >
              Close
            </button>
          </div>
          <ul className="space-y-2 text-gray-800 text-sm">
            {[...participants.keys()].map((id) => {
              const participant = participants.get(id);
              const isRaised = raisedHands.find((u) => u.id === id);
              return (
                <li key={id} className="flex items-center justify-between">
                  <span className="truncate">{participant.displayName || "Unnamed"}</span>
                  <div className="flex items-center gap-2">
                    {participant.micOn ? (
                      <FaMicrophone className="text-green-500" />
                    ) : (
                      <FaMicrophoneSlash className="text-gray-400" />
                    )}
                    {participant.webcamOn ? (
                      <FaVideo className="text-green-500" />
                    ) : (
                      <FaVideoSlash className="text-gray-400" />
                    )}
                    {isRaised && <FaHandPaper className="text-yellow-500" />}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Raised Hands Panel */}
      {raisedHands.length > 0 && (
        <div className="fixed bottom-20 left-4 bg-yellow-100 border border-yellow-300 p-3 rounded-md shadow-lg text-sm z-40 max-w-xs">
          <strong className="block mb-2 text-yellow-800">Raised Hands ✋</strong>
          <ul className="space-y-1 text-yellow-900">
            {raisedHands.map(({ id, name }) => (
              <li key={id} className="truncate">
                {name || "Participant"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat Modal */}
      <CallMessagingModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />
    </>
  );
};

export default ConferenceControl;

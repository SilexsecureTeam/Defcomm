import {
  useRef,
  useMemo,
  useLayoutEffect,
  useState,
  useEffect,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePubSub } from "@videosdk.live/react-sdk";
import { CgMaximizeAlt } from "react-icons/cg";
import { FaPhone } from "react-icons/fa";
import ParticipantVideo from "./ParticipantVideo";
import { AuthContext } from "../../../context/AuthContext";
import audioController from "../../../utils/audioController";
import messageSound from "../../../assets/audio/message.mp3";
import ScreenShareDisplay from "./ScreenShareDisplay";

const AUTO_LOWER_TIMEOUT = 60000;

const PictureInPicture = ({
  me,
  remoteParticipants,
  handleLeaveMeeting,
  removedParticipantsRef,
  activeSpeakerId,
  isScreenSharing,
  presenterId,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState(null);
  const [showControls, setShowControls] = useState(false);

  const { authDetails } = useContext(AuthContext);
  const myId = me?.id;

  const { publish, messages: handMessages } = usePubSub("HAND_RAISE");
  const [handRaised, setHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState([]);

  // Detect touch devices
  const isTouchDevice = useMemo(() => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);
  // Determine active speaker
  const activeSpeaker = useMemo(() => {
    if (!activeSpeakerId) return me;
    if (activeSpeakerId === me?.id) return me;
    const found = remoteParticipants.find((p) => p.id === activeSpeakerId);
    return found || me;
  }, [remoteParticipants, activeSpeakerId, me]);

  const isSelfActive = activeSpeaker?.id === me?.id;

  /** Handle drag bounds */
  useLayoutEffect(() => {
    const updateBounds = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDragConstraints({
        left: -rect.left + 16,
        right: window.innerWidth - rect.right - 16,
        top: -rect.top + 16,
        bottom: window.innerHeight - rect.bottom - 16,
      });
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  /** Subscribe to hand raise messages */
  useEffect(() => {
    if (handMessages.length) {
      const latest = handMessages[handMessages.length - 1];
      const { id, name, raised } = latest.message;

      if (id === myId) {
        setHandRaised(raised);
      } else {
        setRaisedHands((prev) => {
          const exists = prev.some((p) => p.id === id);
          if (raised && !exists) {
            audioController.playRingtone(messageSound);
            return [...prev, { id, name }];
          } else if (!raised) {
            return prev.filter((p) => p.id !== id);
          }
          return prev;
        });
      }
    }
  }, [handMessages, myId]);

  useEffect(() => {
    if (!isTouchDevice) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowControls(false);
      }
    };

    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isTouchDevice]);

  /** Raise hand toggle */
  const toggleRaiseHand = () => {
    const newState = !handRaised;
    publish({
      id: myId,
      name: authDetails?.user?.name || "You",
      raised: newState,
      timestamp: new Date().toISOString(),
    });
    setHandRaised(newState);

    if (newState) {
      setTimeout(() => {
        publish({
          id: myId,
          name: authDetails?.user?.name || "You",
          raised: false,
          timestamp: new Date().toISOString(),
        });
        setHandRaised(false);
      }, AUTO_LOWER_TIMEOUT);
    }
  };

  /** Other participants with hands raised */
  const otherHandsRaised = raisedHands.filter(
    (p) => p.id !== activeSpeaker?.id
  );

  return (
    <motion.div
      ref={containerRef}
      drag
      dragConstraints={
        dragConstraints || { left: 0, right: 0, top: 0, bottom: 0 }
      }
      dragElastic={0.25}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-6 right-6 z-[9999] w-72 h-44
                 bg-gradient-to-br from-gray-900/90 to-black/90
                 rounded-xl overflow-hidden
                 border border-gray-700 shadow-2xl
                 backdrop-blur-md flex items-center justify-center
                 cursor-grab active:cursor-grabbing
                 select-none"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={() => isTouchDevice && setShowControls(true)}
    >
      {/* Active Speaker */}
      <div className="flex-1 relative h-full rounded-xl overflow-hidden">
        <ParticipantVideo
          removedParticipantsRef={removedParticipantsRef}
          participantId={activeSpeaker?.id}
          label={isSelfActive ? "You" : activeSpeaker?.displayName || "Speaker"}
          isMaximized
          onToggleMaximize={() => {}}
        />

        {isScreenSharing && presenterId && (
          <div className="absolute top-0 left-0 w-full h-full z-40 rounded-xl overflow-hidden ">
            <ScreenShareDisplay
              participantId={presenterId}
              isUser={presenterId === me?.id}
            />
          </div>
        )}
        {!isSelfActive && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider
                       bg-green-500/90 text-white px-2 py-1 rounded-md shadow-lg backdrop-blur-sm"
          >
            Speaking
          </motion.div>
        )}

        {/* Hand raise indicator */}
        {otherHandsRaised.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute z-[50] top-2 right-2 flex items-center gap-1
               bg-gray-900/90 text-white px-3 py-1 rounded-xl
               shadow-lg text-xs font-semibold backdrop-blur-md"
          >
            ✋{" "}
            {otherHandsRaised.length > 1
              ? `${otherHandsRaised.length} hands`
              : "1 hand"}
          </motion.div>
        )}
      </div>

      {/* Mini Self Video */}
      {!isSelfActive && (
        <div
          className="absolute bottom-3 right-3 w-24 h-24 bg-gray-800/90
                        border border-gray-600 rounded-xl overflow-hidden shadow-lg transition-all duration-300"
        >
          <ParticipantVideo
            removedParticipantsRef={removedParticipantsRef}
            participantId={me?.id}
            label="You"
            isMaximized={false}
            onToggleMaximize={() => {}}
          />
        </div>
      )}

      {/* Hover Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls || !isTouchDevice ? 1 : 0 }}
        className={`absolute inset-0 z-[50] flex items-end justify-center gap-4 pb-3
              bg-black/30 rounded-xl transition-opacity duration-300
              ${
                showControls || !isTouchDevice
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
      >
        <button
          onClick={() => navigate("/dashboard/conference/room")}
          className="bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg
               transition-transform duration-200 hover:scale-110 flex items-center justify-center"
          title="Back to full view"
        >
          <CgMaximizeAlt size={20} />
        </button>
        <button
          onClick={handleLeaveMeeting}
          className="bg-red-600/80 hover:bg-red-700 text-white p-3 rounded-full shadow-lg
               transition-transform duration-200 hover:scale-110 flex items-center justify-center"
          title="End Call"
        >
          <FaPhone size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PictureInPicture;

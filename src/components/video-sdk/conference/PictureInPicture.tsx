import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CgMaximizeAlt } from "react-icons/cg";
import { FaPhone } from 'react-icons/fa';
import ParticipantVideo from "./ParticipantVideo";

const PictureInPicture = ({
  maximizedParticipantId,
  me,
  remoteParticipants,
  handleLeaveMeeting,
}) => {
  const navigate = useNavigate();
  const dragConstraintsRef = useRef(null);

  return (
    <div ref={dragConstraintsRef} className="fixed inset-0 z-[9999] pointer-events-none">
      <motion.div
        className="absolute bottom-4 right-4 w-48 h-48 z-[10000] bg-black rounded-lg overflow-hidden shadow-lg group transition-all pointer-events-auto"
        drag
        dragConstraints={dragConstraintsRef}
        dragElastic={0.2}
        dragMomentum={false}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Mini video display */}
        <div className="relative flex-1 w-full h-full aspect-square">
          <ParticipantVideo
            participantId={maximizedParticipantId || me?.id}
            label={
              maximizedParticipantId === me?.id || !maximizedParticipantId
                ? "You"
                : remoteParticipants.find((p) => p.id === maximizedParticipantId)?.displayName || "Participant"
            }
            isMaximized
            onToggleMaximize={() => {}}
          />

          {/* Hover controls */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex flex-col gap-3 items-center justify-end transition-opacity duration-300 pb-4">
            <button
              onClick={() => navigate("/dashboard/conference")}
              className="bg-white/80 hover:bg-white text-black p-2 rounded-full shadow"
              title="Back to full view"
            >
              <CgMaximizeAlt size={18} />
            </button>
            <button
              onClick={handleLeaveMeeting}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-md text-lg"
              title="End Call"
            >
              <FaPhone size={20} />
            </button>
          </div>
        </div>

        {/* Hidden audio tracks */}
        <div style={{ display: "none" }}>
          {[me, ...remoteParticipants].map((participant) => (
            <ParticipantVideo
              key={participant?.id}
              participantId={participant?.id}
              label=""
              isMaximized={false}
              onToggleMaximize={() => {}}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PictureInPicture;

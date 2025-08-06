import { motion } from "framer-motion";
import CommLogList from "./CommLogList";
import { useContext, useEffect } from "react";
import { CommContext } from "../../context/CommContext";
import Modal from "../modal/Modal";
import { ChatContext } from "../../context/ChatContext";

const CommLogFull = ({ isPlayingId, handlePlayPause, audioRef, logEndRef }) => {
  const { walkieMessages, setShowCommLog, showCommLog } =
    useContext(CommContext);
  const { setModalTitle } = useContext(ChatContext);

  // Set modal title
  setModalTitle("Walkie-Talkie Communication Log");

  // Auto-scroll when modal is open
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [walkieMessages, showCommLog]);

  return (
    <Modal isOpen={showCommLog} closeModal={() => setShowCommLog(false)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-[80vw] h-[80vh] bg-oliveDark backdrop-blur-md z-50 flex flex-col"
      >
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto px-3 py-2 text-xs space-y-2">
          <CommLogList
            walkieMessages={walkieMessages}
            isPlayingId={isPlayingId}
            handlePlayPause={handlePlayPause}
            audioRef={audioRef}
            logEndRef={logEndRef}
          />
          <div ref={logEndRef} />
        </div>
      </motion.div>
    </Modal>
  );
};

export default CommLogFull;

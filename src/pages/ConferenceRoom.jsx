import useConferenceParticipants from "../hooks/useConferenceParticipants";
import ParticipantVideo from "../components/video-sdk/conference/ParticipantVideo";
import ScreenShareDisplay from "../components/video-sdk/conference/ScreenShareDisplay";
import PictureInPicture from "../components/video-sdk/conference/PictureInPicture";
import ConferenceControl from "../components/video-sdk/conference/ConferenceControl";
import RecordingControlButton from "../components/video-sdk/conference/RecordingControlButton";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { Constants } from "@videosdk.live/react-sdk";
import { MeetingContext } from "../context/MeetingContext";
import Modal from "../components/modal/Modal";
import AddUsersToMeeting from "../components/dashboard/AddUsersToMeeting";
import { Info, Calendar, Clock, ClipboardList, X } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { MdStop } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

const ConferenceRoom = () => {
  const { pathname } = useLocation();
  const { authDetails } = useContext(AuthContext);
  const { conference } = useContext(MeetingContext);
  const [maximizedParticipantId, setMaximizedParticipantId] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const {
    me,
    remoteParticipants,
    presenterId,
    recordingState,
    isScreenSharing,
    recordingStartedAt,
    recordingTimer,
    leave,
    enableScreenShare,
    disableScreenShare,
    startRecording,
    stopRecording,
    removedParticipantsRef,
  } = useConferenceParticipants();

  const handleLeaveMeeting = async () => {
    try {
      await leave();
    } catch (error) {
      console.error("Leave error", error);
    }
  };

  const handleScreenShare = async () => {
    if (!me?.id) return;
    if (presenterId && presenterId !== me.id) return;
    try {
      if (isScreenSharing && presenterId === me.id) {
        await disableScreenShare();
      } else {
        await enableScreenShare();
      }
    } catch (error) {
      console.error("Screen share error", error);
    }
  };

  const toggleRecording = () => {
    const isRecording =
      recordingState === Constants.recordingEvents.RECORDING_STARTED;
    const config = {
      layout: { type: "GRID", priority: "SPEAKER", gridSize: 4 },
      theme: "DARK",
      mode: "video-and-audio",
      quality: "high",
      orientation: "landscape",
    };
    const transcription = {
      enabled: true,
      summary: {
        enabled: true,
        prompt:
          "Write summary in sections like Title, Agenda, Speakers, Action Items, Outlines, Notes and Summary",
      },
    };
    isRecording
      ? stopRecording()
      : startRecording(null, null, config, transcription);
  };

  const isMyMeeting = authDetails?.user?.id === conference?.creator_id;

  return pathname === "/dashboard/conference/room" ? (
    <div className="flex flex-col flex-1 p-6 text-white bg-transparent min-h-screen relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-2">
        <div>
          <p className="text-lg font-semibold">
            {conference?.title || "Conference"}
          </p>

          <AnimatePresence>
            {recordingStartedAt && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-xl px-3 py-1 shadow-lg border border-red-300"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
                <span className="text-xs font-semibold text-gray-800">
                  Recording
                </span>
                {isMyMeeting && (
                  <span className="text-xs font-mono font-bold text-red-600">
                    {recordingTimer}
                  </span>
                )}

                {/* Stop Recording Icon Button */}
                {isMyMeeting && (
                  <button
                    onClick={stopRecording}
                    className="ml-2 p-1 text-red-600 hover:text-red-800 rounded-full transition"
                    title="Stop Recording"
                  >
                    <MdStop size={18} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-[#5C7C2A] text-white text-sm px-2 md:px-4 py-2 rounded-md"
          >
            + Invite Member
          </button>

          {/* View Details Button — text on large screens, icon on small */}
          <button
            onClick={() => setShowDetailsModal(true)}
            className="border border-green-700/50 text-green-300 text-sm px-2 py-2 rounded-md hover:bg-green-900/40 transition-all flex items-center justify-center"
            title="View Details"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Screen Share */}
      {presenterId && (
        <div className="w-full h-[60vh] mb-6 bg-black rounded-md p-2">
          <ScreenShareDisplay
            participantId={presenterId}
            isUser={Number(me?.id) === Number(presenterId)}
          />
        </div>
      )}

      {/* Participants */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-8">
        {me && (
          <ParticipantVideo
            participantId={me.id}
            key={me?.id}
            label="You"
            isMaximized={maximizedParticipantId === me.id}
            onToggleMaximize={() =>
              setMaximizedParticipantId((prev) =>
                prev === me.id ? null : me.id
              )
            }
          />
        )}
        {remoteParticipants.length > 0 ? (
          remoteParticipants.map((p, idx) => (
            <ParticipantVideo
              removedParticipantsRef={removedParticipantsRef}
              key={p.id || idx}
              participantId={p.id}
              label={p.displayName || "Guest"}
              isMaximized={maximizedParticipantId === p.id}
              onToggleMaximize={() =>
                setMaximizedParticipantId((prev) =>
                  prev === p.id ? null : p.id
                )
              }
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">
            Waiting for participants to join...
          </p>
        )}
      </div>

      <ConferenceControl
        handleLeaveMeeting={handleLeaveMeeting}
        handleScreenShare={handleScreenShare}
        isScreenSharing={isScreenSharing}
        me={me}
      />
      {/* {isMyMeeting && recordingStartedAt && (
        <RecordingControlButton
          toggleRecording={toggleRecording}
          recordingState={recordingState}
          recordingTimer={recordingTimer}
        />
      )} */}
      {showAddUserModal && (
        <Modal
          isOpen={showAddUserModal}
          closeModal={() => setShowAddUserModal(false)}
        >
          <AddUsersToMeeting selectedMeeting={conference} />
        </Modal>
      )}
      {showDetailsModal && (
        <Modal
          isOpen={showDetailsModal}
          closeModal={() => setShowDetailsModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0b1a0b] shadow-2xl border border-green-800/10 p-6 text-white max-w-lg w-80 mx-auto relative"
          >
            {/* Header */}
            <div className="pb-4 border-b border-green-800/40">
              <h3 className="text-2xl font-bold text-green-300 tracking-wide">
                {conference?.title || "Meeting Details"}
              </h3>
              {conference?.subject && (
                <p className="text-sm text-gray-400 mt-1">
                  {conference.subject}
                </p>
              )}
            </div>

            {/* Details */}
            <div className="mt-5 space-y-4 text-sm">
              {conference?.agenda && (
                <div className="flex items-start gap-3">
                  <ClipboardList className="text-green-500 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold text-green-400">Agenda</p>
                    <p className="text-gray-200 mt-0.5 leading-relaxed">
                      {conference.agenda}
                    </p>
                  </div>
                </div>
              )}

              {conference?.startdatetime && (
                <div className="flex items-start gap-3">
                  <Clock className="text-green-500 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold text-green-400">Start Time</p>
                    <p className="text-gray-200 mt-0.5">
                      {new Date(conference.startdatetime).toLocaleString(
                        undefined,
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-between items-center">
              {/* Recording Toggle */}
              {isMyMeeting && (
                <button
                  onClick={toggleRecording}
                  disabled={
                    recordingState ===
                      Constants.recordingEvents.RECORDING_STARTING ||
                    recordingState ===
                      Constants.recordingEvents.RECORDING_STOPPING
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md ${
                    recordingState ===
                    Constants.recordingEvents.RECORDING_STARTED
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  } ${
                    recordingState ===
                      Constants.recordingEvents.RECORDING_STARTING ||
                    recordingState ===
                      Constants.recordingEvents.RECORDING_STOPPING
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {recordingState ===
                    Constants.recordingEvents.RECORDING_STARTING && (
                    <span className="animate-pulse">Starting...</span>
                  )}
                  {recordingState ===
                    Constants.recordingEvents.RECORDING_STOPPING && (
                    <span className="animate-pulse">Stopping...</span>
                  )}
                  {recordingState ===
                    Constants.recordingEvents.RECORDING_STARTED &&
                    "Stop Recording"}
                  {recordingState ===
                    Constants.recordingEvents.RECORDING_STOPPED &&
                    "Start Recording"}
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 rounded-md text-sm font-medium transition-all shadow-md hover:shadow-lg"
              >
                <Calendar size={16} />
                Close
              </button>
            </div>
          </motion.div>
        </Modal>
      )}
    </div>
  ) : (
    <PictureInPicture
      removedParticipantsRef={removedParticipantsRef}
      maximizedParticipantId={maximizedParticipantId}
      me={me}
      remoteParticipants={remoteParticipants}
      handleLeaveMeeting={handleLeaveMeeting}
    />
  );
};

export default ConferenceRoom;

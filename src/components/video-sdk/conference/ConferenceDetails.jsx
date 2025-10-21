import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";
import { ClipboardList } from "lucide-react";
import { Constants } from "@videosdk.live/react-sdk";
import { formatUtcToLocal } from "../../../utils/formmaters";
const ConferenceDetails = ({
  conference,
  setShowDetailsModal,
  toggleRecording,
  isMyMeeting,
  recordingState,
}) => {
  return (
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
          <p className="text-sm text-gray-400 mt-1">{conference.subject}</p>
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
                {formatUtcToLocal(conference.startdatetime)}
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
              recordingState === Constants.recordingEvents.RECORDING_STARTING ||
              recordingState === Constants.recordingEvents.RECORDING_STOPPING
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md ${
              recordingState === Constants.recordingEvents.RECORDING_STARTED
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            } ${
              recordingState === Constants.recordingEvents.RECORDING_STARTING ||
              recordingState === Constants.recordingEvents.RECORDING_STOPPING
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
            {recordingState === Constants.recordingEvents.RECORDING_STARTED &&
              "Stop Recording"}
            {recordingState === Constants.recordingEvents.RECORDING_STOPPED &&
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
  );
};

export default ConferenceDetails;

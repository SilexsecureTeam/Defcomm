import React from "react";
import { Constants } from "@videosdk.live/react-sdk";
import { FaCircle, FaStopCircle } from "react-icons/fa";

const RecordingControlButton = ({ toggleRecording, recordingState, recordingTimer }) => {
  const isRecording = recordingState === Constants.recordingEvents.RECORDING_STARTED;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {isRecording && (
        <div className="text-xs text-red-500 font-medium bg-white rounded-full px-3 py-1 shadow">
          ● Recording {recordingTimer}
        </div>
      )}
      <button
        onClick={toggleRecording}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors ${
          isRecording ? "bg-red-600" : "bg-green-600"
        }`}
        title={isRecording ? "Stop Recording" : "Start Recording"}
      >
        {isRecording ? (
          <FaStopCircle className="w-6 h-6 text-white" />
        ) : (
          <FaCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};

export default RecordingControlButton;

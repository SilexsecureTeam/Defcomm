import React, { useEffect, useState } from "react";
import { useMeeting, Constants } from "@videosdk.live/react-sdk";
import { toast } from "react-toastify";

const RecordingControlButton = () => {
  const { startRecording, stopRecording, recordingState } = useMeeting();

  const [recordingStartedAt, setRecordingStartedAt] = useState(null);
  const [recordingTimer, setRecordingTimer] = useState("00:00");

  const toggleRecording = () => {
    const isRecording = recordingState === Constants.recordingEvents.RECORDING_STARTED;

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
        prompt: "Write summary in sections like Title, Agenda, Speakers, Action Items, Outlines, Notes and Summary",
      },
    };

    if (isRecording) {
      stopRecording();
    } else {
      startRecording(null, null, config, transcription);
    }
  };

  useEffect(() => {
    let interval;
    if (recordingStartedAt) {
      interval = setInterval(() => {
        const elapsedMs = Date.now() - recordingStartedAt;
        const totalSeconds = Math.floor(elapsedMs / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        setRecordingTimer(`${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recordingStartedAt]);

  useEffect(() => {
    const handleRecordingStateChanged = ({ status }) => {
      if (status === Constants.recordingEvents.RECORDING_STARTING) {
        toast.info("Recording is starting...");
      } else if (status === Constants.recordingEvents.RECORDING_STARTED) {
        toast.success("Recording started.");
        setRecordingStartedAt(Date.now());
      } else if (status === Constants.recordingEvents.RECORDING_STOPPING) {
        toast.info("Recording is stopping...");
      } else if (status === Constants.recordingEvents.RECORDING_STOPPED) {
        toast.success("Recording stopped.");
        setRecordingStartedAt(null);
        setRecordingTimer("00:00");
      }
    };

    const unsubscribe = useMeeting({ onRecordingStateChanged: handleRecordingStateChanged });
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {recordingStartedAt && (
        <p className="text-sm text-red-500">● Recording {recordingTimer}</p>
      )}
      <button
        onClick={toggleRecording}
        className={`px-4 py-2 rounded-full text-white text-sm shadow-lg transition ${
          recordingState === Constants.recordingEvents.RECORDING_STARTED
            ? "bg-red-600"
            : "bg-green-600"
        }`}
      >
        {recordingState === Constants.recordingEvents.RECORDING_STARTED
          ? "Stop Recording"
          : "Start Recording"}
      </button>
    </div>
  );
};

export default RecordingControlButton;

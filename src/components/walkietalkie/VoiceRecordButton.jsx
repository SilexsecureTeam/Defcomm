// components/VoiceRecordButton.jsx
import { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { MdSend, MdCancel } from "react-icons/md";
import useComm from "../../hooks/useComm";
import buttonSound from "../../assets/audio/radio-button.mp3";

const playClickSound = () => {
  const audio = new Audio(buttonSound);
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

const VoiceRecordButton = ({ channelId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const { broadcastMessage } = useComm();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaTracks();
    };
  }, []);

  const stopMediaTracks = () => {
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const startRecording = async () => {
    try {
      playClickSound();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        stopMediaTracks();
        const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setIsRecording(false);
        clearInterval(timerRef.current);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      playClickSound();
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setDuration(0);
  };

  const handleSend = () => {
    if (!audioBlob || !channelId) return;

    const formData = new FormData();
    formData.append("channel", channelId);
    formData.append("record", audioBlob, "voice.webm");

    broadcastMessage.mutateAsync(formData, {
      onSuccess: () => {
        setAudioBlob(null);
        setDuration(0);
      },
    });
  };

  const formatDuration = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-3">
      {/* Recording UI */}
      {isRecording && (
        <div className="flex flex-col items-center text-red-400 animate-pulse">
          <p className="text-xs font-semibold">Recording...</p>
          <p className="text-sm">{formatDuration(duration)}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        {!isRecording && !audioBlob && (
          <button
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition flex items-center justify-center"
            onClick={startRecording}
          >
            <FaMicrophone size={24} />
          </button>
        )}

        {isRecording && (
          <button
            className="p-4 rounded-full bg-yellow-500 hover:bg-yellow-600 transition flex items-center justify-center"
            onClick={stopRecording}
          >
            <FaStop size={24} />
          </button>
        )}

        {audioBlob && (
          <>
            <button
              className="p-4 rounded-full bg-green-600 hover:bg-green-700 transition flex items-center justify-center disabled:opacity-50"
              onClick={handleSend}
              disabled={broadcastMessage.isPending}
            >
              {broadcastMessage.isPending ? (
                <div className="loader border-2 border-white border-t-transparent w-5 h-5 rounded-full animate-spin" />
              ) : (
                <MdSend size={24} />
              )}
            </button>
            <button
              className="p-4 rounded-full bg-gray-500 hover:bg-gray-600 transition flex items-center justify-center"
              onClick={cancelRecording}
            >
              <MdCancel size={24} />
            </button>
          </>
        )}
      </div>

      <p className="text-xs text-gray-300">
        {!audioBlob && !isRecording && "Tap to record"}
        {isRecording && "Tap stop to finish"}
        {audioBlob && "Send or cancel"}
      </p>
    </div>
  );
};

export default VoiceRecordButton;

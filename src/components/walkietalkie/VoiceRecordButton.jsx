// components/VoiceRecordButton.jsx
import { useState, useRef, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa6";
import { MdSend } from "react-icons/md";
import useComm from "../../hooks/useComm";

const VoiceRecordButton = ({ channelId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const { broadcastMessage } = useComm();

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSend = () => {
    if (!audioBlob || !channelId) return;
    const formData = new FormData();
    formData.append("channel", channelId);
    formData.append("record", audioBlob, "voice.webm");

    broadcastMessage.mutateAsync(formData, {
      onSuccess: () => {
        setAudioBlob(null);
      },
    });
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className={`p-4 rounded-full transition ${
          isRecording ? "bg-yellow-500" : "bg-red-600"
        }`}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        onClick={audioBlob ? handleSend : undefined}
      >
        {audioBlob ? (
          broadcastMessage.isPending ? (
            <div className="loader border-2 border-white border-t-transparent w-6 h-6 rounded-full animate-spin" />
          ) : (
            <MdSend size={28} />
          )
        ) : (
          <FaMicrophone size={28} />
        )}
      </button>
      <p className="text-xs mt-1 text-white">
        {audioBlob ? "Tap to send" : "Hold to talk"}
      </p>
    </div>
  );
};

export default VoiceRecordButton;

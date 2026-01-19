import { useState, useRef, useEffect, useContext, useCallback } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaStop } from "react-icons/fa";
import { MdSend, MdCancel } from "react-icons/md";
import useComm from "../../hooks/useComm";
import buttonSound from "../../assets/audio/radio-button.mp3";
import { CommContext } from "../../context/CommContext";

/**
 * Platform-safe audio click
 */
const playClickSoundSafe = () => {
  try {
    if (navigator.userActivation?.isActive) {
      const audio = new Audio(buttonSound);
      audio.volume = 0.6;
      audio.play().catch(() => {});
    }
  } catch {
    // Never allow audio to crash WebView
  }
};

const VoiceRecordButton = ({ channelId, disabled }) => {
  const { voiceMode } = useContext(CommContext);
  const { broadcastMessage } = useComm();

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const isStartingRef = useRef(false);

  /**
   * Cleanup (runs on unmount AND on failure)
   */
  const stopMediaTracks = useCallback(() => {
    try {
      streamRef.current?.getTracks()?.forEach((t) => t.stop());
    } catch {}
    streamRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      stopMediaTracks();
    };
  }, [stopMediaTracks]);

  /**
   * Start recording (fully guarded)
   */
  const startRecording = async () => {
    if (disabled || isRecording || isStartingRef.current) {
      return;
    }

    isStartingRef.current = true;

    try {
      playClickSoundSafe();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        clearInterval(timerRef.current);
        stopMediaTracks();

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setIsRecording(false);

        if (voiceMode === "hold") {
          handleSend(blob);
        }
      };

      recorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access failed:", err);
      stopMediaTracks();
    } finally {
      isStartingRef.current = false;
    }
  };

  /**
   * Stop recording (safe)
   */
  const stopRecording = () => {
    if (!isRecording) return;

    try {
      playClickSoundSafe();
      mediaRecorderRef.current?.stop();
    } catch {
      stopMediaTracks();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    clearInterval(timerRef.current);
    stopMediaTracks();
    setIsRecording(false);
    setAudioBlob(null);
    setDuration(0);
  };

  const handleSend = async (blobOverride = null) => {
    const blobToSend = blobOverride || audioBlob;
    if (!blobToSend || !channelId) return;

    const formData = new FormData();
    formData.append("channel", channelId);
    formData.append("record", blobToSend, "voice.webm");

    try {
      await broadcastMessage.mutateAsync(formData);
      setAudioBlob(null);
      setDuration(0);
    } catch (err) {
      console.error("Failed to send voice message:", err);
    }
  };

  const formatDuration = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="min-h-10">
        {isRecording && (
          <div className="text-red-400 animate-pulse text-center">
            <p className="text-xs font-semibold">Recording…</p>
            <p className="text-sm">{formatDuration(duration)}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* TAP MODE */}
        {voiceMode === "tap" && !isRecording && !audioBlob && (
          <button
            className="p-4 rounded-full bg-red-600"
            onClick={startRecording}
            disabled={disabled}
          >
            <FaMicrophone size={24} />
          </button>
        )}

        {voiceMode === "tap" && isRecording && (
          <button
            className="p-4 rounded-full bg-yellow-500"
            onClick={stopRecording}
          >
            <FaStop size={24} />
          </button>
        )}

        {/* HOLD MODE (mouse events only – macOS safe) */}
        {voiceMode === "hold" && (
          <button
            className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            disabled={disabled || broadcastMessage.isPending}
          >
            <FaMicrophone size={24} className="text-white" />
            {disabled && (
              <FaMicrophoneSlash size={16} className="absolute text-gray-200" />
            )}
          </button>
        )}

        {audioBlob && voiceMode === "tap" && (
          <>
            <button
              className="p-4 rounded-full bg-green-600"
              onClick={() => handleSend()}
              disabled={broadcastMessage.isPending}
            >
              <MdSend size={24} />
            </button>
            <button
              className="p-4 rounded-full bg-gray-500"
              onClick={cancelRecording}
            >
              <MdCancel size={24} />
            </button>
          </>
        )}
      </div>

      <p className="text-xs text-center min-h-[1.25rem]">
        {disabled ? (
          <span className="text-red-400 font-semibold">
            Someone else is speaking
          </span>
        ) : isRecording ? (
          <span className="text-gray-300">Release to send</span>
        ) : audioBlob ? (
          <span className="text-gray-300">Send or cancel</span>
        ) : voiceMode === "hold" ? (
          <span className="text-gray-300">Hold mic to record</span>
        ) : (
          <span className="text-gray-300">Tap mic to start</span>
        )}
      </p>
    </div>
  );
};

export default VoiceRecordButton;

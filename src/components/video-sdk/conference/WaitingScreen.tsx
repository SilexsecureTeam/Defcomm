import { useEffect, useState, useContext } from "react";
import CountdownTimer from "./CountdownTimer";
import HeaderBar from "./HeaderBar";
import { useNavigate } from "react-router-dom";
import { MeetingContext } from "../../../context/MeetingContext";
import { useMeeting } from "@videosdk.live/react-sdk";
import { formatUtcToLocal } from "../../../utils/formmaters";
import { AuthContext } from "../../../context/AuthContext";
import { onPrompt } from "../../../utils/notifications/onPrompt";

type WaitingScreenProps = {
  waitingScreen: {
    agenda?: string;
    duration?: number | null;
    id: string;
    meeting_id: string;
    meeting_link: string;
    number_join?: number | null;
    startdatetime: string;
    subject?: string;
    title: string;
    _source?: string;
  };
  onJoin: () => void;
  onCancel: () => void;
  isJoining: boolean;
};

const WaitingScreen = ({
  waitingScreen,
  onJoin,
  onCancel,
  isJoining,
}: WaitingScreenProps) => {
  const { authDetails } = useContext(AuthContext);
  const startTime = new Date(waitingScreen.startdatetime).getTime();
  const [countdown, setCountdown] = useState("");
  const [showEndMeetingModal, setShowEndMeetingModal] = useState(false);
  const [pendingJoin, setPendingJoin] = useState(false);
  const { leave } = useMeeting();
  const navigate = useNavigate();
  const {
    conference,
    providerMeetingId,
    setConference,
    setShowConference,
    setIsScreenSharing,
  } = useContext(MeetingContext);

  const handleLeaveMeeting = async () => {
    await leave();
    setConference(null);
    setShowConference(false);
    setIsScreenSharing(false);
    navigate("/dashboard/conference");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = startTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setCountdown("Meeting is starting...");
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);
  const isMyMeeting = authDetails?.user?.id === waitingScreen?.creator_id;

  const handleJoinClick = () => {
    const now = Date.now();

    // Ensure consistent UTC parsing
    const meetingStart = new Date(
      waitingScreen.startdatetime + " UTC"
    ).getTime();

    const meetingDurationMs = (waitingScreen.duration || 0) * 60 * 1000;
    const meetingEnd = meetingStart + meetingDurationMs;

    // Meeting hasn't started yet

    if (!isMyMeeting) {
      if (now < meetingStart) {
        onPrompt({
          title: "Cannot Join Yet",
          message: "You can't join yet. The meeting hasn't started.",
        });
        return;
      }
    } else {
      if (now < meetingStart) {
        onPrompt({
          title: "Early Join",
          message: "You are the creator, you can join early.",
        });
      }
    }

    // Meeting already ended
    if (meetingDurationMs > 0 && now > meetingEnd) {
      onPrompt({
        title: "Meeting Ended",
        message: "You can no longer join. The meeting has ended.",
      });
      return;
    }

    // If user is already in another meeting
    if (conference && providerMeetingId) {
      setShowEndMeetingModal(true);
    } else {
      onJoin();
    }
  };

  const handleEndAndJoin = async () => {
    setShowEndMeetingModal(false);
    setPendingJoin(true);
    await handleLeaveMeeting();
    onJoin();
  };

  return (
    <>
      <HeaderBar onBack={() => navigate("/dashboard/conference/meetings")} />
      <div className="h-screen bg-gradient-to-br from-[#0A0F0A] via-[#111C11] to-[#0B130B] text-white flex items-center justify-center relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.3)_1px,transparent_1px)] bg-[length:24px_24px]" />

        <div className="relative bg-[#111A11]/90 border border-oliveGreen/40 shadow-2xl p-8 rounded-2xl max-w-md w-[90%] text-center backdrop-blur-sm">
          <h2 className="text-3xl font-extrabold text-green-300 mb-2">
            {waitingScreen.title}
            {isMyMeeting ? (
              <span className="px-2 py-1 text-xs bg-green-700 text-white rounded-full ml-1">
                Creator
              </span>
            ) : (
              <span className="px-2 py-1 text-xs bg-gray-600 text-white rounded-full ml-1">
                Guest
              </span>
            )}
          </h2>

          {waitingScreen.subject && (
            <p className="text-green-300/70 font-medium mb-1">
              {waitingScreen.subject}
            </p>
          )}

          {waitingScreen.agenda && (
            <p className="text-gray-400 italic mb-3">{waitingScreen.agenda}</p>
          )}

          <p className="text-gray-400 text-sm">
            Starts at:{" "}
            <span className="text-green-300 font-semibold">
              {formatUtcToLocal(waitingScreen.startdatetime)}
            </span>
          </p>

          <div className="mt-4">
            <div className="text-lg font-semibold text-green-400">
              <CountdownTimer startTime={waitingScreen.startdatetime} />
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleJoinClick}
              disabled={isJoining || pendingJoin}
              className="px-6 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg shadow-green-800/40 disabled:opacity-70"
            >
              {isJoining || pendingJoin ? "Joining..." : "Join Meeting"}
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-lg font-semibold border border-green-700/50 text-green-300 hover:bg-green-900/40 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showEndMeetingModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1A231A] border border-green-800/50 text-white p-6 rounded-lg max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-xl font-semibold text-green-300">
              Leave Current Meeting?
            </h3>
            <p className="text-gray-300">
              You are already in another meeting. Do you want to end it and join
              this one?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowEndMeetingModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEndAndJoin}
                disabled={isJoining || pendingJoin}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
              >
                End and Join
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WaitingScreen;

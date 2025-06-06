import React, { useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import HeaderBar from "./HeaderBar";
import { useNavigate } from "react-router-dom";

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
  const startTime = new Date(waitingScreen.startdatetime).getTime();
  const [countdown, setCountdown] = useState("");
  const navigate = useNavigate();
  
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

  return (
    <>
      <HeaderBar onBack={()=> navigate('/dashboard/conference')} />
      <div className="h-screen bg-gray-900 text-white flex items-center justify-center z-50">
        <div className="bg-[#1F2937] p-8 rounded-2xl shadow-2xl max-w-md w-[90%] text-center space-y-5 border border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Meeting ID: {waitingScreen.meeting_id}</div>
          <h2 className="text-3xl font-bold">{waitingScreen.title}</h2>
          {waitingScreen.agenda && (
            <p className="text-gray-300 text-base italic">{waitingScreen.agenda}</p>
          )}
          {waitingScreen.subject && (
            <p className="text-gray-400 text-sm">Subject: {waitingScreen.subject}</p>
          )}
          <p className="text-gray-400 text-sm">
            Starts at: {new Date(waitingScreen.startdatetime).toLocaleString()}
          </p>

          <div className="text-lg font-semibold text-yellow-400 mt-2">
            <CountdownTimer startTime={waitingScreen.startdatetime} />
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition"
              onClick={onJoin}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join Meeting"}
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WaitingScreen;

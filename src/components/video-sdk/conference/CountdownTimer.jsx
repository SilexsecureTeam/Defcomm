import React, { useEffect, useState, useRef } from "react";
import { FiLoader } from "react-icons/fi";

const CountdownTimer = ({ startTime, durationMinutes = 60 }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [status, setStatus] = useState("loading");
  const [statusColor, setStatusColor] = useState("text-gray-400");
  const intervalRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    // --- Parse backend UTC properly ---
    // Ensure it's treated as UTC
    const startUTC = new Date(startTime.replace(" ", "T") + "Z");
    const endUTC = new Date(startUTC.getTime() + durationMinutes * 60000);

    const updateCountdown = () => {
      if (!mounted) return;
      const now = new Date(); // user's local time

      if (now < startUTC) {
        const diff = startUTC - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        parts.push(`${seconds}s`);

        setStatus("countdown");
        setTimeLeft(parts.join(" "));
        setStatusColor(
          days === 0 && hours === 0 && minutes <= 5
            ? "text-red-400 font-bold"
            : "text-green-400"
        );
      } else if (now >= startUTC && now < endUTC) {
        setStatus("ongoing");
        setTimeLeft("Ongoing");
        setStatusColor("text-blue-400 font-semibold");
      } else {
        setStatus("ended");
        setTimeLeft("Ended");
        setStatusColor("text-gray-400 font-medium");
        clearInterval(intervalRef.current);
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      mounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTime, durationMinutes]);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
        <FiLoader className="animate-spin" />
      </div>
    );
  }

  return (
    <p className={`text-sm mt-2 transition-colors duration-300 ${statusColor}`}>
      {status === "countdown" ? `Starts in: ${timeLeft}` : timeLeft}
    </p>
  );
};

export default CountdownTimer;

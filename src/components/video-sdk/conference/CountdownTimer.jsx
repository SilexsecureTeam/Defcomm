import React, { useEffect, useState } from "react";

const CountdownTimer = ({ startTime, durationMinutes = 60 }) => {
  const [status, setStatus] = useState("countdown"); // "countdown" | "ongoing" | "ended"
  const [timeLeft, setTimeLeft] = useState("");
  const [statusColor, setStatusColor] = useState("text-green-400");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(start.getTime() + durationMinutes * 60000); // default 60 mins

      if (now < start) {
        // Meeting hasn't started
        const diff = start - now;

        const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 7);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const parts = [];
        if (weeks > 0) parts.push(`${weeks}w`);
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds >= 0) parts.push(`${seconds}s`);

        setStatus("countdown");
        setTimeLeft(parts.join(" "));

        // Color warning thresholds
        if (weeks === 0 && days === 0 && hours === 0 && minutes <= 5) {
          setStatusColor("text-red-400 font-bold");
        } else if (weeks === 0 && days === 0 && hours === 0) {
          setStatusColor("text-yellow-400");
        } else {
          setStatusColor("text-green-400");
        }

      } else if (now >= start && now < end) {
        // Meeting is ongoing
        setStatus("ongoing");
        setTimeLeft("Ongoing");
        setStatusColor("text-blue-400 font-semibold");
      } else {
        // Meeting ended
        setStatus("ended");
        setTimeLeft("Ended");
        setStatusColor("text-gray-400 font-medium");
        clearInterval(interval); // stop timer once ended
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationMinutes]);

  return (
    <p className={`text-sm mt-2 ${statusColor}`}>
      {status === "countdown" ? `Starts in: ${timeLeft}` : timeLeft}
    </p>
  );
};

export default CountdownTimer;

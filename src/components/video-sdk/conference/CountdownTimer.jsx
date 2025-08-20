import React, { useEffect, useState } from "react";

const CountdownTimer = ({ startTime, durationMinutes = 60 }) => {
  const [status, setStatus] = useState("countdown"); // "countdown" | "ongoing" | "ended"
  const [timeLeft, setTimeLeft] = useState("");
  const [statusColor, setStatusColor] = useState("text-green-400");

  useEffect(() => {
    const [datePart, timePart] = startTime.split(" ");
    // Force UTC by appending "Z" (or you could append +01:00 for Nigeria time)
    const startUTC = new Date(`${datePart}T${timePart}Z`);
    const endUTC = new Date(startUTC.getTime() + durationMinutes * 60000);

    const interval = setInterval(() => {
      const nowUTC = new Date(
        Date.UTC(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate(),
          new Date().getUTCHours(),
          new Date().getUTCMinutes(),
          new Date().getUTCSeconds()
        )
      );

      if (nowUTC < startUTC) {
        const diff = startUTC - nowUTC;

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

        if (weeks === 0 && days === 0 && hours === 0 && minutes <= 5) {
          setStatusColor("text-red-400 font-bold");
        } else if (weeks === 0 && days === 0 && hours === 0) {
          setStatusColor("text-yellow");
        } else {
          setStatusColor("text-green-400");
        }
      } else if (nowUTC >= startUTC && nowUTC < endUTC) {
        setStatus("ongoing");
        setTimeLeft("Ongoing");
        setStatusColor("text-blue-400 font-semibold");
      } else {
        setStatus("ended");
        setTimeLeft("Ended");
        setStatusColor("text-gray-400 font-medium");
        clearInterval(interval);
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

import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ startTime }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [statusColor, setStatusColor] = useState('text-green-400');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(startTime);
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Starting soon...');
        setStatusColor('text-yellow-400 font-semibold');
        clearInterval(interval);
        return;
      }

      const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
      const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 7);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      let newColor = 'text-green-400';
      if (weeks === 0 && days === 0 && hours === 0 && minutes <= 5) {
        newColor = 'text-red-400 font-bold';
      } else if (weeks === 0 && days === 0 && hours === 0) {
        newColor = 'text-yellow-300';
      }

      setStatusColor(newColor);
      setTimeLeft(
        `${weeks}w ${days}d ${hours}h ${minutes}m ${seconds}s`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <p className={`text-sm mt-2 ${statusColor}`}>
      Starts in: {timeLeft}
    </p>
  );
};

export default CountdownTimer;

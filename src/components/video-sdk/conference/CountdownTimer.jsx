import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ startTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(startTime);
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Starting soon...');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return <p className="text-sm text-yellow-300 mt-2">Starts in: {timeLeft}</p>;
};

export default CountdownTimer;

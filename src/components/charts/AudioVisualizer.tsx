import React from "react";
import { motion } from "framer-motion";

interface AudioVisualizerProps {
  progress?: number;
  fillColor?: string;
  strokeColor?: string;
  width?: number;
  barCount?: number;
}

const AudioVisualizer = ({
  progress = 50,
  fillColor = "#00FF00",
  strokeColor = "transparent",
  width = 150,
  barCount = 40,
}: AudioVisualizerProps) => {
  const progressWidth = (progress / 100) * width;
  const height = 30;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: barCount }).map((_, index) => {
        const barHeight = Math.random() * height * 0.8 + 5;

        return (
          <motion.rect
            key={index}
            x={(index / barCount) * width}
            y={height - barHeight}
            width={Math.max(1, width / barCount - 1.5)}
            height={barHeight}
            fill="#CCC"
            rx="1"
            animate={{
              height: [barHeight * 0.5, barHeight, barHeight * 0.7, barHeight * 1.1, barHeight * 0.9],
              y: [
                height - barHeight * 0.5,
                height - barHeight,
                height - barHeight * 0.7,
                height - barHeight * 1.1,
                height - barHeight * 0.9,
              ],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
              delay: index * 0.02,
            }}
          />
        );
      })}

      <clipPath id="waveClip">
        <rect width={progressWidth} height={height} />
      </clipPath>

      {Array.from({ length: barCount }).map((_, index) => {
        const barHeight = Math.random() * height * 0.8 + 5;

        return (
          <motion.rect
            key={`progress-${index}`}
            x={(index / barCount) * width}
            y={height - barHeight}
            width={Math.max(1, width / barCount - 1.5)}
            height={barHeight}
            fill={!fillColor ? "#00FF00" : fillColor}
            stroke={!strokeColor ? "transparent" : strokeColor }
            strokeWidth="0.3"
            rx="1"
            clipPath="url(#waveClip)"
            animate={{
              height: [barHeight * 0.5, barHeight, barHeight * 0.7, barHeight * 1.1, barHeight * 0.9],
              y: [
                height - barHeight * 0.5,
                height - barHeight,
                height - barHeight * 0.7,
                height - barHeight * 1.1,
                height - barHeight * 0.9,
              ],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
              delay: index * 0.02,
            }}
          />
        );
      })}
    </svg>
  );
};

export default AudioVisualizer;

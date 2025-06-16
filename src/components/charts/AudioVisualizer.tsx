import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface AudioVisualizerProps {
  progress?: number;
  fillColor?: string;
  strokeColor?: string;
  width?: number;
  height?: number;
  barCount?: number;
  shouldAnimate?: boolean;
}

const AudioVisualizer = ({
  progress = 50,
  fillColor = "#00FF00",
  strokeColor = "transparent",
  width = 150,
  height = 30,
  barCount = 40,
  shouldAnimate = true,
}: AudioVisualizerProps) => {
  const progressWidth = (progress / 100) * width;

  // Memoize random heights for consistent render
  const barHeights = useMemo(() => {
    return Array.from({ length: barCount }).map(() =>
      Math.random() * height * 0.8 + 5
    );
  }, [barCount, height]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Audio visualizer"
    >
      <defs>
        <clipPath id="waveClip">
          <rect width={progressWidth} height={height} />
        </clipPath>
      </defs>

      {/* Background bars */}
      {barHeights.map((barHeight, index) => (
        <motion.rect
          key={`bg-${index}`}
          x={(index / barCount) * width}
          y={height - barHeight}
          width={Math.max(1, width / barCount - 1.5)}
          height={barHeight ?? 10}
          fill="#CCC"
          rx="1"
          animate={
            shouldAnimate
              ? {
                  height: [
                    barHeight * 0.5,
                    barHeight,
                    barHeight * 0.7,
                    barHeight * 1.1,
                    barHeight * 0.9,
                  ],
                  y: [
                    height - barHeight * 0.5,
                    height - barHeight,
                    height - barHeight * 0.7,
                    height - barHeight * 1.1,
                    height - barHeight * 0.9,
                  ],
                }
              : undefined
          }
          transition={{
            duration: 1,
            repeat: shouldAnimate ? Infinity : 0,
            ease: "easeInOut",
            repeatType: "mirror",
            delay: index * 0.02,
          }}
        />
      ))}

      {/* Foreground progress bars */}
      {barHeights.map((barHeight, index) => (
        <motion.rect
          key={`progress-${index}`}
          x={(index / barCount) * width}
          y={height - barHeight}
          width={Math.max(1, width / barCount - 1.5)}
          height={barHeight}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="0.3"
          rx="1"
          clipPath="url(#waveClip)"
          animate={
            shouldAnimate
              ? {
                  height: [
                    barHeight * 0.5,
                    barHeight,
                    barHeight * 0.7,
                    barHeight * 1.1,
                    barHeight * 0.9,
                  ],
                  y: [
                    height - barHeight * 0.5,
                    height - barHeight,
                    height - barHeight * 0.7,
                    height - barHeight * 1.1,
                    height - barHeight * 0.9,
                  ],
                }
              : undefined
          }
          transition={{
            duration: 1,
            repeat: shouldAnimate ? Infinity : 0,
            ease: "easeInOut",
            repeatType: "mirror",
            delay: index * 0.02,
          }}
        />
      ))}
    </svg>
  );
};

export default AudioVisualizer;

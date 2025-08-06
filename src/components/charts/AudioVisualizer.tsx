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
  fillColor = "#7CFC00", // military bright green
  strokeColor = "rgba(0,255,0,0.4)",
  width = 200,
  height = 40,
  barCount = 50,
  shouldAnimate = true,
}: AudioVisualizerProps) => {
  const progressWidth = (progress / 100) * width;

  // Memoize random heights for consistent render
  const barHeights = useMemo(() => {
    return Array.from({ length: barCount }).map(
      () => Math.random() * height * 0.8 + height * 0.2
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
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Radar grid pattern */}
        <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path
            d="M 8 0 L 0 0 0 8"
            fill="none"
            stroke="rgba(0,255,0,0.15)"
            strokeWidth="0.5"
          />
        </pattern>

        {/* Clip progress area */}
        <clipPath id="waveClip">
          <rect width={progressWidth} height={height} />
        </clipPath>
      </defs>

      {/* Background grid */}
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Radar sweep line */}
      <motion.line
        x1="0"
        y1="0"
        x2="0"
        y2={height}
        stroke="rgba(0,255,0,0.3)"
        strokeWidth="2"
        animate={{ x1: [0, width], x2: [0, width] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Background bars */}
      {barHeights.map((barHeight, index) => (
        <motion.rect
          key={`bg-${index}`}
          x={(index / barCount) * width}
          y={height - barHeight}
          width={Math.max(1, width / barCount - 1.5)}
          height={barHeight}
          fill="rgba(0,255,0,0.15)"
          rx="1"
        />
      ))}

      {/* Foreground bars with clipping */}
      {barHeights.map((barHeight, index) => (
        <motion.rect
          key={`progress-${index}`}
          x={(index / barCount) * width}
          y={height - barHeight}
          width={Math.max(1, width / barCount - 1.5)}
          height={barHeight}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="0.4"
          rx="1"
          clipPath="url(#waveClip)"
          animate={
            shouldAnimate
              ? {
                  height: [
                    barHeight * 0.6,
                    barHeight,
                    barHeight * 0.75,
                    barHeight * 1.05,
                    barHeight * 0.85,
                  ],
                  y: [
                    height - barHeight * 0.6,
                    height - barHeight,
                    height - barHeight * 0.75,
                    height - barHeight * 1.05,
                    height - barHeight * 0.85,
                  ],
                }
              : undefined
          }
          transition={{
            duration: 0.9,
            repeat: shouldAnimate ? Infinity : 0,
            ease: "easeInOut",
            repeatType: "mirror",
            delay: index * 0.015,
          }}
        />
      ))}
    </svg>
  );
};

export default AudioVisualizer;

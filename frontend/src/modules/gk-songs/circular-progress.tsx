"use client";

/**
 * CircularProgress — SVG-based circular progress ring with draggable seek handle.
 * Wraps the VinylRecord inside the progress ring.
 */

import { useCallback, useRef } from "react";
import { fmtTime } from "./use-music-player";
import { VinylRecord, getVinylVariant } from "./vinyl-record";
import type { SongEntry } from "./songs-data";

interface CircularProgressProps {
  song: SongEntry;
  currentTime: number;
  duration: number;
  spinning: boolean;
  onSeek: (seconds: number) => void;
  size?: number;
}

export function CircularProgress({
  song,
  currentTime,
  duration,
  spinning,
  onSeek,
  size = 280,
}: CircularProgressProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
  const outerR = size / 2 - 12;
  const circumference = 2 * Math.PI * outerR;
  const strokeDashoffset = circumference * (1 - progress);
  const variant = getVinylVariant(song.category);

  // Handle position for the drag handle
  const handleAngle = progress * 2 * Math.PI - Math.PI / 2;
  const hx = size / 2 + Math.cos(handleAngle) * outerR;
  const hy = size / 2 + Math.sin(handleAngle) * outerR;

  const getTimeFromMouse = useCallback(
    (clientX: number, clientY: number): number => {
      const svg = svgRef.current;
      if (!svg || duration <= 0) return 0;
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(clientY - cy, clientX - cx);
      // atan2 gives -pi to pi; shift so 0 = top (-pi/2)
      let pct = (angle + Math.PI / 2) / (2 * Math.PI);
      if (pct < 0) pct += 1;
      return pct * duration;
    },
    [duration],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDragging.current = true;
      onSeek(getTimeFromMouse(e.clientX, e.clientY));
    },
    [getTimeFromMouse, onSeek],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      onSeek(getTimeFromMouse(e.clientX, e.clientY));
    },
    [getTimeFromMouse, onSeek],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      {/* Ambient glow behind */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-20"
        style={{ background: song.ambientColor }}
        aria-hidden
      />

      {/* SVG ring and handle */}
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        style={{ cursor: duration > 0 ? "pointer" : "default" }}
        onPointerDown={duration > 0 ? handlePointerDown : undefined}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        aria-label={`Seek: ${fmtTime(currentTime)} of ${fmtTime(duration)}`}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={Math.max(1, duration)}
        aria-valuenow={currentTime}
      >
        {/* Background track ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerR}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={6}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerR}
          fill="none"
          stroke={song.ambientColor}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 0.3s linear",
            filter: `drop-shadow(0 0 6px ${song.ambientColor}88)`,
          }}
        />
        {/* Drag handle */}
        {duration > 0 && (
          <circle
            cx={hx}
            cy={hy}
            r={9}
            fill={song.ambientColor}
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={2}
            style={{ filter: `drop-shadow(0 0 8px ${song.ambientColor})`, cursor: "grab" }}
          />
        )}

        {/* Inner decorative ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerR - 10}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />
      </svg>

      {/* Vinyl record centered inside */}
      <div
        className="absolute"
        style={{
          top: 12,
          left: 12,
          width: size - 24,
          height: size - 24,
        }}
      >
        <VinylRecord
          spinning={spinning}
          variant={variant}
          ambientColor={song.ambientColor}
          size={size - 24}
        />
      </div>

      {/* Time display — above the circle */}
      <div
        className="absolute left-1/2 -translate-x-1/2 font-mono text-[13px] text-white/70 tracking-wider"
        style={{ top: -28 }}
        aria-label={`${fmtTime(currentTime)} of ${fmtTime(duration)}`}
      >
        {fmtTime(currentTime)}{" "}
        <span className="text-white/35">/</span>{" "}
        {fmtTime(duration)}
      </div>
    </div>
  );
}


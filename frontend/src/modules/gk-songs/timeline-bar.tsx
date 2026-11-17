"use client";

/**
 * TimelineBar — Slim horizontal seekbar that syncs with the circular progress ring.
 */

import { useCallback, useRef } from "react";
import { fmtTime } from "./use-music-player";

interface TimelineBarProps {
  currentTime: number;
  duration: number;
  onSeek: (s: number) => void;
  accentColor?: string;
}

export function TimelineBar({
  currentTime,
  duration,
  onSeek,
  accentColor = "#c084fc",
}: TimelineBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getTimeFromClient = useCallback(
    (clientX: number): number => {
      const bar = barRef.current;
      if (!bar || duration <= 0) return 0;
      const rect = bar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return pct * duration;
    },
    [duration],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDragging.current = true;
      onSeek(getTimeFromClient(e.clientX));
    },
    [getTimeFromClient, onSeek],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      onSeek(getTimeFromClient(e.clientX));
    },
    [getTimeFromClient, onSeek],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="flex w-full items-center gap-3">
      <span className="w-10 text-right font-mono text-[11px] text-white/40">
        {fmtTime(currentTime)}
      </span>
      <div
        ref={barRef}
        role="slider"
        aria-label="Song progress"
        aria-valuemin={0}
        aria-valuemax={Math.max(1, duration)}
        aria-valuenow={currentTime}
        className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/10"
        onPointerDown={duration > 0 ? handlePointerDown : undefined}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Filled portion */}
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${accentColor}cc, ${accentColor})`,
            transition: "width 0.1s linear",
          }}
        />
        {/* Seek handle */}
        {duration > 0 && (
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
            style={{
              left: `calc(${progress}% - 7px)`,
              background: accentColor,
              transition: "left 0.1s linear",
            }}
          />
        )}
      </div>
      <span className="w-10 font-mono text-[11px] text-white/40">
        {fmtTime(duration)}
      </span>
    </div>
  );
}


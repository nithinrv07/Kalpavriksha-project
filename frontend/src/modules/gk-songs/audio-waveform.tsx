"use client";

/**
 * AudioWaveform — Interactive audio waveform visualizer.
 * Displays 48 waveform amplitude bars, fills dynamically with audio playback progress,
 * and allows clicking/scrubbing directly on the waveform to seek.
 */

import { useCallback, useMemo, useRef } from "react";
import { fmtTime } from "./use-music-player";

interface AudioWaveformProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (seconds: number) => void;
  accentColor?: string;
  songId: string;
}

/** Deterministic pseudo-random seed generator for realistic waveform profiles per song */
function generateWaveProfile(songId: string, count = 48): number[] {
  let hash = 0;
  for (let i = 0; i < songId.length; i++) {
    hash = (hash << 5) - hash + songId.charCodeAt(i);
    hash |= 0;
  }
  const heights: number[] = [];
  for (let i = 0; i < count; i++) {
    const sin1 = Math.sin((i / count) * Math.PI);
    const pseudoRandom = Math.abs(Math.sin(hash + i * 1.618));
    // Envelope: louder in the middle, natural phrasing variation
    const val = 0.25 + 0.75 * sin1 * (0.4 + 0.6 * pseudoRandom);
    heights.push(Math.max(0.15, Math.min(1, val)));
  }
  return heights;
}

export function AudioWaveform({
  currentTime,
  duration,
  isPlaying,
  onSeek,
  accentColor = "#c084fc",
  songId,
}: AudioWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const bars = useMemo(() => generateWaveProfile(songId, 48), [songId]);
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
  const activeBarIndex = Math.floor(progress * bars.length);

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container || duration <= 0) return;
      const rect = container.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onSeek(pct * duration);
    },
    [duration, onSeek],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDragging.current = true;
      seekFromClientX(e.clientX);
    },
    [seekFromClientX],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      seekFromClientX(e.clientX);
    },
    [seekFromClientX],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div
        ref={containerRef}
        role="slider"
        aria-label="Audio waveform scrubber"
        aria-valuemin={0}
        aria-valuemax={Math.max(1, duration)}
        aria-valuenow={currentTime}
        onPointerDown={duration > 0 ? handlePointerDown : undefined}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="group relative flex h-12 w-full cursor-pointer items-center justify-between gap-[2px] rounded-xl bg-white/[0.02] px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
      >
        {bars.map((amplitude, i) => {
          const isPassed = i <= activeBarIndex;
          const isCurrent = i === activeBarIndex && isPlaying;
          const heightPercent = amplitude * 100;

          return (
            <div
              key={i}
              className="relative flex-1 rounded-full transition-all duration-150"
              style={{
                height: `${heightPercent}%`,
                background: isPassed
                  ? `linear-gradient(180deg, ${accentColor}, ${accentColor}cc)`
                  : "rgba(255,255,255,0.12)",
                boxShadow: isCurrent ? `0 0 8px ${accentColor}` : "none",
                transform: isCurrent ? "scaleY(1.15)" : "scaleY(1)",
                transformOrigin: "center",
              }}
            />
          );
        })}
      </div>

      <div className="flex justify-between px-1 text-[11px] font-mono text-white/35">
        <span>{fmtTime(currentTime)}</span>
        <span>{fmtTime(duration)}</span>
      </div>
    </div>
  );
}


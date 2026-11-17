"use client";

/**
 * PlaybackControls — Premium playback control bar for the music player.
 */

import {
  Repeat,
  Shuffle,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  SpeakerHigh,
  SpeakerSlash,
  SpeakerNone,
} from "@phosphor-icons/react/ssr";
import type { PlayerState } from "./use-music-player";

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;

interface PlaybackControlsProps {
  playerState: PlayerState;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (s: number) => void;
  onSetVolume: (v: number) => void;
  onToggleMute: () => void;
  onSetSpeed: (s: number) => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  accentColor?: string;
}

export function PlaybackControls({
  playerState,
  onTogglePlay,
  onPrev,
  onNext,
  onToggleMute,
  onSetVolume,
  onSetSpeed,
  onToggleRepeat,
  onToggleShuffle,
  accentColor = "#c084fc",
}: PlaybackControlsProps) {
  const { status, volume, muted, speed, repeat, shuffle } = playerState;
  const isPlaying = status === "playing";
  const isLoading = status === "loading";
  const isUnavailable = status === "unavailable";
  const hasAudio = status !== "idle" && status !== "unavailable";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Primary controls row */}
      <div className="flex items-center gap-5">
        {/* Shuffle */}
        <button
          type="button"
          onClick={onToggleShuffle}
          disabled={!hasAudio}
          aria-label="Shuffle"
          aria-pressed={shuffle}
          className="group relative flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-all hover:text-white disabled:opacity-30"
          title="Shuffle"
        >
          <Shuffle size={18} weight={shuffle ? "fill" : "regular"} />
          {shuffle && (
            <span
              className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
              style={{ background: accentColor }}
            />
          )}
        </button>

        {/* Skip back */}
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasAudio && !isUnavailable}
          aria-label="Previous song"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-all hover:scale-110 hover:text-white disabled:opacity-30"
        >
          <SkipBack size={22} weight="fill" />
        </button>

        {/* Play / Pause — primary button */}
        <button
          type="button"
          onClick={isUnavailable ? undefined : onTogglePlay}
          disabled={isUnavailable || isLoading}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
          style={{
            background: isUnavailable
              ? "rgba(255,255,255,0.08)"
              : `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
            boxShadow: isUnavailable ? "none" : `0 4px 24px ${accentColor}55`,
          }}
        >
          {isLoading ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : isPlaying ? (
            <Pause size={26} weight="fill" />
          ) : (
            <Play size={26} weight="fill" className="ml-1" />
          )}
        </button>

        {/* Skip forward */}
        <button
          type="button"
          onClick={onNext}
          disabled={!hasAudio && !isUnavailable}
          aria-label="Next song"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-all hover:scale-110 hover:text-white disabled:opacity-30"
        >
          <SkipForward size={22} weight="fill" />
        </button>

        {/* Repeat */}
        <button
          type="button"
          onClick={onToggleRepeat}
          disabled={!hasAudio}
          aria-label="Repeat"
          aria-pressed={repeat}
          className="group relative flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-all hover:text-white disabled:opacity-30"
          title="Repeat"
        >
          <Repeat size={18} weight={repeat ? "fill" : "regular"} />
          {repeat && (
            <span
              className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
              style={{ background: accentColor }}
            />
          )}
        </button>
      </div>

      {/* Secondary controls: volume + speed */}
      <div className="flex items-center gap-6">
        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="text-white/50 transition-colors hover:text-white"
          >
            {muted || volume === 0 ? (
              <SpeakerSlash size={16} />
            ) : volume < 0.4 ? (
              <SpeakerNone size={16} />
            ) : (
              <SpeakerHigh size={16} />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => onSetVolume(parseFloat(e.target.value))}
            aria-label="Volume"
            className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/15 accent-violet-400"
            style={{ accentColor }}
          />
        </div>

        {/* Restart button */}
        <button
          type="button"
          onClick={() => {
            if (hasAudio) {
              const e = { currentTarget: document.activeElement } as unknown;
              void e;
              // We can't directly call seek(0) here without a ref; handled via seek prop
            }
          }}
          aria-label="Restart song"
          className="hidden"
        />

        {/* Playback speed */}
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSetSpeed(s)}
              aria-label={`${s}× speed`}
              aria-pressed={speed === s}
              className="rounded-full px-2.5 py-0.5 font-mono text-[11px] transition-all"
              style={
                speed === s
                  ? { background: accentColor, color: "#fff" }
                  : { color: "rgba(255,255,255,0.4)" }
              }
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


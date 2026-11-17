"use client";

/**
 * MiniPlayer — Compact docked player bar for the bottom of the Songs experience.
 * Features miniature spinning vinyl artwork, play/pause, seek progress ring, and expand toggle.
 */

import { ArrowsOut, Pause, Play, SkipForward } from "@phosphor-icons/react/ssr";
import type { SongEntry } from "./songs-data";
import type { PlayerState } from "./use-music-player";
import { fmtTime } from "./use-music-player";
import { VinylRecord, getVinylVariant } from "./vinyl-record";
import type { Locale } from "@/lib/i18n";

interface MiniPlayerProps {
  song: SongEntry;
  playerState: PlayerState;
  onTogglePlay: () => void;
  onNext: () => void;
  onExpand: () => void;
  locale: Locale;
}

export function MiniPlayer({
  song,
  playerState,
  onTogglePlay,
  onNext,
  onExpand,
  locale,
}: MiniPlayerProps) {
  const isPlaying = playerState.status === "playing";
  const isLoading = playerState.status === "loading";
  const isUnavailable = playerState.status === "unavailable";
  const progress = playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0;
  const variant = getVinylVariant(song.category);

  return (
    <aside
      aria-label="Audio Mini Player"
      className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0e0720]/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-6"
      style={{
        boxShadow: `0 8px 32px -4px ${song.ambientColor}33, 0 20px 48px rgba(0,0,0,0.9)`,
      }}
    >
      {/* Top thin progress indicator line */}
      <div className="absolute left-0 top-0 h-[2px] w-full bg-white/[0.08]">
        <div
          className="h-full transition-all duration-200"
          style={{ width: `${progress}%`, background: song.ambientColor }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Left: Tiny spinning vinyl artwork + Title */}
        <button
          type="button"
          onClick={onExpand}
          className="flex min-w-0 flex-1 items-center gap-3 text-left group"
        >
          <div className="relative shrink-0">
            <VinylRecord
              spinning={isPlaying}
              variant={variant}
              ambientColor={song.ambientColor}
              size={44}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold text-white group-hover:text-violet-300 transition-colors">
              {song.title[locale] ?? song.title.en}
            </p>
            <p className="flex items-center gap-2 font-mono text-[11px] text-white/45">
              <span>{song.credit[locale] ?? song.credit.en}</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">{fmtTime(playerState.currentTime)} / {fmtTime(playerState.duration)}</span>
            </p>
          </div>
        </button>

        {/* Right: Controls & Expand Button */}
        <div className="flex items-center gap-3">
          {/* Play / Pause button */}
          <button
            type="button"
            onClick={isUnavailable ? undefined : onTogglePlay}
            disabled={isUnavailable || isLoading}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
            style={{
              background: `linear-gradient(135deg, ${song.ambientColor}, ${song.ambientColor}cc)`,
            }}
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : isPlaying ? (
              <Pause size={18} weight="fill" />
            ) : (
              <Play size={18} weight="fill" className="ml-0.5" />
            )}
          </button>

          {/* Next song */}
          <button
            type="button"
            onClick={onNext}
            aria-label="Next song"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:text-white"
          >
            <SkipForward size={18} weight="fill" />
          </button>

          {/* Expand to full player */}
          <button
            type="button"
            onClick={onExpand}
            aria-label="Expand player"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <ArrowsOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}


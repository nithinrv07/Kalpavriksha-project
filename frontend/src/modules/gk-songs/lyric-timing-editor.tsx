"use client";

/**
 * LyricTimingEditor — Development-only tool for calibrating lyric timestamps.
 * Hidden from ordinary student users (accessible via dev toggle).
 */

import { useState } from "react";
import { Check, Copy, Play, Pause } from "@phosphor-icons/react/ssr";
import type { LyricLine, SongEntry } from "./songs-data";
import { fmtTime } from "./use-music-player";

interface LyricTimingEditorProps {
  song: SongEntry;
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onClose: () => void;
}

export function LyricTimingEditor({
  song,
  currentTime,
  isPlaying,
  onTogglePlay,
  onSeek,
  onClose,
}: LyricTimingEditorProps) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([...song.lyrics]);
  const [activeLineIdx, setActiveLineIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  // Mark start timestamp for currently highlighted line
  const captureStart = (idx: number) => {
    setLyrics((prev) =>
      prev.map((line, i) => (i === idx ? { ...line, start: Math.round(currentTime * 10) / 10 } : line)),
    );
  };

  // Mark end timestamp for currently highlighted line
  const captureEnd = (idx: number) => {
    setLyrics((prev) =>
      prev.map((line, i) => (i === idx ? { ...line, end: Math.round(currentTime * 10) / 10 } : line)),
    );
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(lyrics, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-white/20 bg-[#120a28] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Lyric Timing Calibration Tool</h3>
            <p className="font-mono text-[11px] text-amber-300">
              [DEV ONLY] Calibrate timestamps for: {song.title.en}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copyJson}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 font-mono text-[12px] text-white hover:bg-white/10"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? "Copied JSON!" : "Copy JSON"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/15 px-3 py-1.5 text-xs text-white/50 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>

        {/* Audio control bar */}
        <div className="flex items-center justify-between border-b border-white/10 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onTogglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white"
            >
              {isPlaying ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
            </button>
            <span className="font-mono text-sm text-white">Current: {fmtTime(currentTime)}</span>
          </div>
          <p className="text-[11px] text-white/40">
            Click Start/End to pin current time to a line.
          </p>
        </div>

        {/* Lines table */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="flex flex-col gap-2">
            {lyrics.map((line, idx) => {
              const isSelected = idx === activeLineIdx;
              return (
                <div
                  key={line.id}
                  onClick={() => setActiveLineIdx(idx)}
                  className={`flex items-center justify-between gap-4 rounded-xl border p-2.5 transition-colors ${
                    isSelected
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-white/5 bg-white/[0.02] hover:border-white/15"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="w-6 font-mono text-[11px] text-white/30">{idx + 1}</span>
                    <span className="truncate text-sm font-medium text-white">{line.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        captureStart(idx);
                      }}
                      className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white hover:bg-violet-600"
                    >
                      Start: {line.start !== null ? `${line.start}s` : "--"}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        captureEnd(idx);
                      }}
                      className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white hover:bg-violet-600"
                    >
                      End: {line.end !== null ? `${line.end}s` : "--"}
                    </button>
                    {line.start !== null && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (line.start !== null) onSeek(line.start);
                        }}
                        className="rounded-lg bg-white/10 px-2 py-1 font-mono text-[11px] text-white/70 hover:text-white"
                        title="Seek to start"
                      >
                        Seek
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


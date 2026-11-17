"use client";

/**
 * KaraokeLyricsPanel — Synchronized lyric display with line and word highlighting.
 * Supports full-screen karaoke mode and translation toggle.
 */

import { useEffect, useRef, useState } from "react";
import type { LyricLine, SongEntry } from "./songs-data";

interface KaraokeLyricsPanelProps {
  song: SongEntry;
  currentTime: number;
  isFullScreen?: boolean;
  locale: string;
}

function getActiveLine(lyrics: readonly LyricLine[], currentTime: number): number {
  let active = -1;
  for (let i = 0; i < lyrics.length; i++) {
    const line = lyrics[i];
    if (line && line.start !== null && currentTime >= line.start) {
      active = i;
    }
  }
  return active;
}

function getActiveWord(line: LyricLine, currentTime: number): number {
  if (!line.words.length) return -1;
  // If line-level only (no word timestamps), highlight all words when line is active
  const hasWordTimestamps = line.words.some((w) => w.start !== null);
  if (!hasWordTimestamps) return line.words.length - 1; // highlight whole line

  let active = 0;
  for (let i = 0; i < line.words.length; i++) {
    const word = line.words[i];
    if (word && word.start !== null && currentTime >= word.start) {
      active = i;
    }
  }
  return active;
}

export function KaraokeLyricsPanel({
  song,
  currentTime,
  isFullScreen = false,
  locale,
}: KaraokeLyricsPanelProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [fontSize, setFontSize] = useState(isFullScreen ? 22 : 18);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTimestamps = song.lyrics.some((l) => l.start !== null);
  const activeLine = hasTimestamps ? getActiveLine(song.lyrics, currentTime) : -1;

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLine]);

  const getFontFamily = () => {
    if (song.language === "hi") {
      return '"Noto Sans Devanagari", "Anek Devanagari", var(--font-sans), sans-serif';
    }
    if (song.language === "ta") {
      return '"Noto Sans Tamil", "Anek Tamil", var(--font-sans), sans-serif';
    }
    return "var(--font-sans), sans-serif";
  };

  const getLyricLabel = () => {
    if (locale === "ta") return "வரிகள்";
    if (locale === "hi") return "बोल";
    return "LYRICS";
  };

  if (song.lyrics.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-white/30 text-sm">
        No lyrics available for this song.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Controls header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
          {getLyricLabel()}
          {!hasTimestamps && (
            <span className="ml-2 text-amber-400/60">(line-level sync)</span>
          )}
        </span>
        <div className="flex items-center gap-3">
          {/* Font size controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.max(13, f - 2))}
              aria-label="Decrease lyric size"
              className="flex h-6 w-6 items-center justify-center rounded text-white/40 transition hover:text-white"
            >
              <span className="text-[11px] font-bold">A−</span>
            </button>
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.min(36, f + 2))}
              aria-label="Increase lyric size"
              className="flex h-6 w-6 items-center justify-center rounded text-white/40 transition hover:text-white"
            >
              <span className="text-[14px] font-bold">A+</span>
            </button>
          </div>
          {/* Translation toggle */}
          <button
            type="button"
            onClick={() => setShowTranslation((v) => !v)}
            aria-pressed={showTranslation}
            className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11px] text-white/40 transition hover:border-white/25 hover:text-white"
          >
            {locale === "ta" ? "மொழிபெயர்ப்பு" : locale === "hi" ? "अनुवाद" : "Translation"}
          </button>
        </div>
      </div>

      {/* Lyric scroll area */}
      <div
        ref={containerRef}
        className={`overflow-y-auto ${isFullScreen ? "max-h-[55vh]" : "max-h-[260px]"} scrollbar-thin scrollbar-violet pr-2`}
        lang={song.language}
      >
        <div className="flex flex-col gap-2 py-4">
          {song.lyrics.map((line, li) => {
            const isActive = li === activeLine;
            const isPast = activeLine >= 0 && li < activeLine;
            const activeWord = isActive ? getActiveWord(line, currentTime) : -1;

            return (
              <div
                key={line.id}
                ref={isActive ? activeLineRef : undefined}
                className="transition-all duration-300"
                style={{
                  opacity: !hasTimestamps ? 1 : isActive ? 1 : isPast ? 0.35 : 0.55,
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                  transformOrigin: "left center",
                }}
              >
                <p
                  className="text-balance leading-relaxed"
                  style={{
                    fontSize,
                    fontFamily: getFontFamily(),
                    color: isActive ? "#ffffff" : isPast ? "#a78bfa55" : "rgba(255,255,255,0.65)",
                    textShadow: isActive ? "0 0 20px rgba(192,132,252,0.5)" : "none",
                    transition: "color 0.3s, text-shadow 0.3s",
                  }}
                >
                  {hasTimestamps && !song.lineLevelOnly
                    ? // Word-level highlighting
                      line.words.map((word, wi) => {
                        const wordState =
                          !isActive ? "neutral"
                            : wi < activeWord ? "past"
                              : wi === activeWord ? "active"
                                : "upcoming";
                        return (
                          <span
                            key={wi}
                            className="transition-all duration-150"
                            style={{
                              color:
                                wordState === "active"
                                  ? "#ffffff"
                                  : wordState === "past"
                                    ? "rgba(167,139,250,0.5)"
                                    : wordState === "upcoming"
                                      ? "rgba(255,255,255,0.5)"
                                      : undefined,
                              textShadow:
                                wordState === "active"
                                  ? "0 0 16px rgba(192,132,252,0.8)"
                                  : "none",
                            }}
                          >
                            {word.text}{" "}
                          </span>
                        );
                      })
                    : // Line-level: render as plain text
                      line.text}
                </p>
                {showTranslation && line.translation && (
                  <p
                    className="mt-0.5 text-[13px] italic text-white/30"
                    style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  >
                    {line.translation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


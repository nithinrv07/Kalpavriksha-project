"use client";

/**
 * MusicPlayer — Expanded immersive music player with circular progress,
 * vinyl record, ambient background, karaoke lyrics, and all playback controls.
 */

import { useState, useEffect } from "react";
import {
  ArrowsOut,
  Heart,
  Info,
  SpeakerNone,
  ArrowLeft,
} from "@phosphor-icons/react/ssr";
import type { SongEntry } from "./songs-data";
import { CATEGORY_META } from "./songs-data";
import type { PlayerState } from "./use-music-player";
import { CircularProgress } from "./circular-progress";
import { PlaybackControls } from "./playback-controls";
import { TimelineBar } from "./timeline-bar";
import { AudioWaveform } from "./audio-waveform";
import { KaraokeLyricsPanel } from "./karaoke-lyrics-panel";
import type { Locale } from "@/lib/i18n";

interface MusicPlayerProps {
  song: SongEntry;
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
  isFavourite: boolean;
  onToggleFavourite: () => void;
  locale: Locale;
}

type PlayerView = "player" | "lyrics" | "info";

export function MusicPlayer({
  song,
  playerState,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onSetVolume,
  onToggleMute,
  onSetSpeed,
  onToggleRepeat,
  onToggleShuffle,
  isFavourite,
  onToggleFavourite,
  locale,
}: MusicPlayerProps) {
  const [view, setView] = useState<PlayerView>("player");
  const [isKaraokeFullScreen, setIsKaraokeFullScreen] = useState(false);
  const meta = CATEGORY_META[song.category];
  const isPlaying = playerState.status === "playing";
  const isUnavailable = playerState.status === "unavailable";

  // Responsive player size
  const [playerSize, setPlayerSize] = useState(260);
  useEffect(() => {
    const update = () => {
      setPlayerSize(window.innerWidth < 640 ? 220 : 280);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isTa = locale === "ta";

  const getLangLabel = () => {
    if (isTa) return song.language === "ta" ? "தமிழ்" : song.language === "hi" ? "இந்தி" : "ஆங்கிலம்";
    return song.language === "ta" ? "Tamil" : song.language === "hi" ? "Hindi" : "English";
  };

  if (isKaraokeFullScreen) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#080610]">
        {/* Ambient background */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 10%, ${song.ambientColor}18 0%, transparent 70%)`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-2xl flex-col gap-6 px-6 pb-32 pt-8">
          <button
            type="button"
            onClick={() => setIsKaraokeFullScreen(false)}
            aria-label="Exit fullscreen karaoke"
            className="flex items-center gap-2 self-start rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-white/50 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            {isTa ? "திரும்பு" : "Back"}
          </button>

          <div className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/30">
              {meta.label[locale] ?? meta.label.en}
            </p>
            <h2
              className="mt-1 text-2xl font-black tracking-wide"
              style={{
                fontFamily: song.language === "hi"
                  ? '"Noto Sans Devanagari", var(--font-sans)'
                  : song.language === "ta"
                    ? '"Noto Sans Tamil", var(--font-sans)'
                    : "var(--font-sans)",
              }}
            >
              {song.title[locale] ?? song.title.en}
            </h2>
          </div>

          <KaraokeLyricsPanel
            song={song}
            currentTime={playerState.currentTime}
            isFullScreen
            locale={locale}
          />
        </div>

        {/* Sticky playback bar */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-white/[0.06] bg-[#0d0920]/95 px-6 py-4 backdrop-blur-xl">
          <div className="mx-auto max-w-2xl flex flex-col items-center gap-3">
            <TimelineBar
              currentTime={playerState.currentTime}
              duration={playerState.duration}
              onSeek={onSeek}
              accentColor={song.ambientColor}
            />
            <PlaybackControls
              playerState={playerState}
              onTogglePlay={onTogglePlay}
              onPrev={onPrev}
              onNext={onNext}
              onSeek={onSeek}
              onSetVolume={onSetVolume}
              onToggleMute={onToggleMute}
              onSetSpeed={onSetSpeed}
              onToggleRepeat={onToggleRepeat}
              onToggleShuffle={onToggleShuffle}
              accentColor={song.ambientColor}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.07]">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% -10%, ${song.ambientColor}1a 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 10% 100%, ${song.ambientColor}0d 0%, transparent 50%),
            #0d0920
          `,
          transition: "background 1s ease",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col">
        {/* View switcher tabs */}
        <div className="flex border-b border-white/[0.06] px-6 pt-5">
          {(["player", "lyrics", "info"] as PlayerView[]).map((v) => {
            const labels: Record<PlayerView, Record<string, string>> = {
              player: { en: "Player", ta: "பிளேயர்" },
              lyrics: { en: "Lyrics", ta: "வரிகள்" },
              info: { en: "About", ta: "பற்றி" },
            };
            return (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-selected={view === v}
                role="tab"
                className={`relative pb-3 pr-6 font-mono text-[12px] uppercase tracking-wide transition-colors ${
                  view === v ? "text-white" : "text-white/35 hover:text-white/60"
                }`}
              >
                {labels[v][locale] ?? labels[v].en}
                {view === v && (
                  <span
                    className="absolute bottom-0 left-0 right-6 h-0.5 rounded-full"
                    style={{ background: song.ambientColor }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* PLAYER VIEW */}
        {view === "player" && (
          <div className="flex flex-col items-center gap-6 px-6 pb-7 pt-8">
            {/* Category pill + heart */}
            <div className="flex w-full items-center justify-between">
              <span
                className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ background: `${meta.color}22`, color: meta.color }}
              >
                {meta.label[locale] ?? meta.label.en}
              </span>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/35">
                  {getLangLabel()}
                </span>
                <button
                  type="button"
                  onClick={onToggleFavourite}
                  aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
                  aria-pressed={isFavourite}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Heart
                    size={18}
                    weight={isFavourite ? "fill" : "regular"}
                    className={isFavourite ? "text-pink-500" : "text-white/35"}
                  />
                </button>
              </div>
            </div>

            {/* Circular player */}
            <div className="mt-2" style={{ paddingTop: 32 }}>
              <CircularProgress
                song={song}
                currentTime={playerState.currentTime}
                duration={playerState.duration}
                spinning={isPlaying}
                onSeek={onSeek}
                size={playerSize}
              />
            </div>

            {/* Song info */}
            <div className="text-center">
              <h2
                className="text-xl font-black tracking-wide sm:text-2xl"
                style={{
                  fontFamily:
                    song.language === "hi"
                      ? '"Noto Sans Devanagari", var(--font-sans)'
                      : song.language === "ta"
                        ? '"Noto Sans Tamil", var(--font-sans)'
                        : "var(--font-sans)",
                }}
              >
                {song.title[locale] ?? song.title.en}
              </h2>
              {song.altTitle && (
                <p className="mt-0.5 text-[13px] text-white/40">{song.altTitle}</p>
              )}
              <p className="mt-1 text-[13px] text-white/50">
                {song.credit[locale] ?? song.credit.en}
              </p>
            </div>

            {/* Unavailable state */}
            {isUnavailable && (
              <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-4 text-center">
                <SpeakerNone size={20} className="mx-auto mb-2 text-white/25" />
                <p className="text-[13px] text-white/40">
                  {isTa
                    ? "இந்தப் பாடலுக்கு ஆடியோ இல்லை. பாடல் வரிகளை படிக்கலாம்."
                    : "Audio recording not available for this song. You can still read the lyrics."}
                </p>
              </div>
            )}

            {/* Audio Waveform Scrubber */}
            {!isUnavailable && (
              <div className="w-full">
                <AudioWaveform
                  currentTime={playerState.currentTime}
                  duration={playerState.duration}
                  isPlaying={isPlaying}
                  onSeek={onSeek}
                  accentColor={song.ambientColor}
                  songId={song.id}
                />
              </div>
            )}

            {/* Playback controls */}
            <PlaybackControls
              playerState={playerState}
              onTogglePlay={onTogglePlay}
              onPrev={onPrev}
              onNext={onNext}
              onSeek={onSeek}
              onSetVolume={onSetVolume}
              onToggleMute={onToggleMute}
              onSetSpeed={onSetSpeed}
              onToggleRepeat={onToggleRepeat}
              onToggleShuffle={onToggleShuffle}
              accentColor={song.ambientColor}
            />

            {/* Karaoke expand button */}
            <button
              type="button"
              onClick={() => { setView("lyrics"); setIsKaraokeFullScreen(true); }}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[12px] text-white/40 transition hover:border-white/20 hover:text-white/70"
            >
              <ArrowsOut size={14} />
              {isTa ? "பாடல் வரிகள் முழுத்திரை" : "Full-screen karaoke"}
            </button>
          </div>
        )}

        {/* LYRICS VIEW */}
        {view === "lyrics" && (
          <div className="px-6 pb-6 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">
                  {song.title[locale] ?? song.title.en}
                </h3>
                <p className="text-[12px] text-white/40">
                  {song.credit[locale] ?? song.credit.en}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsKaraokeFullScreen(true)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/40 transition hover:text-white"
              >
                <ArrowsOut size={13} />
                {isTa ? "முழுத்திரை" : "Full screen"}
              </button>
            </div>
            {/* Mini controls in lyrics view */}
            <div className="mb-4">
              <TimelineBar
                currentTime={playerState.currentTime}
                duration={playerState.duration}
                onSeek={onSeek}
                accentColor={song.ambientColor}
              />
            </div>
            <KaraokeLyricsPanel
              song={song}
              currentTime={playerState.currentTime}
              locale={locale}
            />
          </div>
        )}

        {/* INFO VIEW */}
        {view === "info" && (
          <div className="flex flex-col gap-5 px-6 pb-6 pt-5">
            {/* Description */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/35">
                {isTa ? "விளக்கம்" : "About"}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                {song.description[locale] ?? song.description.en}
              </p>
            </div>

            {/* Meaning */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/35">
                {isTa ? "பொருள்" : "Meaning"}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                {song.meaning[locale] ?? song.meaning.en}
              </p>
            </div>

            {/* Did you know */}
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-amber-400/80">
                <Info size={14} weight="fill" aria-hidden />
                {isTa ? "உனக்குத் தெரியுமா?" : "Did You Know?"}
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/65">
                {song.fact[locale] ?? song.fact.en}
              </p>
            </div>

            {/* Vocabulary */}
            {song.vocabulary && song.vocabulary.length > 0 && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-white/35">
                  {isTa ? "வார்த்தைகள்" : "Vocabulary"}
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {song.vocabulary.map((v) => (
                    <div key={v.word} className="flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                      <span className="shrink-0 font-bold text-violet-300">{v.word}</span>
                      <span className="text-[13px] text-white/50">— {v.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Class range */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/35">
                {isTa ? "வகுப்பு" : "Class"}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-0.5 font-mono text-[11px] text-white/50">
                {song.classRange[0]}–{song.classRange[1]}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


"use client";

/**
 * Songs — Module 03 Part B: Immersive music learning experience.
 *
 * Replaces the original TTS-based Songs component with a full HTML5 audio player.
 * Preserves all existing XP/completion integration via updateProgress + completeSong.
 * Does NOT modify the GK Quiz, Module 01 or Module 02.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { MusicNote } from "@phosphor-icons/react/ssr";
import { Burst } from "@/components/burst";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import { XP, completeSong, localDay } from "@/lib/progress";
import type { Band } from "@/lib/progress";
import type { Locale } from "@/lib/i18n";
import { SONG_LIBRARY } from "./songs-data";
import type { SongEntry } from "./songs-data";
import { useMusicPlayer } from "./use-music-player";
import { MusicPlayer } from "./music-player";
import { SongCard } from "./song-card";
import { SongFilters, filterSongs } from "./song-filters";
import type { FilterState } from "./song-filters";
import { MiniPlayer } from "./mini-player";
import { LyricTimingEditor } from "./lyric-timing-editor";

const INITIAL_FILTERS: FilterState = {
  search: "",
  category: "all",
  language: "all",
};

export function Songs({ band }: { band: Band }) {
  const { locale } = useLocale();
  const { songsHeard } = useProgress();
  const isJunior = band === "junior";

  const [selectedId, setSelectedId] = useState<string>(SONG_LIBRARY[0]?.id ?? "");
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [celebrate, setCelebrate] = useState(0);
  const [playerMode, setPlayerMode] = useState<"expanded" | "minimized">("expanded");
  const [showDevEditor, setShowDevEditor] = useState(false);

  const selectedSong = SONG_LIBRARY.find((s) => s.id === selectedId) ?? SONG_LIBRARY[0]!;

  const filteredSongs = useMemo(
    () => filterSongs(SONG_LIBRARY, filters, locale as Locale),
    [filters, locale],
  );

  // ── XP / completion callback ───────────────────────────────────────────────
  const handleComplete = useCallback((songId: string) => {
    updateProgress((p) => completeSong(p, songId, localDay()));
    setCelebrate((n) => n + 1);
  }, []);

  // ── Song selection ────────────────────────────────────────────────────────
  const selectSong = useCallback((song: SongEntry) => {
    setSelectedId(song.id);
  }, []);

  // ── Next / Previous song logic ─────────────────────────────────────────────
  const handleNext = useCallback(() => {
    const idx = filteredSongs.findIndex((s) => s.id === selectedId);
    const nextSong = filteredSongs[(idx + 1) % filteredSongs.length];
    if (nextSong) selectSong(nextSong);
  }, [filteredSongs, selectedId, selectSong]);

  const handlePrev = useCallback(() => {
    const idx = filteredSongs.findIndex((s) => s.id === selectedId);
    const prevIdx = (idx - 1 + filteredSongs.length) % filteredSongs.length;
    const prevSong = filteredSongs[prevIdx];
    if (prevSong) selectSong(prevSong);
  }, [filteredSongs, selectedId, selectSong]);

  const player = useMusicPlayer(handleComplete, handleNext);

  // When selectedId changes, load into audio player
  useEffect(() => {
    if (selectedSong) {
      player.load(selectedSong);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const handleSelectFromList = useCallback(
    (song: SongEntry) => {
      if (song.id !== selectedId) {
        player.stop();
        selectSong(song);
      }
    },
    [selectedId, player, selectSong],
  );

  const toggleFavourite = useCallback(() => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(selectedSong.id)) next.delete(selectedSong.id);
      else next.add(selectedSong.id);
      return next;
    });
  }, [selectedSong.id]);

  const completedCount = songsHeard.length;
  const totalCount = SONG_LIBRARY.length;

  return (
    <div className="flex flex-col gap-5">
      {/* Progress bar */}
      <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-3">
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/35">
              {locale === "ta" ? "முடிந்த பாடல்கள்" : "Songs Completed"}
            </span>
            <span className="font-mono text-[12px] text-white/50">
              {completedCount} / {totalCount}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
        {/* XP celebration */}
        <div className="relative">
          {celebrate > 0 && (
            <>
              <Burst key={celebrate} />
              <span
                key={`xp-${celebrate}`}
                className="float-up absolute -top-7 right-0 font-mono text-[13px] text-amber-400"
              >
                +{XP.song} XP
              </span>
            </>
          )}
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <MusicNote size={18} weight="duotone" className="text-violet-400" />
          </div>
        </div>
      </div>

      {/* Header controls: Minimize / Expand toggle + dev timing editor button */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setPlayerMode((m) => (m === "expanded" ? "minimized" : "expanded"))}
          className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 font-mono text-[11px] text-white/50 transition hover:border-white/20 hover:text-white"
        >
          {playerMode === "expanded"
            ? (locale === "ta" ? "சுருக்கு (Mini Player)" : "Minimize to Mini Player")
            : (locale === "ta" ? "விரிவாக்கு (Expanded)" : "Expand Player")}
        </button>

        <span className="font-mono text-[11px] text-white/40">
          {isJunior ? "Primary (Classes 1–3)" : "Intermediate (Class 4+)"}
        </span>
        <button
          type="button"
          onClick={() => setShowDevEditor(true)}
          className="rounded-full border border-amber-500/20 bg-amber-500/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-amber-300/60 transition hover:border-amber-500/40 hover:text-amber-200"
          title="Developer-only lyric timing calibration tool"
        >
          ⏱️ Calibrate Timestamps
        </button>
      </div>

      {/* Main layout */}
      {playerMode === "expanded" ? (
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          {/* LEFT: Song library */}
          <div className="flex flex-col gap-4">
            <SongFilters filters={filters} onChange={setFilters} locale={locale as Locale} />

            {filteredSongs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] py-10 text-center">
                <MusicNote size={28} className="text-white/20" />
                <p className="text-[13px] text-white/35">
                  {locale === "ta" ? "பாடல்கள் இல்லை" : "No songs found"}
                </p>
              </div>
            ) : (
              <div
                role="radiogroup"
                aria-label={locale === "ta" ? "பாடல்கள்" : "Songs"}
                className="flex flex-col gap-1.5 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 320px)", minHeight: 240 }}
              >
                {filteredSongs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    isSelected={song.id === selectedId}
                    isPlaying={song.id === selectedId && player.state.status === "playing"}
                    isCompleted={songsHeard.includes(song.id)}
                    locale={locale as Locale}
                    onClick={() => handleSelectFromList(song)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Music player */}
          <div className="min-w-0">
            <MusicPlayer
              song={selectedSong}
              playerState={player.state}
              onTogglePlay={player.togglePlay}
              onPrev={handlePrev}
              onNext={handleNext}
              onSeek={player.seek}
              onSetVolume={player.setVolume}
              onToggleMute={player.toggleMute}
              onSetSpeed={player.setSpeed}
              onToggleRepeat={player.toggleRepeat}
              onToggleShuffle={player.toggleShuffle}
              isFavourite={favourites.has(selectedSong.id)}
              onToggleFavourite={toggleFavourite}
              locale={locale as Locale}
            />
          </div>
        </div>
      ) : (
        /* MINIMIZED MODE: Full-width library + persistent MiniPlayer at bottom */
        <div className="flex flex-col gap-4 pb-24">
          <SongFilters filters={filters} onChange={setFilters} locale={locale as Locale} />

          <div
            role="radiogroup"
            aria-label={locale === "ta" ? "பாடல்கள்" : "Songs"}
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isSelected={song.id === selectedId}
                isPlaying={song.id === selectedId && player.state.status === "playing"}
                isCompleted={songsHeard.includes(song.id)}
                locale={locale as Locale}
                onClick={() => handleSelectFromList(song)}
              />
            ))}
          </div>

          {/* Persistent MiniPlayer */}
          <MiniPlayer
            song={selectedSong}
            playerState={player.state}
            onTogglePlay={player.togglePlay}
            onNext={handleNext}
            onExpand={() => setPlayerMode("expanded")}
            locale={locale as Locale}
          />
        </div>
      )}

      {/* Developer-only Lyric Timing Editor modal */}
      {showDevEditor && (
        <LyricTimingEditor
          song={selectedSong}
          currentTime={player.state.currentTime}
          isPlaying={player.state.status === "playing"}
          onTogglePlay={player.togglePlay}
          onSeek={player.seek}
          onClose={() => setShowDevEditor(false)}
        />
      )}
    </div>
  );
}

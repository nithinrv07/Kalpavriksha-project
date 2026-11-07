"use client";

import { CheckCircle, Info, MusicNotes, Play, Stop } from "@phosphor-icons/react/ssr";
import { useState } from "react";
import { Burst } from "@/components/burst";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import { KaraokeLines, useReadAloud } from "@/components/read-aloud";
import { XP, completeSong, localDay, type Band } from "@/lib/progress";
import { GK_COPY, SONGS } from "./content";

/** Fixed precision so server and browser render identical SVG attributes. */
const round = (n: number) => Math.round(n * 100) / 100;

/** Vinyl record with an Ashoka-chakra label; spins while the song plays. */
function Record({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className="size-44 shrink-0 animate-[spin-slow_6s_linear_infinite] drop-shadow-[0_20px_40px_rgb(0_0_0/0.6)] sm:size-52"
      style={{ animationPlayState: spinning ? "running" : "paused" }}
    >
      <circle cx="100" cy="100" r="98" fill="#0b0a10" stroke="var(--line-strong)" />
      {[88, 80, 72, 64, 56].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgb(255 255 255 / 0.05)" />
      ))}
      <path d="M40 60 A75 75 0 0 1 150 38" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="100" r="40" fill="var(--violet-deep)" />
      <circle cx="100" cy="100" r="30" fill="none" stroke="var(--violet)" strokeWidth="2" />
      {Array.from({ length: 24 }, (_, i) => (
        <line
          key={i}
          x1="100"
          y1="100"
          x2={round(100 + Math.cos((i * Math.PI) / 12) * 30)}
          y2={round(100 + Math.sin((i * Math.PI) / 12) * 30)}
          stroke="var(--violet)"
          strokeOpacity="0.8"
        />
      ))}
      <circle cx="100" cy="100" r="5" fill="var(--bg)" />
    </svg>
  );
}

export function Songs({ band }: { band: Band }) {
  const { locale } = useLocale();
  const c = GK_COPY[locale];
  const { songsHeard } = useProgress();
  const { state, play, stop } = useReadAloud();
  const [songId, setSongId] = useState(SONGS[0]?.id ?? "");
  const [celebrate, setCelebrate] = useState(0);
  const song = SONGS.find((s) => s.id === songId) ?? SONGS[0];
  if (!song) return null;
  const playing = state.id === song.id;

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <div role="radiogroup" aria-label={c.tabs.songs} className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {SONGS.map((s) => {
          const active = s.id === song.id;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                stop();
                setSongId(s.id);
              }}
              className={`flex min-w-[220px] items-center gap-3 rounded-2xl border p-3 text-left transition-colors duration-200 ${
                active ? "border-[var(--band)] bg-[color-mix(in_srgb,var(--band)_10%,var(--surface))]" : "border-line bg-surface hover:border-line-strong"
              }`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet-deep/60 text-violet-ink">
                <MusicNotes size={20} weight="duotone" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px]">{s.title[locale]}</span>
                <span className="block font-mono text-[11px] text-muted">{s.kind[locale]}</span>
              </span>
              {songsHeard.includes(s.id) && <CheckCircle size={18} weight="fill" className="shrink-0 text-success" aria-label={c.sung} />}
            </button>
          );
        })}
      </div>

      <div key={song.id} className="fade-up overflow-hidden rounded-[28px] border border-line bg-surface">
        <div className="flex flex-col items-center gap-6 bg-[radial-gradient(60%_80%_at_20%_0%,rgb(124_58_237/0.22),transparent_70%)] p-6 sm:flex-row sm:p-8">
          <Record spinning={playing} />
          <div className="text-center sm:text-left">
            <p className="font-mono text-[12px] text-[var(--band)]">{song.kind[locale]}</p>
            <h2 className="mt-1 font-display text-[clamp(28px,4vw,44px)] leading-tight tracking-[-0.03em]">{song.title[locale]}</h2>
            <p className="mt-1 text-[14px] text-muted">{song.credit[locale]}</p>
            <div className="relative mt-5 inline-flex">
              <button
                type="button"
                onClick={() =>
                  playing
                    ? stop()
                    : play(song.id, song.lines, song.lang, {
                        rate: band === "junior" ? 0.85 : 1,
                        onDone: () => {
                          updateProgress((p) => completeSong(p, song.id, localDay()));
                          setCelebrate((n) => n + 1);
                        },
                      })
                }
                className={`inline-flex h-14 items-center gap-2 rounded-full px-7 font-mono text-sm transition-colors ${
                  playing ? "bg-white/[0.1] text-text" : "bg-[var(--band)] text-bg hover:brightness-110"
                }`}
              >
                {playing ? <Stop size={18} weight="fill" /> : <Play size={18} weight="fill" />}
                {playing ? c.stop : c.singAlong}
              </button>
              {celebrate > 0 && (
                <>
                  <Burst key={celebrate} />
                  <span key={`xp-${celebrate}`} className="float-up absolute -top-6 right-0 font-mono text-[13px] text-amber">
                    +{XP.song} XP
                  </span>
                </>
              )}
            </div>
            {playing && state.silent && <p className="mt-3 max-w-sm text-[12.5px] text-amber">{c.silent}</p>}
          </div>
        </div>

        <div className="border-t border-line p-6 sm:p-8">
          <KaraokeLines
            lines={song.lines}
            lang={song.lang}
            activeLine={playing ? state.line : -1}
            activeWord={playing ? state.word : -1}
            className={`flex flex-col gap-1.5 font-display ${band === "junior" ? "text-[clamp(22px,3.2vw,30px)] leading-[1.5]" : "text-[clamp(19px,2.6vw,25px)] leading-[1.5]"}`}
          />
        </div>

        <div className="grid gap-3 border-t border-line p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-violet">{c.meaning}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{song.meaning[locale]}</p>
          </div>
          <div className="rounded-2xl border border-amber/25 bg-amber/[0.06] p-4">
            <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-amber">
              <Info size={16} weight="fill" aria-hidden />
              {c.fact}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed">{song.fact[locale]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

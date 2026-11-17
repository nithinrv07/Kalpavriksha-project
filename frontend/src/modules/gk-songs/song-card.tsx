"use client";

/**
 * SongCard — A single song entry in the library list.
 */

import { CheckCircle, MusicNotes } from "@phosphor-icons/react/ssr";
import type { SongEntry } from "./songs-data";
import { CATEGORY_META } from "./songs-data";
import type { Locale } from "@/lib/i18n";

interface SongCardProps {
  song: SongEntry;
  isSelected: boolean;
  isPlaying: boolean;
  isCompleted: boolean;
  locale: Locale;
  onClick: () => void;
}

/** Animated equalizer bars for the currently playing song */
function EqualizerBars({ color }: { color: string }) {
  return (
    <span className="inline-flex items-end gap-[2px]" aria-hidden>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="rounded-sm"
          style={{
            width: 3,
            backgroundColor: color,
            animation: `eq-bar-${i} ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
            height: i === 2 ? 12 : i === 1 ? 8 : 10,
          }}
        />
      ))}
    </span>
  );
}

export function SongCard({
  song,
  isSelected,
  isPlaying,
  isCompleted,
  locale,
  onClick,
}: SongCardProps) {
  const meta = CATEGORY_META[song.category];
  const title = song.title[locale] ?? song.title.en;
  const categoryLabel = meta.label[locale] ?? meta.label.en;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${isSelected
          ? "border-white/20 bg-white/[0.07]"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.045]"
        }`}
      style={
        isSelected
          ? { boxShadow: `0 0 0 1px ${meta.color}44, inset 0 0 20px ${meta.color}0a` }
          : {}
      }
    >
      {/* Artwork placeholder */}
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-all"
        style={{
          background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}0a)`,
          border: `1px solid ${meta.color}30`,
        }}
      >
        {isPlaying ? (
          <EqualizerBars color={meta.color} />
        ) : (
          <MusicNotes size={18} weight="duotone" style={{ color: meta.color }} />
        )}
      </span>

      {/* Info */}
      <span className="min-w-0 flex-1">
        <span
          className="block truncate text-[14px] font-medium leading-tight"
          style={{ color: isSelected ? "#ffffff" : "rgba(255,255,255,0.85)" }}
        >
          {title}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5">
          <span
            className="rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide"
            style={{ background: `${meta.color}22`, color: meta.color }}
          >
            {categoryLabel}
          </span>
          {song.audioSrc === null && (
            <span className="font-mono text-[9px] uppercase tracking-wide text-white/25">
              {locale === "ta" ? "இல்லை" : "No audio"}
            </span>
          )}
        </span>
      </span>

      {/* Completed indicator */}
      {isCompleted && (
        <CheckCircle
          size={16}
          weight="fill"
          className="shrink-0 text-emerald-400"
          aria-label="Completed"
        />
      )}
    </button>
  );
}


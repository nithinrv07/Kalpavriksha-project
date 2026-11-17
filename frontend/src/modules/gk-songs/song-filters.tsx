"use client";

/**
 * SongFilters — Category, language and class filters + search field.
 */

import { MagnifyingGlass, X } from "@phosphor-icons/react/ssr";
import type { Locale } from "@/lib/i18n";
import type { SongCategory, SongLanguage } from "./songs-data";
import { CATEGORY_META } from "./songs-data";

export type FilterState = {
  search: string;
  category: SongCategory | "all";
  language: SongLanguage | "all";
};

interface SongFiltersProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  locale: Locale;
}

const LANGUAGE_LABELS: Record<SongLanguage | "all", Record<string, string>> = {
  all: { en: "All Languages", ta: "அனைத்து மொழிகள்", hi: "सभी भाषाएँ" },
  hi: { en: "Hindi", ta: "இந்தி", hi: "हिंदी" },
  ta: { en: "Tamil", ta: "தமிழ்", hi: "तमिल" },
  en: { en: "English", ta: "ஆங்கிலம்", hi: "अंग्रेज़ी" },
};

const CATEGORIES: Array<SongCategory | "all"> = [
  "all",
  "national-anthem",
  "national-song",
  "patriotic-tamil",
  "children-tamil",
  "children-english",
];

export function SongFilters({ filters, onChange, locale }: SongFiltersProps) {
  const isTa = locale === "ta";
  const placeholder = isTa ? "பாடல் தேடு…" : "Search songs…";
  const allLabel = isTa ? "அனைத்தும்" : "All";

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <MagnifyingGlass
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-9 text-[13px] text-white placeholder:text-white/25 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, search: "" })}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat;
          const meta = cat !== "all" ? CATEGORY_META[cat] : null;
          const label =
            cat === "all"
              ? allLabel
              : (meta?.label[locale] ?? meta?.label.en ?? cat);

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange({ ...filters, category: cat })}
              aria-pressed={isActive}
              className="rounded-full border px-3 py-1 font-mono text-[11px] transition-all"
              style={
                isActive
                  ? {
                      background: meta?.color ?? "#c084fc",
                      color: "#fff",
                      borderColor: "transparent",
                    }
                  : {
                      background: "transparent",
                      color: "rgba(255,255,255,0.45)",
                      borderColor: "rgba(255,255,255,0.12)",
                    }
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Language pills */}
      <div className="flex gap-1.5">
        {(["all", "hi", "ta", "en"] as const).map((lang) => {
          const isActive = filters.language === lang;
          return (
            <button
              key={lang}
              type="button"
              onClick={() => onChange({ ...filters, language: lang })}
              aria-pressed={isActive}
              className="rounded-full border px-3 py-1 font-mono text-[11px] transition-all"
              style={
                isActive
                  ? { background: "#6d28d9", color: "#fff", borderColor: "transparent" }
                  : { background: "transparent", color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.1)" }
              }
            >
              {LANGUAGE_LABELS[lang][locale] ?? LANGUAGE_LABELS[lang].en}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Filter the song library by the current FilterState */
import type { SongEntry } from "./songs-data";

export function filterSongs(
  songs: readonly SongEntry[],
  filters: FilterState,
  locale: Locale,
): SongEntry[] {
  const q = filters.search.toLowerCase().trim();
  return songs.filter((s) => {
    if (filters.category !== "all" && s.category !== filters.category) return false;
    if (filters.language !== "all" && s.language !== filters.language) return false;
    if (q) {
      const title = (s.title[locale] ?? s.title.en ?? "").toLowerCase();
      const credit = (s.credit[locale] ?? s.credit.en ?? "").toLowerCase();
      if (!title.includes(q) && !credit.includes(q)) return false;
    }
    return true;
  });
}


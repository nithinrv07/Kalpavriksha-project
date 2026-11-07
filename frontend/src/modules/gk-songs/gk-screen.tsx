"use client";

import { Lightning, MusicNotes } from "@phosphor-icons/react/ssr";
import { useState } from "react";
import { BandHint } from "@/components/band-hint";
import { useLocale } from "@/components/locale-provider";
import type { Band } from "@/lib/progress";
import { GK_COPY } from "./content";
import { Quiz } from "./quiz";
import { Songs } from "./songs";

export function GkScreen({ band }: { band: Band }) {
  const { locale } = useLocale();
  const c = GK_COPY[locale];
  const [tab, setTab] = useState<"quiz" | "songs">("quiz");

  return (
    <div className="flex flex-col gap-6">
      <BandHint band={band} text={c.bandHint[band]} />

      <div role="tablist" aria-label={`${c.tabs.quiz} / ${c.tabs.songs}`} className="flex w-fit gap-1 rounded-2xl border border-line bg-white/[0.03] p-1">
        {(
          [
            ["quiz", Lightning, c.tabs.quiz],
            ["songs", MusicNotes, c.tabs.songs],
          ] as const
        ).map(([id, Glyph, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setTab(id)}
            className="flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] text-muted transition-colors duration-200 hover:text-text aria-selected:bg-violet-deep aria-selected:text-violet-ink"
          >
            <Glyph size={18} weight="duotone" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "quiz" ? <Quiz band={band} /> : <Songs band={band} />}
      </div>
    </div>
  );
}

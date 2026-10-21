"use client";

import { CheckCircle, Clock, Sparkle } from "@phosphor-icons/react/ssr";
import { useState } from "react";
import { BandHint } from "@/components/band-hint";
import { useLocale } from "@/components/locale-provider";
import { useProgress } from "@/components/progress-store";
import type { Band } from "@/lib/progress";
import { CATEGORY_ICON } from "./category-icons";
import { CATEGORIES, CATEGORY_INFO, LEARN_COPY, lessonsFor, type CategoryId, type Lesson } from "./lessons";
import { LessonDialog } from "./lesson-dialog";

function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const frac = total > 0 ? done / total : 0;
  return (
    <svg viewBox="0 0 80 80" className="size-20 shrink-0 -rotate-90" aria-hidden>
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="7" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="var(--band, var(--violet))"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${Math.round(circ * frac * 100) / 100} ${Math.round(circ * 100) / 100}`}
        className="transition-[stroke-dasharray] duration-700"
      />
    </svg>
  );
}

function LessonCard({ lesson, band, done, onOpen }: { lesson: Lesson; band: Band; done: boolean; onOpen: () => void }) {
  const { locale } = useLocale();
  const c = LEARN_COPY[locale];
  const info = CATEGORY_INFO[lesson.category];
  const Glyph = CATEGORY_ICON[lesson.category];
  const style = { "--cat": info.accent } as React.CSSProperties;

  // Seniors revise from a compact list; younger students browse picture cards.
  if (band === "senior") {
    return (
      <button
        type="button"
        onClick={onOpen}
        style={style}
        className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-surface px-4 py-4 text-left transition-colors duration-200 hover:border-line-strong hover:bg-surface-2"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--cat)_16%,transparent)] text-[var(--cat)]">
          <Glyph size={20} weight="duotone" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15.5px]">{lesson.title[locale]}</span>
          <span className="mt-0.5 block font-mono text-[11.5px] text-muted">
            {info.name[locale]} · {lesson.minutes} {c.minutes}
          </span>
        </span>
        {done ? (
          <CheckCircle size={22} weight="fill" className="shrink-0 text-success" aria-label={c.learned} />
        ) : (
          <span className="shrink-0 font-mono text-[11px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
            {c.listen} →
          </span>
        )}
      </button>
    );
  }

  const junior = band === "junior";
  return (
    <button
      type="button"
      onClick={onOpen}
      style={style}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface text-left transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--cat)_50%,transparent)] hover:shadow-[0_20px_60px_-25px_var(--cat)]"
    >
      <span
        className={`relative grid place-items-center overflow-hidden bg-[radial-gradient(120%_120%_at_30%_10%,color-mix(in_srgb,var(--cat)_40%,transparent),transparent_60%)] ${
          junior ? "h-36" : "h-28"
        }`}
      >
        <Glyph
          size={junior ? 64 : 48}
          weight="duotone"
          className="text-[var(--cat)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
        />
        {done && (
          <span className="pop-in absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 font-mono text-[11px] text-success">
            <CheckCircle size={14} weight="fill" />
            {c.learned}
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-mono text-[11.5px] text-[var(--cat)]">{info.name[locale]}</span>
        <span className={`leading-snug ${junior ? "text-[20px]" : "text-[17px]"}`}>{lesson.title[locale]}</span>
        <span className="mt-auto flex items-center gap-1.5 pt-2 font-mono text-[11.5px] text-muted">
          <Clock size={13} aria-hidden />
          {lesson.minutes} {c.minutes}
        </span>
      </span>
    </button>
  );
}

export function LearnScreen({ band }: { band: Band }) {
  const { locale } = useLocale();
  const c = LEARN_COPY[locale];
  const progress = useProgress();
  const lessons = lessonsFor(band);
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = CATEGORIES.filter((cat) => lessons.some((l) => l.category === cat));
  const shown = category === "all" ? lessons : lessons.filter((l) => l.category === category);
  const done = lessons.filter((l) => progress.lessonsDone.includes(l.id)).length;
  const open = lessons.find((l) => l.id === openId) ?? null;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-3 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface px-5 py-4">
          <ProgressRing done={done} total={lessons.length} />
          <div>
            <p className="font-mono text-2xl">
              {done}
              <span className="text-muted">/{lessons.length}</span>
            </p>
            <p className="text-[13px] text-muted">
              {done === lessons.length ? (
                <span className="inline-flex items-center gap-1 text-success">
                  <Sparkle size={14} weight="fill" aria-hidden />
                  {c.allDone}
                </span>
              ) : (
                c.progress(done, lessons.length)
              )}
            </p>
          </div>
        </div>
        <BandHint band={band} text={c.bandHint[band]} />
      </div>

      <div role="radiogroup" aria-label={c.all} className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {(["all", ...categories] as const).map((cat) => {
          const active = category === cat;
          const accent = cat === "all" ? "var(--violet)" : CATEGORY_INFO[cat].accent;
          const Glyph = cat === "all" ? null : CATEGORY_ICON[cat];
          const count = cat === "all" ? lessons.length : lessons.filter((l) => l.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setCategory(cat)}
              style={{ "--cat": accent } as React.CSSProperties}
              className={`flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] transition-colors duration-200 ${
                active
                  ? "border-[var(--cat)] bg-[color-mix(in_srgb,var(--cat)_16%,transparent)] text-text"
                  : "border-line text-muted hover:text-text"
              }`}
            >
              {Glyph && <Glyph size={16} weight="duotone" className="text-[var(--cat)]" aria-hidden />}
              {cat === "all" ? c.all : CATEGORY_INFO[cat].name[locale]}
              <span className="font-mono text-[11px] opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div
        className={
          band === "senior" ? "flex flex-col gap-2" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {shown.map((lesson, i) => (
          <div key={lesson.id} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <LessonCard
              lesson={lesson}
              band={band}
              done={progress.lessonsDone.includes(lesson.id)}
              onOpen={() => setOpenId(lesson.id)}
            />
          </div>
        ))}
      </div>

      <LessonDialog lesson={open} band={band} onClose={() => setOpenId(null)} />
    </div>
  );
}

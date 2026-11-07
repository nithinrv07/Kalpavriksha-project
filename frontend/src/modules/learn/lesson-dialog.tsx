"use client";

import { CheckCircle, Lightbulb, SpeakerHigh, Stop, X } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState } from "react";
import { Burst } from "@/components/burst";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import { KaraokeLines, useReadAloud } from "@/components/read-aloud";
import { XP, completeLesson, localDay, type Band } from "@/lib/progress";
import { CATEGORY_INFO, LEARN_COPY, lessonText, type Lesson } from "./lessons";
import { CATEGORY_ICON } from "./category-icons";

/** Lesson reader on a native <dialog>: karaoke read-aloud, meaning / activity, and an XP reward. */
export function LessonDialog({ lesson, band, onClose }: { lesson: Lesson | null; band: Band; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t, locale } = useLocale();
  const c = LEARN_COPY[locale];
  const progress = useProgress();
  const { state, play, stop } = useReadAloud();
  const [slow, setSlow] = useState(band === "junior");
  const [celebrate, setCelebrate] = useState(0);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (lesson && !dialog.open) dialog.showModal();
    if (!lesson && dialog.open) dialog.close();
  }, [lesson]);

  const close = () => {
    stop();
    setCelebrate(0);
    onClose();
  };

  const text = lesson ? lessonText(lesson, locale) : null;
  const done = lesson ? progress.lessonsDone.includes(lesson.id) : false;
  const reading = lesson !== null && state.id === lesson.id;
  const info = lesson ? CATEGORY_INFO[lesson.category] : null;
  const Glyph = lesson ? CATEGORY_ICON[lesson.category] : null;

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-label={lesson?.title[locale]}
      style={{ "--cat": info?.accent ?? "var(--violet)" } as React.CSSProperties}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-[28px] border border-line-strong bg-surface/95 p-0 text-text shadow-[0_-30px_90px_-10px_rgb(0_0_0/0.8)] backdrop-blur-2xl backdrop:bg-black/65 backdrop:backdrop-blur-sm open:animate-[fade-up_0.45s_var(--ease-out)_both] md:inset-0 md:m-auto md:max-h-[88dvh] md:w-[min(760px,calc(100%-3rem))] md:rounded-[28px]"
    >
      {lesson && text && info && Glyph && (
        <div className="relative flex flex-col p-5 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(70%_100%_at_20%_0%,color-mix(in_srgb,var(--cat)_28%,transparent),transparent_70%)]"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--cat)_18%,transparent)] text-[var(--cat)]">
                <Glyph size={24} weight="duotone" />
              </span>
              <div>
                <p className="font-mono text-[12px] text-[var(--cat)]">{info.name[locale]}</p>
                <h2 className="font-display text-[clamp(22px,3vw,30px)] leading-tight tracking-[-0.02em]">
                  {lesson.title[locale]}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={t.close}
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.04] transition-colors hover:bg-white/[0.1]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative mt-8 rounded-3xl border border-line bg-bg/50 p-5 sm:p-7">
            <KaraokeLines
              lines={text.lines}
              lang={text.lang}
              activeLine={reading ? state.line : -1}
              activeWord={reading ? state.word : -1}
              className={`flex flex-col gap-2 font-display ${
                band === "junior"
                  ? "text-[clamp(22px,3.6vw,32px)] leading-[1.45]"
                  : band === "senior"
                    ? "text-[clamp(17px,2.2vw,21px)] leading-[1.6]"
                    : "text-[clamp(19px,2.8vw,26px)] leading-[1.5]"
              }`}
            />
            {lesson.credit && <p className="mt-4 text-right text-[13px] text-muted">— {lesson.credit[locale]}</p>}
          </div>

          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => (reading ? stop() : play(lesson.id, text.lines, text.lang, { rate: slow ? 0.8 : 1 }))}
              className={`inline-flex h-12 items-center gap-2 rounded-full px-5 font-mono text-sm transition-colors ${
                reading
                  ? "bg-white/[0.1] text-text"
                  : "bg-[var(--cat)] text-bg hover:brightness-110"
              }`}
            >
              {reading ? <Stop size={18} weight="fill" /> : <SpeakerHigh size={18} weight="fill" />}
              {reading ? c.stop : c.listen}
            </button>
            <label className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-[13px] text-muted has-[:checked]:border-[var(--cat)] has-[:checked]:text-text">
              <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} className="accent-[var(--cat)]" />
              {c.slower}
            </label>
            {reading && state.silent && <p className="w-full text-[12.5px] text-amber">{c.silent}</p>}
          </div>

          <div className="relative mt-6 rounded-3xl border border-[color-mix(in_srgb,var(--cat)_30%,transparent)] bg-[color-mix(in_srgb,var(--cat)_7%,transparent)] p-5">
            <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--cat)]">
              <Lightbulb size={16} weight="fill" aria-hidden />
              {c.notes[lesson.noteKind]}
            </p>
            <p className={`mt-2 leading-relaxed ${band === "junior" ? "text-[17px]" : "text-[15px]"}`}>
              {lesson.note[locale]}
            </p>
          </div>

          <div className="relative mt-6 flex justify-end">
            {done ? (
              <span className="pop-in relative inline-flex h-14 items-center gap-2 rounded-full bg-success/15 px-6 font-mono text-sm text-success">
                <CheckCircle size={20} weight="fill" />
                {c.learned}
                {celebrate > 0 && (
                  <>
                    <Burst key={celebrate} />
                    <span key={`xp-${celebrate}`} className="float-up absolute -top-6 right-6 font-mono text-[13px] text-amber">
                      +{XP.lesson} XP
                    </span>
                  </>
                )}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  updateProgress((p) => completeLesson(p, lesson.id, localDay()));
                  setCelebrate((n) => n + 1);
                }}
                className="beam-border inline-flex h-14 items-center gap-2 rounded-full bg-violet-deep px-7 font-mono text-sm text-violet-ink transition-transform hover:-translate-y-0.5"
              >
                <CheckCircle size={20} />
                {c.markDone}
              </button>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

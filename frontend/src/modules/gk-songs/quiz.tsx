"use client";

import {
  ArrowRight,
  ArrowsClockwise,
  ArrowUUpLeft,
  CheckCircle,
  Compass,
  Crown,
  Lightning,
  Plant,
  Sparkle,
  Star,
  Timer,
  Trophy,
  XCircle,
} from "@phosphor-icons/react/ssr";
import { useEffect, useState } from "react";
import { Burst } from "@/components/burst";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import { XP, localDay, recordQuiz, type Band } from "@/lib/progress";
import {
  bandToGkLevel,
  GK_COPY,
  GK_LEVEL_CONFIG,
  GK_LEVELS,
  QUESTION_SECONDS,
  QUIZ,
  type GkLevel,
} from "./content";

type Pick = number | "timeout" | null;
const LETTERS = ["A", "B", "C", "D"] as const;
const LETTER_TINT = ["var(--amber)", "var(--teal)", "var(--pink)", "var(--violet)"] as const;

function shuffled(n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j] as number, order[i] as number];
  }
  return order;
}

function starsFor(correct: number, total: number): 0 | 1 | 2 | 3 {
  const pct = total ? correct / total : 0;
  return pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
}

function LevelIcon({ name, className = "size-5" }: { name: string; className?: string }) {
  switch (name) {
    case "plant":
      return <Plant className={className} weight="duotone" />;
    case "compass":
      return <Compass className={className} weight="duotone" />;
    case "crown":
      return <Crown className={className} weight="duotone" />;
    default:
      return <Lightning className={className} weight="duotone" />;
  }
}

export function Quiz({
  band,
  initialLevel,
}: {
  band: Band;
  initialLevel?: GkLevel;
}) {
  const { locale } = useLocale();
  const c = GK_COPY[locale];
  const { quizBest } = useProgress();

  // Active Level: defaults to initialLevel or mapped from the student's band
  const [level, setLevel] = useState<GkLevel>(initialLevel ?? bandToGkLevel(band));

  const questions = QUIZ[level];
  const seconds = QUESTION_SECONDS[level];
  const levelInfo = GK_LEVEL_CONFIG[level];

  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [order, setOrder] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<Pick>(null);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [left, setLeft] = useState(seconds ?? 0);

  const question = questions[order[step] ?? 0];
  const answered = pick !== null;

  const handleSelectLevel = (newLevel: GkLevel) => {
    if (newLevel === level && phase === "intro") return;
    setLevel(newLevel);
    setPhase("intro");
    setStep(0);
    setPick(null);
    setPicks([]);
    setLeft(QUESTION_SECONDS[newLevel] ?? 0);
  };

  const start = () => {
    setOrder(shuffled(questions.length));
    setStep(0);
    setPick(null);
    setPicks([]);
    setLeft(seconds ?? 0);
    setPhase("play");
  };

  const choose = (p: Pick) => {
    if (answered) return;
    setPick(p);
    setPicks((all) => [...all, p]);
  };

  const advance = () => {
    if (step + 1 < questions.length) {
      setStep(step + 1);
      setPick(null);
      setLeft(seconds ?? 0);
      return;
    }
    const correct = picks.filter((p, i) => p === questions[order[i] ?? 0]?.answer).length;
    updateProgress((prog) => recordQuiz(prog, correct, questions.length, localDay()));
    setPhase("result");
  };

  // Next level helper
  const nextLevel = level === "primary" ? "intermediate" : level === "intermediate" ? "advanced" : null;

  // Countdown for timed levels; running out counts as a wrong answer.
  useEffect(() => {
    if (phase !== "play" || seconds === null || answered) return;
    const id = window.setTimeout(() => {
      if (left <= 1) choose("timeout");
      setLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearTimeout(id);
  });

  // Keys 1–4 answer, Enter moves on.
  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const n = Number(e.key);
      if (!answered && n >= 1 && n <= 4) choose(n - 1);
      else if (answered && e.key === "Enter") advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 3-LEVEL SWITCHER BAR */}
      <div className="rounded-3xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
          <div>
            <h2 className="font-display text-lg font-bold text-text">
              {c.levelTitle}
            </h2>
            <p className="text-xs text-muted">
              {c.levelSubtitle}
            </p>
          </div>
          {phase === "play" && (
            <button
              type="button"
              onClick={() => setPhase("intro")}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3.5 py-1 text-xs text-muted hover:border-line-strong hover:text-text transition-colors"
            >
              <ArrowUUpLeft size={14} />
              <span>{c.switchLevel}</span>
            </button>
          )}
        </div>

        {/* 3 Level Cards */}
        <div className="grid gap-3 sm:grid-cols-3">
          {GK_LEVELS.map((lvl) => {
            const isCurrent = level === lvl;
            const cfg = GK_LEVEL_CONFIG[lvl];
            const qCount = QUIZ[lvl].length;
            const timerText = cfg.defaultSeconds ? `${cfg.defaultSeconds}s` : c.untimed.split(" · ")[0];

            return (
              <button
                key={lvl}
                type="button"
                onClick={() => handleSelectLevel(lvl)}
                style={{ "--lvl-accent": cfg.accent } as React.CSSProperties}
                className={`group relative flex flex-col text-left rounded-2xl border p-4 transition-all duration-200 ${
                  isCurrent
                    ? "border-[var(--lvl-accent)] bg-[color-mix(in_srgb,var(--lvl-accent)_15%,var(--surface))] shadow-[0_0_30px_-8px_var(--lvl-accent)]"
                    : "border-line bg-surface-2/60 hover:border-line-strong hover:bg-surface-2"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--lvl-accent)]">
                    <LevelIcon name={cfg.iconName} className="size-4" />
                    <span>{cfg.badge[locale]}</span>
                  </span>
                  <span className="rounded-full bg-white/[0.08] px-2 py-0.5 font-mono text-[10.5px] text-muted">
                    {qCount} Qs · {timerText}
                  </span>
                </div>

                <span className="font-display text-base font-bold text-text">
                  {cfg.name[locale]}
                </span>
                <span className="mt-1 text-[12px] leading-snug text-muted line-clamp-2">
                  {cfg.subtitle[locale]}
                </span>

                <div className="mt-3 flex items-center justify-between border-t border-line/40 pt-2 text-[11px]">
                  <span className="font-mono text-muted/80">
                    {cfg.targetClasses[locale]}
                  </span>
                  {isCurrent && (
                    <span className="font-mono font-semibold text-[var(--lvl-accent)]">
                      Active ●
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PHASE 1: INTRO SCREEN */}
      {phase === "intro" && (
        <div
          style={{ "--lvl-accent": levelInfo.accent } as React.CSSProperties}
          className="fade-up relative flex flex-col items-center overflow-hidden rounded-[28px] border border-line bg-surface px-6 py-12 text-center sm:py-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,color-mix(in_srgb,var(--lvl-accent)_22%,transparent),transparent_70%)]"
          />

          <span className="relative grid size-20 place-items-center rounded-3xl bg-[color-mix(in_srgb,var(--lvl-accent)_18%,transparent)] text-[var(--lvl-accent)] shadow-[0_0_60px_-10px_var(--lvl-accent)]">
            <LevelIcon name={levelInfo.iconName} className="size-10" />
          </span>

          <span className="relative mt-5 inline-flex items-center gap-1.5 rounded-full border border-[var(--lvl-accent)]/30 bg-[color-mix(in_srgb,var(--lvl-accent)_12%,transparent)] px-3 py-1 font-mono text-xs font-semibold text-[var(--lvl-accent)]">
            <span>{levelInfo.badge[locale]}</span>
            <span>·</span>
            <span>{levelInfo.targetClasses[locale]}</span>
          </span>

          <h3 className="relative mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-text">
            {levelInfo.name[locale]}
          </h3>

          <p className="relative mt-2 max-w-xl text-sm leading-relaxed text-muted">
            {levelInfo.subtitle[locale]}
          </p>

          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-xl border border-line bg-surface-2 px-3 py-1.5 font-mono text-xs text-muted">
              {c.questions(questions.length)}
            </span>
            <span className="rounded-xl border border-line bg-surface-2 px-3 py-1.5 font-mono text-xs text-muted">
              {seconds !== null ? c.perQuestion(seconds) : c.untimed}
            </span>
            <span className="rounded-xl border border-line bg-surface-2 px-3 py-1.5 font-mono text-xs text-muted">
              +{XP.quizCorrect} XP per correct
            </span>
            {quizBest > 0 && (
              <span className="flex items-center gap-1 rounded-xl border border-amber/40 bg-amber/10 px-3 py-1.5 font-mono text-xs font-semibold text-amber">
                <Trophy size={14} weight="fill" />
                <span>{c.best}: {quizBest}%</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={start}
            className="beam-border relative mt-8 inline-flex h-14 items-center gap-3 rounded-full bg-violet-deep px-9 font-mono text-sm font-semibold text-violet-ink transition-transform hover:-translate-y-0.5"
          >
            <span>{c.startQuiz} ({levelInfo.name[locale]})</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* PHASE 2: PLAYING QUIZ */}
      {phase === "play" && question && (
        <div
          key={step}
          style={{ "--lvl-accent": levelInfo.accent } as React.CSSProperties}
          className="fade-up rounded-[28px] border border-line bg-surface p-5 sm:p-8"
        >
          {/* Header with Level & Progress */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--lvl-accent)]/40 bg-[color-mix(in_srgb,var(--lvl-accent)_15%,transparent)] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--lvl-accent)]">
                <LevelIcon name={levelInfo.iconName} className="size-3.5" />
                <span>{levelInfo.name[locale]}</span>
              </span>
              <span className="font-mono text-[12px] text-muted">
                {c.questionOf(step + 1, questions.length)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {seconds !== null && (
                <span
                  className={`flex items-center gap-1.5 font-mono text-[13px] ${
                    left <= 5 && !answered ? "text-danger animate-pulse font-bold" : "text-muted"
                  }`}
                  aria-live="off"
                >
                  <Timer size={16} aria-hidden />
                  <span>{left}s</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => setPhase("intro")}
                className="text-xs text-muted hover:text-text font-mono transition-colors"
              >
                {c.switchLevel}
              </button>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="mt-4 flex gap-1.5" aria-hidden>
            {questions.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < step
                    ? picks[i] === questions[order[i] ?? 0]?.answer
                      ? "bg-success"
                      : "bg-danger"
                    : i === step
                      ? "bg-[var(--lvl-accent)] shadow-[0_0_8px_var(--lvl-accent)]"
                      : "bg-white/[0.08]"
                }`}
              />
            ))}
          </div>

          {seconds !== null && !answered && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]" aria-hidden>
              <div
                className="h-full rounded-full bg-[var(--lvl-accent)] transition-[width] duration-1000 ease-linear"
                style={{ width: `${(left / seconds) * 100}%` }}
              />
            </div>
          )}

          {/* Question Title */}
          <h2 className="mt-6 font-display text-[clamp(20px,2.8vw,30px)] leading-snug tracking-[-0.02em] text-balance">
            {question.q[locale]}
          </h2>

          {/* 4 Options Grid */}
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {question.options.map((opt, i) => {
              const correctOpt = answered && i === question.answer;
              const wrongPick = answered && pick === i && pick !== question.answer;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={answered}
                  onClick={() => choose(i)}
                  style={{ "--tint": LETTER_TINT[i] } as React.CSSProperties}
                  className={`flex items-center gap-3 rounded-2xl border text-left transition-all duration-200 min-h-14 px-4 py-3 text-[15.5px] ${
                    correctOpt
                      ? "pop-in border-success bg-success/12 text-text"
                      : wrongPick
                        ? "shake border-danger bg-danger/12"
                        : answered
                          ? "border-line opacity-45"
                          : "border-line bg-white/[0.03] hover:-translate-y-0.5 hover:border-[var(--tint)] hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className={`grid shrink-0 place-items-center rounded-xl font-mono text-[13px] size-8 ${
                      correctOpt
                        ? "bg-success text-bg"
                        : wrongPick
                          ? "bg-danger text-bg"
                          : "bg-[color-mix(in_srgb,var(--tint)_20%,transparent)] text-[var(--tint)]"
                    }`}
                  >
                    {correctOpt ? (
                      <CheckCircle size={18} weight="fill" />
                    ) : wrongPick ? (
                      <XCircle size={18} weight="fill" />
                    ) : (
                      LETTERS[i]
                    )}
                  </span>
                  <span>{opt[locale]}</span>
                </button>
              );
            })}
          </div>

          {/* Answer Feedback & Explanations */}
          {answered && (
            <div
              className="fade-up mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-t border-line/50 pt-5"
              aria-live="polite"
            >
              <div>
                <p className={`font-display text-xl ${pick === question.answer ? "text-success" : "text-danger"}`}>
                  {pick === question.answer ? c.correct : pick === "timeout" ? c.timeUp : c.wrong}
                  {pick === question.answer && (
                    <span className="ml-2 font-mono text-[13px] text-amber">
                      +{XP.quizCorrect} XP
                    </span>
                  )}
                </p>
                <p className="mt-1 max-w-xl text-[14.5px] leading-relaxed text-muted">
                  {question.explain[locale]}
                </p>
              </div>
              <button
                type="button"
                onClick={advance}
                autoFocus
                className="inline-flex h-12 shrink-0 items-center gap-2 self-end rounded-full bg-violet-deep px-6 font-mono text-sm text-violet-ink transition-transform hover:-translate-y-0.5"
              >
                <span>{step + 1 < questions.length ? c.next : c.finish}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* PHASE 3: RESULTS SCREEN */}
      {phase === "result" && (
        (() => {
          const correct = picks.filter((p, i) => p === questions[order[i] ?? 0]?.answer).length;
          const stars = starsFor(correct, questions.length);
          const scorePercent = Math.round((correct / questions.length) * 100);

          return (
            <div className="fade-up flex flex-col gap-4">
              <div
                style={{ "--lvl-accent": levelInfo.accent } as React.CSSProperties}
                className="relative flex flex-col items-center overflow-hidden rounded-[28px] border border-line bg-surface px-6 py-12 text-center"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lvl-accent)]/40 bg-[color-mix(in_srgb,var(--lvl-accent)_15%,transparent)] px-3 py-1 font-mono text-xs font-semibold text-[var(--lvl-accent)] mb-4">
                  <LevelIcon name={levelInfo.iconName} className="size-3.5" />
                  <span>{levelInfo.name[locale]} Completed</span>
                </span>

                <div className="relative flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <Star
                      key={i}
                      size={48}
                      weight="fill"
                      className={`pop-in ${
                        i < stars ? "text-amber drop-shadow-[0_0_14px_rgb(251_191_36/0.6)]" : "text-white/10"
                      }`}
                      style={{ animationDelay: `${200 + i * 180}ms` }}
                    />
                  ))}
                  {stars >= 2 && <Burst />}
                </div>

                <p className="mt-6 font-display text-[clamp(28px,4vw,44px)] tracking-[-0.03em]">
                  {c.cheer[stars]}
                </p>

                <p className="mt-2 font-mono text-[14px] text-muted">
                  {c.result(correct, questions.length)} ({scorePercent}%) · +{correct * XP.quizCorrect} XP
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={start}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-6 text-sm transition-colors hover:bg-white/[0.06]"
                  >
                    <ArrowsClockwise size={16} />
                    <span>{c.again}</span>
                  </button>

                  {nextLevel && (
                    <button
                      type="button"
                      onClick={() => handleSelectLevel(nextLevel)}
                      style={{ "--next-accent": GK_LEVEL_CONFIG[nextLevel].accent } as React.CSSProperties}
                      className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--next-accent)] bg-[color-mix(in_srgb,var(--next-accent)_20%,transparent)] px-6 text-sm font-semibold text-text transition-transform hover:-translate-y-0.5"
                    >
                      <Sparkle size={16} weight="fill" className="text-[var(--next-accent)]" />
                      <span>{c.tryNextLevel} ({GK_LEVEL_CONFIG[nextLevel].name[locale]})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setPhase("intro")}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 text-sm text-muted hover:text-text transition-colors"
                  >
                    <span>{c.switchLevel}</span>
                  </button>
                </div>
              </div>

              {/* Answers Review Details */}
              <details className="group rounded-3xl border border-line bg-surface p-5">
                <summary className="cursor-pointer font-mono text-[13px] text-muted marker:text-violet">
                  {c.review} ({questions.length} questions)
                </summary>
                <ol className="mt-4 flex flex-col gap-3">
                  {order.map((qi, i) => {
                    const q = questions[qi];
                    if (!q) return null;
                    const ok = picks[i] === q.answer;
                    return (
                      <li key={q.id} className="flex gap-3 text-[14px] border-b border-line/30 pb-3 last:border-b-0">
                        {ok ? (
                          <CheckCircle size={20} weight="fill" className="shrink-0 text-success" />
                        ) : (
                          <XCircle size={20} weight="fill" className="shrink-0 text-danger" />
                        )}
                        <span>
                          <span className="block font-medium text-text">{q.q[locale]}</span>
                          <span className="block text-success font-mono text-xs mt-0.5">
                            ✓ {q.options[q.answer]?.[locale]}
                          </span>
                          <span className="block text-[13px] text-muted mt-1 leading-snug">
                            {q.explain[locale]}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </details>
            </div>
          );
        })()
      )}
    </div>
  );
}

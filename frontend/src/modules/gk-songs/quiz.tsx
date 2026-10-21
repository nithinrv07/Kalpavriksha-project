"use client";

import { ArrowRight, ArrowsClockwise, CheckCircle, Lightning, Star, Timer, XCircle } from "@phosphor-icons/react/ssr";
import { useEffect, useState } from "react";
import { Burst } from "@/components/burst";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import { XP, localDay, recordQuiz, type Band } from "@/lib/progress";
import { GK_COPY, QUESTION_SECONDS, QUIZ } from "./content";

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

export function Quiz({ band }: { band: Band }) {
  const { locale } = useLocale();
  const c = GK_COPY[locale];
  const { quizBest } = useProgress();
  const questions = QUIZ[band];
  const seconds = QUESTION_SECONDS[band];

  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [order, setOrder] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<Pick>(null);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [left, setLeft] = useState(seconds ?? 0);

  const question = questions[order[step] ?? 0];
  const answered = pick !== null;

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

  // Countdown (seniors only); running out counts as a wrong answer.
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

  const junior = band === "junior";

  if (phase === "intro") {
    return (
      <div className="fade-up relative flex flex-col items-center overflow-hidden rounded-[28px] border border-line bg-surface px-6 py-12 text-center sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,color-mix(in_srgb,var(--band)_22%,transparent),transparent_70%)]"
        />
        <span className="relative grid size-20 place-items-center rounded-3xl bg-[color-mix(in_srgb,var(--band)_18%,transparent)] text-[var(--band)] shadow-[0_0_60px_-10px_var(--band)]">
          <Lightning size={40} weight="fill" />
        </span>
        <p className="relative mt-6 font-mono text-[13px] text-muted">
          {c.questions(questions.length)}
          {seconds !== null && ` · ${c.perQuestion(seconds)}`} · +{XP.quizCorrect} XP
        </p>
        {quizBest > 0 && (
          <p className="relative mt-2 font-mono text-[13px] text-amber">
            {c.best}: {quizBest}%
          </p>
        )}
        <button
          type="button"
          onClick={start}
          className="beam-border relative mt-8 inline-flex h-14 items-center gap-3 rounded-full bg-violet-deep px-8 font-mono text-sm text-violet-ink transition-transform hover:-translate-y-0.5"
        >
          {c.startQuiz}
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  if (phase === "result") {
    const correct = picks.filter((p, i) => p === questions[order[i] ?? 0]?.answer).length;
    const stars = starsFor(correct, questions.length);
    return (
      <div className="fade-up flex flex-col gap-4">
        <div className="relative flex flex-col items-center overflow-hidden rounded-[28px] border border-line bg-surface px-6 py-12 text-center">
          <div className="relative flex gap-2">
            {[0, 1, 2].map((i) => (
              <Star
                key={i}
                size={junior ? 56 : 44}
                weight="fill"
                className={`pop-in ${i < stars ? "text-amber drop-shadow-[0_0_14px_rgb(251_191_36/0.6)]" : "text-white/10"}`}
                style={{ animationDelay: `${200 + i * 180}ms` }}
              />
            ))}
            {stars >= 2 && <Burst />}
          </div>
          <p className="mt-6 font-display text-[clamp(28px,4vw,44px)] tracking-[-0.03em]">{c.cheer[stars]}</p>
          <p className="mt-2 font-mono text-[14px] text-muted">
            {c.result(correct, questions.length)} · +{correct * XP.quizCorrect} XP
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-line px-6 text-sm transition-colors hover:bg-white/[0.06]"
          >
            <ArrowsClockwise size={16} />
            {c.again}
          </button>
        </div>
        <details className="group rounded-3xl border border-line bg-surface p-5">
          <summary className="cursor-pointer font-mono text-[13px] text-muted marker:text-violet">{c.review}</summary>
          <ol className="mt-4 flex flex-col gap-3">
            {order.map((qi, i) => {
              const q = questions[qi];
              if (!q) return null;
              const ok = picks[i] === q.answer;
              return (
                <li key={q.id} className="flex gap-3 text-[14px]">
                  {ok ? (
                    <CheckCircle size={20} weight="fill" className="shrink-0 text-success" />
                  ) : (
                    <XCircle size={20} weight="fill" className="shrink-0 text-danger" />
                  )}
                  <span>
                    <span className="block">{q.q[locale]}</span>
                    <span className="block text-success">{q.options[q.answer][locale]}</span>
                    <span className="block text-[13px] text-muted">{q.explain[locale]}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </details>
      </div>
    );
  }

  if (!question) return null;
  const isRight = pick === question.answer;

  return (
    <div key={step} className="fade-up rounded-[28px] border border-line bg-surface p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[12px] text-muted">{c.questionOf(step + 1, questions.length)}</p>
        {seconds !== null && (
          <p
            className={`flex items-center gap-1.5 font-mono text-[13px] ${left <= 5 && !answered ? "text-danger" : "text-muted"}`}
            aria-live="off"
          >
            <Timer size={16} aria-hidden />
            {left}s
          </p>
        )}
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {questions.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < step
                ? picks[i] === questions[order[i] ?? 0]?.answer
                  ? "bg-success"
                  : "bg-danger"
                : i === step
                  ? "bg-[var(--band)]"
                  : "bg-white/[0.08]"
            }`}
          />
        ))}
      </div>
      {seconds !== null && !answered && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]" aria-hidden>
          <div
            className="h-full rounded-full bg-[var(--band)] transition-[width] duration-1000 ease-linear"
            style={{ width: `${(left / seconds) * 100}%` }}
          />
        </div>
      )}

      <h2
        className={`mt-6 font-display leading-snug tracking-[-0.02em] text-balance ${
          junior ? "text-[clamp(24px,3.4vw,34px)]" : "text-[clamp(20px,2.6vw,28px)]"
        }`}
      >
        {question.q[locale]}
      </h2>

      <div className={`mt-6 grid gap-2.5 ${junior ? "grid-cols-2" : "sm:grid-cols-2"}`}>
        {question.options.map((opt, i) => {
          const correctOpt = answered && i === question.answer;
          const wrongPick = answered && pick === i && !isRight;
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => choose(i)}
              style={{ "--tint": LETTER_TINT[i] } as React.CSSProperties}
              className={`flex items-center gap-3 rounded-2xl border text-left transition-all duration-200 ${
                junior ? "min-h-20 p-4 text-[18px]" : "min-h-14 px-4 py-3 text-[15.5px]"
              } ${
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
                className={`grid shrink-0 place-items-center rounded-xl font-mono text-[13px] ${junior ? "size-10" : "size-8"} ${
                  correctOpt
                    ? "bg-success text-bg"
                    : wrongPick
                      ? "bg-danger text-bg"
                      : "bg-[color-mix(in_srgb,var(--tint)_20%,transparent)] text-[var(--tint)]"
                }`}
              >
                {correctOpt ? <CheckCircle size={18} weight="fill" /> : wrongPick ? <XCircle size={18} weight="fill" /> : LETTERS[i]}
              </span>
              {opt[locale]}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="fade-up mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" aria-live="polite">
          <div>
            <p className={`font-display text-xl ${isRight ? "text-success" : "text-danger"}`}>
              {isRight ? c.correct : pick === "timeout" ? c.timeUp : c.wrong}
              {isRight && <span className="ml-2 font-mono text-[13px] text-amber">+{XP.quizCorrect} XP</span>}
            </p>
            <p className="mt-1 max-w-xl text-[14.5px] leading-relaxed text-muted">{question.explain[locale]}</p>
          </div>
          <button
            type="button"
            onClick={advance}
            autoFocus
            className="inline-flex h-12 shrink-0 items-center gap-2 self-end rounded-full bg-violet-deep px-6 font-mono text-sm text-violet-ink transition-transform hover:-translate-y-0.5"
          >
            {step + 1 < questions.length ? c.next : c.finish}
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

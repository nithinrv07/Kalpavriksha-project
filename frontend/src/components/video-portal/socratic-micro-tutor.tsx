"use client";

import React from "react";
import {
  ArrowsCounterClockwise,
  GraduationCap,
  Lightbulb,
  Sparkle,
} from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import { useTheme } from "@/lib/theme";
import type { SocraticReflection } from "@/lib/socratic-engine";

interface SocraticMicroTutorProps {
  reflection: SocraticReflection;
  onExploreAnalogy: () => void;
  onRewind: () => void;
  onRetry: () => void;
}

export function SocraticMicroTutor({
  reflection,
  onExploreAnalogy,
  onRewind,
  onRetry,
}: SocraticMicroTutorProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const isTamil = locale === "ta";
  const promptText = isTamil ? reflection.reflectionPrompt.ta : reflection.reflectionPrompt.en;
  const cueText = isTamil ? reflection.diagnosticCue.ta : reflection.diagnosticCue.en;

  return (
    <div
      role="region"
      aria-label="Socratic Micro-Tutor Guidance"
      className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex flex-col gap-3.5 animate-fade-in ${
        isLight
          ? "border-amber-300 bg-amber-50/90 text-amber-950 shadow-amber-900/10"
          : "border-amber-500/50 bg-[#1e1305]/95 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-amber-500/20 border border-amber-500/40 grid place-items-center text-amber-400">
            <GraduationCap size={16} weight="duotone" />
          </div>
          <div>
            <h4 className="font-display text-xs sm:text-sm font-bold text-amber-400">
              Socratic Micro-Tutor
            </h4>
            <span className="font-mono text-[10px] text-amber-300/70">
              Guided Reflection • Conceptual Breakthrough
            </span>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 font-mono text-[10px] text-amber-300 font-bold uppercase">
          Attempt 2 Review
        </span>
      </div>

      {/* Socratic Reflection Prompt */}
      <p className="text-xs sm:text-sm font-medium leading-relaxed">
        {promptText}
      </p>

      {/* Diagnostic Cue Card */}
      <div
        className={`p-3 rounded-2xl border text-xs leading-relaxed italic ${
          isLight
            ? "border-amber-300 bg-white/80 text-amber-900"
            : "border-amber-500/30 bg-black/40 text-amber-200/90"
        }`}
      >
        &ldquo;{cueText}&rdquo;
      </div>

      {/* Action Shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExploreAnalogy}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Lightbulb size={13} weight="fill" />
            <span>Switch Analogy Lens</span>
          </button>
          <button
            type="button"
            onClick={onRewind}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ArrowsCounterClockwise size={13} weight="bold" />
            <span>Rewind Video</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-display text-xs font-bold shadow-md shadow-amber-900/40 transition-all flex items-center gap-1.5 ml-auto"
        >
          <Sparkle size={13} weight="fill" />
          <span>Retry Checkpoint</span>
        </button>
      </div>
    </div>
  );
}

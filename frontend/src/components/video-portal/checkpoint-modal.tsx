"use client";

import React, { useState } from "react";
import {
  ArrowsCounterClockwise,
  CheckCircle,
  Lightbulb,
  Play,
  Sparkle,
  Target,
  Trophy,
} from "@phosphor-icons/react/ssr";
import { Burst } from "@/components/burst";
import { useLocale } from "@/components/locale-provider";
import { useTheme } from "@/lib/theme";
import { updateProgress } from "@/components/progress-store";
import { verifyAnswer } from "@/lib/hash-utils";
import type { TimelineCheckpoint } from "@/lib/manifest-schema";

interface CheckpointModalProps {
  checkpoint: TimelineCheckpoint;
  checkpointNumber: number;
  totalCheckpoints: number;
  onPass: () => void;
  onRewind: (rewindSec: number) => void;
}

type AnalogyPersona = "sports" | "gaming" | "cooking" | "daily_life";

export function CheckpointModal({
  checkpoint,
  checkpointNumber,
  totalCheckpoints,
  onPass,
  onRewind,
}: CheckpointModalProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resultState, setResultState] = useState<"idle" | "correct" | "incorrect">("idle");
  const [activePersona, setActivePersona] = useState<AnalogyPersona>("sports");
  const [showAnalogies, setShowAnalogies] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [failCount, setFailCount] = useState(0);

  const isHard = checkpoint.gate === "HARD";
  const { quiz, analogies, rewindSec, subtopicTitle } = checkpoint;

  const currentStem = locale === "ta" && quiz.stem.ta ? quiz.stem.ta : quiz.stem.en;
  const currentSubtopic = locale === "ta" && subtopicTitle.ta ? subtopicTitle.ta : subtopicTitle.en;

  const handleSelectOption = async (idx: number) => {
    if (resultState === "correct" || verifying) return;
    setSelectedIdx(idx);
    setVerifying(true);

    try {
      const isCorrect = await verifyAnswer(quiz.id, idx, quiz.correctHash);
      if (isCorrect) {
        setResultState("correct");
        setShowConfetti(true);
        // Award XP via progress store
        updateProgress((prev) => ({
          ...prev,
          xp: (prev.xp || 0) + 20,
        }));
      } else {
        setResultState("incorrect");
        setFailCount((prev) => prev + 1);
      }
    } finally {
      setVerifying(false);
    }
  };

  const personaMeta: Record<AnalogyPersona, { label: string; icon: string }> = {
    sports: { label: "Sports & Athletics", icon: "⚽" },
    gaming: { label: "Video Game Mechanics", icon: "🎮" },
    cooking: { label: "Kitchen & Cooking", icon: "🍳" },
    daily_life: { label: "Everyday Life", icon: "🚗" },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Checkpoint Quiz"
      className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      {showConfetti && <Burst />}

      <div
        className={`relative w-full max-w-2xl max-h-[92%] overflow-y-auto rounded-3xl border p-5 sm:p-7 shadow-2xl flex flex-col gap-5 ${
          isLight
            ? "border-purple-300 bg-white/95 text-purple-950 shadow-purple-900/10"
            : "border-purple-800/80 bg-[#140827]/95 text-white shadow-[0_0_50px_rgba(147,51,234,0.3)]"
        }`}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-purple-800/30 pb-4">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase tracking-wider ${
                isHard
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              <Target size={14} weight="bold" />
              {isHard ? "Hard Gate Checkpoint" : "Checkpoint"}
            </span>
            <span className="font-mono text-xs text-purple-300/80">
              Checkpoint {checkpointNumber} of {totalCheckpoints}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400">
            <Sparkle size={14} weight="fill" className="text-amber-400" />
            <span>+20 XP</span>
          </div>
        </div>

        {/* Subtopic Banner */}
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-purple-400 mb-1">
            Now Reviewing Concept
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold leading-snug">
            {currentSubtopic}
          </h3>
        </div>

        {/* Question Stem */}
        <div
          className={`p-4 rounded-2xl border text-sm sm:text-base leading-relaxed ${
            isLight
              ? "bg-purple-50/80 border-purple-200 text-purple-900 font-medium"
              : "bg-purple-950/40 border-purple-800/40 text-purple-100"
          }`}
        >
          {currentStem}
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-2.5">
          {quiz.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const optionText = locale === "ta" && opt.ta ? opt.ta : opt.en;

            let stateStyle = isLight
              ? "bg-white border-purple-200 text-purple-900 hover:border-purple-400 hover:bg-purple-50/50"
              : "bg-purple-900/20 border-purple-800/40 text-purple-200 hover:border-purple-600 hover:bg-purple-900/40";

            if (isSelected) {
              if (resultState === "correct") {
                stateStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold";
              } else if (resultState === "incorrect") {
                stateStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
              } else {
                stateStyle = "bg-purple-600/30 border-purple-400 text-white";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={resultState === "correct" || verifying}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between text-sm sm:text-base ${stateStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-xl font-mono text-xs font-bold ${
                      isSelected
                        ? "bg-purple-500 text-white"
                        : isLight
                        ? "bg-purple-100 text-purple-800"
                        : "bg-purple-950 text-purple-300 border border-purple-800/60"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{optionText}</span>
                </div>

                {isSelected && resultState === "correct" && (
                  <CheckCircle size={20} weight="fill" className="text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Socratic / Diagnostic Feedback on Incorrect Choice */}
        {resultState === "incorrect" && (
          <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-950/30 text-rose-200 text-xs sm:text-sm flex flex-col gap-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <ArrowsCounterClockwise size={16} weight="bold" />
              <span>Not quite right — Active Recall Remediation</span>
            </div>
            {selectedIdx !== null && quiz.socraticCues?.[`distractor_${selectedIdx}`] && (
              <p className="font-mono text-xs text-rose-200/90 pl-6 border-l-2 border-rose-500/40 my-1">
                {quiz.socraticCues[`distractor_${selectedIdx}`]}
              </p>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-rose-300/80">
                Rewind {rewindSec}s to re-watch this core concept in the lecture.
              </span>
              <button
                type="button"
                onClick={() => onRewind(rewindSec)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowsCounterClockwise size={13} weight="bold" />
                Rewind & Replay (-{rewindSec}s)
              </button>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {resultState === "correct" && (
          <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-200 text-xs sm:text-sm flex flex-col gap-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Trophy size={18} weight="fill" />
              <span>Checkpoint Mastered! +20 XP awarded</span>
            </div>
            <p className="text-xs text-emerald-300/90">
              {locale === "ta" && quiz.explanation.ta ? quiz.explanation.ta : quiz.explanation.en}
            </p>
          </div>
        )}

        {/* Metaphor Radio Toggle (Explain by Analogy) */}
        <div className="border-t border-purple-800/30 pt-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAnalogies(!showAnalogies)}
              className="inline-flex items-center gap-2 font-mono text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Lightbulb size={16} weight="fill" className="text-amber-400" />
              <span>{showAnalogies ? "Hide Metaphor Radio" : "Explain by Analogy (4 Real-World Lenses)"}</span>
            </button>

            {resultState === "correct" && (
              <button
                type="button"
                onClick={onPass}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-display text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-all inline-flex items-center gap-2 animate-pulse"
              >
                <Play size={16} weight="fill" />
                Resume Lecture
              </button>
            )}
          </div>

          {showAnalogies && (
            <div className="mt-3 p-4 rounded-2xl border border-purple-800/40 bg-purple-950/50 flex flex-col gap-3 animate-fade-in">
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(personaMeta) as AnalogyPersona[]).map((pKey) => {
                  const isActive = activePersona === pKey;
                  return (
                    <button
                      key={pKey}
                      type="button"
                      onClick={() => setActivePersona(pKey)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                          : "bg-purple-900/30 text-purple-300 hover:bg-purple-900/50"
                      }`}
                    >
                      <span>{personaMeta[pKey].icon}</span>
                      <span>{personaMeta[pKey].label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs sm:text-sm text-purple-200/90 leading-relaxed italic border-l-2 border-purple-500 pl-3">
                &ldquo;{analogies[activePersona]}&rdquo;
              </div>

              <div className="text-[11px] font-mono text-purple-400/70">
                Textbook Citation: Page {checkpoint.bookCitation.page}, {checkpoint.bookCitation.paragraphAnchor}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

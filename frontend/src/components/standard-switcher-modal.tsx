"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import {
  getSeniorGroup,
  SENIOR_GROUPS,
  type SeniorGroupId,
} from "@/lib/curriculum";

interface StandardSwitcherModalProps {
  currentGrade: number;
  currentSeniorGroup?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectStandard: (std: number, seniorGroup?: string) => void;
}

function StandardSwitcherDialog({
  currentGrade,
  currentSeniorGroup,
  onClose,
  onSelectStandard,
}: Omit<StandardSwitcherModalProps, "isOpen">) {
  const { locale } = useLocale();

  const validGroup: SeniorGroupId =
    currentSeniorGroup === "commerce" || currentSeniorGroup === "business_maths"
      ? currentSeniorGroup
      : "cs";

  const [step, setStep] = useState<"standards" | "group">("standards");
  const [pendingGrade, setPendingGrade] = useState<number>(
    currentGrade >= 11 ? currentGrade : 11,
  );
  const [chosenGroup, setChosenGroup] = useState<SeniorGroupId>(validGroup);

  const handleSelectJuniorStandard = (std: number) => {
    onSelectStandard(std);
    onClose();
  };

  const handleSelectSeniorGrade = (std: number) => {
    setPendingGrade(std);
    setStep("group");
  };

  const handleConfirmSeniorGroup = (groupId: SeniorGroupId) => {
    onSelectStandard(pendingGrade, groupId);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Change school standard"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="pop-in relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-line-strong bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "standards" ? (
          <>
            {/* Step 1: Standards Selection */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight">
                  {locale === "ta" ? "வகுப்பை மாற்று" : "Select Your Standard"}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  {locale === "ta"
                    ? "வகுப்பு 1 முதல் 12 வரையிலான தமிழ்நாடு சமச்சீர் கல்வி பாடத்திட்டம்."
                    : "Tamil Nadu Samacheer Kalvi K-12 Curriculum (Class 1 to 12)."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-xl border border-line text-muted hover:text-text"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-5">
              {/* 1. Seed (Class 1-3) */}
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-amber">
                  <span className="size-2 rounded-full bg-amber" />
                  <span>Seed (விதை / ஆரம்ப நிலை) · Class 1–3</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((std) => {
                    const isSelected = std === currentGrade;
                    return (
                      <button
                        key={std}
                        type="button"
                        onClick={() => handleSelectJuniorStandard(std)}
                        className={`flex flex-col items-center justify-center rounded-2xl border p-3 transition-all ${
                          isSelected
                            ? "border-amber bg-amber/20 text-amber shadow-[0_0_20px_-5px_var(--amber)]"
                            : "border-line bg-surface-2 hover:border-line-strong hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="font-mono text-[10px] text-muted">Class</span>
                        <span className="font-display text-xl font-bold">{std}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Plant (Class 4-10) */}
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-violet">
                  <span className="size-2 rounded-full bg-violet" />
                  <span>Plant (செடி / நடுநிலை) · Class 4–10</span>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {[4, 5, 6, 7, 8, 9, 10].map((std) => {
                    const isSelected = std === currentGrade;
                    return (
                      <button
                        key={std}
                        type="button"
                        onClick={() => handleSelectJuniorStandard(std)}
                        className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 transition-all ${
                          isSelected
                            ? "border-violet bg-violet-deep/60 text-violet-ink shadow-[0_0_20px_-5px_var(--violet)]"
                            : "border-line bg-surface-2 hover:border-line-strong hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="font-mono text-[10px] text-muted">Class</span>
                        <span className="font-display text-xl font-bold">{std}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Tree (Class 11-12) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-teal">
                    <span className="size-2 rounded-full bg-teal" />
                    <span>Tree (வளர்ந்த மரம் / மேல்நிலை) · Class 11–12</span>
                  </div>
                  <span className="font-mono text-[10px] text-teal/80">
                    {locale === "ta" ? "பாடப்பிரிவு கேட்கப்படும்" : "Asks for stream"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[11, 12].map((std) => {
                    const isSelected = std === currentGrade;
                    return (
                      <button
                        key={std}
                        type="button"
                        onClick={() => handleSelectSeniorGrade(std)}
                        className={`group relative flex flex-col items-center justify-center rounded-2xl border p-3.5 transition-all ${
                          isSelected
                            ? "border-teal bg-teal/20 text-teal shadow-[0_0_20px_-5px_var(--teal)]"
                            : "border-line bg-surface-2 hover:border-teal/60 hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="font-mono text-[10px] text-muted">Class</span>
                        <span className="font-display text-2xl font-bold">{std}</span>
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-teal/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-teal group-hover:bg-teal/25 transition-colors">
                          {isSelected && currentSeniorGroup ? (
                            <>
                              <Check size={10} weight="bold" />
                              <span>{getSeniorGroup(currentSeniorGroup)?.badge ?? "Group"}</span>
                            </>
                          ) : (
                            <span>{locale === "ta" ? "பிரிவைத் தேர்வுசெய் →" : "Select Group →"}</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* If already in Class 11 or 12, show active stream card with quick change button */}
                {currentGrade >= 11 && (
                  <div className="mt-3 flex items-center justify-between rounded-2xl border border-teal/30 bg-teal/5 p-3">
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-wider text-teal">
                        {locale === "ta" ? "தற்போதைய மேல்நிலைப் பாடப்பிரிவு:" : "Current Active Stream:"}
                      </p>
                      <p className="font-display text-sm font-bold text-text">
                        {getSeniorGroup(currentSeniorGroup)?.name[locale] ?? "Computer Science Group"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectSeniorGrade(currentGrade)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-teal/40 bg-teal/20 px-3 py-1.5 font-mono text-xs font-semibold text-teal hover:bg-teal/30 transition-colors"
                    >
                      <span>{locale === "ta" ? "பிரிவை மாற்று" : "Change Group"}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-line px-5 py-2 font-mono text-xs text-muted hover:text-text"
              >
                {locale === "ta" ? "மூடு" : "Cancel"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Higher Secondary Group Selection */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep("standards")}
                  className="grid size-9 place-items-center rounded-xl border border-line text-muted hover:border-line-strong hover:text-text transition-colors"
                  aria-label="Back to standards list"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-teal/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-teal">
                      Class {pendingGrade} · {locale === "ta" ? "மேல்நிலை" : "Higher Secondary"}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                    {locale === "ta"
                      ? `வகுப்பு ${pendingGrade}: பாடப்பிரிவைத் தேர்ந்தெடுக்கவும்`
                      : `Class ${pendingGrade}: Select Your Group`}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-xl border border-line text-muted hover:text-text"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-3 text-xs text-muted leading-relaxed">
              {locale === "ta"
                ? `வகுப்பு ${pendingGrade}-க்கான மேல்நிலைப் பாடப்பிரிவைத் தேர்வுசெய்யவும். அதற்கேற்ப உங்கள் பாடங்கள் மற்றும் இயல்கள் காண்பிக்கப்படும்:`
                : `Select your higher secondary group for Class ${pendingGrade}. Curriculum, subjects, and chapters will be customized to your stream:`}
            </p>

            {/* 3 Group Cards */}
            <div className="mt-4 flex flex-col gap-3">
              {SENIOR_GROUPS.map((grp) => {
                const isSelected = chosenGroup === grp.id;
                return (
                  <div
                    key={grp.id}
                    style={{ "--grp-accent": grp.accent } as React.CSSProperties}
                    onClick={() => setChosenGroup(grp.id as SeniorGroupId)}
                    className={`group relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-all duration-200 ${
                      isSelected
                        ? "border-[var(--grp-accent)] bg-[color-mix(in_srgb,var(--grp-accent)_14%,var(--surface))] shadow-[0_0_24px_-4px_var(--grp-accent)]"
                        : "border-line bg-surface-2 hover:border-line-strong hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="rounded-lg border border-[var(--grp-accent)]/40 bg-[var(--grp-accent)]/15 px-2.5 py-1 font-mono text-[11px] font-bold text-[var(--grp-accent)]">
                          {grp.badge}
                        </span>
                        <span className="font-mono text-[11px] text-muted">
                          {grp.code}
                        </span>
                      </div>
                      <span
                        className={`grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${
                          isSelected
                            ? "border-[var(--grp-accent)] bg-[var(--grp-accent)] text-bg"
                            : "border-line-strong text-transparent group-hover:border-muted"
                        }`}
                      >
                        <Check size={12} weight="bold" />
                      </span>
                    </div>

                    <h4 className="font-display text-base font-bold text-text mt-2">
                      {grp.name[locale]}
                    </h4>

                    <p className="mt-1 text-xs text-muted leading-relaxed">
                      {grp.description[locale]}
                    </p>

                    {/* Electives Chips */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-line/60">
                      <div className="flex flex-wrap gap-1.5">
                        {grp.electiveCodes.map((code) => (
                          <span
                            key={code}
                            className="rounded-md border border-line bg-surface/80 px-2 py-0.5 font-mono text-[10px] text-muted"
                          >
                            {code}
                          </span>
                        ))}
                        <span className="rounded-md border border-line/50 bg-surface/40 px-2 py-0.5 font-mono text-[10px] text-muted/80">
                          + TAM & ENG
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmSeniorGroup(grp.id as SeniorGroupId);
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--grp-accent)]/40 bg-[var(--grp-accent)]/10 px-3 py-1 font-mono text-[11px] font-semibold text-[var(--grp-accent)] hover:bg-[var(--grp-accent)]/20 transition-colors"
                      >
                        <span>{locale === "ta" ? "இப்பிரிவைத் தேர்வுசெய்" : "Select & Apply"}</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer with Back, Cancel, and Apply */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => setStep("standards")}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-mono text-xs text-muted hover:border-line-strong hover:text-text transition-colors"
              >
                <ArrowLeft size={13} />
                <span>{locale === "ta" ? "வகுப்புகளுக்கு திரும்பு" : "Back to Classes"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-line px-4 py-2 font-mono text-xs text-muted hover:text-text"
                >
                  {locale === "ta" ? "ரத்து" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmSeniorGroup(chosenGroup)}
                  className="inline-flex items-center gap-2 rounded-full border border-teal bg-teal px-5 py-2 font-mono text-xs font-bold text-bg shadow-[0_0_20px_-3px_var(--teal)] hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  <span>
                    {locale === "ta"
                      ? `வகுப்பு ${pendingGrade} உறுதிசெய் (${getSeniorGroup(chosenGroup)?.badge})`
                      : `Apply Class ${pendingGrade} (${getSeniorGroup(chosenGroup)?.badge})`}
                  </span>
                  <ArrowRight size={13} weight="bold" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function StandardSwitcherModal({
  currentGrade,
  currentSeniorGroup,
  isOpen,
  onClose,
  onSelectStandard,
}: StandardSwitcherModalProps) {
  if (!isOpen) return null;

  return (
    <StandardSwitcherDialog
      currentGrade={currentGrade}
      currentSeniorGroup={currentSeniorGroup}
      onClose={onClose}
      onSelectStandard={onSelectStandard}
    />
  );
}

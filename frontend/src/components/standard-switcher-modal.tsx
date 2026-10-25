"use client";

import { Check, X } from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import { SENIOR_GROUPS, type SeniorGroupId } from "@/lib/curriculum";

export function StandardSwitcherModal({
  currentGrade,
  currentSeniorGroup,
  isOpen,
  onClose,
  onSelectStandard,
}: {
  currentGrade: number;
  currentSeniorGroup?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectStandard: (std: number, seniorGroup?: string) => void;
}) {
  const { locale } = useLocale();
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Change school standard"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="pop-in relative w-full max-w-xl rounded-3xl border border-line-strong bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight">
              {locale === "ta" ? "வகுப்பை மாற்று" : locale === "hi" ? "कक्षा बदलें" : "Select Your Standard"}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {locale === "ta"
                ? "வகுப்பு 1 முதல் 12 வரையிலான தமிழ்நாடு சமச்சீர் கல்வி பாடத்திட்டம்."
                : locale === "hi"
                  ? "कक्षा 1 से 12 तक तमिलनाडु समचीर कल्वि पाठ्यक्रम।"
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
                    onClick={() => {
                      onSelectStandard(std);
                      onClose();
                    }}
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
                    onClick={() => {
                      onSelectStandard(std);
                      onClose();
                    }}
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
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-teal">
              <span className="size-2 rounded-full bg-teal" />
              <span>Tree (வளர்ந்த மரம் / மேல்நிலை) · Class 11–12</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[11, 12].map((std) => {
                const isSelected = std === currentGrade;
                return (
                  <button
                    key={std}
                    type="button"
                    onClick={() => {
                      onSelectStandard(std, currentSeniorGroup ?? "cs");
                      onClose();
                    }}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 transition-all ${
                      isSelected
                        ? "border-teal bg-teal/20 text-teal shadow-[0_0_20px_-5px_var(--teal)]"
                        : "border-line bg-surface-2 hover:border-line-strong hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-muted">Class</span>
                    <span className="font-display text-xl font-bold">{std}</span>
                  </button>
                );
              })}
            </div>

            {/* If 11 or 12 is chosen/active, show quick stream/group selection */}
            {currentGrade >= 11 && (
              <div className="mt-3 rounded-2xl border border-teal/30 bg-teal/5 p-3">
                <p className="font-mono text-[11px] uppercase tracking-wider text-teal mb-2">
                  {locale === "ta" ? "மேல்நிலைப் பிரிவு (Group):" : locale === "hi" ? "ग्रुप (Group):" : "Group Stream:"}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {SENIOR_GROUPS.map((grp) => {
                    const isGrpActive = currentSeniorGroup === grp.id;
                    return (
                      <button
                        key={grp.id}
                        type="button"
                        onClick={() => {
                          onSelectStandard(currentGrade, grp.id);
                          onClose();
                        }}
                        style={{ "--grp-accent": grp.accent } as React.CSSProperties}
                        className={`flex flex-col rounded-xl border p-2 text-left transition-all ${
                          isGrpActive
                            ? "border-[var(--grp-accent)] bg-[color-mix(in_srgb,var(--grp-accent)_16%,var(--surface))] shadow-[0_0_15px_-4px_var(--grp-accent)]"
                            : "border-line bg-surface hover:border-line-strong hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-semibold text-[var(--grp-accent)]">
                            {grp.badge}
                          </span>
                          {isGrpActive && <Check size={12} weight="bold" className="text-[var(--grp-accent)]" />}
                        </div>
                        <span className="text-[12px] font-semibold line-clamp-1 text-text mt-0.5">
                          {grp.name[locale]}
                        </span>
                      </button>
                    );
                  })}
                </div>
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
            {locale === "ta" ? "மூடு" : locale === "hi" ? "बंद करें" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

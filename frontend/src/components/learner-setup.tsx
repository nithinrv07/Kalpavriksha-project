"use client";

import { ArrowRight, Check, GraduationCap, ShieldCheck, X } from "@phosphor-icons/react/ssr";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Avatar } from "@/components/avatar";
import { useLocale } from "@/components/locale-provider";
import { authService } from "@/lib/auth-service";
import { AVATAR_NAME, BAND_INFO, SETUP_COPY } from "@/lib/bands";
import { SENIOR_GROUPS } from "@/lib/curriculum";
import { LOCALES, LOCALE_LABEL, type Locale } from "@/lib/i18n";
import { AVATARS, BANDS, BAND_GRADES, bandOf, type AvatarId, type Band, type Profile } from "@/lib/progress";

const noopSubscribe = () => () => {};
/** False during SSR and hydration, true afterwards: lets device-stored state render without a flash. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Seed, sapling or tree drawing for a band. Decorative. */
export function GrowthStage({ band, className = "" }: { band: Band; className?: string }) {
  const accent = BAND_INFO[band].accent;
  return (
    <svg viewBox="0 0 120 120" aria-hidden className={className}>
      <ellipse cx="60" cy="108" rx="34" ry="6" fill="rgb(255 255 255 / 0.06)" />
      {band === "junior" && (
        <g className="sway">
          <path d="M60 106 V78" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          <path className="leaf" d="M60 82 C44 80 38 66 40 58 C52 58 60 68 60 82Z" fill={accent} opacity="0.9" />
          <path
            className="leaf"
            style={{ animationDelay: "120ms" }}
            d="M60 78 C74 76 82 62 80 52 C68 52 60 62 60 78Z"
            fill={accent}
          />
        </g>
      )}
      {band === "middle" && (
        <g className="sway">
          <path d="M60 106 V46" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M60 80 L44 66 M60 68 L76 54" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          {[
            [40, 62],
            [80, 50],
            [60, 40],
            [48, 46],
            [72, 70],
          ].map(([x, y], i) => (
            <g key={i} transform={`rotate(${i % 2 ? 30 : -30} ${x} ${y})`}>
              <ellipse
                className="leaf"
                style={{ animationDelay: `${i * 90}ms` }}
                cx={x}
                cy={y}
                rx="10"
                ry="6"
                fill={accent}
                opacity={0.65 + (i % 3) * 0.12}
              />
            </g>
          ))}
        </g>
      )}
      {band === "senior" && (
        <g className="sway">
          <path d="M56 106 L58 66 L62 66 L64 106Z" fill={accent} opacity="0.75" />
          <path d="M60 78 L42 62 M60 72 L80 56" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
          {[
            [60, 38, 22],
            [38, 54, 16],
            [82, 52, 17],
            [48, 30, 14],
            [74, 28, 15],
          ].map(([x, y, r], i) => (
            <circle
              key={i}
              className="leaf"
              style={{ animationDelay: `${i * 90}ms` }}
              cx={x}
              cy={y}
              r={r}
              fill={accent}
              opacity={0.35 + (i % 3) * 0.15}
            />
          ))}
        </g>
      )}
    </svg>
  );
}

export function LearnerSetup({
  existing,
  redirectTo,
  onDone,
}: {
  existing?: Profile | null;
  redirectTo?: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const c = SETUP_COPY[locale];

  // Selected Band (Stage): "junior" (Seed: 1-3), "middle" (Plant: 4-10), "senior" (Tree: 11-12)
  const [selectedBand, setSelectedBand] = useState<Band>(
    existing ? bandOf(existing.grade) : "middle",
  );

  // Exact School Standard (Class 1 to 12)
  const [grade, setGrade] = useState<number | null>(existing?.grade ?? 6);
  const [seniorGroup, setSeniorGroup] = useState<string | null>(
    existing && existing.grade >= 11 ? (existing.seniorGroup ?? "cs") : null,
  );
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [name, setName] = useState(existing?.name ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [prefLang, setPrefLang] = useState<Locale>(existing?.preferredLanguage ?? locale);
  const [avatar, setAvatar] = useState<AvatarId>(existing?.avatar ?? "cat");

  const band = grade !== null ? bandOf(grade) : selectedBand;
  const isSeniorGrade = grade !== null && grade >= 11;
  const ready = grade !== null && name.trim().length > 0 && (!isSeniorGrade || Boolean(seniorGroup));

  // Handle clicking one of the 3 stage cards
  const handleStageSelect = (b: Band) => {
    setSelectedBand(b);
    const available = BAND_GRADES[b];
    // If current grade is not in this band, pick a sensible default
    if (!grade || !available.includes(grade)) {
      if (b === "junior") setGrade(1);
      else if (b === "middle") setGrade(6);
      else if (b === "senior") {
        setGrade(11);
        setIsGroupModalOpen(true);
      }
    } else if (b === "senior") {
      setIsGroupModalOpen(true);
    }
  };

  // Handle clicking a specific class button
  const handleGradeSelect = (g: number) => {
    setGrade(g);
    if (g >= 11) {
      setSelectedBand("senior");
      setIsGroupModalOpen(true);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || grade === null) {
      if (isSeniorGrade && !seniorGroup) {
        setIsGroupModalOpen(true);
      }
      return;
    }

    authService.saveProfile({
      name: name.trim(),
      email: email.trim() || undefined,
      grade,
      avatar,
      preferredLanguage: prefLang,
      seniorGroup: grade >= 11 ? (seniorGroup || "cs") : undefined,
      studentId: existing?.studentId,
    });

    if (prefLang !== locale) {
      setLocale(prefLang);
    }

    if (onDone) {
      onDone();
    }

    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <form onSubmit={submit} className="fade-up flex flex-col gap-8">
      {/* Mock Authentication Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet/30 bg-violet-deep/20 px-4 py-3 text-xs text-violet-ink">
        <span className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-violet" weight="fill" />
          <span>
            <strong>Authentication Mode:</strong> Mock / Device Profile (Stored persistently & synced to /api/profile)
          </span>
        </span>
        <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 font-mono text-[11px] text-muted">
          Ready for School SSO
        </span>
      </div>

      <div>
        <h2 className="font-display text-[clamp(26px,3.8vw,44px)] leading-[1.05] tracking-[-0.035em] text-balance">
          {existing
            ? (locale === "ta" ? "உன் சுயவிவரத்தைப் புதுப்பி" : "Update your student profile")
            : c.askTitle}
        </h2>
        <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-muted">
          {locale === "ta"
            ? "விதை (வகுப்பு 1–3), செடி (வகுப்பு 4–10) அல்லது மரம் (வகுப்பு 11–12) தேர்ந்தெடுத்துத் தொடர்க."
            : "Choose Seed for Class 1–3, Plant for Class 4–10, or Tree for Class 11–12, then proceed."}
        </p>
      </div>

      {/* 1. THREE STAGE CARDS: Seed (1-3), Plant (4-10), Tree (11-12) */}
      <fieldset>
        <div className="flex items-center justify-between mb-3">
          <legend className="font-mono text-[12px] uppercase tracking-[0.14em] text-violet font-semibold">
            1. {locale === "ta" ? "படிநிலையைத் தேர்ந்தெடு" : "Select Your Growth Stage"} *
          </legend>
          {grade && (
            <span className="font-mono text-[12px] text-muted">
              Selected: <strong className="text-text">{c.classWord} {grade}</strong> ({BAND_INFO[bandOf(grade)].name[locale]})
            </span>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {BANDS.map((b) => {
            const info = BAND_INFO[b];
            const isSelected = selectedBand === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => handleStageSelect(b)}
                style={{ "--band": info.accent } as React.CSSProperties}
                className={`group relative flex flex-col rounded-3xl border p-5 text-left transition-all duration-300 ${
                  isSelected
                    ? "border-[var(--band)] bg-[color-mix(in_srgb,var(--band)_14%,var(--surface))] shadow-[0_0_60px_-15px_var(--band)]"
                    : "border-line bg-surface hover:border-line-strong hover:bg-surface-2 hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--band)] font-semibold">
                    {info.classes[locale]}
                  </span>
                  <span
                    className={`grid size-6 place-items-center rounded-full border transition-colors ${
                      isSelected ? "border-[var(--band)] bg-[var(--band)] text-bg" : "border-line-strong"
                    }`}
                  >
                    {isSelected && <Check size={14} weight="bold" />}
                  </span>
                </div>

                <GrowthStage
                  band={b}
                  className="mx-auto my-3 size-24 transition-transform duration-500 group-hover:scale-110"
                />

                <span className="font-display text-2xl font-bold tracking-tight text-text">
                  {info.name[locale]}
                </span>
                <span className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">
                  {info.tagline[locale]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Class Selector for the Chosen Stage */}
        <div className="mt-5 rounded-2xl border border-line bg-surface-2 p-4">
          <p className="font-mono text-[11.5px] uppercase tracking-wider text-muted mb-3">
            Pick your exact class in {BAND_INFO[selectedBand].name[locale]}:
          </p>

          <div className="flex flex-wrap gap-2.5">
            {BAND_GRADES[selectedBand].map((g) => {
              const isSelected = grade === g;
              const accent = BAND_INFO[selectedBand].accent;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGradeSelect(g)}
                  style={{ "--band": accent } as React.CSSProperties}
                  className={`group relative flex h-13 min-w-[76px] flex-col items-center justify-center rounded-2xl border px-4 py-2 transition-all duration-200 ${
                    isSelected
                      ? "border-[var(--band)] bg-[var(--band)] text-bg font-bold shadow-[0_0_20px_-4px_var(--band)]"
                      : "border-line bg-surface text-text hover:border-line-strong hover:bg-white/[0.04]"
                  }`}
                >
                  <span className={`font-mono text-[10px] uppercase opacity-75 ${isSelected ? "text-bg" : "text-muted"}`}>
                    {c.classWord}
                  </span>
                  <span className="font-display text-xl font-bold">
                    {g}
                  </span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-white text-bg shadow">
                      <Check size={10} weight="bold" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Higher Secondary Group Selector (Class 11 & 12) */}
        {(selectedBand === "senior" || (grade !== null && grade >= 11)) && (
          <div className={`mt-4 rounded-2xl border p-4 transition-all duration-300 ${
            !seniorGroup
              ? "border-amber-500/70 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40"
              : "border-teal/40 bg-teal/5"
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap size={18} weight="fill" className={!seniorGroup ? "text-amber-400" : "text-teal"} />
                <span className={`font-mono text-[11.5px] uppercase tracking-wider font-semibold ${
                  !seniorGroup ? "text-amber-300" : "text-teal"
                }`}>
                  {locale === "ta"
                    ? "மேல்நிலைப் பாடப்பிரிவைத் தேர்ந்தெடு (Class 11 & 12 Group) *"
                    : `Select Class ${grade || 11} Stream / Group *`}
                </span>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10.5px] ${
                !seniorGroup ? "bg-amber-500/20 text-amber-300 font-bold" : "bg-teal/20 text-teal"
              }`}>
                {!seniorGroup ? "Action Required" : "4 Core Electives"}
              </span>
            </div>

            {!seniorGroup && (
              <p className="mb-3 font-display text-xs text-amber-200/90 leading-relaxed">
                {locale === "ta"
                  ? "வகுப்பு 11/12ல் தொடர ஏதேனும் ஒரு பாடப்பிரிவைத் தேர்ந்தெடுக்கவும் (கணினி அறிவியல், வணிகவியல் அல்லது வணிகக் கணிதம்)."
                  : "Please select your higher secondary stream to proceed (Computer Science, Commerce with CA, or Business Maths)."}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              {SENIOR_GROUPS.map((grp) => {
                const isGrpSelected = seniorGroup === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => setSeniorGroup(grp.id)}
                    style={{ "--grp-accent": grp.accent } as React.CSSProperties}
                    className={`flex flex-col text-left rounded-2xl border p-3.5 transition-all duration-200 ${
                      isGrpSelected
                        ? "border-[var(--grp-accent)] bg-[color-mix(in_srgb,var(--grp-accent)_16%,var(--surface))] shadow-[0_0_25px_-5px_var(--grp-accent)] scale-[1.02]"
                        : "border-line bg-surface hover:border-line-strong hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[var(--grp-accent)]">
                        {grp.badge}
                      </span>
                      <span
                        className={`grid size-5 place-items-center rounded-full border transition-colors ${
                          isGrpSelected
                            ? "border-[var(--grp-accent)] bg-[var(--grp-accent)] text-bg"
                            : "border-line-strong text-transparent"
                        }`}
                      >
                        <Check size={11} weight="bold" />
                      </span>
                    </div>
                    <span className="font-display text-base font-bold text-text">
                      {grp.name[locale]}
                    </span>
                    <span className="mt-1 text-[12px] leading-snug text-muted line-clamp-3">
                      {grp.description[locale]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </fieldset>

      {/* 2. Student Profile Details: Name, Email, Preferred Language & Avatar */}
      <div className="grid gap-5 rounded-3xl border border-line bg-surface p-5 sm:p-7 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
            2. {c.nameLabel} *
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            required
            autoComplete="name"
            placeholder={c.namePlaceholder}
            className="h-13 rounded-2xl border border-line bg-bg/70 px-4 text-[16px] text-text placeholder:text-muted/60 focus:border-violet/60 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
            3. {locale === "ta" ? "மின்னஞ்சல் அல்லது மாணவர் எண்" : "Email or Student Login ID"}
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={80}
            autoComplete="email"
            placeholder="student@school.edu.in"
            className="h-13 rounded-2xl border border-line bg-bg/70 px-4 text-[16px] text-text placeholder:text-muted/60 focus:border-violet/60 focus:outline-none"
          />
        </label>

        {/* Preferred Language */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
            4. {locale === "ta" ? "விருப்ப மொழி" : "Preferred Language"}
          </span>
          <div className="flex gap-2">
            {LOCALES.map((l) => {
              const active = prefLang === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => setPrefLang(l)}
                  className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border font-mono text-xs transition-colors ${
                    active
                      ? "border-violet bg-violet-deep text-violet-ink"
                      : "border-line bg-bg/60 text-muted hover:text-text"
                  }`}
                >
                  {LOCALE_LABEL[l].native}
                  {active && <Check size={12} weight="bold" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buddy Avatar Selector */}
        <fieldset>
          <legend className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
            5. {c.avatarLabel}
          </legend>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8 md:grid-cols-4">
            {AVATARS.map((a) => (
              <label
                key={a}
                title={AVATAR_NAME[a][locale]}
                className="grid cursor-pointer place-items-center rounded-2xl border border-transparent p-1 transition-all duration-200 hover:bg-white/[0.06] has-[:checked]:scale-105 has-[:checked]:border-violet/60 has-[:checked]:bg-violet-deep/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-violet"
              >
                <input
                  type="radio"
                  name="avatar"
                  value={a}
                  checked={avatar === a}
                  onChange={() => setAvatar(a)}
                  className="sr-only"
                  aria-label={AVATAR_NAME[a][locale]}
                />
                <Avatar id={a} className="size-10" iconSize={22} />
              </label>
            ))}
          </div>
        </fieldset>

        {/* Submit / Proceed Action */}
        <div className="flex flex-col gap-3 pt-3 md:col-span-2 md:flex-row md:items-center md:justify-between border-t border-line/60">
          <p className="text-[12.5px] text-muted/80">{c.deviceNote}</p>
          <button
            type="submit"
            disabled={!ready}
            className="beam-border group inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-violet-deep px-9 font-mono text-sm font-semibold text-violet-ink transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 disabled:[&::before]:hidden"
          >
            <span>
              {isSeniorGrade && !seniorGroup
                ? (locale === "ta" ? "பாடப்பிரிவைத் தேர்ந்தெடுக்கவும் →" : "Select Your Group to Proceed →")
                : `Proceed to Class ${grade ?? ""} →`}
            </span>
            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Interactive Higher Secondary Group Selection Modal (Asks group when choosing Class 11 or 12) */}
      {isGroupModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Select Higher Secondary Group"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => {
            if (seniorGroup) setIsGroupModalOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-purple-500/40 bg-gradient-to-b from-[#1c0e35] via-[#140a28] to-[#0d061c] p-6 sm:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(168,85,247,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-purple-900/40 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-purple-500/20 text-purple-300">
                    <GraduationCap size={18} weight="fill" />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-purple-300 font-bold">
                    Class {grade || 11} Stream Selection
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight">
                  {locale === "ta" ? "உங்கள் பாடப்பிரிவைத் தேர்ந்தெடுக்கவும்" : "Select Your Higher Secondary Group"}
                </h3>
                <p className="mt-1 text-xs text-purple-200/70">
                  {locale === "ta"
                    ? "வகுப்பு 11 மற்றும் 12க்கான தமிழ்நாடு சமச்சீர் கல்வி பிரிவு."
                    : `Tamil Nadu Samacheer Kalvi Higher Secondary Group for Class ${grade || 11}.`}
                </p>
              </div>
              {seniorGroup && (
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="grid size-8 place-items-center rounded-xl border border-purple-800/40 text-purple-300 hover:text-white hover:border-purple-600 transition-colors"
                  title="Close"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* 3 Senior Groups */}
            <div className="mt-5 grid gap-3">
              {SENIOR_GROUPS.map((grp) => {
                const isGrpSelected = seniorGroup === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => {
                      setSeniorGroup(grp.id);
                      setIsGroupModalOpen(false);
                    }}
                    className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isGrpSelected
                        ? "border-purple-400 bg-purple-900/50 shadow-[0_0_25px_rgba(168,85,247,0.35)] ring-1 ring-purple-400/60 scale-[1.01]"
                        : "border-purple-900/40 bg-purple-950/20 hover:border-purple-700/60 hover:bg-purple-900/30"
                    }`}
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-purple-300">
                          {grp.badge}
                        </span>
                        <span className="rounded-full bg-purple-900/60 border border-purple-700/50 px-2 py-0.2 font-mono text-[9.5px] text-purple-200">
                          {grp.code}
                        </span>
                      </div>
                      <h4 className="font-display text-base font-bold text-white leading-snug">
                        {grp.name[locale] || grp.name.en}
                      </h4>
                      <p className="text-xs text-purple-200/70 leading-relaxed">
                        {grp.description[locale] || grp.description.en}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span
                        className={`grid size-7 place-items-center rounded-full border transition-all ${
                          isGrpSelected
                            ? "border-purple-400 bg-purple-400 text-purple-950 font-bold shadow"
                            : "border-purple-800 text-transparent group-hover:border-purple-500"
                        }`}
                      >
                        <Check size={14} weight="bold" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between pt-3 border-t border-purple-900/40 text-[11.5px] text-purple-300/70">
              <span>⚡ You can change your stream anytime in Digital Learning</span>
              {seniorGroup && (
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="rounded-xl bg-purple-600 px-4 py-1.5 font-display text-xs font-bold text-white hover:bg-purple-500 transition-colors shadow-sm"
                >
                  Confirm Group
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

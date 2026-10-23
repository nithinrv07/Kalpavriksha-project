"use client";

import { ArrowRight, Check, ShieldCheck } from "@phosphor-icons/react/ssr";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Avatar } from "@/components/avatar";
import { useLocale } from "@/components/locale-provider";
import { authService } from "@/lib/auth-service";
import { AVATAR_NAME, BAND_INFO, SETUP_COPY } from "@/lib/bands";
import { SUPPORTED_STANDARDS, type SupportedStandard } from "@/lib/curriculum";
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
  const [name, setName] = useState(existing?.name ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [prefLang, setPrefLang] = useState<Locale>(existing?.preferredLanguage ?? locale);
  const [avatar, setAvatar] = useState<AvatarId>(existing?.avatar ?? "cat");

  const band = grade !== null ? bandOf(grade) : selectedBand;
  const ready = grade !== null && name.trim().length > 0;

  // Handle clicking one of the 3 stage cards
  const handleStageSelect = (b: Band) => {
    setSelectedBand(b);
    const available = BAND_GRADES[b];
    // If current grade is not in this band, pick a sensible default
    if (!grade || !available.includes(grade)) {
      if (b === "junior") setGrade(1);
      else if (b === "middle") setGrade(6);
      else if (b === "senior") setGrade(11);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || grade === null) return;

    authService.saveProfile({
      name: name.trim(),
      email: email.trim() || undefined,
      grade,
      avatar,
      preferredLanguage: prefLang,
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
            ? (locale === "ta" ? "உன் சுயவிவரத்தைப் புதுப்பி" : locale === "hi" ? "अपनी प्रोफ़ाइल अपडेट करें" : "Update your student profile")
            : c.askTitle}
        </h2>
        <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-muted">
          {locale === "ta"
            ? "விதை (வகுப்பு 1–3), செடி (வகுப்பு 4–10) அல்லது மரம் (வகுப்பு 11–12) தேர்ந்தெடுத்துத் தொடர்க."
            : locale === "hi"
              ? "बीज (कक्षा 1–3), पौधा (कक्षा 4–10) या वृक्ष (कक्षा 11–12) चुनकर आगे बढ़ें।"
              : "Choose Seed for Class 1–3, Plant for Class 4–10, or Tree for Class 11–12, then proceed."}
        </p>
      </div>

      {/* 1. THREE STAGE CARDS: Seed (1-3), Plant (4-10), Tree (11-12) */}
      <fieldset>
        <div className="flex items-center justify-between mb-3">
          <legend className="font-mono text-[12px] uppercase tracking-[0.14em] text-violet font-semibold">
            1. {locale === "ta" ? "படிநிலையைத் தேர்ந்தெடு" : locale === "hi" ? "अवस्था चुनें" : "Select Your Growth Stage"} *
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
                  onClick={() => setGrade(g)}
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
            3. {locale === "ta" ? "மின்னஞ்சல் அல்லது மாணவர் எண்" : locale === "hi" ? "ईमेल या छात्र आईडी" : "Email or Student Login ID"}
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
            4. {locale === "ta" ? "விருப்ப மொழி" : locale === "hi" ? "पसंदीदा भाषा" : "Preferred Language"}
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
            <span>Proceed to Class {grade ?? ""} →</span>
            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </form>
  );
}

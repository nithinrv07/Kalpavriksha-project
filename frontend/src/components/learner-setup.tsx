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
import { AVATARS, bandOf, type AvatarId, type Band, type Profile } from "@/lib/progress";

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

  // Standard (Class 4 to 12)
  const [grade, setGrade] = useState<number | null>(existing?.grade ?? null);
  const [name, setName] = useState(existing?.name ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [prefLang, setPrefLang] = useState<Locale>(existing?.preferredLanguage ?? locale);
  const [avatar, setAvatar] = useState<AvatarId>(existing?.avatar ?? "cat");

  const band = grade !== null ? bandOf(grade) : null;
  const ready = grade !== null && name.trim().length > 0;

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
    <form onSubmit={submit} className="fade-up">
      {/* Mock Authentication Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet/30 bg-violet-deep/20 px-4 py-3 text-xs text-violet-ink">
        <span className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-violet" weight="fill" />
          <span>
            <strong>Authentication Mode:</strong> Mock / Device Profile (Stored persistently in browser & synced to /api/profile)
          </span>
        </span>
        <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 font-mono text-[11px] text-muted">
          Ready for School SSO / Clerk
        </span>
      </div>

      <h2 className="font-display text-[clamp(26px,3.8vw,44px)] leading-[1.05] tracking-[-0.035em] text-balance">
        {existing ? (locale === "ta" ? "உன் சுயவிவரத்தைப் புதுப்பி" : locale === "hi" ? "अपनी प्रोफ़ाइल अपडेट करें" : "Update your student profile") : c.askTitle}
      </h2>
      <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-muted">
        {locale === "ta"
          ? "வகுப்பு 4 முதல் 12 வரையிலான பாடத்திட்டம் உன் வகுப்புக்கேற்ப தனிப்பயனாக்கப்படும்."
          : locale === "hi"
            ? "कक्षा 4 से 12 तक का पाठ्यक्रम आपकी कक्षा के अनुसार व्यक्तिगत बनाया जाएगा।"
            : "Select your school standard (Class 4 to 12). Learning modules, textbooks and quizzes will be personalised to match."}
      </p>

      {/* 1. School Standard Selector (Classes 4 to 12) */}
      <fieldset className="mt-8">
        <div className="flex items-center justify-between">
          <legend className="font-mono text-[12px] uppercase tracking-[0.14em] text-violet">
            1. {locale === "ta" ? "பள்ளி வகுப்பு (வகுப்பு 4 – 12)" : locale === "hi" ? "कक्षा चुनें (कक्षा 4 – 12)" : "School Standard (Class 4 to 12)"} *
          </legend>
          {grade && (
            <span className="font-mono text-[12px] text-muted">
              Selected: <strong className="text-text">{c.classWord} {grade}</strong> ({BAND_INFO[bandOf(grade)].name[locale]})
            </span>
          )}
        </div>

        {/* Dropdown for quick selection on mobile */}
        <div className="mt-3 block sm:hidden">
          <select
            value={grade ?? ""}
            onChange={(e) => setGrade(e.target.value ? Number(e.target.value) : null)}
            className="h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 font-mono text-sm text-text focus:border-violet focus:outline-none"
          >
            <option value="">-- Choose your class --</option>
            {SUPPORTED_STANDARDS.map((s) => (
              <option key={s} value={s}>
                {c.classWord} {s} ({BAND_INFO[bandOf(s)].name[locale]})
              </option>
            ))}
          </select>
        </div>

        {/* Interactive Standard Card Grid on tablet & desktop */}
        <div className="mt-3 hidden grid-cols-3 gap-2.5 sm:grid sm:grid-cols-5 md:grid-cols-9">
          {SUPPORTED_STANDARDS.map((s) => {
            const b = bandOf(s);
            const isSelected = grade === s;
            const accent = BAND_INFO[b].accent;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setGrade(s)}
                style={{ "--band": accent } as React.CSSProperties}
                className={`group relative flex flex-col items-center justify-center rounded-2xl border py-3 px-2 text-center transition-all duration-200 ${
                  isSelected
                    ? "border-[var(--band)] bg-[color-mix(in_srgb,var(--band)_16%,var(--surface))] shadow-[0_0_25px_-5px_var(--band)]"
                    : "border-line bg-surface hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2"
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted opacity-80">
                  {c.classWord}
                </span>
                <span className="font-display text-2xl font-bold tracking-tight text-text">
                  {s}
                </span>
                <span className="mt-1 font-mono text-[9.5px] text-[var(--band)]">
                  {BAND_INFO[b].name[locale]}
                </span>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-[var(--band)] text-bg text-[10px]">
                    <Check size={11} weight="bold" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 2. Student Details: Name, Email, Preferred Language */}
      <div className="mt-8 grid gap-5 rounded-3xl border border-line bg-surface p-5 sm:p-7 md:grid-cols-2">
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

        {/* Submit Actions */}
        <div className="flex flex-col gap-3 pt-2 md:col-span-2 md:flex-row md:items-center md:justify-between">
          <p className="text-[12.5px] text-muted/80">{c.deviceNote}</p>
          <button
            type="submit"
            disabled={!ready}
            className="beam-border group inline-flex h-13 shrink-0 items-center justify-center gap-3 rounded-full bg-violet-deep px-8 font-mono text-sm text-violet-ink transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 disabled:[&::before]:hidden"
          >
            {existing ? c.save : c.start}
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </form>
  );
}

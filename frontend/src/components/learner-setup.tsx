"use client";

import { ArrowRight, Check } from "@phosphor-icons/react/ssr";
import { useState, useSyncExternalStore } from "react";
import { Avatar } from "@/components/avatar";
import { useLocale } from "@/components/locale-provider";
import { updateProgress } from "@/components/progress-store";
import { AVATAR_NAME, BAND_INFO, SETUP_COPY } from "@/lib/bands";
import { AVATARS, BANDS, BAND_GRADES, bandOf, setProfile, type AvatarId, type Band, type Profile } from "@/lib/progress";

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
            // Rotation on the wrapper so the leaf animation's CSS transform cannot override it.
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

function newStudentId() {
  const digits = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b % 10).join("");
  return `KV-${new Date().getFullYear()}-${digits}`;
}

/**
 * Entry flow: class band → exact class → name and buddy avatar.
 * Used as the gate in front of every module and on /sign-in to edit the card.
 */
export function LearnerSetup({ existing, onDone }: { existing?: Profile | null; onDone?: () => void }) {
  const { locale } = useLocale();
  const c = SETUP_COPY[locale];
  const [band, setBand] = useState<Band | null>(existing ? bandOf(existing.grade) : null);
  const [grade, setGrade] = useState<number | null>(existing?.grade ?? null);
  const [name, setName] = useState(existing?.name ?? "");
  const [avatar, setAvatar] = useState<AvatarId>(existing?.avatar ?? "cat");

  const ready = grade !== null && name.trim().length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    updateProgress((p) =>
      setProfile(p, {
        name: name.trim().slice(0, 24),
        avatar,
        grade,
        studentId: existing?.studentId ?? newStudentId(),
      }),
    );
    onDone?.();
  };

  return (
    <form onSubmit={submit} className="fade-up">
      <h2 className="font-display text-[clamp(28px,4vw,48px)] leading-[1.05] tracking-[-0.035em] text-balance">
        {c.askTitle}
      </h2>
      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted">{c.askLead}</p>

      <div role="radiogroup" aria-label={c.askTitle} className="mt-8 grid gap-3 md:grid-cols-3">
        {BANDS.map((b) => {
          const info = BAND_INFO[b];
          const selected = band === b;
          return (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${info.name[locale]}, ${info.classes[locale]}`}
              onClick={() => {
                setBand(b);
                if (grade === null || bandOf(grade) !== b) setGrade(null);
              }}
              style={{ "--band": info.accent } as React.CSSProperties}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 ${
                selected
                  ? "border-[var(--band)] bg-[color-mix(in_srgb,var(--band)_12%,var(--surface))] shadow-[0_0_60px_-20px_var(--band)]"
                  : "border-line bg-surface hover:-translate-y-1 hover:border-line-strong"
              }`}
            >
              <span className="flex items-start justify-between">
                <span className="font-mono text-[12px] text-[var(--band)]">{info.classes[locale]}</span>
                <span
                  className={`grid size-6 place-items-center rounded-full border transition-colors ${
                    selected ? "border-[var(--band)] bg-[var(--band)] text-bg" : "border-line-strong"
                  }`}
                >
                  {selected && <Check size={14} weight="bold" />}
                </span>
              </span>
              <GrowthStage
                band={b}
                className="mx-auto my-2 size-28 transition-transform duration-500 group-hover:scale-110"
              />
              <span className="font-display text-2xl tracking-[-0.02em]">{info.name[locale]}</span>
              <span className="mt-1 text-[13.5px] leading-snug text-muted">{info.tagline[locale]}</span>
            </button>
          );
        })}
      </div>

      {band && (
        <fieldset key={band} className="fade-up mt-8">
          <legend className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">{c.pickClass}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {BAND_GRADES[band].map((g) => (
              <label
                key={g}
                style={{ "--band": BAND_INFO[band].accent } as React.CSSProperties}
                className="cursor-pointer has-[:checked]:border-[var(--band)] has-[:checked]:bg-[var(--band)] has-[:checked]:text-bg has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet flex h-12 min-w-12 items-center justify-center gap-1.5 rounded-2xl border border-line bg-white/[0.04] px-4 font-mono text-sm transition-colors duration-200 hover:bg-white/[0.08]"
              >
                <input
                  type="radio"
                  name="grade"
                  value={g}
                  checked={grade === g}
                  onChange={() => setGrade(g)}
                  className="sr-only"
                />
                <span className="text-[11px] opacity-70">{c.classWord}</span> {g}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {grade !== null && (
        <div className="fade-up mt-8 grid gap-8 rounded-3xl border border-line bg-surface p-5 sm:p-6 md:grid-cols-[1fr_1.2fr]">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">{c.nameLabel}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              required
              autoComplete="given-name"
              placeholder={c.namePlaceholder}
              className="h-14 rounded-2xl border border-line bg-bg/60 px-4 text-[17px] text-text placeholder:text-muted/60 focus:border-violet/60 focus:outline-none"
            />
          </label>
          <fieldset>
            <legend className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">{c.avatarLabel}</legend>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {AVATARS.map((a) => (
                <label
                  key={a}
                  title={AVATAR_NAME[a][locale]}
                  className="grid cursor-pointer place-items-center rounded-2xl border border-transparent p-1.5 transition-all duration-200 hover:bg-white/[0.06] has-[:checked]:scale-105 has-[:checked]:border-violet/60 has-[:checked]:bg-violet-deep/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-violet"
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
                  <Avatar id={a} className="size-12" iconSize={26} />
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
            <p className="text-[13px] text-muted">{c.deviceNote}</p>
            <button
              type="submit"
              disabled={!ready}
              className="beam-border group inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-violet-deep px-8 font-mono text-sm text-violet-ink transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 disabled:[&::before]:hidden"
            >
              {existing ? c.save : c.start}
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

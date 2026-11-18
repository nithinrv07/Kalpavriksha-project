"use client";

import { ArrowLeft, ArrowRight, Lightning, MusicNotes } from "@phosphor-icons/react/ssr";
import { useState } from "react";
import { BandHint } from "@/components/band-hint";
import { useLocale } from "@/components/locale-provider";
import type { Locale } from "@/lib/i18n";
import type { Band } from "@/lib/progress";
import { GK_COPY, GK_LEVELS, GK_LEVEL_CONFIG, QUIZ, bandToGkLevel, type GkLevel } from "./content";
import { LevelIcon, Quiz } from "./quiz";
import { Songs } from "./songs";

type Step = { name: "choose" } | { name: "levels" } | { name: "quiz"; level: GkLevel } | { name: "songs" };

const FLOW_COPY: Record<
  Locale,
  {
    chooseTitle: string;
    chooseLead: string;
    gkTitle: string;
    gkBody: string;
    songsTitle: string;
    songsBody: string;
    back: string;
    recommended: string;
  }
> = {
  en: {
    chooseTitle: "What would you like to do?",
    chooseLead: "Test your general knowledge, or sing along with our patriotic songs.",
    gkTitle: "General Knowledge",
    gkBody: "Quiz questions about India, science and the world.",
    songsTitle: "Patriotic Songs",
    songsBody: "Sing along with the national anthem and other patriotic songs.",
    back: "Back",
    recommended: "Recommended",
  },
  ta: {
    chooseTitle: "என்ன செய்ய விரும்புகிறாய்?",
    chooseLead: "உன் பொது அறிவைச் சோதி, அல்லது தேசபக்திப் பாடல்களுடன் சேர்ந்து பாடு.",
    gkTitle: "பொது அறிவு",
    gkBody: "இந்தியா, அறிவியல், உலகம் பற்றிய வினாடி வினா கேள்விகள்.",
    songsTitle: "தேசபக்திப் பாடல்கள்",
    songsBody: "நாட்டுப்பண் மற்றும் பிற தேசபக்திப் பாடல்களுடன் சேர்ந்து பாடு.",
    back: "பின்செல்",
    recommended: "பரிந்துரைக்கப்பட்டது",
  },
};

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-line bg-white/[0.04] px-3.5 text-sm text-muted transition-colors hover:bg-white/[0.08] hover:text-text"
    >
      <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
      {label}
    </button>
  );
}

/**
 * GK & Patriotic Songs: pick GK or songs first; GK then asks for a level and
 * opens straight on the questions, songs open the sing-along player.
 */
export function GkScreen({ band }: { band: Band }) {
  const { locale } = useLocale();
  const c = GK_COPY[locale];
  const f = FLOW_COPY[locale];
  const [step, setStep] = useState<Step>({ name: "choose" });
  const recommended = bandToGkLevel(band);

  if (step.name === "quiz") {
    return (
      <div className="flex flex-col gap-6">
        <BackButton label={f.back} onClick={() => setStep({ name: "levels" })} />
        <Quiz
          key={step.level}
          band={band}
          initialLevel={step.level}
          autoStart
          onChangeLevel={() => setStep({ name: "levels" })}
        />
      </div>
    );
  }

  if (step.name === "songs") {
    return (
      <div className="flex flex-col gap-6">
        <BackButton label={f.back} onClick={() => setStep({ name: "choose" })} />
        <Songs band={band} />
      </div>
    );
  }

  if (step.name === "levels") {
    return (
      <div className="fade-up flex flex-col gap-6">
        <BackButton label={f.back} onClick={() => setStep({ name: "choose" })} />
        <div>
          <h2 className="font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-text">{c.levelTitle}</h2>
          <p className="mt-1 text-sm text-muted">{c.levelSubtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {GK_LEVELS.map((lvl) => {
            const cfg = GK_LEVEL_CONFIG[lvl];
            const timer = cfg.defaultSeconds ? `${cfg.defaultSeconds}s` : c.untimed.split(" · ")[0];
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setStep({ name: "quiz", level: lvl })}
                style={{ "--lvl-accent": cfg.accent } as React.CSSProperties}
                className="group relative flex flex-col rounded-3xl border border-line bg-surface p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[var(--lvl-accent)] hover:shadow-[0_0_40px_-10px_var(--lvl-accent)]"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--lvl-accent)_18%,transparent)] text-[var(--lvl-accent)]">
                    <LevelIcon name={cfg.iconName} className="size-6" />
                  </span>
                  {lvl === recommended && (
                    <span className="rounded-full border border-[var(--lvl-accent)]/40 bg-[color-mix(in_srgb,var(--lvl-accent)_12%,transparent)] px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-[var(--lvl-accent)]">
                      {f.recommended}
                    </span>
                  )}
                </div>
                <span className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--lvl-accent)]">
                  {cfg.badge[locale]} · {cfg.targetClasses[locale]}
                </span>
                <span className="mt-1 font-display text-xl font-bold text-text">{cfg.name[locale]}</span>
                <span className="mt-1.5 text-[13px] leading-snug text-muted">{cfg.subtitle[locale]}</span>
                <span className="mt-5 flex items-center justify-between border-t border-line pt-3 font-mono text-[11.5px] text-muted">
                  <span>
                    {c.questions(QUIZ[lvl].length)} · {timer}
                  </span>
                  <ArrowRight size={16} className="text-[var(--lvl-accent)] transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // First step: GK or patriotic songs.
  const choices = [
    { id: "levels" as const, Glyph: Lightning, title: f.gkTitle, body: f.gkBody, accent: "var(--amber)" },
    { id: "songs" as const, Glyph: MusicNotes, title: f.songsTitle, body: f.songsBody, accent: "var(--pink)" },
  ];
  return (
    <div className="fade-up flex flex-col gap-6">
      <BandHint
        band={band}
        text={c.bandHint[band]}
        className={band === "senior" ? "rounded-none border-x-0 border-t-0 border-b border-line bg-transparent px-0 py-3 shadow-none" : ""}
      />
      <div className="border-b border-line pb-4">
        <h2 className="font-display text-[clamp(20px,2.5vw,26px)] font-bold tracking-tight text-text">{f.chooseTitle}</h2>
        <p className="mt-1 text-sm text-muted">{f.chooseLead}</p>
      </div>
      <div className="grid md:grid-cols-2">
        {choices.map(({ id, Glyph, title, body, accent }, index) => (
          <button
            key={id}
            type="button"
            onClick={() => setStep(id === "songs" ? { name: "songs" } : { name: "levels" })}
            style={{ "--choice": accent } as React.CSSProperties}
            className={`group relative flex min-h-48 flex-col items-start px-4 py-6 text-left transition-colors duration-300 hover:bg-white/[0.025] md:px-8 ${index === 1 ? "border-t border-line md:border-l md:border-t-0" : ""}`}
          >
            <span className="relative grid size-12 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--choice)_18%,transparent)] text-[var(--choice)]">
              <Glyph size={25} weight="duotone" />
            </span>
            <span className="mt-5 block font-display text-[clamp(20px,2.2vw,26px)] font-bold tracking-tight text-text">{title}</span>
            <span className="mt-1.5 block max-w-md text-[14px] leading-relaxed text-muted">{body}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 font-display text-[13px] font-semibold text-text transition-colors group-hover:text-[var(--choice)]">
              {id === "songs" ? (locale === "ta" ? "பாடல்களை ஆராய்" : "Explore Songs") : (locale === "ta" ? "வினாடி வினா தொடங்கு" : "Start Quiz")}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

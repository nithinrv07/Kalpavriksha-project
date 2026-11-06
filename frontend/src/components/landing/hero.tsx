"use client";

import { ArrowDown, ArrowRight, CheckCircle, DotsNine, Fire, Play, Scroll, Star } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/avatar";
import { BrandMark } from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";
import type { Locale } from "@/lib/i18n";
import { accentOf } from "@/modules/accents";
import { MODULES } from "@/modules/registry";
import { LangSelect } from "./lang-select";
import { MenuSheet } from "./menu-sheet";

type HeroCopy = {
  readonly nav: readonly [label: string, href: string][];
  readonly badge: string;
  readonly title: readonly [string, string];
  readonly lead: string;
  readonly start: string;
  readonly trust: readonly string[];
  readonly preview: {
    readonly hello: string;
    readonly stage: string;
    readonly level: string;
    readonly continue: string;
    readonly lesson: string;
    readonly lessonMeta: string;
    readonly streak: string;
    readonly badge: string;
  };
};

const HERO_COPY: Record<Locale, HeroCopy> = {
  en: {
    nav: [
      ["Modules", "#modules"],
      ["How it works", "#how"],
      ["About", "#about"],
    ],
    badge: "Free for every student · Class 1–12",
    title: ["Learning that grows", "with every student."],
    lead: "Lessons, quizzes, songs and a growth record for Class 1–12, in Tamil and English, on any phone. Free for every student of Kalpavriksha Seva Trust.",
    start: "Start learning — it's free",
    trust: ["Free forever", "Tamil & English", "Class 1–12", "Works on any phone"],
    preview: {
      hello: "Vanakkam, Priya!",
      stage: "Class 6 · Saplings",
      level: "Level 3 · 240 XP",
      continue: "Continue learning",
      lesson: "Kural 391 — Learn well",
      lessonMeta: "Thirukkural · 2 min · 60% done",
      streak: "5-day streak",
      badge: "Quiz star unlocked",
    },
  },
  ta: {
    nav: [
      ["தொகுதிகள்", "#modules"],
      ["எப்படி இயங்கும்", "#how"],
      ["எங்களைப் பற்றி", "#about"],
    ],
    badge: "ஒவ்வொரு மாணவருக்கும் இலவசம் · வகுப்பு 1–12",
    title: ["ஒவ்வொரு மாணவருடனும்", "வளரும் கற்றல்."],
    lead: "1 முதல் 12 ஆம் வகுப்பு வரை பாடங்கள், வினாடி வினா, பாடல்கள், வளர்ச்சிப் பதிவு — தமிழிலும் ஆங்கிலத்திலும், எந்தக் கைபேசியிலும். கல்பவிருக்ஷா சேவா அறக்கட்டளையின் ஒவ்வொரு மாணவருக்கும் இலவசம்.",
    start: "இலவசமாகக் கற்கத் தொடங்கு",
    trust: ["என்றும் இலவசம்", "தமிழ் & ஆங்கிலம்", "வகுப்பு 1–12", "எந்தக் கைபேசியிலும்"],
    preview: {
      hello: "வணக்கம், பிரியா!",
      stage: "வகுப்பு 6 · இளஞ்செடிகள்",
      level: "நிலை 3 · 240 XP",
      continue: "கற்றலைத் தொடர்",
      lesson: "குறள் 391 — கற்க கசடற",
      lessonMeta: "திருக்குறள் · 2 நிமி · 60% முடிந்தது",
      streak: "5 நாள் தொடர்",
      badge: "வினாடி வினா நட்சத்திரம்",
    },
  },
};

/** Illustrative app screen: shows what a student actually gets, instead of decoration. */
function ProductPreview({ copy }: { copy: HeroCopy["preview"] }) {
  const { locale } = useLocale();
  return (
    <div role="img" aria-label={`${copy.continue}: ${copy.lesson}`} className="relative mx-auto w-full max-w-[460px]">
      <div className="relative rounded-[28px] border border-white/10 bg-[#130b26]/95 p-5 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9),0_0_80px_-30px_rgb(168_85_247/0.5)] sm:p-6">
        <div className="flex items-center gap-3">
          <Avatar id="cat" className="size-11" iconSize={24} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-semibold text-white">{copy.hello}</p>
            <p className="truncate text-[13px] text-white/60">{copy.stage}</p>
          </div>
          <span className="shrink-0 rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-[12px] font-medium text-amber max-[420px]:hidden">
            {copy.level}
          </span>
        </div>

        <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.08em] text-white/50">{copy.continue}</p>
        <div className="mt-2 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-violet/20 text-violet">
            <Scroll size={24} weight="duotone" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-white">{copy.lesson}</p>
            <p className="mt-0.5 truncate text-[12.5px] text-white/55">{copy.lessonMeta}</p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-violet to-amber" />
            </div>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber text-[#1a1033]">
            <Play size={16} weight="fill" />
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {MODULES.map((m, i) => {
            const accent = accentOf(m.accent);
            const pct = [60, 35, 80][i] ?? 50;
            return (
              <div key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <span className={`grid size-9 place-items-center overflow-hidden rounded-lg bg-surface-2 ${accent.text}`}>
                  {m.iconImage ? (
                    <Image src={m.iconImage} alt="" width={36} height={36} className="size-full object-cover" />
                  ) : (
                    <m.icon size={18} weight="duotone" />
                  )}
                </span>
                <p className="mt-2 line-clamp-2 min-h-[2.5em] text-[12px] leading-tight text-white/80">{m.title[locale]}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${accent.bar}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating achievement chips give the preview depth without extra imagery. */}
      <div className="absolute -right-3 -top-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#1b1236] px-3.5 py-2.5 shadow-xl sm:-right-8">
        <Star size={18} weight="fill" className="text-amber" />
        <span className="text-[13px] font-medium text-white">{copy.badge}</span>
      </div>
      <div className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#1b1236] px-3.5 py-2.5 shadow-xl sm:-left-8">
        <Fire size={18} weight="fill" className="text-orange-400" />
        <span className="text-[13px] font-medium text-white">{copy.streak}</span>
      </div>
    </div>
  );
}

export function Hero() {
  const { t, locale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const c = HERO_COPY[locale];

  return (
    <section data-hero className="relative isolate">
      {/* Top navigation: logo, section links, language and account actions. */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0b0618]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between gap-4 px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-amber/15 text-amber">
              <BrandMark className="size-5" strokeWidth={1.8} />
            </span>
            <span className="text-[18px] font-semibold tracking-tight text-white">Kalpavriksha</span>
          </Link>

          <nav aria-label={t.menu} className="hidden items-center gap-8 lg:flex">
            {c.nav.map(([label, href]) => (
              <a key={href} href={href} className="text-[15px] text-white/70 transition-colors hover:text-white">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LangSelect />
            <Link
              href="/sign-in"
              className="hidden h-11 items-center rounded-xl px-4 text-[15px] font-medium text-white/85 transition-colors hover:bg-white/[0.06] hover:text-white sm:flex"
            >
              {t.signIn}
            </Link>
            <Link
              href="/m/learn"
              className="hidden h-11 items-center rounded-xl bg-amber px-5 text-[15px] font-semibold text-[#1a1033] transition-colors hover:bg-amber/90 md:flex"
            >
              {t.cta}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.menu}
              className="grid size-11 place-items-center rounded-xl border border-white/10 text-white/80 transition-colors hover:bg-white/[0.06] lg:hidden"
            >
              <DotsNine size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* minmax(0, …) lets columns shrink below their content's width on small screens. */}
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-16 px-5 pb-20 pt-12 sm:pt-16 lg:min-h-[calc(100dvh-72px)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-8 lg:pb-24 lg:pt-10">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3.5 py-1.5 text-[13px] font-medium text-amber">
            <span aria-hidden className="size-1.5 rounded-full bg-amber" />
            {c.badge}
          </span>
          <h1
            className={`mt-6 font-title text-white ${
              locale === "en"
                ? "text-[clamp(42px,5.6vw,76px)] leading-[1.02] tracking-[-0.02em]"
                : "text-[clamp(32px,4.2vw,56px)] leading-[1.15]"
            }`}
          >
            {c.title[0]}{" "}
            <span className="bg-gradient-to-r from-amber via-[#f0abfc] to-violet bg-clip-text text-transparent">{c.title[1]}</span>
          </h1>
          <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-white/70 sm:text-[18px]">{c.lead}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/m/learn"
              className="group inline-flex h-14 items-center gap-2.5 rounded-2xl bg-amber px-7 text-[16px] font-semibold text-[#1a1033] shadow-[0_12px_40px_-12px_rgb(251_191_36/0.7)] transition-all hover:-translate-y-0.5 hover:bg-amber/90"
            >
              {c.start}
              <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#modules"
              className="inline-flex h-14 items-center gap-2 rounded-2xl border border-white/15 px-6 text-[16px] font-medium text-white transition-colors hover:bg-white/[0.06]"
            >
              {t.explore}
              <ArrowDown size={16} />
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {c.trust.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[15px] text-white/75">
                <CheckCircle size={18} weight="fill" className="text-amber" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="fade-up px-4 sm:px-8 lg:px-0" style={{ animationDelay: "150ms" }}>
          <ProductPreview copy={c.preview} />
        </div>
      </div>

      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </section>
  );
}

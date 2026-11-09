"use client";

import { ArrowRight, Check, GraduationCap, ShieldCheck, Sparkle, BookOpen } from "@phosphor-icons/react/ssr";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Avatar } from "@/components/avatar";
import { useLocale } from "@/components/locale-provider";
import { authService } from "@/lib/auth-service";
import { AVATAR_NAME, BAND_INFO, SETUP_COPY } from "@/lib/bands";
import { SENIOR_GROUPS, type SeniorGroupId } from "@/lib/curriculum";
import { LOCALES, LOCALE_LABEL, type Locale } from "@/lib/i18n";
import { AVATARS, bandOf, type AvatarId, type Band, type Profile } from "@/lib/progress";
import { enterFullscreen } from "@/lib/fullscreen";

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
      <ellipse cx="60" cy="108" rx="34" ry="6" fill="var(--line)" />
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

export const SCHOOL_BOARDS = [
  {
    id: "tn_state",
    name: {
      en: "Tamil Nadu State Board (Samacheer Kalvi)",
      ta: "தமிழ்நாடு மாநிலப் பாடத்திட்டம் (சமச்சீர் கல்வி)",
      hi: "तमिलनाडु स्टेट बोर्ड (समचीर कल्वि)",
    },
    badge: "Official Samacheer Kalvi",
    description: {
      en: "State Board curriculum with official textbooks, term-wise syllabus and board exam streams.",
      ta: "அரசுப் பாடநூல்கள் மற்றும் பொதுத்தேர்வு பாடப்பிரிவுகளுடன் கூடிய அதிகாரப்பூர்வ பாடத்திட்டம்.",
      hi: "राज्य बोर्ड पाठ्यक्रम आधिकारिक पाठ्यपुस्तकों के साथ।",
    },
  },
  {
    id: "cbse",
    name: {
      en: "CBSE (Central Board of Secondary Education)",
      ta: "மத்திய இடைநிலைக் கல்வி வாரியம் (சி.பி.எஸ்.இ)",
      hi: "केंद्रीय माध्यमिक शिक्षा बोर्ड (CBSE)",
    },
    badge: "National Curriculum",
    description: {
      en: "NCERT-aligned national school curriculum for standard & higher secondary classes.",
      ta: "என்.சி.இ.ஆர்.டி வழிகாட்டலின்படியான தேசிய பள்ளிப் பாடத்திட்டம்.",
      hi: "एनसीईआरटी आधारित राष्ट्रीय विद्यालय पाठ्यक्रम।",
    },
  },
  {
    id: "icse",
    name: {
      en: "ICSE / Other State Boards",
      ta: "ஐ.சி.எஸ்.இ / பிற வாரியங்கள்",
      hi: "आईसीएसई / अन्य बोर्ड",
    },
    badge: "Alternative Boards",
    description: {
      en: "Comprehensive foundational & secondary education.",
      ta: "விரிவான தொடக்க மற்றும் இடைநிலைக் கல்வி அமைப்பு.",
      hi: "व्यापक माध्यमिक शिक्षा प्रणाली।",
    },
  },
] as const;

// Primary classes (Class 4 to 12 as requested in specification)
const ACADEMIC_CLASSES = [4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

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

  // 1. Student Name
  const [name, setName] = useState(existing?.name ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");

  // 2. School Board
  const [board, setBoard] = useState<string>(existing?.board ?? "tn_state");

  // 3. Exact School Standard (Class 4 to Class 12)
  const [grade, setGrade] = useState<number | null>(existing?.grade ?? 6);

  // 4. Special Stream / Group (Strictly for Class 11 and 12)
  const [seniorGroup, setSeniorGroup] = useState<string | null>(
    existing && existing.grade >= 11 ? (existing.seniorGroup ?? "cs") : null,
  );

  // 5. Preferred Language & Avatar
  const [prefLang, setPrefLang] = useState<Locale>(existing?.preferredLanguage ?? locale);
  const [avatar, setAvatar] = useState<AvatarId>(existing?.avatar ?? "cat");

  const isSeniorGrade = grade !== null && grade >= 11;
  // Validation: Name is required, Grade is required, and if Class 11 or 12, Stream is mandatory
  const isGroupValid = !isSeniorGrade || Boolean(seniorGroup);
  const ready = grade !== null && name.trim().length > 0 && isGroupValid;

  const handleGradeSelect = (g: number) => {
    setGrade(g);
    if (g >= 11) {
      // If switching to Class 11/12 and no group is selected yet, default to "cs"
      if (!seniorGroup) {
        setSeniorGroup("cs");
      }
    } else {
      // Clear senior group for Classes 4–10
      setSeniorGroup(null);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || grade === null) {
      return;
    }

    // Enter full screen on login
    enterFullscreen();

    const saved = authService.saveProfile({
      name: name.trim(),
      email: email.trim() || undefined,
      grade,
      avatar,
      preferredLanguage: prefLang,
      board,
      seniorGroup: isSeniorGrade ? (seniorGroup || "cs") : undefined,
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
      {/* Honest status line: this profile lives on the device, nothing else. */}
      <p className="flex items-center gap-2 text-[13px] text-muted">
        <ShieldCheck size={16} className="text-violet" weight="fill" />
        {c.deviceNote}
      </p>

      <div>
        <h2 className="font-display text-[clamp(26px,3.8vw,44px)] leading-[1.05] tracking-[-0.035em] text-balance">
          {existing
            ? (locale === "ta" ? "உங்கள் கல்வி விவரங்களைத் திருத்துக" : "Update Your Academic Profile")
            : (locale === "ta" ? "மாணவர் கல்வி விவரப் பதிவு" : "Student Academic Profile Setup")}
        </h2>
        <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-muted">
          {locale === "ta"
            ? "உங்கள் பெயர், பள்ளி வாரியம் மற்றும் வகுப்பைத் தேர்ந்தெடுக்கவும். உங்கள் வகுப்புக்கான பாடங்கள் மட்டுமே டிஜிட்டல் கற்றலில் தோன்றும்."
            : "Enter your name, school board, and class. Digital Learning will personalise and show only your class and stream subjects."}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 1. STUDENT NAME & EMAIL                                             */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid gap-5 glass-inset rounded-3xl border p-5 sm:p-7 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-violet font-semibold">
            1. {locale === "ta" ? "மாணவர் பெயர்" : "Student Name"} *
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            required
            autoComplete="name"
            placeholder={c.namePlaceholder}
            className="h-13 rounded-2xl border border-white/15 dark:border-purple-400/20 bg-white/[0.04] dark:bg-black/35 backdrop-blur-md px-4 text-[16px] text-text placeholder:text-muted/60 focus:border-violet/80 focus:ring-2 focus:ring-violet/30 focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
            {locale === "ta" ? "மின்னஞ்சல் அல்லது பள்ளி அடையாள எண்" : "Email or Student Roll Number (Optional)"}
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={80}
            autoComplete="email"
            placeholder="student@school.edu.in"
            className="h-13 rounded-2xl border border-white/15 dark:border-purple-400/20 bg-white/[0.04] dark:bg-black/35 backdrop-blur-md px-4 text-[16px] text-text placeholder:text-muted/60 focus:border-violet/80 focus:ring-2 focus:ring-violet/30 focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]"
          />
        </label>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. SCHOOL BOARD SELECTION                                           */}
      {/* ------------------------------------------------------------------- */}
      <fieldset className="glass-inset rounded-3xl border p-5 sm:p-7 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <legend className="font-mono text-[12px] uppercase tracking-[0.12em] text-violet font-semibold">
            2. {locale === "ta" ? "பள்ளி கல்வி வாரியம்" : "School Board"} *
          </legend>
          <span className="font-mono text-[11px] text-muted">Curriculum Standard</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {SCHOOL_BOARDS.map((b) => {
            const isSelected = board === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBoard(b.id)}
                className={`flex flex-col text-left rounded-2xl border p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-violet bg-violet-deep/40 shadow-[0_0_25px_rgba(168,85,247,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-1 ring-violet backdrop-blur-md"
                    : "border-white/10 dark:border-purple-400/15 bg-white/[0.03] dark:bg-purple-950/20 backdrop-blur-md hover:border-white/25 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-violet-ink font-semibold">
                    {b.badge}
                  </span>
                  <span
                    className={`grid size-5 place-items-center rounded-full border transition-colors ${
                      isSelected ? "border-violet bg-violet text-bg" : "border-line-strong"
                    }`}
                  >
                    {isSelected && <Check size={11} weight="bold" />}
                  </span>
                </div>
                <span className="font-display text-sm font-bold text-text">
                  {b.name[locale] || b.name.en}
                </span>
                <span className="mt-1 text-[11.5px] text-muted line-clamp-2">
                  {b.description[locale] || b.description.en}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* ------------------------------------------------------------------- */}
      {/* 3. CLASS / STANDARD SELECTION (CLASS 4 TO CLASS 12)                 */}
      {/* ------------------------------------------------------------------- */}
      <fieldset className="glass-inset rounded-3xl border p-5 sm:p-7 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <legend className="font-mono text-[12px] uppercase tracking-[0.12em] text-violet font-semibold">
            3. {locale === "ta" ? "வகுப்பு / தரம் (வகுப்பு 4 முதல் 12 வரை)" : "Class / Standard (Class 4 to Class 12)"} *
          </legend>
          {grade !== null && (
            <span className="font-mono text-[12px] text-violet-ink font-bold">
              Selected: Class {grade} {grade >= 11 ? "(Higher Secondary)" : "(Secondary / Middle)"}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {/* Middle & Secondary Classes (4 to 10) */}
          <div>
            <span className="font-mono text-[11px] text-muted uppercase tracking-wider block mb-2">
              Middle & Secondary School (Classes 4–10):
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
              {[4, 5, 6, 7, 8, 9, 10].map((g) => {
                const isSelected = grade === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGradeSelect(g)}
                    className={`group relative flex h-14 flex-col items-center justify-center rounded-2xl border px-3 py-2 transition-all duration-200 ${
                      isSelected
                        ? "border-violet bg-violet text-bg font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105"
                        : "border-white/10 dark:border-purple-400/15 bg-white/[0.03] dark:bg-purple-950/20 backdrop-blur-md text-text hover:border-white/25 hover:bg-white/[0.07]"
                    }`}
                  >
                    <span className={`font-mono text-[10px] uppercase opacity-75 ${isSelected ? "text-bg" : "text-muted"}`}>
                      Class
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

          {/* Higher Secondary Classes (11 and 12) */}
          <div className="pt-2">
            <span className="font-mono text-[11px] text-violet uppercase tracking-wider block mb-2 font-semibold">
              Higher Secondary School (Classes 11–12):
            </span>
            <div className="grid grid-cols-2 gap-3 max-w-sm sm:max-w-md">
              {[11, 12].map((g) => {
                const isSelected = grade === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGradeSelect(g)}
                    className={`group relative flex h-16 flex-col items-center justify-center rounded-2xl border px-4 py-2 transition-all duration-200 ${
                      isSelected
                        ? "border-purple-400 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-[0_0_25px_rgba(168,85,247,0.5)] scale-105"
                        : "border-white/10 dark:border-purple-400/15 bg-white/[0.03] dark:bg-purple-950/20 backdrop-blur-md text-text hover:border-purple-600/60 hover:bg-white/[0.07]"
                    }`}
                  >
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${isSelected ? "text-purple-100" : "text-purple-300/70"}`}>
                      Higher Secondary
                    </span>
                    <span className="font-display text-2xl font-black">
                      Class {g}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-white text-purple-950 shadow">
                        <Check size={12} weight="bold" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* SPECIAL CONDITION: GROUP / STREAM SELECTION (CLASS 11 & 12 ONLY)   */}
        {/* ----------------------------------------------------------------- */}
        {isSeniorGrade && (
          <div
            className={`mt-4 rounded-2xl border p-4 sm:p-5 transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${
              !seniorGroup
                ? "border-amber-500/80 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.2)] ring-2 ring-amber-500/50"
                : "border-purple-500/50 bg-gradient-to-b from-purple-950/40 to-[#120724]/60 shadow-[0_0_25px_rgba(168,85,247,0.2)]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap size={20} weight="fill" className={!seniorGroup ? "text-amber-400" : "text-purple-300"} />
                <span className={`font-display text-base font-bold tracking-wide ${
                  !seniorGroup ? "text-amber-300" : "text-white"
                }`}>
                  Choose Your Group / Stream *
                </span>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${
                !seniorGroup ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-purple-900/60 text-purple-200 border border-purple-700/50"
              }`}>
                {!seniorGroup ? "Required for Class " + grade : "Stream Selected"}
              </span>
            </div>

            <p className="mb-3.5 text-xs text-muted leading-relaxed">
              {locale === "ta"
                ? "வகுப்பு 11 மற்றும் 12ல் படிக்கும் பாடப்பிரிவைத் தேர்ந்தெடுக்கவும். தேர்ந்தெடுக்கப்பட்ட பிரிவின் பாடங்கள் மட்டுமே டிஜிட்டல் கற்றல் பக்கத்தில் தோன்றும்."
                : `Select your higher secondary group for Class ${grade}. Only subjects belonging to this stream will appear in Digital Learning.`}
            </p>

            {/* 6 Stream Options */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SENIOR_GROUPS.map((grp) => {
                const isGrpSelected = seniorGroup === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => setSeniorGroup(grp.id)}
                    className={`group relative flex flex-col text-left rounded-2xl border p-4 transition-all duration-200 ${
                      isGrpSelected
                        ? "border-purple-400 bg-purple-900/60 shadow-[0_0_25px_rgba(168,85,247,0.4)] ring-1 ring-purple-400 scale-[1.02] backdrop-blur-md"
                        : "border-white/10 dark:border-purple-400/15 bg-white/[0.03] dark:bg-purple-950/20 backdrop-blur-md hover:border-purple-600/60 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-purple-300">
                        {grp.badge}
                      </span>
                      <span
                        className={`grid size-5 place-items-center rounded-full border transition-colors ${
                          isGrpSelected
                            ? "border-purple-400 bg-purple-400 text-purple-950 font-bold"
                            : "border-purple-800 text-transparent"
                        }`}
                      >
                        <Check size={11} weight="bold" />
                      </span>
                    </div>

                    <span className="font-display text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                      {grp.name[locale] || grp.name.en}
                    </span>

                    <span className="mt-1 text-[11.5px] leading-snug text-purple-200/70">
                      {grp.description[locale] || grp.description.en}
                    </span>
                  </button>
                );
              })}
            </div>

            {!seniorGroup && (
              <p className="mt-3 font-mono text-xs text-amber-300 font-bold">
                ⚠️ Please select a stream to proceed with Class {grade}.
              </p>
            )}
          </div>
        )}
      </fieldset>

      {/* ------------------------------------------------------------------- */}
      {/* 4. PREFERRED LANGUAGE & BUDDY AVATAR                                */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid gap-5 glass-inset rounded-3xl border p-5 sm:p-7 md:grid-cols-2 lg:grid-cols-12">
        {/* Preferred Language */}
        <div className="flex flex-col gap-2 lg:col-span-4">
          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-violet font-semibold">
            4. {locale === "ta" ? "விருப்ப மொழி" : "Preferred Language"} *
          </span>
          <div className="flex gap-2">
            {LOCALES.map((l) => {
              const active = prefLang === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => setPrefLang(l)}
                  className={`flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border font-mono text-xs font-bold transition-colors ${
                    active
                      ? "border-violet bg-violet-deep text-violet-ink shadow-sm"
                      : "border-white/10 dark:border-purple-400/15 bg-white/[0.03] dark:bg-purple-950/20 backdrop-blur-md text-muted hover:text-text hover:border-white/25 hover:bg-white/[0.07]"
                  }`}
                >
                  {LOCALE_LABEL[l].native}
                  {active && <Check size={13} weight="bold" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buddy Avatar Selector */}
        <fieldset className="lg:col-span-8">
          <legend className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
            5. {c.avatarLabel}
          </legend>
          <div className="mt-3 grid grid-cols-4 gap-x-2 gap-y-3 sm:grid-cols-8">
            {AVATARS.map((a) => (
              <label
                key={a}
                title={AVATAR_NAME[a][locale]}
                className="group flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border border-transparent px-1 py-2 transition-all duration-200 hover:bg-white/[0.06] has-[:checked]:border-violet/60 has-[:checked]:bg-violet-deep/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-violet"
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
                <span className="relative">
                  <Avatar
                    id={a}
                    className="size-11 transition-transform duration-200 group-hover:-translate-y-0.5"
                    iconSize={24}
                  />
                  {avatar === a && (
                    <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-violet text-white ring-2 ring-surface">
                      <Check size={9} weight="bold" />
                    </span>
                  )}
                </span>
                <span className="max-w-full break-words px-0.5 text-center text-[9.5px] leading-[1.25] text-muted transition-colors group-has-[:checked]:text-text sm:text-[10.5px]">
                  {AVATAR_NAME[a][locale]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Submit / Proceed Action */}
        <div className="flex flex-col gap-3 pt-3 md:col-span-2 lg:col-span-12 md:flex-row md:items-center md:justify-between border-t border-line/60">
          <p className="text-[12.5px] text-muted/80">
            {locale === "ta"
              ? "உங்கள் வகுப்பு அல்லது பாடப்பிரிவை எப்போது வேண்டுமானாலும் மாற்றலாம்."
              : "You can change your class, board or stream at any time."}
          </p>
          <button
            type="submit"
            disabled={!ready}
            className="beam-border group inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-violet-deep px-9 font-mono text-sm font-semibold text-violet-ink transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 disabled:[&::before]:hidden shadow-lg cursor-pointer disabled:cursor-not-allowed"
          >
            <span>
              {isSeniorGrade && !seniorGroup
                ? (locale === "ta" ? "பாடப்பிரிவைத் தேர்ந்தெடுக்கவும் *" : "Choose Stream to Proceed *")
                : existing
                ? (locale === "ta" ? "சேமித்து தொடர்க →" : `Save & Continue to Class ${grade ?? ""} →`)
                : `Enter Digital Learning: Class ${grade ?? ""} →`}
            </span>
            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </form>
  );
}

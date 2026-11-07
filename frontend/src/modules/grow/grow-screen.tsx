"use client";

import { Lock, Plus, Trash } from "@phosphor-icons/react/ssr";
import { useMemo, useState } from "react";
import { BandHint } from "@/components/band-hint";
import { Burst } from "@/components/burst";
import { useLocale } from "@/components/locale-provider";
import { updateProgress, useProgress } from "@/components/progress-store";
import { StandardSwitcherModal } from "@/components/standard-switcher-modal";
import { authService } from "@/lib/auth-service";
import { getLearningTrackStats } from "@/lib/learning-track";
import {
  AREAS,
  XP,
  badges,
  localDay,
  logActivity,
  removeActivity,
  skillScores,
  type Activity,
  type Area,
  type Band,
  type Progress,
} from "@/lib/progress";
import { AREA_INFO, BADGE_INFO, GROW_COPY } from "./content";
import { LearningTrackCard } from "./learning-track-card";

/** Fixed precision so server and browser render identical SVG attributes. */
const round = (n: number) => Math.round(n * 100) / 100;

const MAX_LEAVES = 48;
/** Leaf slots on a golden-angle spiral inside the crown, filled newest-last. */
const LEAF_SLOTS = Array.from({ length: MAX_LEAVES }, (_, i) => {
  const r = Math.sqrt((i + 0.5) / MAX_LEAVES);
  const a = i * 2.39996;
  return {
    x: round(160 + Math.cos(a) * 118 * r),
    y: round(118 + Math.sin(a) * 84 * r),
    rot: round((a * 180) / Math.PI) % 360,
  };
});
const FRUIT_SLOTS = [
  [92, 96],
  [228, 104],
  [124, 160],
  [200, 168],
  [160, 64],
  [262, 140],
] as const;

function GrowthTree({
  activities,
  lessonsDoneCount,
  fruits,
  big,
}: {
  activities: readonly Activity[];
  lessonsDoneCount: number;
  fruits: number;
  big: boolean;
}) {
  // Completed lessons from Module 1 bloom as academic leaves on the Growth Tree
  const lessonLeaves: Activity[] = Array.from({ length: lessonsDoneCount }, (_, i) => ({
    id: `lesson-leaf-${i}`,
    area: "academics" as const,
    title: `Lesson ${i + 1}`,
    date: "",
  }));
  const allActivities = [...activities, ...lessonLeaves];
  // Oldest activity takes the innermost slot, so a new leaf always appears at the edge.
  const leaves = [...allActivities].reverse().slice(0, MAX_LEAVES);

  return (
    <svg viewBox="0 0 320 300" aria-hidden className={`mx-auto w-full ${big ? "max-w-[520px]" : "max-w-[380px]"}`}>
      <defs>
        <radialGradient id="crown-glow">
          <stop offset="0" stopColor="var(--band, var(--violet))" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--band, var(--violet))" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="120" rx="150" ry="112" fill="url(#crown-glow)" />
      <ellipse cx="160" cy="288" rx="90" ry="8" fill="rgb(255 255 255 / 0.05)" />
      <g className="sway">
        <path d="M150 288 C152 240 148 200 154 150 L166 150 C172 200 168 240 170 288Z" fill="#6b4f3a" />
        <path
          d="M158 200 C130 180 112 160 96 120 M162 186 C190 170 214 150 228 112 M160 160 C150 130 156 100 160 70"
          fill="none"
          stroke="#6b4f3a"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <ellipse cx="160" cy="118" rx="126" ry="92" fill="none" stroke="var(--line-strong)" strokeDasharray="3 7" />
        {leaves.map((a, i) => {
          const s = LEAF_SLOTS[i];
          if (!s) return null;
          // Rotation lives on the wrapper: the grow-in animation's CSS transform would replace it.
          return (
            <g key={a.id} transform={`rotate(${s.rot} ${s.x} ${s.y})`}>
              <ellipse
                className="leaf"
                style={{ animationDelay: `${Math.min(i, 20) * 30}ms` }}
                cx={s.x}
                cy={s.y}
                rx="11"
                ry="6.5"
                fill={AREA_INFO[a.area].color}
                opacity="0.92"
              />
            </g>
          );
        })}
        {FRUIT_SLOTS.slice(0, fruits).map(([x, y], i) => (
          <g key={i} className="leaf" style={{ animationDelay: `${300 + i * 120}ms` }}>
            <circle cx={x} cy={y} r="11" fill="var(--amber)" opacity="0.25" />
            <circle cx={x} cy={y} r="6.5" fill="var(--amber)" />
          </g>
        ))}
      </g>
    </svg>
  );
}

const radarPoint = (i: number, r: number): readonly [number, number] => {
  const a = (Math.PI * 2 * i) / AREAS.length - Math.PI / 2;
  return [round(120 + Math.cos(a) * r * 84), round(120 + Math.sin(a) * r * 84)];
};

function SkillRadar({ progress }: { progress: Progress }) {
  const { locale } = useLocale();
  const scores = skillScores(progress);
  const values = AREAS.map((a) => scores[a]);
  const poly = (radii: readonly number[]) => radii.map((r, i) => radarPoint(i, r).join(",")).join(" ");
  return (
    <svg
      viewBox="0 0 240 240"
      className="mx-auto w-full max-w-[340px] overflow-visible"
      role="img"
      aria-label={AREAS.map((a) => `${AREA_INFO[a].name[locale]} ${Math.round(scores[a] * 100)}%`).join(", ")}
    >
      {[0.33, 0.66, 1].map((r) => (
        <polygon key={r} points={poly(AREAS.map(() => r))} fill="none" stroke="var(--line-strong)" />
      ))}
      {AREAS.map((_, i) => {
        const [x, y] = radarPoint(i, 1);
        return <line key={i} x1="120" y1="120" x2={x} y2={y} stroke="var(--line)" />;
      })}
      <polygon
        points={poly(values)}
        fill="color-mix(in srgb, var(--band, var(--violet)) 30%, transparent)"
        stroke="var(--band, var(--violet))"
        strokeWidth="2"
        className="transition-all duration-700"
      />
      {AREAS.map((a, i) => {
        const [x, y] = radarPoint(i, values[i] ?? 0);
        const [lx, ly] = radarPoint(i, 1.28);
        return (
          <g key={a}>
            <circle cx={x} cy={y} r="4" fill={AREA_INFO[a].color} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-muted font-mono text-[9.5px]">
              {AREA_INFO[a].name[locale]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Junior view of the same data: a sticker per area with a count. */
function Stickers({
  activities,
  lessonsDoneCount,
  songsHeardCount,
}: {
  activities: readonly Activity[];
  lessonsDoneCount: number;
  songsHeardCount: number;
}) {
  const { locale } = useLocale();
  return (
    <div className="grid grid-cols-3 gap-2">
      {AREAS.map((a) => {
        const info = AREA_INFO[a];
        const Glyph = info.icon;
        let count = activities.filter((x) => x.area === a).length;
        if (a === "academics") count += lessonsDoneCount;
        if (a === "communication") count += songsHeardCount;

        return (
          <div
            key={a}
            style={{ "--area": info.color } as React.CSSProperties}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all ${
              count ? "border-[var(--area)] bg-[color-mix(in_srgb,var(--area)_14%,transparent)]" : "border-dashed border-line-strong opacity-60"
            }`}
          >
            <Glyph size={32} weight={count ? "fill" : "duotone"} className="text-[var(--area)]" aria-hidden />
            <span className="text-[13px] leading-tight">{info.name[locale]}</span>
            <span className="font-mono text-[12px] text-muted">×{count}</span>
          </div>
        );
      })}
    </div>
  );
}

function ActivityForm({ band }: { band: Band }) {
  const { locale } = useLocale();
  const c = GROW_COPY[locale];
  const today = localDay();
  const [area, setArea] = useState<Area>("academics");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [celebrate, setCelebrate] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = title.trim();
    if (!text) return;
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    updateProgress((p) => logActivity(p, { id, area, title: text.slice(0, 80), date: date || today }, today));
    setTitle("");
    setCelebrate((n) => n + 1);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-xl tracking-[-0.02em]">{c.logTitle}</h2>
      <fieldset>
        <legend className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-muted">{c.areaLabel}</legend>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {AREAS.map((a) => {
            const info = AREA_INFO[a];
            const Glyph = info.icon;
            return (
              <label
                key={a}
                style={{ "--area": info.color } as React.CSSProperties}
                className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-line px-1 py-2.5 text-center text-[12px] text-muted transition-colors hover:bg-white/[0.05] has-[:checked]:border-[var(--area)] has-[:checked]:bg-[color-mix(in_srgb,var(--area)_14%,transparent)] has-[:checked]:text-text has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-violet"
              >
                <input type="radio" name="area" value={a} checked={area === a} onChange={() => setArea(a)} className="sr-only" />
                <Glyph size={band === "junior" ? 24 : 20} weight="duotone" className="text-[var(--area)]" aria-hidden />
                {info.name[locale]}
              </label>
            );
          })}
        </div>
      </fieldset>
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-muted">{c.whatLabel}</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          required
          placeholder={AREA_INFO[area].example[locale]}
          className="h-12 rounded-xl border border-line bg-bg/60 px-4 text-[15px] placeholder:text-muted/60 focus:border-violet/60 focus:outline-none"
        />
      </label>
      <div className="flex items-end gap-3">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-muted">{c.dateLabel}</span>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            className="h-12 rounded-xl border border-line bg-bg/60 px-3 text-[15px] [color-scheme:dark] focus:border-violet/60 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={!title.trim()}
          className="relative inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-violet-deep px-5 font-mono text-sm text-violet-ink transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
        >
          <Plus size={16} weight="bold" />
          {c.add}
          {celebrate > 0 && (
            <>
              <Burst key={celebrate} />
              <span key={`xp-${celebrate}`} className="float-up absolute -top-6 right-2 font-mono text-[13px] text-amber">
                +{XP.activity} XP
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function GrowScreen({ band }: { band: Band }) {
  const { locale } = useLocale();
  const c = GROW_COPY[locale];
  const progress = useProgress();
  const earned = badges(progress, localDay());
  const fruits = earned.filter((b) => b.earned).length;
  const dateFmt = new Intl.DateTimeFormat(`${locale}-IN`, { day: "numeric", month: "short" });
  const scores = skillScores(progress);
  const ranked = [...AREAS].sort((a, b) => scores[b] - scores[a]);

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const learningStats = useMemo(() => getLearningTrackStats(progress), [progress]);

  const totalLeaves = progress.activities.length + progress.lessonsDone.length;

  return (
    <div className="flex flex-col gap-6">
      <BandHint band={band} text={c.bandHint[band]} />

      {/* Standard Switcher Modal for switching Class 1-12 */}
      <StandardSwitcherModal
        currentGrade={learningStats.standard}
        currentSeniorGroup={progress.profile?.seniorGroup}
        isOpen={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
        onSelectStandard={(std, grp) => {
          authService.updateStandard(std, grp);
          setSwitcherOpen(false);
        }}
      />

      <div className={`grid gap-4 ${band === "junior" ? "lg:grid-cols-[1.3fr_1fr]" : "lg:grid-cols-[1.1fr_1fr]"}`}>
        <section className="rounded-[28px] border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-display text-xl tracking-[-0.02em]">{c.treeTitle}</h2>
          <p className="mt-1 font-mono text-[12px] text-muted">
            {c.leaves(totalLeaves, progress.lessonsDone.length)}
          </p>
          <GrowthTree
            activities={progress.activities}
            lessonsDoneCount={progress.lessonsDone.length}
            fruits={fruits}
            big={band === "junior"}
          />
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
            {AREAS.map((a) => (
              <span key={a} className="flex items-center gap-1.5 text-[12px] text-muted">
                <span className="size-2.5 rounded-full" style={{ background: AREA_INFO[a].color }} aria-hidden />
                {AREA_INFO[a].name[locale]}
              </span>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <ActivityForm band={band} />
          <section className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="font-display text-xl tracking-[-0.02em]">{band === "junior" ? c.stickersTitle : c.skillsTitle}</h2>
            <div className="mt-4">
              {band === "junior" ? (
                <Stickers
                  activities={progress.activities}
                  lessonsDoneCount={progress.lessonsDone.length}
                  songsHeardCount={progress.songsHeard.length}
                />
              ) : (
                <SkillRadar progress={progress} />
              )}
            </div>
            {band === "senior" && (
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4">
                <p className="text-[13px] text-muted">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.1em]">{c.strongest}</span>
                  <span className="text-[15px]" style={{ color: AREA_INFO[ranked[0] ?? "academics"].color }}>
                    {AREA_INFO[ranked[0] ?? "academics"].name[locale]}
                  </span>
                </p>
                <p className="text-[13px] text-muted">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.1em]">{c.growNext}</span>
                  <span className="text-[15px]" style={{ color: AREA_INFO[ranked.at(-1) ?? "service"].color }}>
                    {AREA_INFO[ranked.at(-1) ?? "service"].name[locale]}
                  </span>
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Dedicated Learning Track Performance Card integrated into Module 2 */}
      <LearningTrackCard
        stats={learningStats}
        band={band}
        onOpenStandardSwitcher={() => setSwitcherOpen(true)}
      />

      <section className="rounded-[28px] border border-line bg-surface p-5 sm:p-6">
        <h2 className="font-display text-xl tracking-[-0.02em]">{c.badgesTitle}</h2>
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
          {earned.map(({ id, earned: got }) => {
            const info = BADGE_INFO[id];
            const Glyph = info.icon;
            return (
              <li
                key={id}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center ${
                  got ? "pop-in border-amber/40 bg-amber/[0.08]" : "border-line opacity-55"
                }`}
              >
                <span
                  className={`relative grid size-14 place-items-center rounded-full ${
                    got ? "bg-amber/20 text-amber shadow-[0_0_30px_-6px_rgb(251_191_36/0.7)]" : "bg-white/[0.04] text-muted"
                  }`}
                >
                  <Glyph size={28} weight={got ? "fill" : "duotone"} aria-hidden />
                  {!got && <Lock size={14} weight="fill" className="absolute -bottom-0.5 -right-0.5 text-muted" aria-hidden />}
                </span>
                <span className="text-[14px]">{info.name[locale]}</span>
                <span className="text-[12px] leading-snug text-muted">{info.how[locale]}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-[28px] border border-line bg-surface p-5 sm:p-6">
        <h2 className="font-display text-xl tracking-[-0.02em]">{band === "senior" ? c.portfolio : c.recent}</h2>
        {progress.activities.length === 0 ? (
          <p className="mt-3 text-[14px] text-muted">{c.empty}</p>
        ) : (
          <ul className="mt-3 flex flex-col divide-y divide-line">
            {progress.activities.slice(0, band === "senior" ? 50 : 12).map((a) => {
              const info = AREA_INFO[a.area];
              const Glyph = info.icon;
              return (
                <li key={a.id} className="group flex items-center gap-3 py-3">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-xl"
                    style={{ background: `color-mix(in srgb, ${info.color} 16%, transparent)`, color: info.color }}
                  >
                    <Glyph size={18} weight="duotone" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px]">{a.title}</span>
                    <span className="block font-mono text-[11.5px] text-muted">
                      {info.name[locale]} · {dateFmt.format(new Date(`${a.date}T12:00:00`))}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => updateProgress((p) => removeActivity(p, a.id))}
                    aria-label={`${c.remove}: ${a.title}`}
                    className="grid size-10 place-items-center rounded-xl text-muted opacity-60 transition-all hover:bg-danger/10 hover:text-danger hover:opacity-100 focus-visible:opacity-100"
                  >
                    <Trash size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

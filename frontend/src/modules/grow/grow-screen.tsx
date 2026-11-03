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
import { LiquidGlassSurface } from "@/components/liquid-glass-surface";

/** Fixed precision so server and browser render identical SVG attributes. */
const round = (n: number) => Math.round(n * 100) / 100;

const MAX_LEAVES = 48;

/** Botanical leaf slots mapped naturally to branch tips, secondary boughs,
 * and outer crown clusters so the tree blooms organically from youth to maturity.
 */
const LEAF_SLOTS = [
  // Tier 1 (1-9): Primary branch tips & key boughs (balanced early growth)
  { x: 115, y: 92, rot: -45 },
  { x: 245, y: 92, rot: 45 },
  { x: 180, y: 52, rot: 0 },
  { x: 85, y: 132, rot: -65 },
  { x: 275, y: 132, rot: 65 },
  { x: 146, y: 92, rot: -25 },
  { x: 214, y: 92, rot: 25 },
  { x: 74, y: 165, rot: -80 },
  { x: 286, y: 165, rot: 80 },

  // Tier 2 (10-18): Secondary twigs and crown volume
  { x: 160, y: 64, rot: -18 },
  { x: 200, y: 64, rot: 18 },
  { x: 100, y: 78, rot: -52 },
  { x: 260, y: 78, rot: 52 },
  { x: 135, y: 122, rot: -35 },
  { x: 225, y: 122, rot: 35 },
  { x: 96, y: 152, rot: -70 },
  { x: 264, y: 152, rot: 70 },
  { x: 180, y: 88, rot: 0 },

  // Tier 3 (19-28): Inner crown & lush bough clusters
  { x: 140, y: 140, rot: -20 },
  { x: 220, y: 140, rot: 20 },
  { x: 166, y: 114, rot: -10 },
  { x: 194, y: 114, rot: 10 },
  { x: 112, y: 140, rot: -45 },
  { x: 248, y: 140, rot: 45 },
  { x: 134, y: 72, rot: -30 },
  { x: 226, y: 72, rot: 30 },
  { x: 174, y: 74, rot: -6 },
  { x: 186, y: 74, rot: 6 },

  // Tier 4 (29-38): Outer foliage highlights & canopy perimeter
  { x: 150, y: 46, rot: -15 },
  { x: 210, y: 46, rot: 15 },
  { x: 80, y: 98, rot: -60 },
  { x: 280, y: 98, rot: 60 },
  { x: 60, y: 140, rot: -85 },
  { x: 300, y: 140, rot: 85 },
  { x: 118, y: 165, rot: -60 },
  { x: 242, y: 165, rot: 60 },
  { x: 102, y: 118, rot: -40 },
  { x: 258, y: 118, rot: 40 },

  // Tier 5 (39-48): Full flourishing Kalpavriksha canopy
  { x: 165, y: 38, rot: -8 },
  { x: 195, y: 38, rot: 8 },
  { x: 180, y: 35, rot: 0 },
  { x: 64, y: 118, rot: -75 },
  { x: 296, y: 118, rot: 75 },
  { x: 84, y: 175, rot: -85 },
  { x: 276, y: 175, rot: 85 },
  { x: 152, y: 98, rot: -14 },
  { x: 208, y: 98, rot: 14 },
  { x: 180, y: 110, rot: 0 },
] as const;

const FRUIT_SLOTS = [
  [115, 92],  // Upper-left branch tip
  [245, 92],  // Upper-right branch tip
  [180, 52],  // Central crown peak
  [85, 132],  // Lower-left bough tip
  [275, 132], // Lower-right bough tip
  [180, 138], // Central bough fork
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
    <svg
      viewBox="0 0 360 320"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className={`mx-auto w-full select-none ${big ? "max-w-[460px] max-h-[360px]" : "max-w-[390px] max-h-[320px]"}`}
    >
      <defs>
        {/* Soft, harmonious crown halo that adapts across themes */}
        <radialGradient id="crown-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="var(--band, var(--violet))" stopOpacity="0.2" />
          <stop offset="65%" stopColor="var(--band, var(--violet))" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--band, var(--violet))" stopOpacity="0" />
        </radialGradient>

        {/* Rich natural tree bark gradient: deep contrast in light mode, warm wood in dark mode */}
        <linearGradient id="tree-bark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#432613" />
          <stop offset="35%" stopColor="#6e4122" />
          <stop offset="65%" stopColor="#84502c" />
          <stop offset="100%" stopColor="#432613" />
        </linearGradient>

        {/* Golden badge fruit radial gradient */}
        <radialGradient id="fruit-gold" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>

      {/* 1. Canopy background soft halo */}
      <ellipse cx="180" cy="130" rx="142" ry="106" fill="url(#crown-glow)" />

      {/* 2. Ground base shadow & fertile soil mound (clearly visible in both themes) */}
      <ellipse cx="180" cy="292" rx="108" ry="9" className="fill-black/10 dark:fill-black/50" />
      <path
        d="M125 292 C145 287 215 287 235 292 C210 295 150 295 125 292 Z"
        className="fill-amber-950/20 dark:fill-amber-950/50"
      />

      {/* 3. Swaying Living Tree Group (Hardware-accelerated pixel origin) */}
      <g className="tree-sway">
        {/* Canopy delicate guide boundary */}
        <ellipse
          cx="180"
          cy="130"
          rx="138"
          ry="102"
          fill="none"
          stroke="currentColor"
          className="text-purple-600/30 dark:text-purple-300/25"
          strokeWidth="1.2"
          strokeDasharray="4 8"
        />

        {/* Tree Root Flares */}
        <path
          d="M160 268 C148 278 136 286 124 290"
          stroke="url(#tree-bark)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M200 268 C212 278 224 286 236 290"
          stroke="url(#tree-bark)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Solid Tapered Trunk */}
        <path
          d="M154 288 C158 250 163 222 168 190 C172 170 176 150 178 135 L182 135 C184 150 188 170 192 190 C197 222 202 250 206 288 C192 291 168 291 154 288 Z"
          fill="url(#tree-bark)"
        />

        {/* Left Boughs & Twigs */}
        <path
          d="M170 190 C140 180 115 165 85 132"
          stroke="url(#tree-bark)"
          strokeWidth="9.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M135 174 C110 170 90 170 75 165"
          stroke="url(#tree-bark)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M174 165 C155 140 135 115 115 92"
          stroke="url(#tree-bark)"
          strokeWidth="7.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M142 128 C125 105 112 85 100 78"
          stroke="url(#tree-bark)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right Boughs & Twigs */}
        <path
          d="M190 190 C220 180 245 165 275 132"
          stroke="url(#tree-bark)"
          strokeWidth="9.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M225 174 C250 170 270 170 285 165"
          stroke="url(#tree-bark)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M186 165 C205 140 225 115 245 92"
          stroke="url(#tree-bark)"
          strokeWidth="7.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M218 128 C235 105 248 85 260 78"
          stroke="url(#tree-bark)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Central Crown Forks */}
        <path
          d="M178 135 C170 105 158 80 152 60"
          stroke="url(#tree-bark)"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M182 135 C190 105 202 80 208 60"
          stroke="url(#tree-bark)"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M180 130 L180 52"
          stroke="url(#tree-bark)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 4. Botanical Leaves Sprouting Naturally Across Tree Boughs */}
        {leaves.map((a, i) => {
          const s = LEAF_SLOTS[i];
          if (!s) return null;
          return (
            <g
              key={a.id}
              transform={`translate(${s.x}, ${s.y}) rotate(${s.rot})`}
              className="transition-transform duration-300"
            >
              <path
                d="M0 -11.5 C5.5 -6.5 6.5 4.5 0 11.5 C-6.5 4.5 -5.5 -6.5 0 -11.5 Z"
                fill={AREA_INFO[a.area].color}
                stroke="currentColor"
                strokeWidth="0.8"
                className="text-black/20 dark:text-white/25"
              />
              <line
                x1="0"
                y1="-8"
                x2="0"
                y2="8"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* 5. Golden Fruits for Badges Earned */}
        {FRUIT_SLOTS.slice(0, fruits).map(([x, y], i) => (
          <g key={i} className="transition-transform duration-300">
            {/* Ambient golden glow */}
            <circle cx={x} cy={y} r="13" fill="#f59e0b" opacity="0.28" />
            {/* Ripe golden fruit */}
            <circle
              cx={x}
              cy={y}
              r="8"
              fill="url(#fruit-gold)"
              stroke="#b45309"
              strokeWidth="1"
            />
            {/* Specular light highlight */}
            <circle cx={x - 2.5} cy={y - 2.5} r="2" fill="#ffffff" opacity="0.85" />
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
    <LiquidGlassSurface
      radius={24}
      className="flex flex-col gap-4 border border-purple-200/70 dark:border-white/10 bg-white/75 dark:bg-[#0d0720]/80 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] p-5 sm:p-6"
    >
      <h2 className="font-display text-base sm:text-lg lg:text-xl font-bold tracking-wide text-slate-900 dark:text-white">{c.logTitle}</h2>
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
            className="h-12 rounded-xl border border-line bg-bg/60 px-3 text-[15px] [color-scheme:light] dark:[color-scheme:dark] focus:border-violet/60 focus:outline-none"
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
    </LiquidGlassSurface>
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
        <LiquidGlassSurface
          radius={28}
          className="border border-purple-200/70 dark:border-white/10 bg-white/75 dark:bg-[#0d0720]/80 p-5 sm:p-6 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] flex flex-col justify-between"
        >
          <div>
            <h2 className="font-display text-xl sm:text-2xl tracking-[-0.02em] text-slate-900 dark:text-white">{c.treeTitle}</h2>
            <p className="mt-1 font-mono text-[12.5px] font-medium text-slate-600 dark:text-purple-200/80">
              {c.leaves(totalLeaves, progress.lessonsDone.length)}
            </p>
          </div>
          <div className="my-auto py-2 flex items-center justify-center">
            <GrowthTree
              activities={progress.activities}
              lessonsDoneCount={progress.lessonsDone.length}
              fruits={fruits}
              big={band === "junior"}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-2xl border border-purple-200/60 dark:border-white/5 bg-purple-50/50 dark:bg-white/[0.02] px-3 py-2.5">
            {AREAS.map((a) => (
              <span key={a} className="flex items-center gap-1.5 text-[12px] font-medium text-slate-700 dark:text-purple-200/80">
                <span
                  className="size-2.5 rounded-full ring-1 ring-black/15 dark:ring-white/20 shrink-0"
                  style={{ background: AREA_INFO[a].color }}
                  aria-hidden
                />
                {AREA_INFO[a].name[locale]}
              </span>
            ))}
          </div>
        </LiquidGlassSurface>

        <div className="flex flex-col gap-4">
          <ActivityForm band={band} />
          <LiquidGlassSurface
            radius={24}
            className="border border-purple-200/70 dark:border-white/10 bg-white/75 dark:bg-[#0d0720]/80 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] p-5 sm:p-6"
          >
            <h2 className="font-display text-base sm:text-lg lg:text-xl font-bold tracking-wide text-slate-900 dark:text-white">{band === "junior" ? c.stickersTitle : c.skillsTitle}</h2>
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
          </LiquidGlassSurface>
        </div>
      </div>

      {/* Dedicated Learning Track Performance Card integrated into Module 2 */}
      <LearningTrackCard
        stats={learningStats}
        band={band}
        onOpenStandardSwitcher={() => setSwitcherOpen(true)}
      />

      <LiquidGlassSurface
        radius={28}
        className="border border-purple-200/70 dark:border-white/10 bg-white/75 dark:bg-[#0d0720]/80 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] p-5 sm:p-6"
      >
        <h2 className="font-display text-base sm:text-lg lg:text-xl font-bold tracking-wide text-slate-900 dark:text-white">{c.badgesTitle}</h2>
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
        </LiquidGlassSurface>

      <LiquidGlassSurface
        radius={28}
        className="border border-purple-200/70 dark:border-white/10 bg-white/75 dark:bg-[#0d0720]/80 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] p-5 sm:p-6"
      >
        <h2 className="font-display text-base sm:text-lg lg:text-xl font-bold tracking-wide text-slate-900 dark:text-white">{band === "senior" ? c.portfolio : c.recent}</h2>
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
      </LiquidGlassSurface>
    </div>
  );
}

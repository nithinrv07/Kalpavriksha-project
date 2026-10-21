"use client";

import type { ReactNode } from "react";
import { ComingSoon } from "@/components/coming-soon";
import { ModuleShell } from "@/components/module-shell";
import type { Band } from "@/lib/progress";
import { getModule } from "./registry";
import { GkScreen } from "./gk-songs/gk-screen";
import { GrowScreen } from "./grow/grow-screen";
import { LearnScreen } from "./learn/learn-screen";

/** Module slug → its screen. A registry entry without a screen yet shows the coming-soon card. */
const SCREENS: Partial<Record<string, (band: Band) => ReactNode>> = {
  learn: (band) => <LearnScreen key={band} band={band} />,
  grow: (band) => <GrowScreen key={band} band={band} />,
  "gk-songs": (band) => <GkScreen key={band} band={band} />,
};

export function ModuleScreen({ slug }: { slug: string }) {
  const mod = getModule(slug);
  const screen = SCREENS[slug];
  if (!mod || !screen) return <ComingSoon slug={slug} />;
  return <ModuleShell module={mod}>{(band) => screen(band)}</ModuleShell>;
}

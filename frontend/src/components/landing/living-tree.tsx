"use client";

import { useEffect, useState } from "react";
import { MoonlitPetals } from "@/components/moonlit-petals";
import { NIGHT_CANOPY, canopyFor, type Canopy } from "@/lib/canopy";
import { useTheme } from "@/lib/theme";
import { getQualityBudget } from "@/lib/perf/quality";

/**
 * The landing backdrop is the Kalpavriksha wishing tree:
 * A rich, lush, dense canopy of luminous blossoms and branches
 * with drifting petals throughout the left side of the landing page.
 * The canopy harmoniously follows the local time of day.
 * In light mode, uses a vibrant violet palette that pops on lavender paper.
 */

export function LivingTree() {
  const { isDark } = useTheme();
  const [canopy, setCanopy] = useState<Canopy>(NIGHT_CANOPY);
  const budget = getQualityBudget();

  useEffect(() => {
    const update = () => setCanopy(canopyFor(new Date()));
    update();
    const id = window.setInterval(update, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  // Light theme: vibrant violet palette that pops on lavender paper
  const blossomColor = isDark
    ? canopy.blossom
    : "#7C3AED"; // vibrant violet-600
  const petalColor = isDark
    ? canopy.petal
    : "#A855F7"; // violet-500 for petals
  const branchColor = isDark ? "#3E3539" : "#4C1D95"; // violet-900 for branches

  return (
    <MoonlitPetals
      background="transparent"
      scale={85}
      blossomColor={blossomColor}
      petals={Math.min(85, budget.petals)}
      wind={20}
      direction="left"
      throttleAfterViewports={1.15}
      ambientFps={10}
      advanced={{
        flowers: Math.min(8000, budget.flowers),
        crownReach: 75,
        twigs: 30,
        clumpSize: 12,
        flowerSize: 6.5,
        petalColor: petalColor,
        branchColor: branchColor,
        hazeOpacity: 0,
        vignette: 0,
        grain: 0,
      }}
      className="will-change-transform contain-strict"
    />
  );
}

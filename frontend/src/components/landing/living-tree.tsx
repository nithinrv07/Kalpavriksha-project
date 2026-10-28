"use client";

import { useEffect, useState } from "react";
import { MoonlitPetals } from "@/components/moonlit-petals";
import { NIGHT_CANOPY, canopyFor, type Canopy } from "@/lib/canopy";

/**
 * The landing backdrop is the Kalpavriksha wishing tree:
 * A rich, lush, dense canopy of luminous blossoms and branches
 * with drifting petals throughout the left side of the landing page.
 * The canopy harmoniously follows the local time of day.
 */
import { getQualityBudget } from "@/lib/perf/quality";

export function LivingTree() {
  const [canopy, setCanopy] = useState<Canopy>(NIGHT_CANOPY);
  const budget = getQualityBudget();

  useEffect(() => {
    const update = () => setCanopy(canopyFor(new Date()));
    update();
    const id = window.setInterval(update, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <MoonlitPetals
      background="transparent"
      scale={85}
      blossomColor={canopy.blossom}
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
        petalColor: canopy.petal,
        hazeOpacity: 0,
        vignette: 0,
        grain: 0,
      }}
      className="will-change-transform contain-strict"
    />
  );
}

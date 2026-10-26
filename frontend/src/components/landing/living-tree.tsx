"use client";

import { MoonlitPetals } from "@/components/moonlit-petals";
import { useProgress } from "@/components/progress-store";
import { levelOf } from "@/lib/progress";

const MAX_STAGE = 10;

/**
 * The landing backdrop is the learner's own tree: it starts modest and fills
 * out with blossoms and branches as XP accumulates, reaching today's full
 * canopy at level 10. Size stays inside the original footprint so it never
 * creeps over the 3D sphere.
 */
export function LivingTree() {
  const progress = useProgress();
  const stage = Math.min(MAX_STAGE, Math.max(1, levelOf(progress.xp).level));
  const grow = (stage - 1) / (MAX_STAGE - 1);

  return (
    <MoonlitPetals
      background="transparent"
      scale={58 + grow * 10}
      blossomColor="#D8B4FE"
      petals={Math.round(60 + grow * 20)}
      wind={20}
      direction="left"
      throttleAfterViewports={1.15}
      advanced={{
        flowers: Math.round(8000 + grow * 3000),
        crownReach: 100,
        twigs: Math.round(20 + grow * 10),
        clumpSize: 11,
        flowerSize: 6,
        hazeOpacity: 0,
        vignette: 0,
        grain: 0,
      }}
    />
  );
}

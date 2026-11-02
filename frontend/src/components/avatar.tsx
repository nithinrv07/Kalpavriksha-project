import type { Icon } from "@phosphor-icons/react";
import { Bird, Butterfly, Cat, Cow, Dog, Fish, Horse, Rabbit } from "@phosphor-icons/react/ssr";
import type { AvatarId } from "@/lib/progress";

/**
 * Buddy colours are tuned to one family: a saturated rim, a lighter crown and a
 * white silhouette, so the eight read as one sticker set rather than clip art.
 */
export const AVATAR_LOOK: Record<AvatarId, { icon: Icon; tint: string; rim: string }> = {
  cat: { icon: Cat, tint: "from-[#c4b5fd] to-[#7c3aed]", rim: "#7c3aed" },
  dog: { icon: Dog, tint: "from-[#fcd34d] to-[#d97706]", rim: "#d97706" },
  bird: { icon: Bird, tint: "from-[#5eead4] to-[#0f766e]", rim: "#0f766e" },
  butterfly: { icon: Butterfly, tint: "from-[#f9a8d4] to-[#be185d]", rim: "#be185d" },
  fish: { icon: Fish, tint: "from-[#93c5fd] to-[#1d4ed8]", rim: "#1d4ed8" },
  rabbit: { icon: Rabbit, tint: "from-[#e9d5ff] to-[#a78bfa]", rim: "#a78bfa" },
  horse: { icon: Horse, tint: "from-[#fdba74] to-[#c2410c]", rim: "#c2410c" },
  cow: { icon: Cow, tint: "from-[#86efac] to-[#15803d]", rim: "#15803d" },
};

/** Round buddy sticker: a white silhouette on a glossy tinted disc. */
export function Avatar({ id, className = "size-10", iconSize = 20 }: { id: AvatarId; className?: string; iconSize?: number }) {
  const { icon: Glyph, tint, rim } = AVATAR_LOOK[id];
  return (
    <span
      aria-hidden
      className={`relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br text-white ${tint} ${className}`}
      style={{
        boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.5), inset 0 -3px 8px rgb(0 0 0 / 0.22), 0 0 0 1px ${rim}40`,
      }}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle at 34% 22%, rgb(255 255 255 / 0.55), transparent 58%)" }}
      />
      <Glyph
        size={iconSize}
        weight="fill"
        className="relative drop-shadow-[0_1px_1px_rgb(0_0_0/0.28)]"
      />
    </span>
  );
}

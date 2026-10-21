import type { Icon } from "@phosphor-icons/react";
import { Bird, Butterfly, Cat, Cow, Dog, Fish, Horse, Rabbit } from "@phosphor-icons/react/ssr";
import type { AvatarId } from "@/lib/progress";

export const AVATAR_LOOK: Record<AvatarId, { icon: Icon; tint: string }> = {
  cat: { icon: Cat, tint: "from-[#a78bfa] to-[#7c3aed]" },
  dog: { icon: Dog, tint: "from-[#fbbf24] to-[#d97706]" },
  bird: { icon: Bird, tint: "from-[#2dd4bf] to-[#0f766e]" },
  butterfly: { icon: Butterfly, tint: "from-[#f472b6] to-[#be185d]" },
  fish: { icon: Fish, tint: "from-[#60a5fa] to-[#1d4ed8]" },
  rabbit: { icon: Rabbit, tint: "from-[#e9d5ff] to-[#a78bfa]" },
  horse: { icon: Horse, tint: "from-[#fb923c] to-[#c2410c]" },
  cow: { icon: Cow, tint: "from-[#4ade80] to-[#15803d]" },
};

/** Round animal avatar. Decorative: pair with the student's name. */
export function Avatar({ id, className = "size-10", iconSize = 20 }: { id: AvatarId; className?: string; iconSize?: number }) {
  const { icon: Glyph, tint } = AVATAR_LOOK[id];
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br text-[#0b0a10] ${tint} ${className}`}>
      <Glyph size={iconSize} weight="duotone" />
    </span>
  );
}

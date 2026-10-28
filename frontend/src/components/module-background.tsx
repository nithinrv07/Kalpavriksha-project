import { ChromeWaves } from "@/components/landing/chrome-waves";
import type { AccentKey } from "@/modules/accents";

interface ModuleBackgroundProps {
  accent?: AccentKey;
}

/**
 * Module background: renders the signature ChromeWaves background from the landing page
 * across all modules (Digital Learning, Holistic Growth, GK & Patriotic Songs)
 * for seamless visual consistency and obsidian space depth.
 */
export function ModuleBackground(_props: ModuleBackgroundProps) {
  return <ChromeWaves />;
}

import type { Icon } from "@phosphor-icons/react";
import { BookOpenText, Flag, Plant } from "@phosphor-icons/react/ssr";
import type { LocalizedText } from "@/lib/i18n";
import type { ShapeName } from "@/lib/shapes";

/**
 * Every feature of the Kalpavriksha app is a module described here.
 * Menu, hero chips, bento tiles and `/m/[slug]` routes are all derived from
 * this list — adding Module 4 means adding one entry (and its folder).
 */
export type KalpaModule = {
  readonly id: string;
  readonly slug: string;
  readonly index: string;
  readonly title: LocalizedText;
  readonly summary: LocalizedText;
  readonly icon: Icon;
  readonly iconImage?: string;
  /** Particle shape the hero morphs into when this module is highlighted. */
  readonly shape: ShapeName;
  /** Bento tile footprint on large screens. */
  readonly tile: "feature" | "tall" | "standard";
};

export const MODULES: readonly KalpaModule[] = [
  {
    id: "content",
    slug: "learn",
    index: "01",
    title: { en: "Digital Learning", ta: "டிஜிட்டல் கற்றல்" },
    summary: {
      en: "Videos, lessons, songs and stories. Read or listen.",
      ta: "காணொளிகள், பாடங்கள், பாடல்கள், கதைகள் — படிக்கலாம், கேட்கலாம்.",
    },
    icon: BookOpenText,
    iconImage: "/images/modules/digital-learning-icon.png",
    shape: "play",
    tile: "feature",
  },
  {
    id: "evaluation",
    slug: "grow",
    index: "02",
    title: { en: "Holistic Growth", ta: "முழுமையான வளர்ச்சி" },
    summary: {
      en: "Academics, skills, sports and activities in one profile.",
      ta: "படிப்பு, திறன்கள், விளையாட்டு, செயல்பாடுகள் — ஒரே சுயவிவரத்தில்.",
    },
    icon: Plant,
    iconImage: "/images/modules/holistic-growth-icon.png",
    shape: "bars",
    tile: "tall",
  },
  {
    id: "gk-songs",
    slug: "gk-songs",
    index: "03",
    title: {
      en: "GK & Patriotic Songs",
      ta: "பொது அறிவு & தேசபக்திப் பாடல்கள்",
    },
    summary: {
      en: "Quizzes, current affairs and songs with read-aloud.",
      ta: "வினாடி வினா, நடப்பு நிகழ்வுகள், வாசித்துக் காட்டும் பாடல்கள்.",
    },
    icon: Flag,
    iconImage: "/images/modules/gk-songs-icon.png",
    shape: "chakra",
    tile: "standard",
  },
] as const satisfies readonly KalpaModule[];

export function getModule(slug: string): KalpaModule | undefined {
  return MODULES.find((m) => m.slug === slug);
}

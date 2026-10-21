import type { Icon } from "@phosphor-icons/react";
import { Feather, Flask, MusicNotes, Scroll } from "@phosphor-icons/react/ssr";
import type { CategoryId } from "./lessons";

export const CATEGORY_ICON: Record<CategoryId, Icon> = {
  kural: Scroll,
  aathichudi: Feather,
  bharathiyar: MusicNotes,
  science: Flask,
};

/**
 * One colour per module, so a child can recognise a module without reading.
 * The class strings live here (not in the registry) because Tailwind only
 * generates utilities it can find as complete literals in the source.
 */
export type AccentKey = "violet" | "teal" | "amber";

export type ModuleAccent = {
  key: AccentKey;
  /** Base colour for canvases, SVG and inline styles. */
  hex: string;
  /** rgba glow for the animated neon border. */
  glow: string;
  /** Text utility for indices, links and small labels. */
  text: string;
  /** Text utility for a card title on hover. */
  textHover: string;
  /** Icon chip: soft background + accent glyph. */
  chip: string;
  /** Round arrow badge on hover. */
  chipHover: string;
  /** Large banner icon (module header). */
  banner: string;
  /** Card hover: border + outer glow. */
  cardHover: string;
  /** Media frame hover inside a card. */
  frameHover: string;
  /** Active pill in the module switcher. */
  tabActive: string;
  /** Solid accent pill (dark text on accent fill). */
  solid: string;
  /** Thin accent rule, e.g. the chip progress bar. */
  bar: string;
};

export const ACCENTS: Record<AccentKey, ModuleAccent> = {
  violet: {
    key: "violet",
    hex: "#C084FC",
    glow: "rgba(147,51,234,0.45)",
    text: "text-violet",
    textHover: "group-hover:text-violet-ink",
    chip: "bg-violet-deep/60 text-violet-ink",
    chipHover: "group-hover:border-violet group-hover:bg-violet-deep group-hover:text-violet-ink",
    banner: "bg-violet-deep/70 text-violet-ink shadow-[0_0_40px_-8px_rgba(124,58,237,0.7)]",
    cardHover: "hover:border-violet/40 hover:shadow-[0_20px_60px_-5px_rgba(0,0,0,0.95),0_0_45px_rgba(168,85,247,0.35)]",
    frameHover: "group-hover:border-violet/40 group-hover:shadow-[0_20px_50px_-10px_rgba(124,58,237,0.3)]",
    tabActive: "bg-violet-deep text-violet-ink",
    solid: "bg-violet text-bg",
    bar: "bg-violet",
  },
  teal: {
    key: "teal",
    hex: "#2DD4BF",
    glow: "rgba(45,212,191,0.4)",
    text: "text-teal",
    textHover: "group-hover:text-teal",
    chip: "bg-teal/15 text-teal",
    chipHover: "group-hover:border-teal group-hover:bg-teal/20 group-hover:text-teal",
    banner: "bg-teal/15 text-teal shadow-[0_0_40px_-8px_rgba(45,212,191,0.55)]",
    cardHover: "hover:border-teal/40 hover:shadow-[0_20px_60px_-5px_rgba(0,0,0,0.95),0_0_45px_rgba(45,212,191,0.3)]",
    frameHover: "group-hover:border-teal/40 group-hover:shadow-[0_20px_50px_-10px_rgba(45,212,191,0.25)]",
    tabActive: "bg-teal/20 text-teal",
    solid: "bg-teal text-bg",
    bar: "bg-teal",
  },
  amber: {
    key: "amber",
    hex: "#FBBF24",
    glow: "rgba(251,191,36,0.4)",
    text: "text-amber",
    textHover: "group-hover:text-amber-300",
    chip: "bg-amber/15 text-amber-300",
    chipHover: "group-hover:border-amber group-hover:bg-amber/20 group-hover:text-amber-200",
    banner: "bg-amber/15 text-amber-300 shadow-[0_0_40px_-8px_rgba(251,191,36,0.55)]",
    cardHover: "hover:border-amber/40 hover:shadow-[0_20px_60px_-5px_rgba(0,0,0,0.95),0_0_45px_rgba(251,191,36,0.25)]",
    frameHover: "group-hover:border-amber-400/40 group-hover:shadow-[0_20px_50px_-10px_rgba(251,191,36,0.25)]",
    tabActive: "bg-amber/20 text-amber-300",
    solid: "bg-amber text-bg",
    bar: "bg-amber",
  },
};

export function accentOf(key: AccentKey): ModuleAccent {
  return ACCENTS[key];
}

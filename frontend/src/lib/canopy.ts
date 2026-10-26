/**
 * The wishing tree's canopy colour follows the local time of day so morning
 * classes get a warm dawn, midday keeps the approved lavender and evening
 * slides into rose then cool moonlight.
 */
export type Canopy = { blossom: string; petal: string };

const PHASES: readonly { at: number; colors: Canopy }[] = [
  { at: 0, colors: { blossom: "#C4B5FD", petal: "#CFD3F5" } },
  { at: 6, colors: { blossom: "#F7C6A3", petal: "#FBE3CC" } },
  { at: 12, colors: { blossom: "#D8B4FE", petal: "#EDE6EA" } },
  { at: 18, colors: { blossom: "#F2A6C4", petal: "#FBD8E4" } },
  { at: 24, colors: { blossom: "#C4B5FD", petal: "#CFD3F5" } },
];

/** The original moonlight canopy, used for the server render. */
export const NIGHT_CANOPY: Canopy = PHASES[0]!.colors;

function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => {
    const ca = (pa >> shift) & 255;
    const cb = (pb >> shift) & 255;
    return Math.round(ca + (cb - ca) * t);
  };
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
}

/** Blend the canopy between the nearest two times of day. */
export function canopyFor(date: Date): Canopy {
  const hour = date.getHours() + date.getMinutes() / 60;
  for (let i = 0; i < PHASES.length - 1; i++) {
    const from = PHASES[i]!;
    const to = PHASES[i + 1]!;
    if (hour >= from.at && hour <= to.at) {
      const t = (hour - from.at) / (to.at - from.at);
      return {
        blossom: mixHex(from.colors.blossom, to.colors.blossom, t),
        petal: mixHex(from.colors.petal, to.colors.petal, t),
      };
    }
  }
  return NIGHT_CANOPY;
}

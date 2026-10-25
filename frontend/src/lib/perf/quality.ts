/**
 * Device quality tiers shared by every canvas / WebGL surface.
 *
 * The site keeps all of its 3D effects on every device; this module only decides
 * how much resolution and how many particles each effect may use.
 */

export type QualityTier = 0 | 1 | 2 | 3;

export interface QualityBudget {
  tier: QualityTier;
  /** Hard cap for canvas backing-store pixel ratio. */
  maxDpr: number;
  /** Preferred frame rate for ambient effects. */
  targetFps: number;
  /** MSAA is only worth it on high-end GPUs. */
  antialias: boolean;
  /** Tree blossom count. */
  flowers: number;
  /** Falling petal count. */
  petals: number;
  /** Flip-side particle count. */
  particles: number;
  /** Depth headline layer count. */
  depthLayers: number;
  /** Footer wave-field density. */
  waveDensity: number;
}

const BUDGETS: Record<QualityTier, QualityBudget> = {
  0: {
    tier: 0,
    maxDpr: 1,
    targetFps: 30,
    antialias: false,
    flowers: 3500,
    petals: 30,
    particles: 1200,
    depthLayers: 8,
    waveDensity: 70,
  },
  1: {
    tier: 1,
    maxDpr: 1.25,
    targetFps: 30,
    antialias: false,
    flowers: 6000,
    petals: 50,
    particles: 2200,
    depthLayers: 12,
    waveDensity: 100,
  },
  2: {
    tier: 2,
    maxDpr: 1.5,
    targetFps: 60,
    antialias: false,
    flowers: 11000,
    petals: 80,
    particles: 4000,
    depthLayers: 18,
    waveDensity: 145,
  },
  3: {
    tier: 3,
    maxDpr: 2,
    targetFps: 60,
    antialias: true,
    flowers: 11000,
    petals: 80,
    particles: 4000,
    depthLayers: 18,
    waveDensity: 145,
  },
};

type BrowserNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

let cachedTier: QualityTier | null = null;
let cachedGLSupport: { webgl: boolean; webgl2: boolean } | null = null;

function probeWebGL(): { webgl: boolean; webgl2: boolean } {
  if (cachedGLSupport) return cachedGLSupport;
  if (typeof document === "undefined") return { webgl: true, webgl2: true };

  let webgl = false;
  let webgl2 = false;
  try {
    const canvas = document.createElement("canvas");
    const gl2 = canvas.getContext("webgl2");
    const gl = (gl2 ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    webgl2 = !!gl2;
    webgl = !!gl;
    // Release the probe context so it does not count against the browser quota.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webgl = false;
    webgl2 = false;
  }
  cachedGLSupport = { webgl, webgl2 };
  return cachedGLSupport;
}

/** Classify the current device once per session. Safe to call during SSR. */
export function detectQualityTier(): QualityTier {
  if (cachedTier !== null) return cachedTier;
  if (typeof window === "undefined") return 2;

  const nav = navigator as BrowserNavigator;
  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  const gl = probeWebGL();
  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const saveData = nav.connection?.saveData ?? false;

  let tier: QualityTier = 2;
  if (!gl.webgl) {
    tier = 0;
  } else if (memory <= 4 || cores <= 4) {
    tier = 1;
  } else if (memory >= 8 && cores >= 8 && gl.webgl2) {
    tier = 3;
  }

  // Phones pay for every pixel in battery and heat; step one notch down.
  if (coarsePointer && tier > 1) tier = (tier - 1) as QualityTier;
  if (saveData && tier > 0) tier = (tier - 1) as QualityTier;

  cachedTier = tier;
  return cachedTier;
}

export function getQualityBudget(tier: QualityTier = detectQualityTier()): QualityBudget {
  return BUDGETS[tier];
}

/** Clamp a device pixel ratio to the tier's cap (never above the real one). */
export function clampDpr(
  dpr: number | undefined = typeof window !== "undefined" ? window.devicePixelRatio : 1,
  tier: QualityTier = detectQualityTier()
): number {
  const raw = dpr ?? 1;
  const safe = Number.isFinite(raw) && raw > 0 ? raw : 1;
  return Math.min(safe, BUDGETS[tier].maxDpr);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

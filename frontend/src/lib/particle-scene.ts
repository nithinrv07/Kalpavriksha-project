import { SHAPES, generateShape, type ShapeName } from "./shapes";
import { getQualityBudget } from "./perf/quality";

/**
 * Framework-free Canvas 2D particle renderer: a point cloud that morphs
 * between shapes, sways gently and tilts toward the pointer.
 * No WebGL / three.js so it stays light on low-end phones.
 */
export type ParticleScene = {
  readonly morphTo: (shape: ShapeName) => void;
  /** Pause / resume rendering without losing the current shape. */
  readonly setActive: (active: boolean) => void;
  readonly destroy: () => void;
};

const MORPH_MS = 1700;
const MAX_DELAY = 0.35;
const TONES = ["#f5f3ff", "#c4b5fd", "#8b5cf6"] as const;
/** Alpha per (tone × depth) bucket: [tone0 far, tone0 near, tone1 far, …]. */
const BUCKET_ALPHA = [0.55, 1, 0.5, 0.95, 0.45, 0.9] as const;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

export function createParticleScene(canvas: HTMLCanvasElement, initial: ShapeName): ParticleScene {
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return { morphTo: () => undefined, setActive: () => undefined, destroy: () => undefined };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowPower =
    window.matchMedia("(max-width: 768px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4;
  const count = lowPower
    ? Math.min(2200, getQualityBudget().particles)
    : getQualityBudget().particles;

  const targets = new Map<ShapeName, Float32Array>();
  const target = (name: ShapeName) => {
    let pts = targets.get(name);
    if (!pts) {
      pts = generateShape(name, count, SHAPES.indexOf(name) + 11);
      targets.set(name, pts);
    }
    return pts;
  };

  // Per-particle state.
  const pos = new Float32Array(target(initial));
  const from = new Float32Array(pos);
  let to = target(initial);
  const delay = new Float32Array(count);
  const phase = new Float32Array(count);
  const tone = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    delay[i] = Math.random() * MAX_DELAY;
    phase[i] = Math.random() * Math.PI * 2;
    const r = Math.random();
    tone[i] = r < 0.18 ? 0 : r < 0.5 ? 1 : 2;
  }

  let width = 0;
  let height = 0;
  let dpr = 1;
  let morphStart = -Infinity;
  /** False while a morph has not yet been drawn through to its target shape. */
  let settled = true;
  let raf = 0;
  let visible = true;
  let enabled = true;
  let pointerX = 0;
  let pointerY = 0;
  let tiltX = 0;
  let tiltY = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    if (reducedMotion) draw(performance.now());
  };

  const draw = (now: number) => {
    const progress = (now - morphStart) / MORPH_MS;
    const morphing = progress < 1 + MAX_DELAY;
    if (!morphing && !settled) {
      // A morph can finish while no frames were drawn (off-screen): land exactly on the target.
      pos.set(to);
      settled = true;
    }

    tiltX += (pointerX - tiltX) * 0.05;
    tiltY += (pointerY - tiltY) * 0.05;
    const yaw = (reducedMotion ? 0 : Math.sin(now * 0.00035) * 0.45) + tiltX * 0.5;
    const pitch = (reducedMotion ? 0 : Math.sin(now * 0.00023) * 0.12) + tiltY * 0.3;
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);

    const scale = Math.min(width, height) * 0.46 * dpr;
    const ox = (width * dpr) / 2;
    const oy = (height * dpr) / 2;
    const breathe = reducedMotion ? 0 : 0.009;

    // One pass builds a path per (tone × depth) bucket; six fills per frame instead of
    // thousands of fillRect + globalAlpha state changes (main-thread cost during scroll).
    const paths = BUCKET_ALPHA.map(() => new Path2D());

    for (let i = 0; i < count; i++) {
      const k = i * 3;
      let x: number;
      let y: number;
      let z: number;
      if (morphing) {
        const local = easeInOutCubic(clamp01((progress - (delay[i] ?? 0)) / (1 - MAX_DELAY)));
        // Particles bloom outward mid-flight, then settle into the new shape.
        const bloom = Math.sin(local * Math.PI) * 0.22;
        const p = phase[i] ?? 0;
        x = (from[k] ?? 0) + ((to[k] ?? 0) - (from[k] ?? 0)) * local + Math.cos(p) * bloom;
        y = (from[k + 1] ?? 0) + ((to[k + 1] ?? 0) - (from[k + 1] ?? 0)) * local + Math.sin(p) * bloom;
        z = (from[k + 2] ?? 0) + ((to[k + 2] ?? 0) - (from[k + 2] ?? 0)) * local;
        pos[k] = x;
        pos[k + 1] = y;
        pos[k + 2] = z;
      } else {
        x = pos[k] ?? 0;
        y = pos[k + 1] ?? 0;
        z = pos[k + 2] ?? 0;
      }
      const wobble = Math.sin(now * 0.0012 + (phase[i] ?? 0)) * breathe;
      x += wobble;
      y += wobble * 0.6;

      // Rotate (yaw then pitch), then perspective-project.
      const rx = x * cy + z * sy;
      const rz = -x * sy + z * cy;
      const ry = y * cp - rz * sp;
      const fz = y * sp + rz * cp;
      const persp = 2.8 / (2.8 - fz);
      const t = tone[i] ?? 2;
      const size = (t === 0 ? 1.8 : 1.3) * dpr * persp;
      paths[t * 2 + (fz > 0 ? 1 : 0)]?.rect(ox + rx * scale * persp, oy - ry * scale * persp, size, size);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    paths.forEach((path, b) => {
      ctx.fillStyle = TONES[b >> 1] ?? "#fff";
      ctx.globalAlpha = BUCKET_ALPHA[b] ?? 1;
      ctx.fill(path);
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  };

  // While the page is actively scrolling, draw every other frame: the cloud keeps moving,
  // and smooth scroll gets more of the main thread.
  let lastScroll = -Infinity;
  let frame = 0;
  const onScroll = () => {
    lastScroll = performance.now();
  };

  const loop = (now: number) => {
    frame++;
    if (now - lastScroll > 150 || frame % 2 === 0) draw(now);
    raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
  };

  const start = () => {
    if (reducedMotion || raf || !visible || !enabled || document.hidden) return;
    if (!settled) {
      // Returning mid-morph: continue from where the particles were left, not a stale half-state.
      from.set(pos);
      morphStart = performance.now();
    }
    raf = requestAnimationFrame(loop);
  };

  const onPointer = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = clamp01((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    pointerY = clamp01((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const io = new IntersectionObserver((entries) => {
    // Several entries can arrive in one batch during fast scrolls; the last one is current.
    visible = entries[entries.length - 1]?.isIntersecting ?? true;
    start();
  });
  io.observe(canvas);
  const onVisibility = () => start();
  document.addEventListener("visibilitychange", onVisibility);
  if (!reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  resize();
  start();

  return {
    morphTo(shape) {
      if (to === target(shape)) return;
      from.set(pos);
      to = target(shape);
      if (reducedMotion) {
        pos.set(to);
        draw(performance.now());
      } else {
        morphStart = performance.now();
        settled = false;
      }
    },
    setActive(next: boolean) {
      if (next === enabled) return;
      enabled = next;
      if (!enabled) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else {
        start();
      }
    },
    destroy() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    },
  };
}

/**
 * Point-cloud generators for the particle hero. Pure and seeded so the same
 * shape always produces the same cloud. Coordinates are normalised to [-1, 1],
 * y points up.
 */
export const SHAPES = ["tree", "ring", "play", "bars", "chakra"] as const;
export type ShapeName = (typeof SHAPES)[number];

type Rng = () => number;
type Vec3 = readonly [number, number, number];
type Sampler = (rng: Rng) => Vec3;
type Blob = readonly [x: number, y: number, z: number, radius: number];

function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;
const between = (rng: Rng, min: number, max: number) => min + (max - min) * rng();
const pick = <T>(rng: Rng, items: readonly [T, ...T[]]): T => items[Math.floor(rng() * items.length)] ?? items[0];

function unitDirection(rng: Rng): Vec3 {
  const u = between(rng, -1, 1);
  const a = rng() * TAU;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(a), u, s * Math.sin(a)];
}

function ringPoint(rng: Rng, radius: number, thickness: number, depth: number): Vec3 {
  const a = rng() * TAU;
  const r = radius + between(rng, -thickness, thickness);
  return [r * Math.cos(a), r * Math.sin(a), between(rng, -depth, depth)];
}

/** Weighted mix of samplers: each point picks a part by its weight. */
function mix(parts: readonly (readonly [number, Sampler])[]): Sampler {
  const total = parts.reduce((sum, [w]) => sum + w, 0);
  return (rng) => {
    let roll = rng() * total;
    for (const [w, sample] of parts) {
      roll -= w;
      if (roll <= 0) return sample(rng);
    }
    const last = parts[parts.length - 1];
    if (!last) throw new Error("mix() needs at least one part");
    return last[1](rng);
  };
}

const CANOPY: readonly [Blob, ...Blob[]] = [
  [0, 0.42, 0, 0.42],
  [-0.42, 0.24, 0.05, 0.3],
  [0.42, 0.26, -0.05, 0.3],
  [-0.2, 0.66, 0, 0.28],
  [0.22, 0.64, 0.05, 0.28],
];

const tree = mix([
  // Trunk, flaring into roots near the ground.
  [
    0.14,
    (rng) => {
      const y = between(rng, -0.95, -0.12);
      const flare = y < -0.8 ? (-0.8 - y) * 1.6 : 0;
      const radius = (0.05 + (-0.12 - y) * 0.05 + flare) * Math.sqrt(rng());
      const a = rng() * TAU;
      return [radius * Math.cos(a), y, radius * Math.sin(a)];
    },
  ],
  // Branches from the trunk top to each canopy cluster.
  [
    0.14,
    (rng) => {
      const blob = pick(rng, CANOPY);
      const t = rng();
      const j = 0.025;
      return [
        blob[0] * t + between(rng, -j, j),
        -0.2 + (blob[1] + 0.2) * t + between(rng, -j, j),
        blob[2] * t + between(rng, -j, j),
      ];
    },
  ],
  // Canopy: overlapping soft spheres.
  [
    0.72,
    (rng) => {
      const [cx, cy, cz, r] = pick(rng, CANOPY);
      const [dx, dy, dz] = unitDirection(rng);
      const d = r * (0.7 + 0.3 * rng());
      return [cx + dx * d, cy + dy * d, cz + dz * d];
    },
  ],
]);

const ring: Sampler = (rng) => {
  const u = rng() * TAU;
  const v = rng() * TAU;
  const tube = 0.24 * (0.55 + 0.45 * rng());
  const R = 0.62 + tube * Math.cos(v);
  return [R * Math.cos(u), R * Math.sin(u), tube * Math.sin(v)];
};

const play = mix([
  [0.35, (rng) => ringPoint(rng, 0.86, 0.035, 0.05)],
  [
    0.65,
    (rng) => {
      // Uniform sample inside the triangle A(-0.28, 0.44) B(-0.28, -0.44) C(0.46, 0).
      const s = Math.sqrt(rng());
      const t = rng();
      const a = 1 - s;
      const b = s * (1 - t);
      const c = s * t;
      return [-0.28 * a - 0.28 * b + 0.46 * c, 0.44 * a - 0.44 * b, between(rng, -0.1, 0.1)];
    },
  ],
]);

const BAR_HEIGHTS = [0.5, 0.85, 1.25, 1.7] as const;
const bars = mix(
  BAR_HEIGHTS.map((h, i): readonly [number, Sampler] => [
    h,
    (rng) => [-0.6 + i * 0.4 + between(rng, -0.13, 0.13), -0.85 + rng() * h, between(rng, -0.13, 0.13)],
  ]),
);

const SPOKES = 24;
const chakra = mix([
  [0.3, (rng) => ringPoint(rng, 0.86, 0.04, 0.05)],
  [0.1, (rng) => ringPoint(rng, 0.76, 0.015, 0.04)],
  [
    0.08,
    (rng) => {
      const a = rng() * TAU;
      const r = 0.12 * Math.sqrt(rng());
      return [r * Math.cos(a), r * Math.sin(a), between(rng, -0.05, 0.05)];
    },
  ],
  [
    0.52,
    (rng) => {
      const spoke = (Math.floor(rng() * SPOKES) / SPOKES) * TAU;
      const r = between(rng, 0.12, 0.76);
      const width = 0.03 * (1 - r) + 0.004;
      const side = between(rng, -width, width);
      return [
        r * Math.cos(spoke) - side * Math.sin(spoke),
        r * Math.sin(spoke) + side * Math.cos(spoke),
        between(rng, -0.03, 0.03),
      ];
    },
  ],
]);

const SAMPLERS: Readonly<Record<ShapeName, Sampler>> = { tree, ring, play, bars, chakra };

export function generateShape(name: ShapeName, count: number, seed = 1): Float32Array {
  const rng = mulberry32(seed);
  const sample = SAMPLERS[name];
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y, z] = sample(rng);
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

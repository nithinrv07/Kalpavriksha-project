import { describe, expect, it } from "vitest";
import { SHAPES, generateShape } from "./shapes";

describe("generateShape", () => {
  it.each(SHAPES)("%s returns count * 3 finite coordinates within bounds", (name) => {
    const points = generateShape(name, 500, 7);
    expect(points).toBeInstanceOf(Float32Array);
    expect(points.length).toBe(1500);
    for (const v of points) {
      expect(Number.isFinite(v)).toBe(true);
      expect(Math.abs(v)).toBeLessThanOrEqual(1.05);
    }
  });

  it.each(SHAPES)("%s is deterministic for the same seed", (name) => {
    expect(generateShape(name, 200, 42)).toEqual(generateShape(name, 200, 42));
  });

  it("produces visibly different clouds for different shapes", () => {
    const tree = generateShape("tree", 300, 1);
    const ring = generateShape("ring", 300, 1);
    let diff = 0;
    for (let i = 0; i < tree.length; i++) diff += Math.abs((tree[i] ?? 0) - (ring[i] ?? 0));
    expect(diff / tree.length).toBeGreaterThan(0.1);
  });

  it("tree has a trunk below and canopy above", () => {
    const pts = generateShape("tree", 2000, 3);
    let below = 0;
    let above = 0;
    for (let i = 1; i < pts.length; i += 3) {
      if ((pts[i] ?? 0) < -0.3) below++;
      else if ((pts[i] ?? 0) > 0) above++;
    }
    expect(above).toBeGreaterThan(below * 2);
    expect(below).toBeGreaterThan(0);
  });
});

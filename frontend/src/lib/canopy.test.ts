import { describe, expect, it } from "vitest";
import { NIGHT_CANOPY, canopyFor } from "./canopy";

const at = (hour: number, minute = 0) => canopyFor(new Date(2026, 0, 1, hour, minute));

describe("canopyFor", () => {
  it("keeps the approved lavender at midday", () => {
    expect(at(12).blossom).toBe("#d8b4fe");
  });

  it("warms to peach at dawn", () => {
    expect(at(6).blossom).toBe("#f7c6a3");
  });

  it("cools to moonlight at midnight", () => {
    expect(at(0).blossom).toBe(NIGHT_CANOPY.blossom.toLowerCase());
  });

  it("blends smoothly between phases", () => {
    const morning = at(9);
    expect(morning.blossom).not.toBe(at(6).blossom);
    expect(morning.blossom).not.toBe(at(12).blossom);
    expect(morning.blossom).toMatch(/^#[0-9a-f]{6}$/);
  });
});

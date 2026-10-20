import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n";
import { SHAPES } from "@/lib/shapes";
import { MODULES, getModule } from "./registry";

describe("module registry", () => {
  it("ships the three launch modules in order", () => {
    expect(MODULES.map((m) => m.slug)).toEqual(["learn", "grow", "gk-songs"]);
  });

  it("has unique ids and slugs", () => {
    expect(new Set(MODULES.map((m) => m.id)).size).toBe(MODULES.length);
    expect(new Set(MODULES.map((m) => m.slug)).size).toBe(MODULES.length);
  });

  it("translates every module title and summary in all locales", () => {
    for (const m of MODULES) {
      for (const locale of LOCALES) {
        expect(m.title[locale].trim()).not.toBe("");
        expect(m.summary[locale].trim()).not.toBe("");
      }
    }
  });

  it("uses a known particle shape for every module", () => {
    for (const m of MODULES) expect(SHAPES).toContain(m.shape);
  });

  it("looks modules up by slug", () => {
    expect(getModule("grow")?.id).toBe("evaluation");
    expect(getModule("missing")).toBeUndefined();
  });
});

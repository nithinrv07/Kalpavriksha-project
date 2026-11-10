import { describe, it, expect } from "vitest";
import { getLessonManifest, getOrCreateLessonManifest } from "@/data/manifests";

describe("Lesson Manifest Registry & Video Mapping", () => {
  it("resolves the pilot Class 10 Science Unit 1 master manifest", () => {
    const manifest = getLessonManifest("c10-science-ch1");
    expect(manifest).not.toBeNull();
    expect(manifest?.lessonId).toBe("c10-science-ch1");
    expect(manifest?.videoId).toBe("-HSDnFOhws0");
    expect(manifest?.timeline.length).toBeGreaterThanOrEqual(2);
  });

  it("resolves compiled manifests for Class 10 Maths chapters with accurate YouTube IDs", () => {
    const manifest = getLessonManifest("c10-math-ch1");
    expect(manifest).not.toBeNull();
    expect(manifest?.videoId).toBe("sEWCDOWcS0g");
    expect(manifest?.timeline[0]?.gate).toBe("HARD");
    expect(manifest?.timeline[0]?.quiz.correctHash).toBeDefined();
    expect(manifest?.timeline[0]?.quiz.correctHash.length).toBe(64);
  });

  it("resolves compiled manifests for Class 10 Social Science chapters", () => {
    const manifest = getLessonManifest("c10-social-ch1");
    expect(manifest).not.toBeNull();
    expect(manifest?.videoId).toBe("n4jNh3l4oCA");
  });
});

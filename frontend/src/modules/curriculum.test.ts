import { describe, expect, it } from "vitest";
import {
  getChapterById,
  getStandardCurriculum,
  getSubjectsForStandard,
  isSupportedStandard,
  SUPPORTED_STANDARDS,
  TN_TEXTBOOK_PORTAL_URL,
  validateStandardAccess,
} from "@/lib/curriculum";
import {
  completeLesson,
  EMPTY_PROGRESS,
  parseProgress,
  setLastAccessed,
  setProfile,
  updateStudentProfile,
  type Profile,
} from "@/lib/progress";

describe("Standard-wise Curriculum Engine (Class 4 to 12)", () => {
  it("supports all standards from Class 4 through Class 12", () => {
    expect(SUPPORTED_STANDARDS).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12]);
    for (const std of SUPPORTED_STANDARDS) {
      expect(isSupportedStandard(std)).toBe(true);
      const curriculum = getStandardCurriculum(std);
      expect(curriculum).toBeDefined();
      expect(curriculum?.standard).toBe(std);
      expect(curriculum?.subjects.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("Scenario 1: Class 4 student sees only subjects configured for Class 4", () => {
    const subjects = getSubjectsForStandard(4);
    const codes = subjects.map((s) => s.code);
    expect(codes).toContain("TAM-04");
    expect(codes).toContain("ENG-04");
    expect(codes).toContain("MAT-04");
    expect(codes).toContain("SCI-04");
    expect(codes).toContain("SOC-04");

    // Must NOT contain higher secondary streams like Physics or Accountancy
    expect(codes).not.toContain("PHY-11");
    expect(codes).not.toContain("ACC-11");
  });

  it("Scenario 2: Class 8 student sees upper primary subjects configured for Class 8", () => {
    const subjects = getSubjectsForStandard(8);
    const codes = subjects.map((s) => s.code);
    expect(codes).toContain("TAM-08");
    expect(codes).toContain("ENG-08");
    expect(codes).toContain("MAT-08");
    expect(codes).toContain("SCI-08");
    expect(codes).toContain("SOC-08");
    expect(codes).not.toContain("TAM-04");
  });

  it("Scenario 3: Class 10 student sees board exam subjects configured for Class 10", () => {
    const subjects = getSubjectsForStandard(10);
    const codes = subjects.map((s) => s.code);
    expect(codes).toContain("TAM-10");
    expect(codes).toContain("ENG-10");
    expect(codes).toContain("MAT-10");
    expect(codes).toContain("SCI-10");
    expect(codes).toContain("SOC-10");
    expect(codes).not.toContain("PHY-12");
  });

  it("Scenario 4: Class 12 student sees higher secondary elective and language subjects", () => {
    const subjects = getSubjectsForStandard(12);
    const codes = subjects.map((s) => s.code);
    expect(codes).toContain("TAM-12");
    expect(codes).toContain("ENG-12");
    expect(codes).toContain("MAT-12");
    expect(codes).toContain("PHY-12");
    expect(codes).toContain("CHE-12");
    expect(codes).toContain("BIO-12");
    expect(codes).toContain("CSC-12");
    expect(codes).toContain("COM-12");
    expect(codes).toContain("ACC-12");
    expect(codes).toContain("ECO-12");
  });

  it("links every subject and chapter to the official TN Textbook portal", () => {
    for (const std of SUPPORTED_STANDARDS) {
      const subjects = getSubjectsForStandard(std);
      for (const sub of subjects) {
        expect(sub.textbookUrl).toBe(TN_TEXTBOOK_PORTAL_URL);
        expect(sub.chapters.length).toBeGreaterThan(0);
        for (const ch of sub.chapters) {
          expect(ch.title.en.trim().length).toBeGreaterThan(0);
          expect(ch.title.ta.trim().length).toBeGreaterThan(0);
          expect(ch.resources.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("Scenario 5 & 6: Student profile persistence, email, and standard loading", () => {
    const profile: Profile = {
      name: "Priya",
      email: "priya@school.edu.in",
      avatar: "butterfly",
      grade: 6,
      studentId: "KV-2026-1234",
      preferredLanguage: "ta",
    };

    const progressWithProfile = setProfile(EMPTY_PROGRESS, profile);
    expect(progressWithProfile.profile?.grade).toBe(6);
    expect(progressWithProfile.profile?.email).toBe("priya@school.edu.in");
    expect(progressWithProfile.profile?.preferredLanguage).toBe("ta");

    // Test serialization and defensive parsing
    const serialized = JSON.stringify(progressWithProfile);
    const parsed = parseProgress(JSON.parse(serialized));
    expect(parsed.profile?.grade).toBe(6);
    expect(parsed.profile?.name).toBe("Priya");
    expect(parsed.profile?.email).toBe("priya@school.edu.in");
  });

  it("Scenario 7: Updating student standard refreshes subjects correctly", () => {
    const profile: Profile = {
      name: "Karthik",
      avatar: "cat",
      grade: 6,
      studentId: "KV-2026-5678",
    };

    let p = setProfile(EMPTY_PROGRESS, profile);
    expect(getSubjectsForStandard(p.profile!.grade)[0]?.code).toBe("TAM-06");

    // Student moves to Class 9
    p = updateStudentProfile(p, { grade: 9 });
    expect(p.profile?.grade).toBe(9);
    expect(getSubjectsForStandard(p.profile!.grade)[0]?.code).toBe("TAM-09");
  });

  it("Scenario 8: Continue Learning records and retrieves last opened chapter", () => {
    const profile: Profile = {
      name: "Ananya",
      avatar: "bird",
      grade: 8,
      studentId: "KV-2026-9012",
    };

    let p = setProfile(EMPTY_PROGRESS, profile);
    expect(p.profile?.lastAccessed).toBeUndefined();

    // Student opens Class 8 Science Chapter 1
    p = setLastAccessed(p, { standard: 8, subjectId: "c8-science", chapterId: "c8-sci-ch1" });
    expect(p.profile?.lastAccessed?.standard).toBe(8);
    expect(p.profile?.lastAccessed?.subjectId).toBe("c8-science");
    expect(p.profile?.lastAccessed?.chapterId).toBe("c8-sci-ch1");

    const resolved = getChapterById(8, "c8-science", "c8-sci-ch1");
    expect(resolved).toBeDefined();
    expect(resolved?.subject.id).toBe("c8-science");
    expect(resolved?.chapter.id).toBe("c8-sci-ch1");

    // Completing lesson adds to lessonsDone and gives XP
    p = completeLesson(p, "c8-sci-ch1", "2026-10-23");
    expect(p.lessonsDone).toContain("c8-sci-ch1");
    expect(p.xp).toBe(20);
  });

  it("Scenario 10: URL access validation blocks cross-standard tampering", () => {
    // Student in Class 6 tries to access Class 10 content
    const invalidCheck = validateStandardAccess(6, 10);
    expect(invalidCheck.allowed).toBe(false);
    expect(invalidCheck.reason).toContain("Class 10");

    // Student in Class 6 accesses Class 6 content
    const validCheck = validateStandardAccess(6, 6);
    expect(validCheck.allowed).toBe(true);
    expect(validCheck.reason).toBeUndefined();

    // Invalid standard
    const unsupported = validateStandardAccess(6, 99);
    expect(unsupported.allowed).toBe(false);
  });
});

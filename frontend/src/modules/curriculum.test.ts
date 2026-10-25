import { describe, expect, it } from "vitest";
import {
  filterSubjectsByGroup,
  getChapterById,
  getSeniorGroup,
  getStandardCurriculum,
  getSubjectsForStandard,
  isSupportedStandard,
  SENIOR_GROUPS,
  SUPPORTED_STANDARDS,
  TN_11TH_TEXTBOOKS_URL,
  TN_12TH_TEXTBOOKS_URL,
  TN_CLASS_1_2_3_NEW_TEXTBOOKS_URL,
  TN_NEW_SYLLABUS_2026_27_URL,
  TN_OFFICIAL_TEXTBOOK_LINKS,
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

describe("Standard-wise Curriculum Engine (Class 1 to 12)", () => {
  it("supports all standards from Class 1 through Class 12 across 3 growth stages", () => {
    expect(SUPPORTED_STANDARDS).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    for (const std of SUPPORTED_STANDARDS) {
      expect(isSupportedStandard(std)).toBe(true);
      const curriculum = getStandardCurriculum(std);
      expect(curriculum).toBeDefined();
      expect(curriculum?.standard).toBe(std);
      expect(curriculum?.subjects.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("Scenario 0: Class 1, 2, 3 (Seed stage) sees primary foundational subjects", () => {
    const subjects1 = getSubjectsForStandard(1);
    const codes1 = subjects1.map((s) => s.code);
    expect(codes1).toEqual(["TAM-01", "ENG-01", "MAT-01", "EVS-01"]);
    expect(subjects1.find((s) => s.id === "c1-tamil")?.chapters.length).toBe(9);
    expect(subjects1.find((s) => s.id === "c1-english")?.chapters.length).toBe(6);
    expect(subjects1.find((s) => s.id === "c1-math")?.chapters.length).toBe(6);
    expect(subjects1.find((s) => s.id === "c1-evs")?.chapters.length).toBe(6);

    const subjects2 = getSubjectsForStandard(2);
    const codes2 = subjects2.map((s) => s.code);
    expect(codes2).toEqual(["TAM-02", "ENG-02", "MAT-02", "EVS-02"]);
    expect(subjects2.find((s) => s.id === "c2-tamil")?.chapters.length).toBe(9);
    expect(subjects2.find((s) => s.id === "c2-english")?.chapters.length).toBe(6);
    expect(subjects2.find((s) => s.id === "c2-math")?.chapters.length).toBe(6);
    expect(subjects2.find((s) => s.id === "c2-evs")?.chapters.length).toBe(6);

    const subjects3 = getSubjectsForStandard(3);
    const codes3 = subjects3.map((s) => s.code);
    expect(codes3).toEqual(["TAM-03", "ENG-03", "MAT-03", "SCI-03", "SOC-03"]);
    expect(subjects3.find((s) => s.id === "c3-tamil")?.chapters.length).toBe(9);
    expect(subjects3.find((s) => s.id === "c3-english")?.chapters.length).toBe(6);
    expect(subjects3.find((s) => s.id === "c3-math")?.chapters.length).toBe(6);
    expect(subjects3.find((s) => s.id === "c3-science")?.chapters.length).toBe(6);
    expect(subjects3.find((s) => s.id === "c3-social")?.chapters.length).toBe(6);
  });

  it("Scenario 1: Class 4 & 5 students see full 3-term primary/plant subjects", () => {
    const subjects4 = getSubjectsForStandard(4);
    const codes4 = subjects4.map((s) => s.code);
    expect(codes4).toEqual(["TAM-04", "ENG-04", "MAT-04", "SCI-04", "SOC-04"]);
    expect(subjects4.find((s) => s.id === "c4-tamil")?.chapters.length).toBe(9);
    expect(subjects4.find((s) => s.id === "c4-english")?.chapters.length).toBe(6);
    expect(subjects4.find((s) => s.id === "c4-math")?.chapters.length).toBe(6);
    expect(subjects4.find((s) => s.id === "c4-science")?.chapters.length).toBe(6);
    expect(subjects4.find((s) => s.id === "c4-social")?.chapters.length).toBe(6);

    const subjects5 = getSubjectsForStandard(5);
    const codes5 = subjects5.map((s) => s.code);
    expect(codes5).toEqual(["TAM-05", "ENG-05", "MAT-05", "SCI-05", "SOC-05"]);
    expect(subjects5.find((s) => s.id === "c5-tamil")?.chapters.length).toBe(9);
    expect(subjects5.find((s) => s.id === "c5-english")?.chapters.length).toBe(6);
    expect(subjects5.find((s) => s.id === "c5-math")?.chapters.length).toBe(6);
    expect(subjects5.find((s) => s.id === "c5-science")?.chapters.length).toBe(6);
    expect(subjects5.find((s) => s.id === "c5-social")?.chapters.length).toBe(6);

    // Must NOT contain higher secondary streams like Physics or Accountancy
    expect(codes4).not.toContain("PHY-11");
    expect(codes4).not.toContain("ACC-11");
    expect(codes5).not.toContain("CHE-12");
  });

  it("Scenario 1b: Class 6 student sees full 3-term syllabus across all 5 subjects", () => {
    const subjects = getSubjectsForStandard(6);
    expect(subjects.length).toBe(5);

    const c6Tamil = subjects.find((s) => s.id === "c6-tamil");
    expect(c6Tamil).toBeDefined();
    expect(c6Tamil!.chapters.length).toBe(9); // All 3 terms
    expect(c6Tamil!.chapters[0]?.title.ta).toContain("இன்பத்தமிழ்");
    expect(c6Tamil!.chapters[8]?.title.ta).toContain("திருக்குறள்");

    const c6English = subjects.find((s) => s.id === "c6-english");
    expect(c6English).toBeDefined();
    expect(c6English!.chapters.length).toBe(7); // All 3 terms
    expect(c6English!.chapters[0]?.title.en).toContain("Sea Turtles");

    const c6Math = subjects.find((s) => s.id === "c6-math");
    expect(c6Math).toBeDefined();
    expect(c6Math!.chapters.length).toBe(14); // All 3 terms

    const c6Science = subjects.find((s) => s.id === "c6-science");
    expect(c6Science).toBeDefined();
    expect(c6Science!.chapters.length).toBe(15); // All 3 terms

    const c6Social = subjects.find((s) => s.id === "c6-social");
    expect(c6Social).toBeDefined();
    expect(c6Social!.chapters.length).toBe(12); // All 3 terms
  });

  it("Scenario 1c: Class 7 student sees full 3-term syllabus across all 5 subjects", () => {
    const subjects = getSubjectsForStandard(7);
    const codes = subjects.map((s) => s.code);
    expect(codes).toEqual(["TAM-07", "ENG-07", "MAT-07", "SCI-07", "SOC-07"]);

    const c7Tamil = subjects.find((s) => s.id === "c7-tamil");
    expect(c7Tamil?.chapters.length).toBe(9);
    expect(c7Tamil?.chapters[0]?.title.ta).toContain("எங்கள் தமிழ்");

    const c7English = subjects.find((s) => s.id === "c7-english");
    expect(c7English?.chapters.length).toBe(7);
    expect(c7English?.chapters[0]?.title.en).toContain("Eidgah");

    const c7Math = subjects.find((s) => s.id === "c7-math");
    expect(c7Math?.chapters.length).toBe(10);

    const c7Science = subjects.find((s) => s.id === "c7-science");
    expect(c7Science?.chapters.length).toBe(10);

    const c7Social = subjects.find((s) => s.id === "c7-social");
    expect(c7Social?.chapters.length).toBe(9);
  });

  it("Scenario 2: Class 8 student sees upper primary full 3-term syllabus across all 5 subjects", () => {
    const subjects = getSubjectsForStandard(8);
    const codes = subjects.map((s) => s.code);
    expect(codes).toEqual(["TAM-08", "ENG-08", "MAT-08", "SCI-08", "SOC-08"]);

    const c8Tamil = subjects.find((s) => s.id === "c8-tamil");
    expect(c8Tamil?.chapters.length).toBe(9);
    expect(c8Tamil?.chapters[0]?.title.ta).toContain("தமிழ்மொழி வாழ்த்து");

    const c8English = subjects.find((s) => s.id === "c8-english");
    expect(c8English?.chapters.length).toBe(7);
    expect(c8English?.chapters[0]?.title.en).toContain("The Nose-Jewel");

    const c8Math = subjects.find((s) => s.id === "c8-math");
    expect(c8Math?.chapters.length).toBe(10);

    const c8Science = subjects.find((s) => s.id === "c8-science");
    expect(c8Science?.chapters.length).toBe(10);

    const c8Social = subjects.find((s) => s.id === "c8-social");
    expect(c8Social?.chapters.length).toBe(9);
  });

  it("Scenario 2b: Class 9 student sees full syllabus across all 5 subjects", () => {
    const subjects = getSubjectsForStandard(9);
    const codes = subjects.map((s) => s.code);
    expect(codes).toEqual(["TAM-09", "ENG-09", "MAT-09", "SCI-09", "SOC-09"]);

    const c9Tamil = subjects.find((s) => s.id === "c9-tamil");
    expect(c9Tamil?.chapters.length).toBe(9);
    expect(c9Tamil?.chapters[0]?.title.ta).toContain("திராவிட மொழிக் குடும்பம்");

    const c9English = subjects.find((s) => s.id === "c9-english");
    expect(c9English?.chapters.length).toBe(7);
    expect(c9English?.chapters[0]?.title.en).toContain("Learning the Game");

    const c9Math = subjects.find((s) => s.id === "c9-math");
    expect(c9Math?.chapters.length).toBe(9);

    const c9Science = subjects.find((s) => s.id === "c9-science");
    expect(c9Science?.chapters.length).toBe(10);

    const c9Social = subjects.find((s) => s.id === "c9-social");
    expect(c9Social?.chapters.length).toBe(9);
  });

  it("Scenario 3: Class 10 student sees full SSLC board exam syllabus across all 5 subjects", () => {
    const subjects = getSubjectsForStandard(10);
    const codes = subjects.map((s) => s.code);
    expect(codes).toEqual(["TAM-10", "ENG-10", "MAT-10", "SCI-10", "SOC-10"]);

    const c10Tamil = subjects.find((s) => s.id === "c10-tamil");
    expect(c10Tamil?.chapters.length).toBe(9);
    expect(c10Tamil?.chapters[0]?.title.ta).toContain("அன்னை மொழியே");

    const c10English = subjects.find((s) => s.id === "c10-english");
    expect(c10English?.chapters.length).toBe(7);
    expect(c10English?.chapters[0]?.title.en).toContain("His First Flight");

    const c10Math = subjects.find((s) => s.id === "c10-math");
    expect(c10Math?.chapters.length).toBe(8);

    const c10Science = subjects.find((s) => s.id === "c10-science");
    expect(c10Science?.chapters.length).toBe(12);

    const c10Social = subjects.find((s) => s.id === "c10-social");
    expect(c10Social?.chapters.length).toBe(10);
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
        if (std <= 3) {
          expect(sub.textbookUrl).toBe(TN_CLASS_1_2_3_NEW_TEXTBOOKS_URL);
        } else if (std === 11) {
          expect(sub.textbookUrl).toBe(TN_11TH_TEXTBOOKS_URL);
        } else if (std === 12) {
          expect(sub.textbookUrl).toBe(TN_12TH_TEXTBOOKS_URL);
        } else {
          expect(sub.textbookUrl).toBe(TN_TEXTBOOK_PORTAL_URL);
        }
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
    p = setLastAccessed(p, { standard: 8, subjectId: "c8-science", chapterId: "c8-science-ch1" });
    expect(p.profile?.lastAccessed?.standard).toBe(8);
    expect(p.profile?.lastAccessed?.subjectId).toBe("c8-science");
    expect(p.profile?.lastAccessed?.chapterId).toBe("c8-science-ch1");

    const resolved = getChapterById(8, "c8-science", "c8-science-ch1");
    expect(resolved).toBeDefined();
    expect(resolved?.subject.id).toBe("c8-science");
    expect(resolved?.chapter.id).toBe("c8-science-ch1");

    // Completing lesson adds to lessonsDone and gives XP
    p = completeLesson(p, "c8-science-ch1", "2026-10-23");
    expect(p.lessonsDone).toContain("c8-science-ch1");
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

  it("provides official Tamil Nadu reference links for textbooks and 2026-27 syllabus", () => {
    expect(TN_TEXTBOOK_PORTAL_URL).toBe("https://share.google/DWaDvFsGIVE5d4HHs");
    expect(TN_NEW_SYLLABUS_2026_27_URL).toBe("https://share.google/qaF2Aopcl5hgnN7p0");
    expect(TN_CLASS_1_2_3_NEW_TEXTBOOKS_URL).toBe("https://share.google/KPUGozoLZRzEdc9wP");

    expect(TN_OFFICIAL_TEXTBOOK_LINKS.length).toBe(5);
    expect(TN_OFFICIAL_TEXTBOOK_LINKS.map((l) => l.url)).toContain(TN_NEW_SYLLABUS_2026_27_URL);
    expect(TN_OFFICIAL_TEXTBOOK_LINKS.map((l) => l.url)).toContain(TN_TEXTBOOK_PORTAL_URL);
    expect(TN_OFFICIAL_TEXTBOOK_LINKS.map((l) => l.url)).toContain(TN_CLASS_1_2_3_NEW_TEXTBOOKS_URL);
    expect(TN_OFFICIAL_TEXTBOOK_LINKS.map((l) => l.url)).toContain(TN_11TH_TEXTBOOKS_URL);
    expect(TN_OFFICIAL_TEXTBOOK_LINKS.map((l) => l.url)).toContain(TN_12TH_TEXTBOOKS_URL);
  });

  it("Scenario 11: Class 11 & 12 touching a subject reveals all chapters from tntextbooks.net", () => {
    const c11Physics = getSubjectsForStandard(11).find((s) => s.id === "c11-physics");
    expect(c11Physics).toBeDefined();
    expect(c11Physics!.chapters.length).toBe(11);
    expect(c11Physics!.chapters[0]?.title.en).toBe("Nature of Physical World and Measurement");
    expect(c11Physics!.chapters[10]?.title.en).toBe("Waves");
    expect(c11Physics!.textbookUrl).toBe(TN_11TH_TEXTBOOKS_URL);

    const c12Chemistry = getSubjectsForStandard(12).find((s) => s.id === "c12-chemistry");
    expect(c12Chemistry).toBeDefined();
    expect(c12Chemistry!.chapters.length).toBe(15);
    expect(c12Chemistry!.chapters[0]?.title.en).toBe("Metallurgy");
    expect(c12Chemistry!.chapters[14]?.title.en).toBe("Chemistry in Everyday Life");
    expect(c12Chemistry!.textbookUrl).toBe(TN_12TH_TEXTBOOKS_URL);

    const c12English = getSubjectsForStandard(12).find((s) => s.id === "c12-english");
    expect(c12English).toBeDefined();
    expect(c12English!.chapters.length).toBe(18);
    expect(c12English!.chapters[0]?.title.en).toContain("Two Gentlemen of Verona");
    expect(c12English!.chapters[1]?.title.en).toContain("The Castle");
    expect(c12English!.chapters[2]?.title.en).toContain("God Sees the Truth, but Waits");
    expect(c12English!.chapters[17]?.title.en).toContain("Remember Caesar");

    const c11English = getSubjectsForStandard(11).find((s) => s.id === "c11-english");
    expect(c11English).toBeDefined();
    expect(c11English!.chapters.length).toBe(18);
    expect(c11English!.chapters[0]?.title.en).toContain("The Portrait of a Lady");
    expect(c11English!.chapters[17]?.title.en).toContain("The Never-Never Nest");
  });

  it("Scenario 12: Class 11 and 12 include Computer Applications and Business Mathematics", () => {
    const c11Subjects = getSubjectsForStandard(11);
    const c11Codes = c11Subjects.map((s) => s.code);
    expect(c11Codes).toContain("CAP-11");
    expect(c11Codes).toContain("BMA-11");

    const c11CompApp = c11Subjects.find((s) => s.id === "c11-comp-app");
    expect(c11CompApp).toBeDefined();
    expect(c11CompApp!.chapters.length).toBe(18);
    expect(c11CompApp!.chapters[0]?.title.en).toBe("Introduction to Computers");
    expect(c11CompApp!.chapters[17]?.title.en).toBe("Tamil Computing");
    expect(c11CompApp!.textbookUrl).toBe(TN_11TH_TEXTBOOKS_URL);

    const c11BusMath = c11Subjects.find((s) => s.id === "c11-business-math");
    expect(c11BusMath).toBeDefined();
    expect(c11BusMath!.chapters.length).toBe(10);
    expect(c11BusMath!.chapters[0]?.title.en).toBe("Matrices and Determinants");
    expect(c11BusMath!.chapters[9]?.title.en).toBe("Operations Research");

    const c12Subjects = getSubjectsForStandard(12);
    const c12Codes = c12Subjects.map((s) => s.code);
    expect(c12Codes).toContain("CAP-12");
    expect(c12Codes).toContain("BMA-12");

    const c12CompApp = c12Subjects.find((s) => s.id === "c12-comp-app");
    expect(c12CompApp).toBeDefined();
    expect(c12CompApp!.chapters.length).toBe(18);
    expect(c12CompApp!.chapters[0]?.title.en).toBe("Multimedia and Desktop Publishing");
    expect(c12CompApp!.chapters[17]?.title.en).toBe("Electronic Data Interchange (EDI)");

    const c12BusMath = c12Subjects.find((s) => s.id === "c12-business-math");
    expect(c12BusMath).toBeDefined();
    expect(c12BusMath!.chapters.length).toBe(10);
    expect(c12BusMath!.chapters[0]?.title.en).toBe("Applications of Matrices and Determinants");
    expect(c12BusMath!.chapters[9]?.title.en).toBe("Operations Research");
  });

  it("Scenario 13: Higher Secondary Groups filter exact electives for Commerce, Business Maths, and Computer Science", () => {
    expect(SENIOR_GROUPS.length).toBe(3);
    const groupIds = SENIOR_GROUPS.map((g) => g.id);
    expect(groupIds).toEqual(["cs", "commerce", "business_maths"]);

    expect(getSeniorGroup("cs")?.badge).toBe("Computer Science");
    expect(getSeniorGroup("commerce")?.badge).toBe("Commerce with CA");
    expect(getSeniorGroup("business_maths")?.badge).toBe("Business Maths");
    expect(getSeniorGroup("non-existent")).toBeUndefined();

    const c12Subjects = getSubjectsForStandard(12);

    // 1. Commerce Group: Commerce, Accountancy, Economics, Computer Applications
    const commerceElectives = filterSubjectsByGroup(c12Subjects, "commerce", false);
    const commerceCodes = commerceElectives.map((s) => s.code);
    expect(commerceCodes).toEqual(["COM-12", "ACC-12", "ECO-12", "CAP-12"]);

    // 2. Business Maths Group: Commerce, Accountancy, Economics, Business Mathematics
    const bmaElectives = filterSubjectsByGroup(c12Subjects, "business_maths", false);
    const bmaCodes = bmaElectives.map((s) => s.code);
    expect(bmaCodes).toEqual(["COM-12", "ACC-12", "ECO-12", "BMA-12"]);

    // 3. Computer Science Group: Computer Science, Maths, Physics, Chemistry
    const csElectives = filterSubjectsByGroup(c12Subjects, "cs", false);
    const csCodes = csElectives.map((s) => s.code);
    expect(csCodes).toEqual(["MAT-12", "PHY-12", "CHE-12", "CSC-12"]);

    // When languages are included, Tamil & English are also present
    const commerceFull = filterSubjectsByGroup(c12Subjects, "commerce", true);
    expect(commerceFull.map((s) => s.code)).toEqual(["TAM-12", "ENG-12", "COM-12", "ACC-12", "ECO-12", "CAP-12"]);
  });

  it("Scenario 14: Student profile with Higher Secondary Group persists and parses cleanly", () => {
    const profile: Profile = {
      name: "Sanjay",
      avatar: "cat",
      grade: 11,
      studentId: "KV-2026-7890",
      seniorGroup: "commerce",
    };

    const p = setProfile(EMPTY_PROGRESS, profile);
    expect(p.profile?.seniorGroup).toBe("commerce");

    const serialized = JSON.stringify(p);
    const parsed = parseProgress(JSON.parse(serialized));
    expect(parsed.profile?.seniorGroup).toBe("commerce");
  });
});

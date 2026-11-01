import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { makeStudentId, type Profile } from "@/lib/progress";

const PERSISTENCE_FILE = path.join(process.cwd(), ".profile-store.json");

// Helper to load profile from filesystem
function loadPersistedProfile(): Profile | null {
  try {
    if (fs.existsSync(PERSISTENCE_FILE)) {
      const raw = fs.readFileSync(PERSISTENCE_FILE, "utf8");
      return JSON.parse(raw);
    }
  } catch {
    // Fallback to null on read error
  }
  return null;
}

// Helper to save profile to filesystem
function savePersistedProfile(profile: Profile | null): void {
  try {
    if (profile) {
      fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify(profile, null, 2), "utf8");
    } else if (fs.existsSync(PERSISTENCE_FILE)) {
      fs.unlinkSync(PERSISTENCE_FILE);
    }
  } catch {
    // Ignore disk write errors in restricted environments
  }
}

// In-memory session mock store initialized from disk
let serverProfileStore: Profile | null = loadPersistedProfile();

export async function GET() {
  if (!serverProfileStore) {
    serverProfileStore = loadPersistedProfile();
  }

  return NextResponse.json({
    authMode: process.env.NEXT_PUBLIC_AUTH_PROVIDER || "mock_local",
    isMock: true,
    profile: serverProfileStore,
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || typeof data.grade !== "number") {
      return NextResponse.json({ error: "Name and grade (class) are required" }, { status: 400 });
    }

    const grade = Math.round(Number(data.grade));
    if (grade < 1 || grade > 12) {
      return NextResponse.json({ error: "Class must be between 1 and 12" }, { status: 400 });
    }

    // Class 11 and 12 mandatory group validation
    if (grade >= 11 && !data.seniorGroup) {
      return NextResponse.json(
        { error: "Stream / Group selection is mandatory for Class 11 and 12" },
        { status: 400 },
      );
    }

    serverProfileStore = {
      name: String(data.name).trim().slice(0, 24),
      avatar: data.avatar || "cat",
      grade,
      studentId: data.studentId || makeStudentId(data.board, grade),
      email: data.email ? String(data.email).trim().slice(0, 80) : undefined,
      preferredLanguage: data.preferredLanguage || "en",
      board: data.board ? String(data.board).trim().slice(0, 50) : "tn_state",
      seniorGroup: grade >= 11 && data.seniorGroup ? String(data.seniorGroup).trim().slice(0, 32) : undefined,
      lastAccessed: data.lastAccessed,
    };

    savePersistedProfile(serverProfileStore);

    return NextResponse.json({
      success: true,
      authMode: "mock_local",
      profile: serverProfileStore,
    });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    if (!serverProfileStore) {
      serverProfileStore = loadPersistedProfile();
    }

    if (!serverProfileStore) {
      return NextResponse.json({ error: "No profile found to update" }, { status: 404 });
    }

    let updatedGrade = serverProfileStore.grade;
    if (typeof data.grade === "number") {
      updatedGrade = Math.round(data.grade);
    }

    let updatedSeniorGroup = serverProfileStore.seniorGroup;
    if (data.seniorGroup !== undefined) {
      updatedSeniorGroup = data.seniorGroup ? String(data.seniorGroup).trim().slice(0, 32) : undefined;
    }

    // If grade is 11 or 12, group must be present
    if (updatedGrade >= 11 && !updatedSeniorGroup) {
      return NextResponse.json(
        { error: "Stream / Group is required for Class 11 and 12" },
        { status: 400 },
      );
    }

    serverProfileStore = {
      ...serverProfileStore,
      grade: updatedGrade,
      seniorGroup: updatedGrade >= 11 ? updatedSeniorGroup : undefined,
      board: data.board ? String(data.board).trim().slice(0, 50) : serverProfileStore.board,
      preferredLanguage: data.preferredLanguage || serverProfileStore.preferredLanguage,
      name: data.name ? String(data.name).trim().slice(0, 24) : serverProfileStore.name,
      avatar: data.avatar || serverProfileStore.avatar,
      email: data.email !== undefined ? (data.email ? String(data.email).trim().slice(0, 80) : undefined) : serverProfileStore.email,
      lastAccessed: data.lastAccessed !== undefined ? data.lastAccessed : serverProfileStore.lastAccessed,
    };

    savePersistedProfile(serverProfileStore);

    return NextResponse.json({
      success: true,
      profile: serverProfileStore,
    });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}

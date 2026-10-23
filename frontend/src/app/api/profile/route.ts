import { NextResponse } from "next/server";
import type { Profile } from "@/lib/progress";

// In-memory session mock store for the active server runtime
let serverProfileStore: Profile | null = null;

export async function GET() {
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
      return NextResponse.json({ error: "Name and grade (standard) are required" }, { status: 400 });
    }

    serverProfileStore = {
      name: String(data.name).trim().slice(0, 24),
      avatar: data.avatar || "cat",
      grade: Math.round(Number(data.grade)),
      studentId: data.studentId || `KV-${new Date().getFullYear()}-0001`,
      email: data.email ? String(data.email).trim().slice(0, 80) : undefined,
      preferredLanguage: data.preferredLanguage || "en",
      lastAccessed: data.lastAccessed,
    };

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
      return NextResponse.json({ error: "No profile found to update" }, { status: 404 });
    }

    if (typeof data.grade === "number") {
      serverProfileStore = {
        ...serverProfileStore,
        grade: Math.round(data.grade),
      };
    }

    if (data.lastAccessed) {
      serverProfileStore = {
        ...serverProfileStore,
        lastAccessed: data.lastAccessed,
      };
    }

    return NextResponse.json({
      success: true,
      profile: serverProfileStore,
    });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}

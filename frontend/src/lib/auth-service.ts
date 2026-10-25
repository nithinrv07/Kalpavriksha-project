"use client";

import type { Profile } from "@/lib/progress";
import { updateProgress } from "@/components/progress-store";
import { setProfile, updateStudentProfile } from "@/lib/progress";

export type AuthMode = "mock_local" | "production_sso";

export interface StudentAuthContext {
  mode: AuthMode;
  isMock: boolean;
  user: Profile | null;
}

const STORAGE_KEY = "kalpavriksha.progress";

function generateStudentId(): string {
  const digits = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b % 10).join("");
  return `KV-${new Date().getFullYear()}-${digits}`;
}

export const authService = {
  getAuthMode(): AuthMode {
    return (process.env.NEXT_PUBLIC_AUTH_PROVIDER as AuthMode) || "mock_local";
  },

  isMock(): boolean {
    return this.getAuthMode() === "mock_local";
  },

  getStoredProfile(): Profile | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.profile ?? null;
    } catch {
      return null;
    }
  },

  saveProfile(data: {
    name: string;
    email?: string;
    grade: number;
    avatar: Profile["avatar"];
    preferredLanguage?: Profile["preferredLanguage"];
    seniorGroup?: string;
    studentId?: string;
  }): Profile {
    const studentId = data.studentId || generateStudentId();
    const profile: Profile = {
      name: data.name.trim().slice(0, 24),
      email: data.email?.trim().slice(0, 80),
      grade: data.grade,
      avatar: data.avatar,
      preferredLanguage: data.preferredLanguage,
      seniorGroup: data.seniorGroup,
      studentId,
    };

    updateProgress((p) => setProfile(p, profile));

    // Async attempt to sync with backend route if available
    if (typeof window !== "undefined") {
      fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      }).catch(() => {
        // Fallback silently to client persistence in mock mode
      });
    }

    return profile;
  },

  updateStandard(grade: number, seniorGroup?: string): void {
    updateProgress((p) =>
      updateStudentProfile(p, {
        grade,
        ...(seniorGroup !== undefined ? { seniorGroup } : {}),
      }),
    );
    if (typeof window !== "undefined") {
      fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, seniorGroup }),
      }).catch(() => {});
    }
  },

  signOut(): void {
    updateProgress((p) => setProfile(p, null));
  },
};

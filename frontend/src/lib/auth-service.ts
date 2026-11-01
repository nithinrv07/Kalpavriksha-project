"use client";

import type { Profile } from "@/lib/progress";
import { updateProgress } from "@/components/progress-store";
import { makeStudentId, setProfile, updateStudentProfile } from "@/lib/progress";

export type AuthMode = "mock_local" | "production_sso";

export interface StudentAuthContext {
  mode: AuthMode;
  isMock: boolean;
  user: Profile | null;
}

const STORAGE_KEY = "kalpavriksha.progress";

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

  async syncWithServer(): Promise<Profile | null> {
    if (typeof window === "undefined") return null;
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) return null;
      const data = await res.json();
      if (data.profile) {
        const local = this.getStoredProfile();
        if (!local) {
          updateProgress((p) => setProfile(p, data.profile));
        }
        return data.profile;
      }
    } catch {
      // Ignore network errors in offline/mock mode
    }
    return null;
  },

  saveProfile(data: {
    name: string;
    email?: string;
    grade: number;
    avatar: Profile["avatar"];
    preferredLanguage?: Profile["preferredLanguage"];
    board?: string;
    seniorGroup?: string;
    studentId?: string;
  }): Profile {
    const studentId = data.studentId || makeStudentId(data.board, data.grade);
    const profile: Profile = {
      name: data.name.trim().slice(0, 24),
      email: data.email?.trim().slice(0, 80),
      grade: data.grade,
      avatar: data.avatar,
      preferredLanguage: data.preferredLanguage,
      board: data.board || "tn_state",
      seniorGroup: data.grade >= 11 ? data.seniorGroup : undefined,
      studentId,
    };

    updateProgress((p) => setProfile(p, profile));

    // Persistent sync with backend API route
    if (typeof window !== "undefined") {
      fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      }).catch(() => {
        // Fallback silently to client persistence if offline
      });
    }

    return profile;
  },

  updateStandard(grade: number, seniorGroup?: string): void {
    this.updateAcademicProfile({ grade, seniorGroup });
  },

  updateAcademicProfile(updates: {
    grade: number;
    seniorGroup?: string;
    board?: string;
  }): void {
    updateProgress((p) =>
      updateStudentProfile(p, {
        grade: updates.grade,
        ...(updates.seniorGroup !== undefined ? { seniorGroup: updates.seniorGroup } : {}),
        ...(updates.board !== undefined ? { board: updates.board } : {}),
      }),
    );
    if (typeof window !== "undefined") {
      fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: updates.grade,
          seniorGroup: updates.grade >= 11 ? updates.seniorGroup : undefined,
          board: updates.board,
        }),
      }).catch(() => {});
    }
  },

  signOut(): void {
    updateProgress((p) => setProfile(p, null));
    if (typeof window !== "undefined") {
      fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "", grade: 0 }),
      }).catch(() => {});
    }
  },
};

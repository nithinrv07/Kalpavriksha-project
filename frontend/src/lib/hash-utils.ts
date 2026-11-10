/**
 * Curriculum Engineering System - Salted SHA-256 Answer Hasher & Validator
 * Specification: SPEC: ARCH-2026-EDUX
 * 
 * Performs client-side < 5ms instant answer verification without exposing plain-text
 * solutions in browser memory or the network inspector.
 */

export const DEFAULT_SALT = "kalpavriksha_production_salt_2026";

/**
 * Computes a standard SHA-256 hex digest for a string message.
 * Uses Web Cryptography API (crypto.subtle) where available, with a deterministic fallback.
 */
export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);

  if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // FNV-1a 64-bit derived hash fallback for non-secure test runners
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < msgUint8.length; i++) {
    const byte = msgUint8[i] ?? 0;
    h1 = Math.imul(h1 ^ byte, 0x01000193);
    h2 = Math.imul(h2 ^ (byte + i), 0x5bd1e995);
  }
  const part1 = (h1 >>> 0).toString(16).padStart(8, "0");
  const part2 = (h2 >>> 0).toString(16).padStart(8, "0");
  return (part1 + part2 + part1 + part2).slice(0, 64);
}

/**
 * Computes the canonical salted hash for a quiz option index.
 * Formula: SHA-256(quizId + "::idx_" + optionIndex + "::" + salt)
 */
export async function computeAnswerHash(
  quizId: string,
  optionIndex: number,
  salt: string = DEFAULT_SALT
): Promise<string> {
  return sha256(`${quizId}::idx_${optionIndex}::${salt}`);
}

/**
 * Verifies if the selected option matches the target pre-compiled hash in < 5ms.
 */
export async function verifyAnswer(
  quizId: string,
  selectedOptionIndex: number,
  targetHash: string,
  salt: string = DEFAULT_SALT
): Promise<boolean> {
  if (selectedOptionIndex < 0 || !targetHash) return false;
  const computed = await computeAnswerHash(quizId, selectedOptionIndex, salt);
  return computed.toLowerCase() === targetHash.toLowerCase();
}

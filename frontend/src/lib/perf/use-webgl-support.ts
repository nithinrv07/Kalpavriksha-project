"use client";

import { useSyncExternalStore } from "react";
import { supportsWebGL } from "./quality";

const noopSubscribe = () => () => {};

/**
 * Whether the browser can create a WebGL context. False on the server and during
 * hydration, so WebGL scenes only ever mount after a successful probe — browsers
 * without WebGL keep the static fallback and never hit a failing context.
 */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(noopSubscribe, supportsWebGL, () => false);
}

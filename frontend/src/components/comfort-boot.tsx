"use client";

import { useEffect } from "react";
import { bootComfort } from "@/lib/comfort";

/** Applies a saved calm/projector choice to every page, not just the landing. */
export function ComfortBoot() {
  useEffect(() => {
    bootComfort();
  }, []);
  return null;
}

"use client";

import { Moon, Sun } from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import { setTheme, useTheme } from "@/lib/theme";

const LABEL = {
  en: { toLight: "Switch to light mode", toDark: "Switch to dark mode" },
  ta: { toLight: "ஒளி பயன்முறைக்கு மாறு", toDark: "இருள் பயன்முறைக்கு மாறு" },
} as const;

/** Sun / moon button that flips between light and dark mode. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const { locale } = useLocale();
  const copy = LABEL[locale as keyof typeof LABEL] ?? LABEL.en;
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={next === "light" ? copy.toLight : copy.toDark}
      title={next === "light" ? copy.toLight : copy.toDark}
      className={`grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-ink/[0.06] text-text transition-colors duration-200 hover:bg-ink/[0.12] active:scale-[0.98] ${className}`}
    >
      {theme === "dark" ? <Sun size={18} weight="duotone" aria-hidden /> : <Moon size={18} weight="duotone" aria-hidden />}
    </button>
  );
}

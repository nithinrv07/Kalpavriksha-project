"use client";

import { CaretDown } from "@phosphor-icons/react/ssr";
import { useLocale } from "@/components/locale-provider";
import { LOCALES, LOCALE_LABEL, isLocale } from "@/lib/i18n";

/** Styled trigger over a native <select>: accessible, and uses the phone's own picker. */
export function LangSelect({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  return (
    <label
      className={`relative flex h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-white/[0.06] px-3.5 font-mono text-[13px] text-text transition-colors duration-200 hover:bg-white/[0.1] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-violet ${className}`}
    >
      <span>{LOCALE_LABEL[locale].short}</span>
      <CaretDown size={12} weight="bold" aria-hidden />
      <select
        aria-label={t.language}
        value={locale}
        onChange={(e) => {
          if (isLocale(e.target.value)) setLocale(e.target.value);
        }}
        className="absolute inset-0 cursor-pointer appearance-none bg-transparent text-[16px] text-transparent opacity-0"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} className="bg-surface text-text">
            {LOCALE_LABEL[l].native}
          </option>
        ))}
      </select>
    </label>
  );
}

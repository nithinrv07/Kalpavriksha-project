"use client";

import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { COPY, isLocale, type Copy, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "kalpavriksha.locale";

type LocaleContextValue = {
  readonly locale: Locale;
  readonly t: Copy;
  readonly setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale | null {
  try {
    const urlLang = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('lang') : null;
    if (isLocale(urlLang)) return urlLang;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = readStoredLocale();
    // Hydrate from storage after mount so server and first client render match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the choice lasts for this visit only.
    }
  }, []);

  const value = useMemo(() => ({ locale, t: COPY[locale], setLocale }), [locale, setLocale]);
  return <LocaleContext value={value}>{children}</LocaleContext>;
}

export function useLocale(): LocaleContextValue {
  const ctx = use(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}

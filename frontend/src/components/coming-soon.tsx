"use client";

import { ArrowLeft } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { useLocale } from "@/components/locale-provider";
import { getModule } from "@/modules/registry";

/** Placeholder for a registered module whose screen is not built yet. */
export function ComingSoon({ slug }: { slug: string }) {
  const { t, locale } = useLocale();
  const m = getModule(slug);

  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-4">
      <ChromeWaves />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_60%,rgb(124_58_237/0.16),transparent_70%)]"
      />
      <div className="fade-up relative z-10 w-full max-w-xl rounded-3xl border border-line bg-surface p-8 shadow-[0_0_90px_-25px_rgb(124_58_237/0.45)] sm:p-12">
        <BrandMark className="size-8 text-violet" />
        <p className="mt-10 font-mono text-[12px] text-violet">{m?.index ?? ""}</p>
        <h1 className="mt-3 font-display text-[clamp(34px,5vw,56px)] leading-[0.98] tracking-[-0.045em]">
          {m?.title[locale] ?? ""}
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">{t.comingSoon}</p>
        <Link
          href="/"
          className="group mt-10 inline-flex h-12 items-center gap-2 rounded-xl border border-line px-5 text-sm transition-colors duration-200 hover:bg-white/[0.06]"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          {t.back}
        </Link>
      </div>
    </main>
  );
}

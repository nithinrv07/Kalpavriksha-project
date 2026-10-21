"use client";

import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";
import { RevealWords } from "@/components/scroll-fx";

export function CtaFooter() {
  const { t } = useLocale();
  const firstModule = "/m/learn";

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line lg:mt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_80%_at_20%_100%,rgb(124_58_237/0.22),transparent_70%)]"
      />

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-10 px-4 py-24 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-32">
        <RevealWords
          text={t.ctaTitle}
          className="max-w-3xl font-display text-[clamp(44px,7vw,112px)] leading-[0.92] tracking-[-0.055em]"
        />
        <Link
          href={firstModule}
          data-reveal="up"
          className="beam-border group inline-flex h-14 shrink-0 items-center gap-3 self-start rounded-full bg-violet-deep px-7 font-mono text-sm text-violet-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 lg:self-auto"
        >
          {t.cta}
          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-6 border-t border-line px-4 py-8 text-[13px] text-muted sm:px-6 md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-2.5 text-text">
          <BrandMark className="size-5 text-violet" />
          {t.trust}
        </span>
        <span>{t.partner}</span>
        <span className="font-mono text-[12px]">© {new Date().getFullYear()}</span>
      </div>

      {/* Oversized outlined wordmark, cropped by the page edge. */}
      <p
        aria-hidden
        className="footer-mark relative -mb-[0.22em] select-none text-center font-display text-[clamp(64px,17vw,300px)] leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--line-strong)]"
      >
        Kalpavriksha
      </p>
    </footer>
  );
}

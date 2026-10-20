"use client";

import { ArrowLeft } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { useLocale } from "@/components/locale-provider";
import { getModule } from "@/modules/registry";

export type ComingSoonTarget = { readonly kind: "module"; readonly slug: string } | { readonly kind: "sign-in" };

export function ComingSoon({ target }: { target: ComingSoonTarget }) {
  const { t, locale } = useLocale();

  let eyebrow: string;
  let title: string;
  let body: string;
  switch (target.kind) {
    case "module": {
      const m = getModule(target.slug);
      eyebrow = m?.index ?? "";
      title = m?.title[locale] ?? "";
      body = t.comingSoon;
      break;
    }
    case "sign-in":
      eyebrow = "ID";
      title = t.signIn;
      body = t.signInSoon;
      break;
    default: {
      const unreachable: never = target;
      throw new Error(`Unhandled target ${JSON.stringify(unreachable)}`);
    }
  }

  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-4">
      <ChromeWaves />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_60%,rgb(124_58_237/0.16),transparent_70%)]"
      />
      <div className="fade-up relative z-10 w-full max-w-xl rounded-3xl border border-line bg-surface p-8 shadow-[0_0_90px_-25px_rgb(124_58_237/0.45)] sm:p-12">
        <BrandMark className="size-8 text-violet" />
        <p className="mt-10 font-mono text-[12px] text-violet">{eyebrow}</p>
        <h1 className="mt-3 font-display text-[clamp(34px,5vw,56px)] leading-[0.98] tracking-[-0.045em]">{title}</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">{body}</p>
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

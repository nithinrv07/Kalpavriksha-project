"use client";

import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";
import { ScrollWaveField } from "@/components/scroll-wave-field";
import { SplitText } from "@/components/split-text";
import { WarpText } from "@/components/warp-text";
import { StandingPenguin } from "./standing-penguin";

export function CtaFooter() {
  const { t } = useLocale();
  const firstModule = "/m/learn";

  return (
    <footer className="relative mt-8 overflow-hidden border-t border-line sm:mt-10 lg:mt-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_80%_at_20%_100%,rgb(124_58_237/0.22),transparent_70%)]"
      />

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-10 px-4 pt-10 pb-20 sm:px-6 sm:pt-12 sm:pb-24 lg:flex-row lg:items-end lg:justify-between lg:pt-14 lg:pb-28">
        <div className="flex items-end gap-5 sm:gap-8 lg:gap-10">
          <StandingPenguin />
          <SplitText
            text={t.ctaTitle}
            tag="h2"
            textAlign="left"
            splitType="chars,words"
            effect="rise"
            hoverEffect="lift"
            delay={30}
            duration={1.2}
            className="max-w-3xl font-display text-[clamp(44px,7vw,112px)] leading-[0.92] tracking-[-0.055em] text-text"
          />
        </div>
        <Link
          href={firstModule}
          data-reveal="up"
          className="beam-border group inline-flex h-14 shrink-0 items-center gap-3 self-start rounded-full bg-violet-deep px-7 font-mono text-sm text-violet-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 lg:self-auto"
        >
          {t.cta}
          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Bottom footer credit & wordmark area with ScrollWaveField active ONLY here */}
      <div className="relative overflow-hidden border-t border-line">
        {/* ScrollWaveField WebGL effect constrained strictly to this bottom footer area */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          <ScrollWaveField
            background="transparent"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-4 py-8 text-[13px] text-muted sm:px-6 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-2.5 text-text">
            <BrandMark className="size-5 text-violet" />
            {t.trust}
          </span>
          <span>{t.partner}</span>
          <span className="font-mono text-[12px]">© {new Date().getFullYear()}</span>
        </div>

        {/* Oversized interactive WebGL warp wordmark, cropped by the page edge. */}
        <div className="footer-mark relative z-10 -mb-[0.16em] w-full select-none overflow-hidden">
          <WarpText
            text="Kalpavriksha"
            fontFamily="var(--font-display), var(--font-geist), sans-serif"
            fontSize="clamp(64px, 17vw, 300px)"
            fontWeight={700}
            letterSpacing="-0.06em"
            lineHeight={0.9}
            outline={true}
            strokeColor="rgba(255, 255, 255, 0.55)"
            strokeWidth={2.2}
            color="rgba(255, 255, 255, 0.55)"
            warpStrength={0.08}
            warpScale={1.7}
            speed={0.55}
            pointerInfluence={0.42}
            pointerStrength={0.38}
            refraction={0.018}
            chromatic={0.02}
            ripple={true}
            clickRipple={true}
            idleDrift={0.2}
            lens="bulge"
            className="w-full"
            style={{ minHeight: "clamp(120px, 18vw, 300px)" }}
          />
        </div>
      </div>
    </footer>
  );
}

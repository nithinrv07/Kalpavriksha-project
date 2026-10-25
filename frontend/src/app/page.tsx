import { BentoModules } from "@/components/landing/bento-modules";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { CtaFooter } from "@/components/landing/cta-footer";
import { Hero } from "@/components/landing/hero";
import { IdentitySection } from "@/components/landing/identity-section";
import { MoonlitPetals } from "@/components/moonlit-petals";
import { ScrollFx } from "@/components/scroll-fx";

export default function Home() {
  return (
    <>
      <ChromeWaves />
      {/* Blooming Wishing Tree with drifting petals throughout the left side of the landing page */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 z-[1] h-full w-[66vw] min-w-[320px] max-w-[880px] overflow-hidden opacity-90"
        style={{
          maskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
        }}
      >
        <MoonlitPetals
          background="transparent"
          scale={85}
          blossomColor="#D8B4FE"
          petals={80}
          wind={20}
          direction="left"
          throttleAfterViewports={1.15}
          advanced={{
            flowers: 11000,
            crownReach: 100,
            twigs: 30,
            clumpSize: 11,
            flowerSize: 6,
            hazeOpacity: 0,
            vignette: 0,
            grain: 0,
          }}
        />
      </div>
      <main className="relative z-10">
        <ScrollFx />
        <Hero />
        <BentoModules />
        <IdentitySection />
        <CtaFooter />
      </main>
    </>
  );
}

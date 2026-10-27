import { BentoModules } from "@/components/landing/bento-modules";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { CtaFooter } from "@/components/landing/cta-footer";
import { Hero } from "@/components/landing/hero";
import { IdentitySection } from "@/components/landing/identity-section";
import { KolamDivider } from "@/components/landing/kolam-divider";
import { LivingTree } from "@/components/landing/living-tree";
import { ScrollFx } from "@/components/scroll-fx";

export default function Home() {
  return (
    <>
      <ChromeWaves />
      {/* Blooming Wishing Tree with drifting petals throughout the left side of the landing page */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 z-[1] h-full w-[44vw] min-w-[320px] max-w-[620px] overflow-hidden opacity-95 transform-gpu"
        style={{
          maskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
        }}
      >
        <LivingTree />
      </div>
      <main className="relative z-10">
        <ScrollFx />
        <Hero />
        <BentoModules />
        <KolamDivider />
        <IdentitySection />
        <CtaFooter />
      </main>
    </>
  );
}

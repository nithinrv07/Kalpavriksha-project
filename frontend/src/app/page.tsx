import { BentoModules } from "@/components/landing/bento-modules";
import { ChromeWaves } from "@/components/landing/chrome-waves";
import { CtaFooter } from "@/components/landing/cta-footer";
import { Hero } from "@/components/landing/hero";
import { IdentitySection } from "@/components/landing/identity-section";
import { Principles } from "@/components/landing/principles";
import { ScrollFx } from "@/components/scroll-fx";

export default function Home() {
  return (
    <>
      <ChromeWaves />
      <main className="relative z-10">
        <ScrollFx />
        <Hero />
        <BentoModules />
        <Principles />
        <IdentitySection />
        <CtaFooter />
      </main>
    </>
  );
}

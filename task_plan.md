# Task plan — Kalpavriksha landing page (concept A+B+C mix)

Goal: professional landing page for the single Kalpavriksha app. Reference style from `../LANDING.mp4`
(dark, violet, morphing particle cloud, huge headline). Module detail kept light.

- [x] Scaffold Next.js 16 + TS + Tailwind v4 (`kalpavriksha-app/`)
- [x] Tests first: `src/lib/shapes.test.ts`, `src/modules/registry.test.ts` (vitest)
- [x] Module registry (`src/modules/`) — add a module = one entry
- [x] Particle shape generators (`src/lib/shapes.ts`) — pure, seeded
- [x] Canvas 2D particle hero (no three.js dependency)
- [x] Landing sections: frame hero, bento modules, identity strip, principles, CTA/footer
- [x] i18n EN / TA / HI for landing copy
- [x] Generic module route `/m/[slug]` + `/sign-in` placeholder (no dead links)
- [x] Lint, typecheck, tests, build; visual check in browser (desktop + mobile)
- [x] Scroll animations: GSAP ScrollTrigger + Lenis smooth scroll
- [x] Full-page chrome spiral background with violet glow
- [ ] Next: module 1 content screens (mock data)

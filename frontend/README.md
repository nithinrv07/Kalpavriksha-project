# Kalpavriksha — frontend

Next.js 16 (App Router) · React 19 + React Compiler · Tailwind CSS v4 · GSAP + Lenis · Vitest.
Frontend only: student progress is saved in the browser (`localStorage`) until a backend exists.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000  (add `-- --webpack` on low-RAM machines)
npm run test         # unit + content tests
npm run typecheck    # generates route types, then tsc
npm run lint
npm run build
```

## Where things are

```
src/
├── app/                  Routes: / (landing), /m/[slug] (modules), /sign-in (learner card)
├── components/
│   ├── landing/          Landing page sections (hero, bento, identity, footer…)
│   ├── module-shell.tsx  Shared module frame + grade gate
│   ├── learner-setup.tsx Grade band → class → name & avatar entry flow
│   ├── learner-card.tsx  /sign-in screen
│   ├── read-aloud.tsx    Web Speech read-aloud with karaoke highlighting
│   └── progress-store.ts Device-saved student progress
├── lib/
│   ├── progress.ts       XP, levels, streaks, badges, grade bands (pure, tested)
│   ├── bands.ts          Seedlings (1–5) · Saplings (6–10) · Tall Trees (11–12)
│   └── i18n.ts           English / Tamil / Hindi copy
└── modules/
    ├── registry.ts       The module list (menu, tiles and routes come from here)
    ├── screens.tsx       Module slug → screen
    ├── learn/            01 Digital Learning: lessons + reader
    ├── grow/             02 Holistic Growth: growth tree, radar, badges
    └── gk-songs/         03 GK quiz + sing-along songs
```

Content (lessons, quiz questions, songs) is in each module's `lessons.ts` / `content.ts`, tagged by grade band.

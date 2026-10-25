# 3D performance plan

Goal: keep every 3D effect, make the site run smoothly on any device and browser.

## Rules

- No 3D module is removed. Effects can pause, lower their resolution, or drop particle counts — they stay in the product.
- Hidden work must not render: off-screen, background tab, or the unused side of the flip card.
- Quality follows the device once at boot, then adjusts if frames drop.

## Work items

| # | Item | State |
| --- | --- | --- |
| 1 | Shared device tier + render budget (`src/lib/perf/quality.ts`) | done |
| 2 | Shared visibility hook (`src/lib/perf/use-scene-visibility.ts`) | done |
| 3 | Pause the hidden flip-card 3D scenes (hero) | done |
| 4 | Sphere gallery: one DPR cap, tier-based AA, no per-frame canvas resize | done |
| 5 | Tree overlay: throttle to ambient fps after the hero scrolls away | done |
| 6 | Footer wave field: visibility gate, tier density, GL teardown | done |
| 7 | Shared render scheduler (one rAF for all canvases) | next |
| 8 | Texture pre-decode/atlas, remove per-frame allocations | next |
| 9 | Reduced-motion static frames for sphere + wave field | next |
| 10 | Cross-browser fallbacks + CI perf budgets | next |

## What was measured (local dev, 91 Hz display)

- Hero front face: only the sphere draws; back face: sphere draws 0, particle field runs.
- Footer wave: 0 draws while at the top of the page, runs only when scrolled into view.
- Tree overlay: ~20% of its full cost once the hero is scrolled away (ambient fps cap).
- Footer wordmark still runs uncapped (next item: scheduler).
- `npm run typecheck`, `npm run lint` (0 errors), `npm run test` (70 passing) are green.
- Do not call `WEBGL_lose_context` synchronously in an effect cleanup: React re-runs
  effects on the same canvas and the context would stay dead.

## Device tiers

| Tier | DPR | Target fps | Flowers | Particles | Wave density |
| --- | --- | --- | --- | --- | --- |
| 0 | 1.0 | 30 | 3,500 | 1,200 | 70 |
| 1 | 1.25 | 30 | 6,000 | 2,200 | 100 |
| 2 | 1.5 | 60 | 11,000 | 4,000 | 145 |
| 3 | 2.0 | 60 | 11,000 | 4,000 | 145 |

Tier comes from memory, CPU cores, WebGL2 support, pointer type, and data-saver mode.

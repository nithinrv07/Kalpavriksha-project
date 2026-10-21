# Findings

- Brief (`../GSX_Chennai_Chapter_Project_Details.docx`): 3 projects → 3 modules in one mobile-first PWA; Tamil/English (+Hindi/Sanskrit); phones, tablets, desktops, smart TVs; free for students.
- Infra estimate (`../GSX_Technical_Infrastructure_Rough_Estimate.docx`): Next.js PWA, Node API, Clerk, MongoDB Atlas, Cloudflare R2. Roles: Admin, Teacher, Content Manager, Student.
- `../LANDING.mp4` is a recording of a third-party "Brainy.Ai" concept — used as style reference only, not embedded, no branding copied.
- Decisions: black + violet palette; particles form a tree (Kalpavriksha) and morph per module; mock data, no auth yet.
- Particle hero uses Canvas 2D instead of three.js to keep bundle small for low-end rural phones.
- Project lives in OneDrive → `npm install` is very slow (OneDrive syncs node_modules). Consider moving the repo out of OneDrive.
- 21st.dev inspiration: Animated Beam + Border Beam (magicui) re-implemented CSS-only (no framer-motion). Free tier = 2 component retrievals/day.
- Fonts: Geist (display/body), IBM Plex Mono (labels), Anek Tamil / Anek Devanagari (lazy, preload:false). Icons: Phosphor (`@phosphor-icons/react/ssr`).
- Hydration: round SVG coordinates computed with Math.sin/cos — Node vs browser differ in last digits.
- Partner credit "Technology partner: GSX Chennai Chapter" in footer is unconfirmed (open question in the infra estimate doc).

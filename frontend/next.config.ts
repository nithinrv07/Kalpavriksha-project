import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Compiler only for production builds to avoid 2GB+ memory spike during dev
  reactCompiler: process.env.NODE_ENV === "production",

  // Evict inactive pages from dev server memory to keep RAM usage low (<500MB)
  onDemandEntries: {
    maxInactiveAge: 30 * 1000,
    pagesBufferLength: 2,
  },

  productionBrowserSourceMaps: false,

  experimental: {
    // Limit worker threads to 2 so Next.js doesn't spawn 10 heavy Node workers on student PCs
    cpus: 2,

    // Phosphor's barrel re-exports ~9,000 icon modules; without this every page
    // compiles all of them, which exhausts memory on low-RAM machines.
    optimizePackageImports: ["@phosphor-icons/react", "@phosphor-icons/react/ssr"],
  },

  async redirects() {
    return [
      // Module 1 (Digital Learning) aliases & fallbacks
      { source: "/learn", destination: "/m/learn", permanent: false },
      { source: "/m/content", destination: "/m/learn", permanent: false },
      { source: "/m/digital-learning", destination: "/m/learn", permanent: false },
      { source: "/m/1", destination: "/m/learn", permanent: false },
      { source: "/m/01", destination: "/m/learn", permanent: false },
      { source: "/m/module1", destination: "/m/learn", permanent: false },
      { source: "/m/module-1", destination: "/m/learn", permanent: false },
      { source: "/module1", destination: "/m/learn", permanent: false },
      { source: "/module-1", destination: "/m/learn", permanent: false },
      { source: "/m1", destination: "/m/learn", permanent: false },

      // Module 2 (Holistic Growth & Evaluation) aliases & fallbacks
      { source: "/grow", destination: "/m/grow", permanent: false },
      { source: "/evaluate", destination: "/m/grow", permanent: false },
      { source: "/m/evaluate", destination: "/m/grow", permanent: false },
      { source: "/m/evaluation", destination: "/m/grow", permanent: false },
      { source: "/m/holistic-growth", destination: "/m/grow", permanent: false },
      { source: "/m/2", destination: "/m/grow", permanent: false },
      { source: "/m/02", destination: "/m/grow", permanent: false },
      { source: "/m/module2", destination: "/m/grow", permanent: false },
      { source: "/m/module-2", destination: "/m/grow", permanent: false },
      { source: "/module2", destination: "/m/grow", permanent: false },
      { source: "/module-2", destination: "/m/grow", permanent: false },
      { source: "/m2", destination: "/m/grow", permanent: false },

      // Module 3 (GK & Songs) aliases & fallbacks
      { source: "/gk-songs", destination: "/m/gk-songs", permanent: false },
      { source: "/m/3", destination: "/m/gk-songs", permanent: false },
      { source: "/m/03", destination: "/m/gk-songs", permanent: false },
      { source: "/m/module3", destination: "/m/gk-songs", permanent: false },
      { source: "/m/module-3", destination: "/m/gk-songs", permanent: false },
      { source: "/module3", destination: "/m/gk-songs", permanent: false },
      { source: "/module-3", destination: "/m/gk-songs", permanent: false },
      { source: "/m3", destination: "/m/gk-songs", permanent: false },

      // Auth aliases
      { source: "/signin", destination: "/sign-in", permanent: false },
      { source: "/login", destination: "/sign-in", permanent: false },
    ];
  },
};

export default nextConfig;

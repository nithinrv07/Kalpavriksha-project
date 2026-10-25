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
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Phosphor's barrel re-exports ~9,000 icon modules; without this every page
    // compiles all of them, which exhausts memory on low-RAM machines.
    optimizePackageImports: ["@phosphor-icons/react", "@phosphor-icons/react/ssr"],
  },
};

export default nextConfig;

// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Laisse le build passer même si ESLint trouve des erreurs
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Décommente au besoin si tu veux aussi ignorer les erreurs TypeScript en build
  // typescript: {
  //   ignoreBuildErrors: true,
  // },

  reactStrictMode: true,
};

export default nextConfig;

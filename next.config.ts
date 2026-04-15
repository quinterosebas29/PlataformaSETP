import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar TypeScript estricto en build (ignoreBuildErrors: false es el default)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Nota: la propiedad 'eslint' fue removida en Next.js 15+.
  // ESLint se configura ahora mediante eslint.config.mjs en la raíz del proyecto.
  // ignoreDuringBuilds: false es el comportamiento por defecto.
};

export default nextConfig;

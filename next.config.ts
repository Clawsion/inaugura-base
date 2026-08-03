import type { NextConfig } from "next";

// ─── Helper: parse ALLOWED_ORIGINS env var para array ───
// Formato: comma-separated list de domínios
// Exemplo: ALLOWED_ORIGINS=app.coolify.io,meu-dominio.com,localhost
// Ou wildcard: ALLOWED_ORIGINS=*.coolify.io,*.meu-dominio.com
function getAllowedOrigins(): string[] {
  const env = process.env.ALLOWED_ORIGINS;
  const defaults = [
    "**.space-z.ai",
    "**.fcapp.run",
    "localhost",
    "127.0.0.1",
  ];

  if (!env) return defaults;

  const custom = env
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    // Converter *.dominio.com para **.dominio.com (Next.js 16 wildcard syntax)
    .map((d) => (d.startsWith("*.") ? `**${d.slice(1)}` : d));

  return [...defaults, ...custom];
}

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Permite Server Actions através de proxies (Caddy + space-z.ai + Coolify)
  // CRÍTICO: sem isto, Next.js 16 rejeita requests com "Invalid Server Actions request"
  // quando x-forwarded-host (proxy upstream) não bate com origin header (browser).
  allowedDevOrigins: getAllowedOrigins(),
  experimental: {
    serverActions: {
      allowedOrigins: getAllowedOrigins(),
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;

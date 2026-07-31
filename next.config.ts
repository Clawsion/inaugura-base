import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Permite Server Actions através de proxies (Caddy + space-z.ai gateway)
  allowedDevOrigins: [
    "*.space-z.ai",
    "*.fcapp.run",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;

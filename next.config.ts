import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Permite Server Actions através de proxies (Caddy + space-z.ai gateway + Alibaba FC)
  // CRÍTICO: sem isto, Next.js 16 rejeita requests com "Invalid Server Actions request"
  // quando x-forwarded-host (proxy upstream) não bate com origin header (browser).
  allowedDevOrigins: [
    "**.space-z.ai",
    "**.fcapp.run",
    "localhost",
    "127.0.0.1",
  ],
  experimental: {
    // Em Next.js 16, serverActions está dentro de experimental.
    // Autoriza todos os origins que o browser pode enviar no header `origin`.
    // O Next.js compara este header com x-forwarded-host (que vem do proxy)
    // e aborta se não baterem — exceto se o origin estiver nesta lista.
    //
    // IMPORTANTE: o wildcard `*` matches apenas 1 segmento. `**` matches
    // múltiplos. Por isso `**.space-z.ai` cobre `preview-chat-ce9c7347-xxx.space-z.ai`
    // e `**.fcapp.run` cobre `ws-abaac-fceeaf-ogxipghktr.cn-hongkong-vpc.fcapp.run`.
    serverActions: {
      allowedOrigins: [
        "**.space-z.ai",
        "**.fcapp.run",
        "localhost",
        "127.0.0.1",
      ],
      // Aumenta body size limit (default 1MB pode ser pouco para forms grandes
      // com paleta + fonts playground + skills selecionadas)
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;

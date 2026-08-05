// ============================================================================
// /api/font/[name]/route.ts — Font Server API v2
// ============================================================================
// Serve @font-face CSS para QUALQUER font do catálogo.
// Tenta múltiplas fontes em sequência (primeiro que funciona é usado):
//
//   1. Fontsource CDN (jsDelivr) — serve .woff2 diretamente
//      Cobertura: TODAS as Google Fonts + Commit Mono + outras open-source
//   2. Google Fonts CSS API — @import CSS
//   3. Fontshare CDN — @import CSS (Satoshi, Clash Display, etc.)
//   4. GitHub raw (google/fonts repo) — .ttf diretamente
//   5. Fallback: local() — não bloqueia o render
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

const cssCache = new Map<string, { css: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// 1. Fontsource CDN
async function tryFontsource(fontName: string): Promise<string | null> {
  const slug = toSlug(fontName);
  const url400 = `https://cdn.jsdelivr.net/fontsource/fonts/${slug}@latest/latin-400-normal.woff2`;

  try {
    const res = await fetch(url400, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });

    if (res.status === 200) {
      const weights = [400, 500, 600, 700, 800];
      return weights.map((w) => {
        const woff2Url = `https://cdn.jsdelivr.net/fontsource/fonts/${slug}@latest/latin-${w}-normal.woff2`;
        return `@font-face {
  font-family: '${fontName}';
  src: url('${woff2Url}') format('woff2');
  font-weight: ${w};
  font-display: swap;
  font-style: normal;
}`;
      }).join("\n\n");
    }
    return null;
  } catch {
    return null;
  }
}

// 2. Google Fonts CSS API
async function tryGoogleFonts(fontName: string): Promise<string | null> {
  const family = fontName.replace(/\s+/g, "+");
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800;900&display=swap`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const css = await res.text();
    if (css.includes("@font-face")) {
      return `@import url('${url}');`;
    }
    return null;
  } catch {
    return null;
  }
}

// 3. Fontshare CDN
async function tryFontshare(fontName: string): Promise<string | null> {
  const slug = toSlug(fontName);
  const url = `https://api.fontshare.com/v2/css?f[]=${slug}@400,500,600,700,800,900&display=swap`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const css = await res.text();
    if (css.includes("@font-face")) {
      return css;
    }
    return null;
  } catch {
    return null;
  }
}

// 4. GitHub raw (google/fonts repo)
async function tryGitHubRaw(fontName: string): Promise<string | null> {
  const slug = toSlug(fontName);
  const fileName = fontName.replace(/\s+/g, "");
  const possiblePaths = [
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/${fileName}-Regular.ttf`,
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/${fileName}[wght].ttf`,
  ];

  for (const url of possiblePaths) {
    try {
      const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(4000) });
      if (res.status === 200) {
        return `@font-face {
  font-family: '${fontName}';
  src: url('${url}') format('truetype');
  font-weight: 400;
  font-display: swap;
  font-style: normal;
}`;
      }
    } catch {
      continue;
    }
  }
  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const fontName = decodeURIComponent(name).replace(/\+/g, " ").trim();

  if (!fontName || fontName === "Auto") {
    return new NextResponse("/* Invalid font name */", {
      headers: { "Content-Type": "text/css" },
    });
  }

  const cached = cssCache.get(fontName);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return new NextResponse(cached.css, {
      headers: { "Content-Type": "text/css", "Cache-Control": "public, max-age=86400" },
    });
  }

  const sources = [
    { name: "Fontsource", fn: () => tryFontsource(fontName) },
    { name: "Google Fonts", fn: () => tryGoogleFonts(fontName) },
    { name: "Fontshare", fn: () => tryFontshare(fontName) },
    { name: "GitHub raw", fn: () => tryGitHubRaw(fontName) },
  ];

  for (const source of sources) {
    const css = await source.fn();
    if (css) {
      const result = `/* ${fontName} — via ${source.name} */\n${css}`;
      cssCache.set(fontName, { css: result, timestamp: Date.now() });
      return new NextResponse(result, {
        headers: { "Content-Type": "text/css", "Cache-Control": "public, max-age=86400" },
      });
    }
  }

  // Fallback
  const fallback = `/* ${fontName} — não encontrada. Usar instalação manual. */
@font-face {
  font-family: '${fontName}';
  src: local('${fontName}'), local('${fontName.replace(/\s+/g, "")}');
  font-weight: 400 900;
  font-display: swap;
  font-style: normal;
}`;

  return new NextResponse(fallback, {
    headers: { "Content-Type": "text/css", "Cache-Control": "public, max-age=300" },
  });
}

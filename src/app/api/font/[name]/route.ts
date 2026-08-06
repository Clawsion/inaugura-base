// ============================================================================
// /api/font/[name]/route.ts — Font Server API v3
// ============================================================================
// Serve @font-face CSS para QUALQUER font do catálogo.
// Tenta múltiplas fontes em sequência:
//
//   1. GitHub repo próprio (Clawsion/inaugura-fonts) via jsDelivr CDN
//      — 89 fonts já descarregadas (Fontshare + Google)
//   2. Fontsource CDN (jsDelivr) — TODAS as Google Fonts
//   3. Google Fonts CSS API — @import CSS
//   4. Fontshare CDN — CSS API (para fonts que não descarregámos)
//   5. Fallback: local()
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

const cssCache = new Map<string, { css: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

// URL base do nosso repo GitHub via jsDelivr
const GITHUB_CDN = "https://cdn.jsdelivr.net/gh/Clawsion/inaugura-fonts@main";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// 1. GitHub repo próprio (Clawsion/inaugura-fonts) via jsDelivr
async function tryGitHubRepo(fontName: string): Promise<string | null> {
  const slug = toSlug(fontName);
  const dirUrl = `${GITHUB_CDN}/${slug}`;

  // Tentar vários padrões de nomes de ficheiro
  const possibleFiles = [
    `${slug}-0.woff2`,
    `${slug}-1.woff2`,
    `${slug}-0.ttf`,
    `${fontName.replace(/\s+/g, "")}.ttf`,
    `${fontName.replace(/\s+/g, "")}-Regular.ttf`,
  ];

  for (const file of possibleFiles) {
    const url = `${dirUrl}/${file}`;
    try {
      const res = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(4000),
      });
      if (res.status === 200) {
        // Encontrou! Agora tentar encontrar todos os pesos (0-5)
        const weights = [400, 500, 600, 700, 800];
        const faceDecls: string[] = [];

        for (let i = 0; i < 6; i++) {
          const woff2Url = `${dirUrl}/${slug}-${i}.woff2`;
          try {
            const checkRes = await fetch(woff2Url, {
              method: "HEAD",
              signal: AbortSignal.timeout(2000),
            });
            if (checkRes.status === 200) {
              faceDecls.push(`@font-face {
  font-family: '${fontName}';
  src: url('${woff2Url}') format('woff2');
  font-weight: ${weights[i] || 400};
  font-display: swap;
  font-style: normal;
}`);
            }
          } catch { break; }
        }

        // Se não encontrou pesos numerados, usar o ficheiro único
        if (faceDecls.length === 0) {
          faceDecls.push(`@font-face {
  font-family: '${fontName}';
  src: url('${url}') format('${file.endsWith('.woff2') ? 'woff2' : 'truetype'}');
  font-weight: 400 900;
  font-display: swap;
  font-style: normal;
}`);
        }

        return faceDecls.join("\n\n");
      }
    } catch { continue; }
  }

  return null;
}

// 2. Fontsource CDN
async function tryFontsource(fontName: string): Promise<string | null> {
  const slug = toSlug(fontName);
  const url = `https://cdn.jsdelivr.net/fontsource/fonts/${slug}@latest/latin-400-normal.woff2`;

  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(4000) });
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
  } catch { return null; }
}

// 3. Google Fonts CSS API
async function tryGoogleFonts(fontName: string): Promise<string | null> {
  const family = fontName.replace(/\s+/g, "+");
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800;900&display=swap`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const css = await res.text();
    if (css.includes("@font-face")) return `@import url('${url}');`;
    return null;
  } catch { return null; }
}

// 4. Fontshare CSS API
async function tryFontshare(fontName: string): Promise<string | null> {
  const slug = toSlug(fontName);
  const url = `https://api.fontshare.com/v2/css?f[]=${slug}@400,500,600,700,800,900&display=swap`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const css = await res.text();
    if (css.includes("@font-face")) return css;
    return null;
  } catch { return null; }
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
    { name: "GitHub repo (jsDelivr)", fn: () => tryGitHubRepo(fontName) },
    { name: "Fontsource", fn: () => tryFontsource(fontName) },
    { name: "Google Fonts", fn: () => tryGoogleFonts(fontName) },
    { name: "Fontshare", fn: () => tryFontshare(fontName) },
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

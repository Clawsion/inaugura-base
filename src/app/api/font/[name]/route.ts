// ============================================================================
// /api/font/[name]/route.ts — Font Server API
// ============================================================================
// Serve @font-face CSS para QUALQUER font do catálogo.
// Tenta múltiplas fontes em sequência:
//   1. Google Fonts (se a font existe lá)
//   2. Fontshare (se a font existe lá)
//   3. Fontsup.com (agregador gratuito — tem milhares de fonts)
//   4. Fallback: retorna CSS com system-ui
//
// COMO USAR:
//   <link href="/api/font/Amazing+Sweety" rel="stylesheet">
//   ou
//   @import url('/api/font/Amazing+Sweety');
//
// A API retorna CSS @font-face que o browser pode usar imediatamente.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { GOOGLE_FONTS_CONFIRMED, FONTSHARE_FONTS_CONFIRMED } from "@/lib/font-cdns";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // Cache 24h

// Cache em memória para evitar refetch
const cssCache = new Map<string, { css: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

interface FontSourceResult {
  css: string | null;
  source: string;
}

// Tentar Google Fonts
async function tryGoogleFonts(fontName: string): Promise<FontSourceResult> {
  const family = fontName.replace(/\s+/g, "+");
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800;900&display=swap`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const css = await res.text();

    // Google Fonts retorna CSS com @font-face se a font existe
    // Se retornar HTML, a font não existe
    if (css.includes("@font-face")) {
      return { css, source: "google" };
    }
    return { css: null, source: "google" };
  } catch {
    return { css: null, source: "google" };
  }
}

// Tentar Fontshare
async function tryFontshare(fontName: string): Promise<FontSourceResult> {
  const slug = fontName.toLowerCase().replace(/\s+/g, "-");
  const url = `https://api.fontshare.com/v2/css?f[]=${slug}@400,500,600,700,800,900&display=swap`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const css = await res.text();

    // Fontshare retorna CSS com @font-face se a font existe
    // Se retornar vazio ou erro, a font não existe
    if (css.includes("@font-face")) {
      return { css, source: "fontshare" };
    }
    return { css: null, source: "fontshare" };
  } catch {
    return { css: null, source: "fontshare" };
  }
}

// Tentar Fontsup (agregador gratuito com milhares de fonts)
async function tryFontsup(fontName: string): Promise<FontSourceResult> {
  const slug = fontName.toLowerCase().replace(/\s+/g, "-");
  const searchUrl = `https://www.fontsup.com/search/${encodeURIComponent(fontName)}`;

  try {
    const res = await fetch(searchUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await res.text();

    // Procurar por links de download de .woff2 ou .ttf
    const woff2Match = html.match(/href="([^"]+\.woff2[^"]*)"/i);
    const ttfMatch = html.match(/href="([^"]+\.ttf[^"]*)"/i);

    const fontUrl = woff2Match?.[1] || ttfMatch?.[1];
    if (fontUrl) {
      // Construir URL completa se for relativa
      const fullUrl = fontUrl.startsWith("http") ? fontUrl : `https://www.fontsup.com${fontUrl}`;

      // Gerar @font-face com a URL do Fontsup
      const css = `@font-face {
  font-family: '${fontName}';
  src: url('${fullUrl}') format('${woff2Match ? 'woff2' : 'truetype'}');
  font-weight: 400 900;
  font-display: swap;
  font-style: normal;
}`;
      return { css, source: "fontsup" };
    }
    return { css: null, source: "fontsup" };
  } catch {
    return { css: null, source: "fontsup" };
  }
}

// Verificar se a font existe no Google Fonts (fetch rápido)
async function checkGoogleFontsExists(fontName: string): Promise<boolean> {
  // Se está na lista confirmada, existe
  if (GOOGLE_FONTS_CONFIRMED.has(fontName)) return true;

  // Caso contrário, tentar fetch rápido
  const family = fontName.replace(/\s+/g, "+");
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@400&display=swap`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const css = await res.text();
    return css.includes("@font-face");
  } catch {
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const fontName = decodeURIComponent(name).replace(/\+/g, " ").trim();

  if (!fontName || fontName === "Auto") {
    return new NextResponse("/* Invalid font name */", {
      headers: { "Content-Type": "text/css" },
    });
  }

  // Verificar cache
  const cached = cssCache.get(fontName);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return new NextResponse(cached.css, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // 1. Se está confirmada no Google Fonts, retornar CSS direto
  if (GOOGLE_FONTS_CONFIRMED.has(fontName)) {
    const family = fontName.replace(/\s+/g, "+");
    const css = `@import url('https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800;900&display=swap');`;
    cssCache.set(fontName, { css, timestamp: Date.now() });
    return new NextResponse(css, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // 2. Se está confirmada no Fontshare, retornar CSS direto
  if (FONTSHARE_FONTS_CONFIRMED.has(fontName)) {
    const slug = fontName.toLowerCase().replace(/\s+/g, "-");
    const css = `@import url('https://api.fontshare.com/v2/css?f[]=${slug}@400,500,600,700,800,900&display=swap');`;
    cssCache.set(fontName, { css, timestamp: Date.now() });
    return new NextResponse(css, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // 3. Para fonts não-confirmadas, tentar múltiplas fontes
  // Primeiro verificar se existe no Google Fonts (pode não estar na lista confirmada)
  const googleExists = await checkGoogleFontsExists(fontName);
  if (googleExists) {
    const family = fontName.replace(/\s+/g, "+");
    const css = `@import url('https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800;900&display=swap');`;
    cssCache.set(fontName, { css, timestamp: Date.now() });
    return new NextResponse(css, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // 4. Tentar Fontshare
  const fontshareResult = await tryFontshare(fontName);
  if (fontshareResult.css) {
    cssCache.set(fontName, { css: fontshareResult.css, timestamp: Date.now() });
    return new NextResponse(fontshareResult.css, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // 5. Tentar Fontsup (agregador)
  const fontsupResult = await tryFontsup(fontName);
  if (fontsupResult.css) {
    cssCache.set(fontName, { css: fontsupResult.css, timestamp: Date.now() });
    return new NextResponse(fontsupResult.css, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // 6. Fallback — retornar CSS com system-ui (não bloqueia o render)
  const fallbackCss = `/* ${fontName} — font não encontrada em nenhum CDN.
   Usa fallback do sistema. Para instalar manualmente, ver font-installation.ts. */
@font-face {
  font-family: '${fontName}';
  src: local('${fontName}'), local('${fontName.replace(/\s+/g, "")}');
  font-weight: 400 900;
  font-display: swap;
  font-style: normal;
}`;

  return new NextResponse(fallbackCss, {
    headers: {
      "Content-Type": "text/css",
      "Cache-Control": "public, max-age=300", // Cache menor para retry
    },
  });
}

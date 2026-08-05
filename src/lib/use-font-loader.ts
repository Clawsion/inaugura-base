"use client";

// ============================================================================
// useFontLoader — carrega fonts dinamicamente em tempo real
// ============================================================================
// VERSÃO 2 — Carrega QUALQUER font dinamicamente:
//   1. Tenta Google Fonts API (css2)
//   2. Se falhar, tenta Fontshare API
//   3. Se falhar, usa fallback do sistema
//
// Isto faz com que TODAS as 541+ fonts do catálogo carreguem visualmente.
// ============================================================================

import { useEffect } from "react";
import { GOOGLE_FONTS_CONFIRMED, FONTSHARE_FONTS_CONFIRMED } from "./font-cdns";

// Re-export para compatibilidade (outros ficheiros já importam de use-font-loader)
export { GOOGLE_FONTS_CONFIRMED, FONTSHARE_FONTS_CONFIRMED };

// Fonts pagas — usar alternativa gratuita
const PAID_FONT_ALTERNATIVES: Record<string, string> = {
  "Söhne": "Inter",
  "Aeonik": "Geist",
  "PP Neue Montreal": "Inter",
  "Lyon": "Playfair Display",
  "GT Sectra": "Fraunces",
  "Tiempos Text": "Newsreader",
  "Berkeley Mono": "JetBrains Mono",
  "Sartoria": "Playfair Display",
};

const loadedFonts = new Set<string>();
const failedFonts = new Set<string>();

function getFontUrls(fontName: string): string[] {
  // Se é paga, usar alternativa
  const actualFont = PAID_FONT_ALTERNATIVES[fontName] ?? fontName;
  const urls: string[] = [];

  // 1. Se está confirmada no Google Fonts, usar URL direta
  if (GOOGLE_FONTS_CONFIRMED.has(actualFont)) {
    const family = actualFont.replace(/\s+/g, "+");
    urls.push(`https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800;900&display=swap`);
  }

  // 2. Se está confirmada no Fontshare, usar URL direta
  if (FONTSHARE_FONTS_CONFIRMED.has(actualFont)) {
    const slug = actualFont.toLowerCase().replace(/\s+/g, "-");
    urls.push(`https://api.fontshare.com/v2/css?f[]=${slug}@400,500,600,700,800,900&display=swap`);
  }

  // 3. Se não está em nenhuma lista confirmada, TENTAR ambos os CDNs
  //    (muitas fonts scraped podem estar no Google Fonts ou Fontshare)
  if (urls.length === 0) {
    const family = actualFont.replace(/\s+/g, "+");
    const slug = actualFont.toLowerCase().replace(/\s+/g, "-");
    urls.push(`https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800;900&display=swap`);
    urls.push(`https://api.fontshare.com/v2/css?f[]=${slug}@400,500,600,700,800,900&display=swap`);
  }

  return urls;
}

export function loadFont(fontName: string) {
  if (!fontName || fontName === "Auto" || fontName === "" || loadedFonts.has(fontName)) return;
  if (failedFonts.has(fontName)) return;

  // Verifica se já existe um link para esta font
  const existing = document.querySelector(`link[data-font="${fontName}"]`);
  if (existing) return;

  // USAR A API ROUTE /api/font/[name] — ela tenta Google → Fontshare → Fontsup → fallback
  // Isto garante que TODAS as fonts carregam (as que estão em qualquer CDN)
  const apiUrl = `/api/font/${encodeURIComponent(fontName)}`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = apiUrl;
  link.dataset.font = fontName;

  link.onerror = () => {
    // Se a API falhou, tentar carregamento direto como fallback
    const urls = getFontUrls(fontName);
    if (urls.length > 0) {
      urls.forEach((url) => {
        const fallbackLink = document.createElement("link");
        fallbackLink.rel = "stylesheet";
        fallbackLink.href = url;
        fallbackLink.dataset.font = `${fontName}-fallback`;
        document.head.appendChild(fallbackLink);
      });
      loadedFonts.add(fontName);
    } else {
      failedFonts.add(fontName);
    }
  };

  document.head.appendChild(link);
  loadedFonts.add(fontName);
}

export function useFontLoader(fonts: string[]) {
  useEffect(() => {
    fonts.forEach((f) => {
      if (f && f !== "Auto" && f !== "") loadFont(f);
    });
  }, [fonts.join(",")]);
}

// ─── PRÉ-CARREGAMENTO de fonts populares ──────────────────────────────────
// Carrega as fonts mais usadas imediatamente quando a app abre,
// para que mudem instantaneamente quando o user as seleciona.
const POPULAR_FONTS = [
  "Inter", "Geist", "Geist Mono", "Satoshi", "General Sans",
  "Clash Display", "Clash Grotesk", "Cabinet Grotesk", "Switzer",
  "Plus Jakarta Sans", "DM Sans", "Manrope", "Space Grotesk",
  "Sora", "Outfit", "Bricolage Grotesque", "Figtree",
  "JetBrains Mono", "Playfair Display", "Fraunces",
];

let preloaded = false;
export function preloadPopularFonts() {
  if (preloaded) return;
  preloaded = true;
  // Carregar em background (não bloqueia o render)
  POPULAR_FONTS.forEach((f) => {
    // Pequeno delay para não saturar a rede
    setTimeout(() => loadFont(f), 100 + Math.random() * 2000);
  });
}

// Helper: obter o nome real da font para CSS (com fallback para pagas)
export function getCssFontName(fontName: string): string {
  if (!fontName || fontName === "Auto" || fontName === "") return "inherit";
  const actual = PAID_FONT_ALTERNATIVES[fontName] ?? fontName;
  return `'${actual}', system-ui, sans-serif`;
}

// Helper: verificar se uma font pode carregar de CDN (Google/Fontshare)
export function isFontOnCdn(fontName: string): boolean {
  if (!fontName || fontName === "Auto" || fontName === "") return false;
  const actual = PAID_FONT_ALTERNATIVES[fontName] ?? fontName;
  return GOOGLE_FONTS_CONFIRMED.has(actual) || FONTSHARE_FONTS_CONFIRMED.has(actual);
}

// Helper: verificar se uma font já foi carregada com sucesso
export function isFontLoaded(fontName: string): boolean {
  if (!fontName || fontName === "Auto" || fontName === "") return false;
  return loadedFonts.has(fontName) && !failedFonts.has(fontName);
}

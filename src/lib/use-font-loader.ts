"use client";

// ============================================================================
// useFontLoader — carrega fonts dinamicamente em tempo real
// ============================================================================
// Quando uma font é selecionada, injeta um <link> tag para carregar a font
// do Google Fonts ou Fontshare CDN. Isto faz com que a font MUDAR VISUALMENTE.
// Sem isto, o browser faz fallback para a font default (porque não está carregada).
// ============================================================================

import { useEffect } from "react";

// Mapping: font name → CDN URL
const GOOGLE_FONTS = new Set([
  "Geist", "Geist Mono", "Inter", "Plus Jakarta Sans", "DM Sans", "Manrope",
  "Lexend", "Poppins", "Space Grotesk", "Sora", "Syne", "Unbounded",
  "Bricolage Grotesque", "Archivo", "Big Shoulders Display", "Anton",
  "Bebas Neue", "Oswald", "Outfit", "Fraunces", "Newsreader",
  "Instrument Serif", "Playfair Display", "Cormorant Garamond", "Lora",
  "Merriweather", "Fira Code", "Space Mono", "IBM Plex Mono", "Azeret Mono",
  "Hanken Grotesk", "Schibsted Grotesk", "Onest", "Mona Sans", "Hubot Sans",
  "Figtree", "Albert Sans", "Be Vietnam Pro", "Work Sans", "Nunito",
  "Public Sans", "Crimson Pro", "Literata", "JetBrains Mono",
]);

const FONTSHARE_FONTS = new Set([
  "Satoshi", "General Sans", "Switzer", "Cabinet Grotesk", "Clash Display",
  "Clash Grotesk", "Boska", "Technor", "Melodrama", "Aktura", "RX100",
  "Zodiak", "Tanker", "Sentient", "Bespoke Serif", "Erode", "Gambetta",
  "Nippo", "Supreme", "Commit Mono",
]);

// Fonts pagas — usar alternativa gratuita
const PAID_FONT_ALTERNATIVES: Record<string, string> = {
  "Söhne": "Inter",
  "Aeonik": "Geist",
  "PP Neue Montreal": "Inter",
  "Lyon": "Playfair Display",
  "GT Sectra": "Fraunces",
  "Tiempos Text": "Newsreader",
  "Berkeley Mono": "JetBrains Mono",
};

const loadedFonts = new Set<string>();

function getFontUrl(fontName: string): string | null {
  // Se é paga, usar alternativa
  const actualFont = PAID_FONT_ALTERNATIVES[fontName] ?? fontName;

  if (GOOGLE_FONTS.has(actualFont)) {
    // Google Fonts API
    const family = actualFont.replace(/\s+/g, "+");
    return `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800;900&display=swap`;
  }

  if (FONTSHARE_FONTS.has(actualFont)) {
    // Fontshare API — slug é lowercase com hifens
    const slug = actualFont.toLowerCase().replace(/\s+/g, "-");
    return `https://api.fontshare.com/v2/css?f[]=${slug}@400,500,600,700,800,900&display=swap`;
  }

  return null;
}

export function loadFont(fontName: string) {
  if (!fontName || fontName === "Auto" || loadedFonts.has(fontName)) return;

  const url = getFontUrl(fontName);
  if (!url) return;

  // Verifica se já existe um link para esta font
  const existing = document.querySelector(`link[data-font="${fontName}"]`);
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  link.dataset.font = fontName;
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

// Helper: obter o nome real da font para CSS (com fallback para pagas)
export function getCssFontName(fontName: string): string {
  if (!fontName || fontName === "Auto" || fontName === "") return "inherit";
  const actual = PAID_FONT_ALTERNATIVES[fontName] ?? fontName;
  return `'${actual}', system-ui, sans-serif`;
}

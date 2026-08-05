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

// Fonts confirmadas no Google Fonts (carregamento garantido)
const GOOGLE_FONTS_CONFIRMED = new Set([
  "Geist", "Geist Mono", "Inter", "Plus Jakarta Sans", "DM Sans", "Manrope",
  "Lexend", "Poppins", "Space Grotesk", "Sora", "Syne", "Unbounded",
  "Bricolage Grotesque", "Archivo", "Big Shoulders Display", "Anton",
  "Bebas Neue", "Oswald", "Outfit", "Fraunces", "Newsreader",
  "Instrument Serif", "Playfair Display", "Cormorant Garamond", "Lora",
  "Merriweather", "Fira Code", "Space Mono", "IBM Plex Mono", "Azeret Mono",
  "Hanken Grotesk", "Schibsted Grotesk", "Onest", "Mona Sans", "Hubot Sans",
  "Figtree", "Albert Sans", "Be Vietnam Pro", "Work Sans", "Nunito",
  "Public Sans", "Crimson Pro", "Literata", "JetBrains Mono",
  "Roboto", "Roboto Mono", "Roboto Flex", "Source Sans 3", "Source Serif 4",
  "Source Code Pro", "PT Sans", "PT Serif", "Lato", "Open Sans",
  "Montserrat", "Raleway", "Dancing Script", "Pacifico", "Caveat",
  "Sacramento", "Allura", "Alex Brush", "Arizonia", "Bad Script",
  "Bilbo Swash Caps", "Cookie", "Great Vibes", "Italianno", "Marck Script",
  "Parisienne", "Noto Serif", "Noto Serif Display", "EB Garamond",
  "Spectral", "Spectral SC", "Crimson Text", "DM Serif Display",
  "DM Serif Text", "Enriqueta", "Frank Ruhl Libre", "Glegoo", "Hepta Slab",
  "IBM Plex Serif", "Inria Serif", "Markazi Text", "Mate", "Mate SC",
  "Noto Serif SC", "Old Standard TT", "Philosopher", "Pridi", "Prata",
  "Teko", "Tourney", "Yanone Kaffeesatz", "Goldman", "Grenze",
  "Grenze Gotisch", "Holtwood One SC", "Iceberg", "Iceland",
  "Jacques Francois", "Jacques Francois Shadow", "Kavoon", "Kdam Thmor",
  "Keania One", "Kreon", "Kristi", "La Belle Aurore", "Lakki Reddy",
  "Langar", "Lemon", "Lemonada", "Lilita One", "Lobster", "Lobster Two",
  "Codystar", "Dela Gothic One", "DotGothic16", "Bungee", "Bungee Inline",
  "Bungee Shade", "Alfa Slab One", "Archivo Black", "Khand", "Karla",
  "Mulish", "Nunito Sans", "Quicksand", "Questrial", "Rajdhani",
  "Rationale", "Rubik", "Saira", "Saira Condensed", "Sarabun", "Tajawal",
  "Zen Kaku Gothic New", "Zen Loop", "Zen Maru Gothic", "Zen Old Mincho",
  "Zen Tokyo Zoo", "Anybody", "Arimo", "Atkinson Hyperlegible", "Bitter",
  "Carlito", "Chivo", "Commissioner", "Domine", "Encode Sans", "Epilogue",
  "Familjen Grotesk", "Gudea", "Heebo", "Hind", "IBM Plex Sans",
  "Inconsolata", "Inika", "Jost", "Kanit", "Khand", "Mada", "Orienta",
  "Cutive Mono", "DM Mono", "Nanum Gothic Coding", "Spline Sans Mono",
  "Cousine", "Major Mono Display", "DotGothic16", "Barriecito",
  "GTL001", "Getai Grotesk", "Hyperlegible Sans",
]);

// Fonts confirmadas no Fontshare (carregamento garantido)
const FONTSHARE_FONTS_CONFIRMED = new Set([
  "Satoshi", "General Sans", "Switzer", "Cabinet Grotesk", "Clash Display",
  "Clash Grotesk", "Boska", "Technor", "Melodrama", "Aktura", "RX100",
  "Zodiak", "Tanker", "Sentient", "Bespoke Serif", "Erode", "Gambetta",
  "Nippo", "Supreme", "Commit Mono", "Author", "Ranade", "Chillax", "Pally",
  "Telma", "Wargaming", "Strike", "Migra", "Panch", "Rocher", "Penaflor",
  "Sahitya", "Triode",
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

  const urls = getFontUrls(fontName);
  if (urls.length === 0) return;

  // Verifica se já existe um link para esta font
  const existing = document.querySelector(`link[data-font="${fontName}"]`);
  if (existing) return;

  // Para fonts confirmadas, carrega diretamente
  // Para fonts não-confirmadas, tenta carregar mas verifica se o CSS é válido
  const isConfirmed = GOOGLE_FONTS_CONFIRMED.has(fontName) || FONTSHARE_FONTS_CONFIRMED.has(fontName);

  if (isConfirmed) {
    // Font confirmada — carrega diretamente
    urls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.dataset.font = fontName;
      document.head.appendChild(link);
    });
    loadedFonts.add(fontName);
  } else {
    // Font não-confirmada — tenta via fetch para verificar se o CSS é válido
    // Se for válido, injeta o link; se não, marca como falhada
    urls.forEach((url, i) => {
      // Para Google Fonts, verificar se retorna CSS (não HTML de erro)
      if (url.includes("fonts.googleapis.com")) {
        fetch(url)
          .then((res) => res.text())
          .then((css) => {
            // Google Fonts retorna CSS válido com @font-face se a font existe
            // Se retornar HTML, a font não existe
            if (css.includes("@font-face")) {
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = url;
              link.dataset.font = fontName;
              document.head.appendChild(link);
              loadedFonts.add(fontName);
            } else if (i === urls.length - 1) {
              failedFonts.add(fontName);
            }
          })
          .catch(() => {
            if (i === urls.length - 1) failedFonts.add(fontName);
          });
      } else {
        // Fontshare — carrega diretamente (retorna 404 se não existe)
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.dataset.font = fontName;
        link.onerror = () => {
          if (i === urls.length - 1) failedFonts.add(fontName);
        };
        document.head.appendChild(link);
        loadedFonts.add(fontName);
      }
    });
  }
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

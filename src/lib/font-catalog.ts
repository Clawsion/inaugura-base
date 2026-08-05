// ============================================================================
// font-catalog.ts — Catálogo CURADO de fonts VISUALMENTE DISTINTAS
// ============================================================================
// PRINCÍPIO: cada font aqui tem PERSONALIDADE ÚNICA — proibido repetir vibes.
// Se duas fonts parecem iguais, só fica a melhor.
// Nível mínimo: 9/10 Awwwards. Sem amadorismo.
// ============================================================================
// Sources: Fontshare API, Google Fonts, Awwwards SOTD, typ.io, dembrandt.com
// ============================================================================

import { NEW_FONTS_2026 } from "./new-fonts-2026";
import { SCRAPED_FONTS } from "./scraped-fonts";

export interface FontDef {
  name: string;
  source: string;
  category: "sans" | "display" | "serif" | "mono";
  foundry: string;
  siteType: string[];
  freeAlternative?: string;
  license?: "free" | "paid" | "freemium";
  // O que faz esta font ÚNICA vs outras da mesma categoria
  personality: string;
  // URL para download da font (página do site original)
  sourceUrl?: string;
  // Tipo de licença (para incluir no .zip)
  licenseType?: string; // ex: "OFL", "ITF-FFL", "Apache 2.0", "CC BY 4.0"
  // CDN onde a font pode ser carregada (Google Fonts, Fontshare, etc.)
  cdn?: "google" | "fontshare" | "none";
}

export const FONT_CATALOG: FontDef[] = [
  // ═══════════════════════════════════════════════════════════════
  // SANS-SERIF — apenas as visualmente DISTINTAS entre si
  // ═══════════════════════════════════════════════════════════════
  { name: "Geist", source: "Vercel", category: "sans", foundry: "Vercel (Google)", siteType: ["SaaS", "Tech"], license: "free", personality: "Geométrica moderna, rounded terminals, tech-forward" },
  { name: "Inter", source: "Linear, Raycast, Notion UI", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "UI"], license: "free", personality: "Neutral grotesk, tall x-height, max legibilidade — o standard" },
  { name: "Satoshi", source: "Stripe, Resend, Awwwards", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Editorial", "Premium"], license: "free", personality: "Grotesk com personalidade geométrica — mais quente que Inter" },
  { name: "Plus Jakarta Sans", source: "Tokopedia, SaaS", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Friendly"], license: "free", personality: "Geométrica FRIENDLY — mais redonda e quente que Inter" },
  { name: "DM Sans", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Clean"], license: "free", personality: "Grotesk neutra com letterforms únicas (g, a) — distinta de Inter" },
  { name: "Hanken Grotesk", source: "Hanken, Awwwards", category: "sans", foundry: "Google Fonts", siteType: ["Editorial", "Nordic"], license: "free", personality: "Grotesk escandinava — mais estreita e elegante que Inter" },
  { name: "Manrope", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Modern"], license: "free", personality: "Semi-geométrica com curves suaves — distinta de Inter/DM Sans" },
  { name: "Schibsted Grotesk", source: "Schibsted, Awwwards", category: "sans", foundry: "Google Fonts", siteType: ["Editorial", "Nordic"], license: "free", personality: "Grotesk editorial nórdica — personality forte, não neutral" },
  { name: "Mona Sans", source: "GitHub/Figma", category: "sans", foundry: "GitHub (Google)", siteType: ["Dev", "SaaS"], license: "free", personality: "Variable super-wide — GitHub brand, tech mas humana" },
  { name: "General Sans", source: "Fontshare, editorial", category: "sans", foundry: "Fontshare", siteType: ["Editorial", "Premium"], license: "free", personality: "Grotesk editorial quente — distinta de Satoshi (mais neutra)" },
  { name: "Switzer", source: "SWIX, Awwwards", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Minimal"], license: "free", personality: "Grotesk minimalista — sem personalidade = ideal para body limpo" },
  { name: "Lexend", source: "Google Fonts (acessível)", category: "sans", foundry: "Google Fonts", siteType: ["Education", "Accessible"], license: "free", personality: "Otimizada para leitura — letter-spacing dinâmico por tamanho" },
  { name: "Poppins", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["Friendly", "E-commerce"], license: "free", personality: "Geométrica PURA baseada em círculos — Bauhaus style, muito distinta" },
  { name: "Gambetta", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Editorial", "Magazine"], license: "free", personality: "Grotesk editorial com personality — serifs internos subtis" },
  { name: "Nippo", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Minimal", "Swiss"], license: "free", personality: "Swiss/japonês — ultra-minimal, quase Neue Haas" },
  { name: "Supreme", source: "Fontshare, streetwear", category: "sans", foundry: "Fontshare", siteType: ["Creative", "Bold"], license: "free", personality: "Streetwear/condensed — BOLD, urbana, nada neutral" },

  // ═══════════════════════════════════════════════════════════════
  // DISPLAY/GROTESK — para HEADLINES com PERSONALIDADE FORTE
  // ═══════════════════════════════════════════════════════════════
  { name: "Clash Display", source: "Awwwards SOTD, Fontshare", category: "display", foundry: "Fontshare", siteType: ["Awwwards", "Bold", "Agency"], license: "free", personality: "Display BOLD com letterforms únicas (g, a) — #1 Awwwards 2026" },
  { name: "Cabinet Grotesk", source: "Fontshare, Awwwards", category: "display", foundry: "Fontshare", siteType: ["Awwwards", "Premium"], license: "free", personality: "Grotesk display elegante — mais refinada que Clash, editorial" },
  { name: "Clash Grotesk", source: "Bureau Cool, Awwwards", category: "display", foundry: "Fontshare", siteType: ["Awwwards", "Agency"], license: "free", personality: "Versão grotesk do Clash — menos display, mais body-friendly" },
  { name: "Space Grotesk", source: "Google Fonts, tech", category: "display", foundry: "Google Fonts", siteType: ["Tech", "Dev", "Gaming"], license: "free", personality: "Tech/mono-flavor — letterforms únicas (a, g, 0) sem ser mono" },
  { name: "Sora", source: "Google Fonts, Awwwards", category: "display", foundry: "Google Fonts", siteType: ["Tech", "Modern"], license: "free", personality: "Geométrica limpa para headings — mais tech que Outfit" },
  { name: "Syne", source: "Synesthésie MC, Google", category: "display", foundry: "Google Fonts", siteType: ["Awwwards", "Experimental"], license: "free", personality: "EXPERIMENTAL — letterforms distorcidas, art-school vibe" },
  { name: "Unbounded", source: "Google Fonts, Awwwards", category: "display", foundry: "Google Fonts", siteType: ["Awwwards", "Bold"], license: "free", personality: "ULTRA-BOLD display — rounded, chunky, impossível ignorar" },
  { name: "Bricolage Grotesque", source: "Awwwards, Google", category: "display", foundry: "Google Fonts", siteType: ["Awwwards", "Trending"], license: "free", personality: "Collage de styles — mistura grotesk + serif + unique, trending 2026" },
  { name: "Archivo", source: "Google Fonts, Awwwards", category: "display", foundry: "Google Fonts", siteType: ["Editorial", "Display"], license: "free", personality: "Grotesk condensada — editorial/jornal, narrow headlines" },
  { name: "Big Shoulders Display", source: "Google Fonts", category: "display", foundry: "Google Fonts", siteType: ["Bold", "Poster"], license: "free", personality: "ULTRA-CONDENSED — poster/headline impactante, Chicago style" },
  { name: "Anton", source: "Google Fonts", category: "display", foundry: "Google Fonts", siteType: ["Bold", "Poster"], license: "free", personality: "Black condensed — máxima impacto, só para hero gigante" },
  { name: "Bebas Neue", source: "Google Fonts", category: "display", foundry: "Google Fonts", siteType: ["Bold", "Poster"], license: "free", personality: "All-caps condensed — cinema/poster clássico" },
  { name: "Oswald", source: "Google Fonts", category: "display", foundry: "Google Fonts", siteType: ["Condensed", "Headline"], license: "free", personality: "Condensed — narrower que Archivo, mais técnica" },
  { name: "Boska", source: "Fontshare, Awwwards", category: "display", foundry: "Fontshare", siteType: ["Awwwards", "Display"], license: "free", personality: "Wedge-serif display — não é sans nem serif, é híbrida" },
  { name: "Technor", source: "Fontshare, tech", category: "display", foundry: "Fontshare", siteType: ["Tech", "Display"], license: "free", personality: "Tech display com personality — angular, futurista" },
  { name: "Melodrama", source: "Fontshare, editorial", category: "display", foundry: "Fontshare", siteType: ["Editorial", "Display"], license: "free", personality: "Serif display DRAMÁTICA — editorial luxury com flair" },
  { name: "RX100", source: "Fontshare, tech", category: "display", foundry: "Fontshare", siteType: ["Tech", "Gaming"], license: "free", personality: "Tech/gaming display — angular, agressiva, cyberpunk" },
  { name: "Zodiak", source: "Fontshare, editorial", category: "display", foundry: "Fontshare", siteType: ["Editorial", "Display"], license: "free", personality: "Serif display geométrica — zodiac/celestial vibe" },
  { name: "Tanker", source: "Fontshare, bold", category: "display", foundry: "Fontshare", siteType: ["Bold", "Display"], license: "free", personality: "ULTRA-BOLD square — brutalist display, sem rounded" },
  { name: "Sentient", source: "Fontshare, Awwwards", category: "display", foundry: "Fontshare", siteType: ["Awwwards", "Display"], license: "free", personality: "Serif display moderna — organic curves, AI-era vibe" },

  // ═══════════════════════════════════════════════════════════════
  // SERIF — EDITORIAL/LUXURY — cada uma com personalidade única
  // ═══════════════════════════════════════════════════════════════
  { name: "Fraunces", source: "Google Fonts, Awwwards", category: "serif", foundry: "Google Fonts", siteType: ["Editorial", "Magazine"], license: "free", personality: "Variable serif COMPLEXA — wonky/soft, máxima personality" },
  { name: "Instrument Serif", source: "Instrument, Awwwards", category: "serif", foundry: "Instrument (Google)", siteType: ["Editorial", "Premium"], license: "free", personality: "Serif elegante FINA — thin strokes, Stripe editorial style" },
  { name: "Newsreader", source: "Google Fonts, editorial", category: "serif", foundry: "Google Fonts", siteType: ["Editorial", "Blog"], license: "free", personality: "Serif newspaper clássica — readability máxima, body-friendly" },
  { name: "Playfair Display", source: "Google Fonts, luxury", category: "serif", foundry: "Google Fonts", siteType: ["Luxury", "Fashion"], license: "free", personality: "Serif ALTO-CONTRASTE — luxury/fashion, drama máximo" },
  { name: "Cormorant Garamond", source: "Google Fonts, luxury", category: "serif", foundry: "Google Fonts", siteType: ["Luxury", "Fashion"], license: "free", personality: "Serif ultra-fina elegante — mais delicada que Playfair" },
  { name: "Bespoke Serif", source: "Fontshare, Awwwards", category: "serif", foundry: "Fontshare", siteType: ["Awwwards", "Premium"], license: "free", personality: "Serif custom-feel — letterforms únicas, não standard" },
  { name: "Erode", source: "Fontshare, editorial", category: "serif", foundry: "Fontshare", siteType: ["Editorial", "Premium"], license: "free", personality: "Serif com erosion effect — desgastada, vintage premium" },
  { name: "Lora", source: "Google Fonts, editorial", category: "serif", foundry: "Google Fonts", siteType: ["Editorial", "Blog"], license: "free", personality: "Serif caligráfica brushed — mais quente/humana que Newsreader" },

  // ═══════════════════════════════════════════════════════════════
  // MONO — apenas as DISTINTAS entre si
  // ═══════════════════════════════════════════════════════════════
  { name: "Geist Mono", source: "Vercel, Awwwards dev", category: "mono", foundry: "Vercel (Google)", siteType: ["Dev", "Tech"], license: "free", personality: "Mono geométrica — Vercel brand, rounded, moderna" },
  { name: "JetBrains Mono", source: "JetBrains, Cursor", category: "mono", foundry: "JetBrains (Google)", siteType: ["Dev", "Code"], license: "free", personality: "Mono code-optimized — ligatures, code-focused, max readability" },
  { name: "Space Mono", source: "Google Fonts, Awwwards", category: "mono", foundry: "Google Fonts", siteType: ["Tech", "Awwwards"], license: "free", personality: "Mono com personality — letterforms distorcidas, retro-futurista" },
  { name: "Fira Code", source: "Google Fonts, dev", category: "mono", foundry: "Google Fonts", siteType: ["Dev", "Code"], license: "free", personality: "Mono com LIGATURES — != → ≠, => → ⇒, code poetry" },
  { name: "IBM Plex Mono", source: "IBM, Awwwards", category: "mono", foundry: "IBM (Google)", siteType: ["Enterprise", "Tech"], license: "free", personality: "Mono corporativa IBM — mais técnica/angular que JetBrains" },
  { name: "Commit Mono", source: "Awwwards dev, free", category: "mono", foundry: "Commit (free)", siteType: ["Dev", "Terminal"], license: "free", personality: "Mono slim/narrow — mais condensada que JetBrains, distinctive" },

  // ═══════════════════════════════════════════════════════════════
  // EXPANSÃO — Fontshare + Google Fonts premium (skill: Premium Free Font Curator)
  // ═══════════════════════════════════════════════════════════════
  { name: "Author", source: "Fontshare, Awwwards", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Premium"], license: "free", personality: "Sans-serif widish — mais larga que Inter, editorial premium" },
  { name: "Ranade", source: "Fontshare, Awwwards", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Editorial"], license: "free", personality: "Sans-serif angular — tech mas elegante, distinta de Satoshi" },
  { name: "Chillax", source: "Fontshare, Awwwards", category: "display", foundry: "Fontshare", siteType: ["Awwwards", "Friendly"], license: "free", personality: "Display relaxed — rounded, chill, para headings amigáveis" },
  { name: "Pally", source: "Fontshare, Awwwards", category: "sans", foundry: "Fontshare", siteType: ["Friendly", "Playful"], license: "free", personality: "Sans rounded bubbly — maximal friendly, para kids/playful" },
  { name: "Outfit", source: "Google Fonts, SaaS", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Modern"], license: "free", personality: "Geométrica universal — mais limpa que Plus Jakarta, SaaS ready" },
  { name: "Figtree", source: "Google Fonts, Awwwards", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Clean"], license: "free", personality: "Sans moderna clean — distinta de Inter, mais organic" },

  // ════════════════════════════════════════════════════════════════════════
  // EXPANSÃO 2026 — +150 fonts premium (Awwwards + Google + Fontshare)
  // ════════════════════════════════════════════════════════════════════════
  ...NEW_FONTS_2026,

  // ════════════════════════════════════════════════════════════════════════
  // SCRAPED FONTS — Extraídas de sites curados (BeFonts, Fontesk, FreeFaces, UseModify)
  // Todas free for commercial use. Organizadas por site de origem.
  // ════════════════════════════════════════════════════════════════════════
  ...SCRAPED_FONTS,
];

// Helper: filtrar fonts por categoria
export function getFontsByCategory(cat: FontDef["category"]): FontDef[] {
  return FONT_CATALOG.filter((f) => f.category === cat);
}

// Helper: filtrar fonts por tipo de site
export function getFontsBySiteType(siteType: string): FontDef[] {
  return FONT_CATALOG.filter((f) => f.siteType.includes(siteType));
}

// Helper: todas as fonts únicas (nomes)
export function getAllFontNames(): string[] {
  return [...new Set(FONT_CATALOG.map((f) => f.name))];
}

// Helper: buscar info de uma font
export function getFontInfo(name: string): FontDef | undefined {
  return FONT_CATALOG.find((f) => f.name === name);
}

// Helper: obter todos os sites/fondries únicos (para filtro por origem)
export function getAllFontSources(): string[] {
  const sources = new Set<string>();
  FONT_CATALOG.forEach((f) => {
    // Dividir source por vírgulas e adicionar cada parte
    f.source.split(",").forEach((s) => {
      const trimmed = s.trim();
      if (trimmed) sources.add(trimmed);
    });
    // Também adicionar foundry
    if (f.foundry) sources.add(f.foundry);
  });
  return Array.from(sources).sort();
}

// Helper: filtrar fonts por site/foundry de origem
export function getFontsBySource(source: string): FontDef[] {
  return FONT_CATALOG.filter(
    (f) =>
      f.source.toLowerCase().includes(source.toLowerCase()) ||
      f.foundry.toLowerCase().includes(source.toLowerCase())
  );
}

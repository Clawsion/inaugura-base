// ============================================================================
// font-catalog.ts — Catálogo de fonts REAIS verificadas (100+ fonts)
// ============================================================================
// Sources verificadas:
// - Fontshare API (https://api.fontshare.com/v2/fonts) — 100 families
// - Google Fonts (fonts.google.com) — mais populares 2026
// - Awwwards SOTD — fonts confirmadas em sites premiados
// - Sites reais: Vercel, Linear, Stripe, Resend, Cursor, Raycast, Notion
// ============================================================================
// Cada font tem:
// - name: nome da font (igual ao CSS font-family)
// - source: sites reais onde é usada ou foundry
// - category: sans | display | serif | mono
// - foundry: Google Fonts, Fontshare, Klim, Pangram, etc.
// - siteType: para que tipo de site é mais adequada
// ============================================================================

export interface FontDef {
  name: string;
  source: string;
  category: "sans" | "display" | "serif" | "mono";
  foundry: string;
  siteType: string[];
  // Alternativa gratuita (para fonts pagas) — free alternative com vibe similar
  freeAlternative?: string;
  // Se é paid ou free
  license?: "free" | "paid" | "freemium";
}

export const FONT_CATALOG: FontDef[] = [
  // ═══════════════════════════════════════════════════════════════
  // SANS-SERIF (UI/Body) — para SaaS, tech, dashboards, apps
  // ═══════════════════════════════════════════════════════════════
  { name: "Geist", source: "Vercel, Alephic", category: "sans", foundry: "Vercel (Google)", siteType: ["SaaS", "Tech", "Dev"] },
  { name: "Inter", source: "Linear, Raycast, Notion UI", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Tech", "UI"] },
  { name: "Satoshi", source: "Stripe, Resend, Awwwards", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Editorial", "Premium"] },
  { name: "General Sans", source: "Fontshare, editorial SaaS", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Editorial"] },
  { name: "Switzer", source: "SWIX, Awwwards sites", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Minimal"] },
  { name: "Plus Jakarta Sans", source: "Tokopedia, SaaS", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Friendly"] },
  { name: "DM Sans", source: "Google Fonts, SaaS", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Clean"] },
  { name: "Manrope", source: "Google Fonts, SaaS", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Modern"] },
  { name: "Figtree", source: "Google Fonts showcase", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Clean"] },
  { name: "Hanken Grotesk", source: "Hanken, Awwwards", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Editorial"] },
  { name: "Albert Sans", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Clean"] },
  { name: "Lexend", source: "Google Fonts (acessível)", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Accessible"] },
  { name: "Schibsted Grotesk", source: "Schibsted, Awwwards", category: "sans", foundry: "Google Fonts", siteType: ["Editorial", "Nordic"] },
  { name: "Onest", source: "Google Fonts, Awwwards", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Modern"] },
  { name: "Mona Sans", source: "GitHub, Figma brand", category: "sans", foundry: "GitHub (Google)", siteType: ["Dev", "SaaS"] },
  { name: "Hubot Sans", source: "GitHub", category: "sans", foundry: "GitHub (Google)", siteType: ["Dev", "SaaS"] },
  { name: "PP Neue Montreal", source: "Awwwards SOTD 2026 (demandespeciale)", category: "sans", foundry: "Pangram Pangram", siteType: ["Awwwards", "Premium", "Editorial"], license: "freemium", freeAlternative: "Inter (Google) — mesma中性grotesk vibe, free" },
  { name: "Aeonik", source: "CoType, premium SaaS", category: "sans", foundry: "CoType", siteType: ["SaaS", "Premium"], license: "paid", freeAlternative: "Geist (Vercel/Google) — geometric clean, free" },
  { name: "Söhne", source: "Stripe (confirmed typ.io)", category: "sans", foundry: "Klim Type Foundry", siteType: ["SaaS", "Premium", "Fintech"], license: "paid", freeAlternative: "Inter (Google) — a #1 free alternative ao Söhne, quase idêntica" },
  { name: "Poppins", source: "Google Fonts, popular", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Friendly", "E-commerce"] },
  { name: "Work Sans", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Clean"] },
  { name: "Nunito", source: "Google Fonts, friendly", category: "sans", foundry: "Google Fonts", siteType: ["Education", "Friendly"] },
  { name: "Public Sans", source: "Google Fonts, gov", category: "sans", foundry: "Google Fonts", siteType: ["Enterprise", "Gov"] },
  { name: "Fira Sans", source: "Google Fonts, Mozilla", category: "sans", foundry: "Google Fonts", siteType: ["Tech", "Dev"] },
  { name: "Asap", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Clean"] },
  { name: "Spline Sans", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["Tech", "Dev"] },
  { name: "Red Hat Display", source: "Red Hat, Google", category: "sans", foundry: "Google Fonts", siteType: ["Enterprise", "Tech"] },
  { name: "Merriweather Sans", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["Editorial", "Blog"] },
  { name: "Be Vietnam Pro", source: "Google Fonts, multilingual", category: "sans", foundry: "Google Fonts", siteType: ["Multilingual", "SaaS"] },
  { name: "Epilogue", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["SaaS", "Modern"] },
  { name: "Quicksand", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["Friendly", "Wellness"] },
  { name: "Bespoke Sans", source: "Fontshare, Awwwards", category: "sans", foundry: "Fontshare", siteType: ["Awwwards", "Premium"] },
  { name: "Bevellier", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Modern"] },
  { name: "Alpino", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Editorial"] },
  { name: "Amulya", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Clean"] },
  { name: "Author", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Editorial", "Premium"] },
  { name: "Gambetta", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Editorial", "Magazine"] },
  { name: "Ranade", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Clean"] },
  { name: "Nippo", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Minimal", "Swiss"] },
  { name: "Supreme", source: "Fontshare, streetwear", category: "sans", foundry: "Fontshare", siteType: ["Creative", "Bold"] },
  { name: "Plein", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Creative", "Bold"] },
  { name: "Stardom", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "Chillax", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Creative", "Friendly"] },
  { name: "Zina", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Editorial", "Modern"] },
  { name: "Synonym", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["SaaS", "Modern"] },
  { name: "Quilon", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Editorial", "Clean"] },
  { name: "Telma", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Creative", "Bold"] },
  { name: "Segment", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Tech", "Modern"] },
  { name: "Hoover", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "Pencerio", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Creative", "Premium"] },
  { name: "Roundo", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Friendly", "Wellness"] },
  { name: "Pally", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Friendly", "Playful"] },
  { name: "Kola", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Creative", "Bold"] },
  { name: "Neco", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "Pramukh Rounded", source: "Fontshare", category: "sans", foundry: "Fontshare", siteType: ["Friendly", "Wellness"] },
  { name: "Hind", source: "Google Fonts, multilingual", category: "sans", foundry: "Google Fonts", siteType: ["Multilingual"] },
  { name: "Rajdhani", source: "Google Fonts, tech", category: "sans", foundry: "Google Fonts", siteType: ["Tech", "Gaming"] },
  { name: "Khand", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["Tech", "Dev"] },
  { name: "Crimson Pro", source: "Google Fonts", category: "sans", foundry: "Google Fonts", siteType: ["Editorial", "Blog"] },
  { name: "Literata", source: "Google Fonts, editorial", category: "sans", foundry: "Google Fonts", siteType: ["Editorial", "Blog"] },

  // ═══════════════════════════════════════════════════════════════
  // DISPLAY/GROTESK (Headings) — para Awwwards, creative, bold
  // ═══════════════════════════════════════════════════════════════
  { name: "Cabinet Grotesk", source: "Fontshare, Awwwards", category: "display", foundry: "Fontshare", siteType: ["Awwwards", "Agency", "Premium"] },
  { name: "Clash Display", source: "Awwwards SOTD, Fontshare", category: "display", foundry: "Fontshare", siteType: ["Awwwards", "Bold", "Agency"] },
  { name: "Clash Grotesk", source: "Bureau Cool, Awwwards", category: "display", foundry: "Fontshare", siteType: ["Awwwards", "Agency"] },
  { name: "Outfit", source: "Google Fonts, SaaS", category: "display", foundry: "Google Fonts", siteType: ["SaaS", "Modern"] },
  { name: "Space Grotesk", source: "Google Fonts, tech", category: "display", foundry: "Google Fonts", siteType: ["Tech", "Dev", "Gaming"] },
  { name: "Sora", source: "Google Fonts, Awwwards", category: "display", foundry: "Google Fonts", siteType: ["Tech", "Modern"] },
  { name: "Syne", source: "Synesthésie MC, Google", category: "display", foundry: "Google Fonts", siteType: ["Awwwards", "Experimental", "Bold"] },
  { name: "Unbounded", source: "Google Fonts, Awwwards bold", category: "display", foundry: "Google Fonts", siteType: ["Awwwards", "Bold", "Display"] },
  { name: "Bricolage Grotesque", source: "Awwwards, Google", category: "display", foundry: "Google Fonts", siteType: ["Awwwards", "Trending", "Editorial"] },
  { name: "Archivo", source: "Google Fonts, Awwwards", category: "display", foundry: "Google Fonts", siteType: ["Editorial", "Display"] },
  { name: "Big Shoulders Display", source: "Google Fonts, bold", category: "display", foundry: "Google Fonts", siteType: ["Bold", "Display", "Poster"] },
  { name: "Anybody", source: "Google Fonts, Awwwards", category: "display", foundry: "Google Fonts", siteType: ["Creative", "Display"] },
  { name: "Anton", source: "Google Fonts, bold", category: "display", foundry: "Google Fonts", siteType: ["Bold", "Poster", "Headline"] },
  { name: "Bebas Neue", source: "Google Fonts, bold", category: "display", foundry: "Google Fonts", siteType: ["Bold", "Poster", "Headline"] },
  { name: "Oswald", source: "Google Fonts, condensed", category: "display", foundry: "Google Fonts", siteType: ["Bold", "Condensed", "Headline"] },
  { name: "Teko", source: "Google Fonts, condensed", category: "display", foundry: "Google Fonts", siteType: ["Tech", "Condensed"] },
  { name: "Boska", source: "Fontshare, Awwwards", category: "display", foundry: "Fontshare", siteType: ["Awwwards", "Display"] },
  { name: "Technor", source: "Fontshare, tech", category: "display", foundry: "Fontshare", siteType: ["Tech", "Display"] },
  { name: "Melodrama", source: "Fontshare, editorial", category: "display", foundry: "Fontshare", siteType: ["Editorial", "Display"] },
  { name: "Aktura", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "RX100", source: "Fontshare, tech", category: "display", foundry: "Fontshare", siteType: ["Tech", "Gaming"] },
  { name: "Zodiak", source: "Fontshare, editorial", category: "display", foundry: "Fontshare", siteType: ["Editorial", "Display"] },
  { name: "Stardom", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "Tanker", source: "Fontshare, bold", category: "display", foundry: "Fontshare", siteType: ["Bold", "Display"] },
  { name: "Expose", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "Sharpie", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Handwritten"] },
  { name: "New Title", source: "Fontshare, editorial", category: "display", foundry: "Fontshare", siteType: ["Editorial", "Display"] },
  { name: "Gambarino", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "Striper", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "Boxing", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Bold"] },
  { name: "Kihim", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "Rowan", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Editorial", "Display"] },
  { name: "Sentient", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Awwwards", "Display"] },
  { name: "Paquito", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Bold"] },
  { name: "Rosaline", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "Styro", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "Pilcrow Rounded", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Friendly", "Display"] },
  { name: "Kohinoor Zerone", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Tech", "Display"] },
  { name: "Chubbo", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Friendly", "Display"] },
  { name: "Comico", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Playful"] },
  { name: "Tabular", source: "Fontshare, tech", category: "display", foundry: "Fontshare", siteType: ["Tech", "Dev"] },
  { name: "Panchang", source: "Fontshare, multilingual", category: "display", foundry: "Fontshare", siteType: ["Multilingual", "Display"] },
  { name: "Trench Slab", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Editorial", "Display"] },
  { name: "Array", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Tech", "Display"] },
  { name: "Britney", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Bold"] },
  { name: "Bonny", source: "Fontshare", category: "display", foundry: "Fontshare", siteType: ["Creative", "Display"] },

  // ═══════════════════════════════════════════════════════════════
  // SERIF (Editorial/Premium) — para magazines, luxury, editorial
  // ═══════════════════════════════════════════════════════════════
  { name: "Fraunces", source: "Google Fonts, Awwwards", category: "serif", foundry: "Google Fonts", siteType: ["Editorial", "Magazine", "Premium"] },
  { name: "Newsreader", source: "Google Fonts, editorial", category: "serif", foundry: "Google Fonts", siteType: ["Editorial", "Blog"] },
  { name: "Instrument Serif", source: "Instrument, Awwwards", category: "serif", foundry: "Instrument (Google)", siteType: ["Editorial", "Premium", "Stripe"] },
  { name: "Lyon", source: "Notion marketing (confirmed)", category: "serif", foundry: "Commercial Type", siteType: ["Editorial", "Luxury", "Premium"], license: "paid", freeAlternative: "Playfair Display (Google) — serif elegante luxury, free" },
  { name: "GT Sectra", source: "Awwwards editorial, Klim", category: "serif", foundry: "Grilli Type", siteType: ["Editorial", "Luxury"], license: "paid", freeAlternative: "Fraunces (Google) — serif variable premium, free" },
  { name: "Tiempos Text", source: "Awwwards editorial, Klim", category: "serif", foundry: "Klim Type Foundry", siteType: ["Editorial", "Magazine"], license: "paid", freeAlternative: "Newsreader (Google) — editorial serif clean, free" },
  { name: "Lora", source: "Google Fonts, editorial", category: "serif", foundry: "Google Fonts", siteType: ["Editorial", "Blog"] },
  { name: "Playfair Display", source: "Google Fonts, luxury", category: "serif", foundry: "Google Fonts", siteType: ["Luxury", "Editorial", "Fashion"] },
  { name: "Merriweather", source: "Google Fonts, editorial", category: "serif", foundry: "Google Fonts", siteType: ["Editorial", "Blog"] },
  { name: "Cormorant Garamond", source: "Google Fonts, luxury", category: "serif", foundry: "Google Fonts", siteType: ["Luxury", "Fashion", "Editorial"] },
  { name: "Bespoke Serif", source: "Fontshare, Awwwards", category: "serif", foundry: "Fontshare", siteType: ["Awwwards", "Premium"] },
  { name: "Erode", source: "Fontshare, editorial", category: "serif", foundry: "Fontshare", siteType: ["Editorial", "Premium"] },
  { name: "Recia", source: "Fontshare", category: "serif", foundry: "Fontshare", siteType: ["Editorial", "Display"] },
  { name: "Bespoke Slab", source: "Fontshare", category: "serif", foundry: "Fontshare", siteType: ["Editorial", "Display"] },
  { name: "Bespoke Stencil", source: "Fontshare", category: "serif", foundry: "Fontshare", siteType: ["Creative", "Display"] },
  { name: "Karma", source: "Google Fonts, editorial", category: "serif", foundry: "Google Fonts", siteType: ["Editorial", "Blog"] },
  { name: "Dancing Script", source: "Google Fonts, script", category: "serif", foundry: "Google Fonts", siteType: ["Creative", "Handwritten"] },
  { name: "Kalam", source: "Google Fonts, handwritten", category: "serif", foundry: "Google Fonts", siteType: ["Creative", "Handwritten"] },

  // ═══════════════════════════════════════════════════════════════
  // MONO (Developer/Terminal) — para dev tools, code, terminal
  // ═══════════════════════════════════════════════════════════════
  { name: "Geist Mono", source: "Vercel, Awwwards dev", category: "mono", foundry: "Vercel (Google)", siteType: ["Dev", "Tech", "SaaS"] },
  { name: "JetBrains Mono", source: "JetBrains, Cursor", category: "mono", foundry: "JetBrains (Google)", siteType: ["Dev", "Tech", "Code"] },
  { name: "Space Mono", source: "Google Fonts, Awwwards", category: "mono", foundry: "Google Fonts", siteType: ["Tech", "Awwwards"] },
  { name: "Fira Code", source: "Google Fonts, dev", category: "mono", foundry: "Google Fonts", siteType: ["Dev", "Code"] },
  { name: "IBM Plex Mono", source: "IBM, Awwwards", category: "mono", foundry: "IBM (Google)", siteType: ["Enterprise", "Tech"] },
  { name: "Berkeley Mono", source: "Terminal.dev, premium", category: "mono", foundry: "Berkeley Graphics", siteType: ["Dev", "Premium", "Terminal"], license: "paid", freeAlternative: "JetBrains Mono (Google) — mono premium free, top choice" },
  { name: "Commit Mono", source: "Awwwards dev, free", category: "mono", foundry: "Commit (free)", siteType: ["Dev", "Terminal"], license: "free" },
  { name: "Azeret Mono", source: "Google Fonts", category: "mono", foundry: "Google Fonts", siteType: ["Tech", "Dev"] },
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

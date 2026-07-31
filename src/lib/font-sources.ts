// ============================================================================
// font-sources.ts — 10 sites curados para encontrar fonts
// ============================================================================
// Cada site tem: nome, URL, descrição, tipo de licença comum, e filtros
// suportados (para o nosso filter input na UI).
// ============================================================================

export interface FontSource {
  id: string;
  name: string;
  url: string;
  description: string;
  license: "Free" | "Free + Paid" | "Paid" | "Open Source";
  filters: string[]; // tags que combinam com o nosso filter input
  badge?: string; // destaque (ex: "Popular", "Dev Favorite")
}

export const FONT_SOURCES: FontSource[] = [
  {
    id: "google-fonts",
    name: "Google Fonts",
    url: "https://fonts.google.com",
    description:
      "A maior biblioteca gratuita do mundo. 1.500+ familias, API simples, integração direta com Next.js.",
    license: "Free",
    filters: ["gratuito", "web", "api", "latin", "variable", "popular", "nextjs"],
    badge: "Popular",
  },
  {
    id: "fontshare",
    name: "Fontshare",
    url: "https://www.fontshare.com",
    description:
      "Indian Type Foundry — fonts premium gratuitas para uso pessoal e comercial. Qualidade alta, curadoria forte.",
    license: "Free",
    filters: ["gratuito", "premium", "display", "serif", "sans", "curated"],
    badge: "Dev Favorite",
  },
  {
    id: "fontesk",
    name: "Fontesk",
    url: "https://fontesk.com",
    description:
      "Diretório curado com 12.000+ fonts. Filtros avançados por peso, estilo, licença e suporte multilingue.",
    license: "Free + Paid",
    filters: ["diretório", "filtros", "multilingue", "licença"],
  },
  {
    id: "adobe-fonts",
    name: "Adobe Fonts",
    url: "https://fonts.adobe.com",
    description:
      "Antigo Typekit. 25.000+ fonts premium incluídas no Creative Cloud. Sincronização com projetos Adobe.",
    license: "Paid",
    filters: ["premium", "creative-cloud", "typekit", "profissional"],
    badge: "Premium",
  },
  {
    id: "font-squirrel",
    name: "Font Squirrel",
    url: "https://www.fontsquirrel.com",
    description:
      "100% grátis para uso comercial. Ferramenta Webfont Generator para converter fonts em todos os formatos.",
    license: "Free",
    filters: ["gratuito", "comercial", "converter", "webfont", "generator"],
  },
  {
    id: "dafont",
    name: "DaFont",
    url: "https://www.dafont.com",
    description:
      "Maior arquivo de fonts decorativas e temáticas. Boa para títulos criativos e fonts de display únicas.",
    license: "Free + Paid",
    filters: ["decorativas", "display", "temáticas", "criativas"],
  },
  {
    id: "behance-fonts",
    name: "Behance Fonts",
    url: "https://www.behance.net/search?search=free+font",
    description:
      "Fonts gratuitas publicadas pela comunidade de designers. Casos de uso reais e mockups incluídos.",
    license: "Free",
    filters: ["comunidade", "designers", "mockups", "cases"],
  },
  {
    id: "befonts",
    name: "Befonts",
    url: "https://befonts.com",
    description:
      "Fonts premium gratuitas para uso pessoal e comercial. Atualizações semanais com novos lançamentos.",
    license: "Free",
    filters: ["gratuito", "premium", "lançamentos", "semanal"],
  },
  {
    id: "fontspace",
    name: "Fontspace",
    url: "https://www.fontspace.com",
    description:
      "110.000+ fonts de designers independentes. Licenças claramente identificadas, preview em tempo real.",
    license: "Free + Paid",
    filters: ["independentes", "licenças", "preview", "grande-arquivo"],
  },
  {
    id: "1001fonts",
    name: "1001 Fonts",
    url: "https://www.1001fonts.com",
    description:
      "Curadoria com categorias claras (sans, serif, script, mono). Filtros por tema, popularidade e data.",
    license: "Free + Paid",
    filters: ["categorias", "tema", "popularidade", "filtros"],
  },
];

// Lista de filtros únicos para sugerir como chips
export const FONT_FILTER_SUGGESTIONS = [
  "gratuito",
  "premium",
  "variable",
  "display",
  "serif",
  "sans",
  "mono",
  "comercial",
  "comunidade",
  "popular",
];

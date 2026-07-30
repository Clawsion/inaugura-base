// ============================================================================
// perfect-combo.ts — Algoritmo de matching font + cor + skin
// ============================================================================
// Gera combinações perfeitas (font + paleta + skin) com base em:
//  - Nicho detetado / tipo de site
//  - Compatibilidade tipográfica (heading + body + mono)
//  - Harmonia cromática (roles: bg, card, text, accent, muted)
//  - Estilo visual recomendado (qual skin funciona melhor)
// ============================================================================

import type { FontInfo } from "./fonts-modernas";
import { getTopAwwwardsFonts } from "./top-awwwards-fonts";
import type { Skin } from "./skins";
import { SKINS } from "./skins";

export interface PerfectCombo {
  id: string;
  nome: string;
  descricao: string;
  estilos: string[]; // ["brutalist", "minimal", "traditional", "vintage"]
  fonts: {
    heading: FontInfo;
    body: FontInfo;
    mono?: FontInfo;
  };
  paleta: {
    bg: string;
    card: string;
    text: string;
    accent: string;
    muted: string;
  };
  skin: Skin;
  razao: string; // porquê esta combo
}

// ============================================================================
// Algoritmo: para cada estilo, define font + paleta + skin compatíveis
// ============================================================================
export function generatePerfectCombos(): PerfectCombo[] {
  const topFonts = getTopAwwwardsFonts();
  const find = (family: string) => topFonts.find((f) => f.family === family) ?? topFonts[0];

  return [
    // ── 1. MODERN MINIMAL (Linear/Vercel/Stripe style) ────────────────────
    {
      id: "modern-minimal",
      nome: "Modern Minimal",
      descricao: "Limpo, técnico, confiável. Para SaaS B2B, dashboards, dev tools.",
      estilos: ["minimal", "tech", "clean"],
      fonts: {
        heading: find("Geist"),
        body: find("Inter"),
        mono: find("Geist Mono"),
      },
      paleta: {
        bg: "#08080A",
        card: "#131316",
        text: "#FAFAFC",
        accent: "#00FFB2",
        muted: "#9CA3AF",
      },
      skin: SKINS.find((s) => s.id === "mono-carbon") ?? SKINS[0],
      razao: "Geist + Inter é o stack moderno padrão da Vercel/Linear. Verde neon sobre preto = tech premium.",
    },

    // ── 2. EDITORIAL LUXURY (magazine, premium brands) ────────────────────
    {
      id: "editorial-luxury",
      nome: "Editorial Luxury",
      descricao: "Sofisticado, magazine-style. Para marcas premium, fashion, imobiliário de luxo.",
      estilos: ["traditional", "editorial", "luxury"],
      fonts: {
        heading: find("Fraunces"),
        body: find("Newsreader"),
        mono: find("IBM Plex Mono"),
      },
      paleta: {
        bg: "#1A1714",
        card: "#25221E",
        text: "#F2EBDD",
        accent: "#E08070",
        muted: "#A89E8E",
      },
      skin: SKINS.find((s) => s.id === "editorial-serif") ?? SKINS[0],
      razao: "Fraunces + Newsreader = hierarquia editorial clássica. Tons terracota/cream sobre couro escuro = luxury timeless.",
    },

    // ── 3. NEO-BRUTALIST PLAYFUL (agências criativas, startups) ───────────
    {
      id: "neo-brutalist",
      nome: "Neo-Brutalist",
      descricao: "Ousado, divertido, memorável. Para agências, portfólios, startups criativas.",
      estilos: ["brutalist", "playful", "bold"],
      fonts: {
        heading: find("Clash Display"),
        body: find("Satoshi"),
        mono: find("Space Mono"),
      },
      paleta: {
        bg: "#0A0A0A",
        card: "#1A1A1A",
        text: "#FFFFFF",
        accent: "#39FF14",
        muted: "#9CA3AF",
      },
      skin: SKINS.find((s) => s.id === "brutalist-ink") ?? SKINS[0],
      razao: "Clash Display + Satoshi = stack awwwards 2024. Verde fluorescente sobre preto + bordas brancas = impacto brutalist.",
    },

    // ── 4. WARM VINTAGE (artisanal, coffee, lifestyle) ────────────────────
    {
      id: "warm-vintage",
      nome: "Warm Vintage",
      descricao: "Caloroso, nostálgico, artesanal. Para cafés, marcas artesanais, lifestyle.",
      estilos: ["vintage", "warm", "artisanal"],
      fonts: {
        heading: find("Cormorant"),
        body: find("Lora"),
        mono: find("JetBrains Mono"),
      },
      paleta: {
        bg: "#FAF6EF",
        card: "#FFFFFF",
        text: "#1A1A1A",
        accent: "#8B1A1A",
        muted: "#6B6258",
      },
      skin: SKINS.find((s) => s.id === "editorial-serif") ?? SKINS[0],
      razao: "Cormorant + Lora = serifa vintage clássica. Vermelho bordô sobre creme = warmth artesanal.",
    },

    // ── 5. PURE LIGHT APPLE (Apple/Notion style) ──────────────────────────
    {
      id: "pure-light-apple",
      nome: "Pure Light Apple",
      descricao: "Limpo, arejado, premium light. Para produtos Apple-like, SaaS premium.",
      estilos: ["minimal", "light", "apple"],
      fonts: {
        heading: find("Plus Jakarta Sans"),
        body: find("Inter"),
        mono: find("JetBrains Mono"),
      },
      paleta: {
        bg: "#FFFFFF",
        card: "#FAFAFC",
        text: "#0F172A",
        accent: "#2563EB",
        muted: "#64748B",
      },
      skin: SKINS.find((s) => s.id === "pure-light") ?? SKINS[0],
      razao: "Plus Jakarta + Inter = stack moderno limpo. Azul cobalto sobre branco = Apple/Notion airy premium.",
    },

    // ── 6. CYBERPUNK GAMING (gaming, crypto, web3) ────────────────────────
    {
      id: "cyberpunk-gaming",
      nome: "Cyberpunk Gaming",
      descricao: "Neon, futurista, high-energy. Para gaming, crypto, web3, fintech disruptivo.",
      estilos: ["cyberpunk", "neon", "futuristic"],
      fonts: {
        heading: find("Space Grotesk"),
        body: find("Space Grotesk"),
        mono: find("JetBrains Mono"),
      },
      paleta: {
        bg: "#050505",
        card: "#1A1A1A",
        text: "#FFFFFF",
        accent: "#00FFB2",
        muted: "#888888",
      },
      skin: SKINS.find((s) => s.id === "neo-brutalist-3d") ?? SKINS[0],
      razao: "Space Grotesk = tech aesthetic awwwards. Verde neon + magenta em camadas 3D = cyberpunk energy.",
    },

    // ── 7. MONO INK LITERARY (blogs, publications, writers) ───────────────
    {
      id: "mono-ink-literary",
      nome: "Mono Ink Literary",
      descricao: "Literário, atemporal, focado em texto. Para blogs, publicações, writers.",
      estilos: ["traditional", "literary", "minimal"],
      fonts: {
        heading: find("Instrument Serif"),
        body: find("Spectral"),
        mono: find("Cousine"),
      },
      paleta: {
        bg: "#FAF7F0",
        card: "#FFFFFF",
        text: "#0A0A0A",
        accent: "#0A0A0A",
        muted: "#6B6B6B",
      },
      skin: SKINS.find((s) => s.id === "mono-ink") ?? SKINS[0],
      razao: "Instrument Serif + Spectral = readable literary perfection. Tinta sobre creme = atemporal como livros.",
    },

    // ── 8. BENTO MODERN (Apple-style bento, product showcases) ────────────
    {
      id: "bento-modern",
      nome: "Bento Modern",
      descricao: "Estruturado, visualmente rico. Para product showcases, features, Apple-style.",
      estilos: ["minimal", "bento", "structured"],
      fonts: {
        heading: find("Bricolage Grotesque"),
        body: find("DM Sans"),
        mono: find("Geist Mono"),
      },
      paleta: {
        bg: "#08080A",
        card: "#131316",
        text: "#FAFAFC",
        accent: "#00FFB2",
        muted: "#9CA3AF",
      },
      skin: SKINS.find((s) => s.id === "mono-carbon") ?? SKINS[0],
      razao: "Bricolage Grotesque + DM Sans = bento grid aesthetic. Verde neon sobre carbon = moderno estruturado.",
    },
  ];
}

// Helper: get combo by id
export function getComboById(id: string): PerfectCombo | undefined {
  return generatePerfectCombos().find((c) => c.id === id);
}

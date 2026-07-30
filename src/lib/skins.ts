// ============================================================================
// skins.ts — 5 SKINS DE VERDADE (sem Glass Aurora, com Mono Ink)
// ============================================================================
// Ordem para caberem numa linha: Mono Ink → Brutalist Ink → Editorial Serif →
// Neo Brutalist 3D → Mono Carbon
// ============================================================================

export interface SkinTokens {
  bg: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
  radius: string;
  shadow: string;
  headingFont: string;
  bodyFont: string;
  bgPattern?: string;
  effectClass?: string;
}

export type SkinCategory =
  | "Mono"
  | "Brutalist"
  | "Editorial"
  | "3D"
  | "Carbon";

export interface Skin {
  id: string;
  name: string;
  description: string;
  category: SkinCategory;
  dark: SkinTokens;
  light: SkinTokens;
}

export const SKINS: Skin[] = [
  // ── 1. Mono Ink ────────────────────────────────────────────────────────
  // Pure ink on cream. Literary, timeless. Light = paper, Dark = deep ink.
  {
    id: "mono-ink",
    name: "Mono Ink",
    description: "Pure ink on cream, literary calm",
    category: "Mono",
    light: {
      bg: "#FAF7F0",
      card: "#FFFFFF",
      text: "#0A0A0A",
      muted: "#6B6B6B",
      accent: "#0A0A0A",
      border: "#0A0A0A",
      radius: "0px",
      shadow: "none",
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "Georgia, 'Times New Roman', serif",
      bgPattern: "radial-gradient(circle at 30% 20%, rgba(10,10,10,0.02) 0%, transparent 60%)",
    },
    dark: {
      bg: "#0A0A0A",
      card: "#161616",
      text: "#FAF7F0",
      muted: "#8C8C8C",
      accent: "#FAF7F0",
      border: "#FAF7F0",
      radius: "0px",
      shadow: "none",
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "Georgia, 'Times New Roman', serif",
      bgPattern: "radial-gradient(circle at 30% 20%, rgba(250,247,240,0.03) 0%, transparent 60%)",
    },
  },

  // ── 2. Brutalist Ink ───────────────────────────────────────────────────
  {
    id: "brutalist-ink",
    name: "Brutalist Ink",
    description: "Hard edges, raw offset shadows, monospace",
    category: "Brutalist",
    light: {
      bg: "#FFFEF0",
      card: "#FFFFFF",
      text: "#000000",
      muted: "#444444",
      accent: "#1A00E6",
      border: "#000000",
      radius: "0px",
      shadow: "5px 5px 0px #000000",
      headingFont: "var(--font-mono), ui-monospace, monospace",
      bodyFont: "var(--font-mono), ui-monospace, monospace",
      bgPattern: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.02) 20px, rgba(0,0,0,0.02) 21px)",
    },
    dark: {
      bg: "#0A0A0A",
      card: "#161616",
      text: "#FFFFFF",
      muted: "#8C8C8C",
      accent: "#EBFF00",
      border: "#FFFFFF",
      radius: "0px",
      shadow: "5px 5px 0px #FFFFFF",
      headingFont: "var(--font-mono), ui-monospace, monospace",
      bodyFont: "var(--font-mono), ui-monospace, monospace",
      bgPattern: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px)",
    },
  },

  // ── 3. Editorial Serif ─────────────────────────────────────────────────
  {
    id: "editorial-serif",
    name: "Editorial Serif",
    description: "Magazine luxury, serif authority, paper texture",
    category: "Editorial",
    light: {
      bg: "#FAF6EF",
      card: "#FFFFFF",
      text: "#1A1A1A",
      muted: "#6B6258",
      accent: "#8B1A1A",
      border: "#E0D7C8",
      radius: "0px",
      shadow: "0 1px 3px rgba(26, 26, 26, 0.07)",
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "var(--font-inter), Georgia, serif",
      bgPattern: "radial-gradient(circle at 20% 30%, rgba(139,26,26,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(107,98,88,0.04) 0%, transparent 50%)",
    },
    dark: {
      bg: "#1A1714",
      card: "#25221E",
      text: "#F2EBDD",
      muted: "#A89E8E",
      accent: "#E08070",
      border: "#3A352E",
      radius: "0px",
      shadow: "0 2px 6px rgba(0, 0, 0, 0.45)",
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "var(--font-inter), Georgia, serif",
      bgPattern: "radial-gradient(circle at 20% 30%, rgba(224,128,112,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(168,158,142,0.04) 0%, transparent 50%)",
    },
  },

  // ── 4. Neo Brutalist 3D ────────────────────────────────────────────────
  {
    id: "neo-brutalist-3d",
    name: "Neo Brutalist 3D",
    description: "Faux 3D shadows, extreme contrast, layered depth",
    category: "3D",
    light: {
      bg: "#FFFFFF",
      card: "#FFE600",
      text: "#000000",
      muted: "#5C5C5C",
      accent: "#FF3366",
      border: "#000000",
      radius: "1rem",
      shadow: "6px 6px 0px #000000, 12px 12px 0px #FF3366, 18px 18px 24px rgba(0,0,0,0.2)",
      headingFont: "var(--font-jakarta), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
      bgPattern: "linear-gradient(135deg, #FFFFFF 0%, #FFFAE6 100%)",
    },
    dark: {
      bg: "#050505",
      card: "#1A1A1A",
      text: "#FFFFFF",
      muted: "#888888",
      accent: "#00FFB2",
      border: "#FFFFFF",
      radius: "1rem",
      shadow: "6px 6px 0px #00FFB2, 12px 12px 0px #FF00AA, 18px 18px 32px rgba(0,255,178,0.25)",
      headingFont: "var(--font-jakarta), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
      bgPattern: "linear-gradient(135deg, #050505 0%, #0D0D1A 100%)",
    },
  },

  // ── 5. Mono Carbon ─────────────────────────────────────────────────────
  {
    id: "mono-carbon",
    name: "Mono Carbon",
    description: "Carbon fiber pattern, electric lime, tech minimal",
    category: "Carbon",
    light: {
      bg: "#F2F2F2",
      card: "#FFFFFF",
      text: "#0A0A0A",
      muted: "#5C5C5C",
      accent: "#84CC16",
      border: "rgba(0, 0, 0, 0.10)",
      radius: "0.5rem",
      shadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      headingFont: "var(--font-geist-sans), system-ui, sans-serif",
      bodyFont: "var(--font-geist-sans), system-ui, sans-serif",
      bgPattern: "repeating-linear-gradient(45deg, #F2F2F2 0px, #F2F2F2 2px, #E8E8E8 2px, #E8E8E8 4px), repeating-linear-gradient(-45deg, transparent 0px, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)",
    },
    dark: {
      bg: "#0A0A0A",
      card: "#161616",
      text: "#F2F2F2",
      muted: "#7C7C7C",
      accent: "#A3E635",
      border: "rgba(163, 230, 53, 0.18)",
      radius: "0.5rem",
      shadow: "0 0 12px rgba(163, 230, 53, 0.12)",
      headingFont: "var(--font-geist-sans), system-ui, sans-serif",
      bodyFont: "var(--font-geist-sans), system-ui, sans-serif",
      bgPattern: "repeating-linear-gradient(45deg, #0A0A0A 0px, #0A0A0A 2px, #141414 2px, #141414 4px), repeating-linear-gradient(-45deg, transparent 0px, transparent 2px, rgba(163,230,53,0.03) 2px, rgba(163,230,53,0.03) 4px)",
    },
  },
];

export function getSkinById(id: string): Skin | undefined {
  return SKINS.find((s) => s.id === id);
}

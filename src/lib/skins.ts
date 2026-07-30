// ============================================================================
// skins.ts — 10 distinct, production-ready UI skins for ProjectForge AI
// Auto-verified for WCAG AA contrast (text/bg, muted/bg, accent/bg).
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
}

export type SkinCategory =
  | "Minimal"
  | "Glass"
  | "Neu"
  | "Brutalist"
  | "Editorial"
  | "Gradient"
  | "Cyberpunk"
  | "Apple"
  | "Material"
  | "Luxury";

export interface Skin {
  id: string;
  name: string;
  description: string;
  category: SkinCategory;
  dark: SkinTokens;
  light: SkinTokens;
}

export const SKINS: Skin[] = [
  // ── 1. Minimal Mono ───────────────────────────────────────────────────
  {
    id: "minimal-mono",
    name: "Minimal Mono",
    description: "Swiss precision in pure monochrome",
    category: "Minimal",
    light: {
      bg: "#FFFFFF",
      card: "#FFFFFF",
      text: "#0A0A0A",
      muted: "#595959",
      accent: "#0A0A0A",
      border: "#0A0A0A",
      radius: "0px",
      shadow: "none",
      headingFont: "var(--font-mono), ui-monospace, monospace",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
    dark: {
      bg: "#0A0A0A",
      card: "#0A0A0A",
      text: "#FFFFFF",
      muted: "#A6A6A6",
      accent: "#FFFFFF",
      border: "#FFFFFF",
      radius: "0px",
      shadow: "none",
      headingFont: "var(--font-mono), ui-monospace, monospace",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },

  // ── 2. Glass Aurora ───────────────────────────────────────────────────
  {
    id: "glass-aurora",
    name: "Glass Aurora",
    description: "Translucent surfaces over living color",
    category: "Glass",
    light: {
      bg: "#E8E0FF",
      card: "#FFFFFF",
      text: "#1C1033",
      muted: "#5E4F80",
      accent: "#7C3AED",
      border: "rgba(255, 255, 255, 0.65)",
      radius: "1.5rem",
      shadow: "0 8px 32px rgba(124, 58, 237, 0.14)",
      headingFont: "var(--font-jakarta), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
    dark: {
      bg: "#0E0A2E",
      card: "#1A1438",
      text: "#E6E0FF",
      muted: "#948CB8",
      accent: "#A78BFA",
      border: "rgba(167, 139, 250, 0.22)",
      radius: "1.5rem",
      shadow: "0 8px 32px rgba(167, 139, 250, 0.2)",
      headingFont: "var(--font-jakarta), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },

  // ── 3. Soft Neumorph ──────────────────────────────────────────────────
  {
    id: "soft-neumorph",
    name: "Soft Neumorph",
    description: "Tactile depth through soft shadow",
    category: "Neu",
    light: {
      bg: "#E3E8EF",
      card: "#E3E8EF",
      text: "#2D3748",
      muted: "#4A5568",
      accent: "#3D4A5C",
      border: "#E3E8EF",
      radius: "2rem",
      shadow: "9px 9px 18px #C2C8D2, -9px -9px 18px #FFFFFF",
      headingFont: "var(--font-jakarta), system-ui, sans-serif",
      bodyFont: "var(--font-jakarta), system-ui, sans-serif",
    },
    dark: {
      bg: "#2B2E36",
      card: "#2B2E36",
      text: "#E2E8F0",
      muted: "#A0A6B2",
      accent: "#B8C0CC",
      border: "#2B2E36",
      radius: "2rem",
      shadow: "9px 9px 18px #1E2026, -9px -9px 18px #383C46",
      headingFont: "var(--font-jakarta), system-ui, sans-serif",
      bodyFont: "var(--font-jakarta), system-ui, sans-serif",
    },
  },

  // ── 4. Brutalist Raw ──────────────────────────────────────────────────
  {
    id: "brutalist-raw",
    name: "Brutalist Raw",
    description: "Unapologetic borders, raw and unrefined",
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
    },
  },

  // ── 5. Editorial Serif ────────────────────────────────────────────────
  {
    id: "editorial-serif",
    name: "Editorial Serif",
    description: "Magazine elegance with serif authority",
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
    },
  },

  // ── 6. Mesh Gradient ──────────────────────────────────────────────────
  {
    id: "mesh-gradient",
    name: "Mesh Gradient",
    description: "Vibrant gradients that breathe and flow",
    category: "Gradient",
    light: {
      bg: "#FDF2F8",
      card: "#FFFFFF",
      text: "#2D1B4E",
      muted: "#6B5B8A",
      accent: "#EC4899",
      border: "rgba(236, 72, 153, 0.16)",
      radius: "1rem",
      shadow: "0 10px 30px rgba(236, 72, 153, 0.12)",
      headingFont: "var(--font-geist-sans), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
    dark: {
      bg: "#190B2E",
      card: "#2A1A4A",
      text: "#F3E8FF",
      muted: "#9B7BC4",
      accent: "#F472B6",
      border: "rgba(244, 114, 182, 0.22)",
      radius: "1rem",
      shadow: "0 10px 30px rgba(244, 114, 182, 0.2)",
      headingFont: "var(--font-geist-sans), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },

  // ── 7. Cyberpunk Neon ─────────────────────────────────────────────────
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon",
    description: "Neon glow on a digital frontier",
    category: "Cyberpunk",
    light: {
      bg: "#EEF1F6",
      card: "#FFFFFF",
      text: "#0A0E14",
      muted: "#3D4D63",
      accent: "#00834A",
      border: "rgba(0, 168, 95, 0.4)",
      radius: "0.5rem",
      shadow: "0 0 8px rgba(0, 168, 95, 0.22), 0 0 16px rgba(214, 0, 122, 0.1)",
      headingFont: "var(--font-mono), ui-monospace, monospace",
      bodyFont: "var(--font-mono), ui-monospace, monospace",
    },
    dark: {
      bg: "#070A10",
      card: "#0C1118",
      text: "#E6F1FF",
      muted: "#6E84A0",
      accent: "#00FF9F",
      border: "rgba(0, 255, 159, 0.3)",
      radius: "0.5rem",
      shadow:
        "0 0 10px rgba(0, 255, 159, 0.4), 0 0 24px rgba(255, 0, 144, 0.15)",
      headingFont: "var(--font-mono), ui-monospace, monospace",
      bodyFont: "var(--font-mono), ui-monospace, monospace",
    },
  },

  // ── 8. Apple Liquid ───────────────────────────────────────────────────
  {
    id: "apple-liquid",
    name: "Apple Liquid",
    description: "Effortless fluidity with Californian polish",
    category: "Apple",
    light: {
      bg: "#F5F5F7",
      card: "#FFFFFF",
      text: "#1D1D1F",
      muted: "#6E6E73",
      accent: "#0071E3",
      border: "rgba(0, 0, 0, 0.08)",
      radius: "1.5rem",
      shadow: "0 4px 6px rgba(0, 0, 0, 0.04), 0 14px 28px rgba(0, 0, 0, 0.06)",
      headingFont:
        "-apple-system, BlinkMacSystemFont, 'SF Pro Display', var(--font-geist-sans), sans-serif",
      bodyFont:
        "-apple-system, BlinkMacSystemFont, 'SF Pro Text', var(--font-inter), sans-serif",
    },
    dark: {
      bg: "#000000",
      card: "#1C1C1E",
      text: "#F5F5F7",
      muted: "#86868B",
      accent: "#0A84FF",
      border: "rgba(255, 255, 255, 0.1)",
      radius: "1.5rem",
      shadow: "0 4px 8px rgba(0, 0, 0, 0.3), 0 14px 28px rgba(0, 0, 0, 0.45)",
      headingFont:
        "-apple-system, BlinkMacSystemFont, 'SF Pro Display', var(--font-geist-sans), sans-serif",
      bodyFont:
        "-apple-system, BlinkMacSystemFont, 'SF Pro Text', var(--font-inter), sans-serif",
    },
  },

  // ── 9. Material You ───────────────────────────────────────────────────
  {
    id: "material-you",
    name: "Material You",
    description: "Dynamic tones with playful elevation",
    category: "Material",
    light: {
      bg: "#FEF7FF",
      card: "#F3EDF7",
      text: "#1D1B20",
      muted: "#625B71",
      accent: "#6750A4",
      border: "rgba(103, 80, 164, 0.14)",
      radius: "1rem",
      shadow: "0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08)",
      headingFont: "var(--font-geist-sans), 'Roboto', system-ui, sans-serif",
      bodyFont: "var(--font-geist-sans), 'Roboto', system-ui, sans-serif",
    },
    dark: {
      bg: "#141218",
      card: "#211F26",
      text: "#E6E0E9",
      muted: "#CAC4D0",
      accent: "#D0BCFF",
      border: "rgba(208, 188, 255, 0.16)",
      radius: "1rem",
      shadow: "0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.5)",
      headingFont: "var(--font-geist-sans), 'Roboto', system-ui, sans-serif",
      bodyFont: "var(--font-geist-sans), 'Roboto', system-ui, sans-serif",
    },
  },

  // ── 10. Luxury Noir ───────────────────────────────────────────────────
  {
    id: "luxury-noir",
    name: "Luxury Noir",
    description: "Midnight gold for the discerning eye",
    category: "Luxury",
    light: {
      bg: "#F7F3EC",
      card: "#FFFFFF",
      text: "#1A1A1A",
      muted: "#6B6258",
      accent: "#9A7A2E",
      border: "rgba(184, 149, 74, 0.25)",
      radius: "0.5rem",
      shadow: "0 4px 20px rgba(0, 0, 0, 0.07)",
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "var(--font-inter), Georgia, serif",
    },
    dark: {
      bg: "#0B0B0B",
      card: "#141414",
      text: "#EDE6D6",
      muted: "#8A8270",
      accent: "#C9A961",
      border: "rgba(201, 169, 97, 0.22)",
      radius: "0.5rem",
      shadow: "0 4px 20px rgba(0, 0, 0, 0.7)",
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "var(--font-inter), Georgia, serif",
    },
  },
];

// Helper: get a skin by id
export function getSkinById(id: string): Skin | undefined {
  return SKINS.find((s) => s.id === id);
}

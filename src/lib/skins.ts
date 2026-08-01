// ============================================================================
// skins.ts — Skins atualizados 2026
// ============================================================================
// 3 skins principais novos (Linear Dark, Neural, Cloud) + alguns clássicos.
// O logo da app muda de cor conforme o accent do skin ativo.
// ============================================================================

export interface SkinTokens {
  bg: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  accentForeground: string;
  border: string;
  radius: string;
  shadow: string;
  headingFont: string;
  bodyFont: string;
  bgPattern?: string;
}

export interface Skin {
  id: string;
  name: string;
  description: string;
  category: string;
  dark: SkinTokens;
  light: SkinTokens;
  // Smart default: preset de cor sugerido no formulário quando este skin está ativo
  suggestedColorPreset?: string;
}

export const SKINS: Skin[] = [
  // ── 1. Linear Dark — dark mode profissional obrigatório ──────────────────
  {
    id: "linear-dark",
    name: "Linear Dark",
    description: "Dark mode profissional, SaaS premium",
    category: "Dark",
    suggestedColorPreset: "modern-blue",
    dark: {
      bg: "#0A0A0B",
      card: "#18181B",
      text: "#FAFAFA",
      muted: "#A1A1AA",
      accent: "#5E6AD2",
      accentForeground: "#FFFFFF",
      border: "#27272A",
      radius: "8px",
      shadow: "0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.3)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
    light: {
      bg: "#FAFAFA",
      card: "#FFFFFF",
      text: "#09090B",
      muted: "#71717A",
      accent: "#5E6AD2",
      accentForeground: "#FFFFFF",
      border: "#E4E4E7",
      radius: "8px",
      shadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },

  // ── 2. Neural — AI-native, perfeito para Inaugura-Base ───────────────────
  {
    id: "neural",
    name: "Neural",
    description: "AI-native, roxo elétrico + ciano",
    category: "Dark",
    suggestedColorPreset: "violet-ai",
    dark: {
      bg: "#08080C",
      card: "#131320",
      text: "#F4F4F8",
      muted: "#9494B0",
      accent: "#8B5CF6",
      accentForeground: "#FFFFFF",
      border: "#2A2A3D",
      radius: "10px",
      shadow: "0 4px 24px rgba(139, 92, 246, 0.15), 0 1px 4px rgba(0, 0, 0, 0.4)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
      bgPattern: "radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.06) 0%, transparent 40%)",
    },
    light: {
      bg: "#F5F3FF",
      card: "#FFFFFF",
      text: "#1E1B2E",
      muted: "#6B6885",
      accent: "#7C3AED",
      accentForeground: "#FFFFFF",
      border: "#DDD6FE",
      radius: "10px",
      shadow: "0 2px 12px rgba(124, 58, 237, 0.08)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },

  // ── 3. Cloud — melhor light mode ─────────────────────────────────────────
  {
    id: "cloud",
    name: "Cloud",
    description: "Light mode limpo, arejado, WCAG-AA",
    category: "Light",
    suggestedColorPreset: "neutral-premium",
    dark: {
      bg: "#0F172A",
      card: "#1E293B",
      text: "#F1F5F9",
      muted: "#94A3B8",
      accent: "#4F46E5",
      accentForeground: "#FFFFFF",
      border: "#334155",
      radius: "8px",
      shadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
    light: {
      bg: "#F8FAFC",
      card: "#FFFFFF",
      text: "#0F172A",
      muted: "#64748B",
      accent: "#4F46E5",
      accentForeground: "#FFFFFF",
      border: "#E2E8F0",
      radius: "8px",
      shadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },

  // ── 4. Mono Ink — clássico minimalista ───────────────────────────────────
  {
    id: "mono-ink",
    name: "Mono Ink",
    description: "Pure ink on cream, literary calm",
    category: "Mono",
    suggestedColorPreset: "monochrome",
    dark: {
      bg: "#0A0A0A",
      card: "#141414",
      text: "#EDEDED",
      muted: "#808080",
      accent: "#E0E0E0",
      accentForeground: "#0A0A0A",
      border: "#2A2A2A",
      radius: "4px",
      shadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
    light: {
      bg: "#FAF7F0",
      card: "#FFFFFF",
      text: "#0A0A0A",
      muted: "#808080",
      accent: "#0A0A0A",
      accentForeground: "#FAF7F0",
      border: "#D0CCC0",
      radius: "4px",
      shadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },

  // ── 5. Brutalist Ink — bruto e arrojado ──────────────────────────────────
  {
    id: "brutalist-ink",
    name: "Brutalist Ink",
    description: "Bold black borders, hard offset shadows",
    category: "Brutalist",
    suggestedColorPreset: "high-contrast",
    dark: {
      bg: "#0D0D0D",
      card: "#1A1A1A",
      text: "#00FF88",
      muted: "#666666",
      accent: "#00FF88",
      accentForeground: "#0D0D0D",
      border: "#00FF88",
      radius: "0px",
      shadow: "6px 6px 0 #00FF88",
      headingFont: "var(--font-mono), ui-monospace, monospace",
      bodyFont: "var(--font-mono), ui-monospace, monospace",
    },
    light: {
      bg: "#FFFFFF",
      card: "#FFFFFF",
      text: "#0D0D0D",
      muted: "#666666",
      accent: "#0D0D0D",
      accentForeground: "#FFFFFF",
      border: "#0D0D0D",
      radius: "0px",
      shadow: "6px 6px 0 #0D0D0D",
      headingFont: "var(--font-mono), ui-monospace, monospace",
      bodyFont: "var(--font-mono), ui-monospace, monospace",
    },
  },

  // ── 6. Editorial Serif — elegante, tipografia editorial ──────────────────
  {
    id: "editorial-serif",
    name: "Editorial Serif",
    description: "Serif headings, warm palette, magazine feel",
    category: "Editorial",
    suggestedColorPreset: "warm-coral",
    dark: {
      bg: "#12100E",
      card: "#1C1916",
      text: "#F5EFE6",
      muted: "#8A8276",
      accent: "#C4856A",
      accentForeground: "#12100E",
      border: "#2D2925",
      radius: "2px",
      shadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
    light: {
      bg: "#F9F6F0",
      card: "#FFFFFF",
      text: "#1A1715",
      muted: "#8A8276",
      accent: "#9C5D3F",
      accentForeground: "#FFFFFF",
      border: "#D9D3CA",
      radius: "2px",
      shadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },

  // ── 7. Dark Cyber Purple — neon/tech futurista ───────────────────────────
  {
    id: "dark-cyber-purple",
    name: "Dark Cyber Purple",
    description: "Roxo neon futurista, atmosfera tech/gaming",
    category: "Dark",
    suggestedColorPreset: "violet-ai",
    dark: {
      bg: "#1C1C1E",
      card: "#252528",
      text: "#FFFFFF",
      muted: "#8E8E93",
      accent: "#BF5AF2",
      accentForeground: "#FFFFFF",
      border: "#38383C",
      radius: "10px",
      shadow: "0 4px 24px rgba(191, 90, 242, 0.2), 0 1px 4px rgba(0, 0, 0, 0.4)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
      bgPattern: "radial-gradient(circle at 20% 20%, rgba(191, 90, 242, 0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(157, 78, 221, 0.04) 0%, transparent 40%)",
    },
    light: {
      bg: "#F3F0F7",
      card: "#FFFFFF",
      text: "#1C1C1E",
      muted: "#8E8E93",
      accent: "#9D4EDD",
      accentForeground: "#FFFFFF",
      border: "#E5E0EB",
      radius: "10px",
      shadow: "0 2px 12px rgba(157, 78, 221, 0.08)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },

  // ── 8. Obsidian — escuro profundo + roxo/azul ─────────────────────────────
  {
    id: "obsidian",
    name: "Obsidian",
    description: "Escuro profundo, elegante e focado, roxo/azul",
    category: "Dark",
    suggestedColorPreset: "violet-ai",
    dark: {
      bg: "#0F0F12",
      card: "#16161B",
      text: "#E8E8ED",
      muted: "#7A7A8C",
      accent: "#8B5CF6",
      accentForeground: "#FFFFFF",
      border: "#22222A",
      radius: "6px",
      shadow: "0 4px 24px rgba(0, 0, 0, 0.6), 0 0 12px rgba(139, 92, 246, 0.05)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
    light: {
      bg: "#F7F7F8",
      card: "#FFFFFF",
      text: "#0F0F12",
      muted: "#7A7A8C",
      accent: "#7C3AED",
      accentForeground: "#FFFFFF",
      border: "#E2E2E6",
      radius: "6px",
      shadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },

  // ── 9. Raw Concrete — brutalist puro, cinzas frios + amarelo neon ────────
  {
    id: "raw-concrete",
    name: "Raw Concrete",
    description: "Brutalist puro, cinzas frios + amarelo neon",
    category: "Brutalist",
    suggestedColorPreset: "high-contrast",
    dark: {
      bg: "#1A1A1D",
      card: "#242428",
      text: "#E4E4E7",
      muted: "#71717A",
      accent: "#EAB308",
      accentForeground: "#1A1A1D",
      border: "#3F3F46",
      radius: "0px",
      shadow: "4px 4px 0 #EAB308",
      headingFont: "var(--font-mono), ui-monospace, monospace",
      bodyFont: "var(--font-mono), ui-monospace, monospace",
    },
    light: {
      bg: "#E4E4E7",
      card: "#FFFFFF",
      text: "#18181B",
      muted: "#71717A",
      accent: "#18181B",
      accentForeground: "#E4E4E7",
      border: "#18181B",
      radius: "0px",
      shadow: "4px 4px 0 #18181B",
      headingFont: "var(--font-mono), ui-monospace, monospace",
      bodyFont: "var(--font-mono), ui-monospace, monospace",
    },
  },

  // ── 10. Glassmorphism — vidro fosco moderno ──────────────────────────────
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Vidro fosco moderno, blur + accent suave",
    category: "Glass",
    suggestedColorPreset: "soft-pastel",
    dark: {
      bg: "#0A0A0F",
      card: "rgba(30, 30, 45, 0.6)",
      text: "#F0F0F5",
      muted: "#9494A8",
      accent: "#60A5FA",
      accentForeground: "#0A0A0F",
      border: "rgba(255, 255, 255, 0.08)",
      radius: "16px",
      shadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
      bgPattern: "radial-gradient(circle at 30% 20%, rgba(96, 165, 250, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(167, 139, 250, 0.06) 0%, transparent 40%)",
    },
    light: {
      bg: "#F0F2F5",
      card: "rgba(255, 255, 255, 0.7)",
      text: "#1A1A2E",
      muted: "#6B6B80",
      accent: "#3B82F6",
      accentForeground: "#FFFFFF",
      border: "rgba(0, 0, 0, 0.06)",
      radius: "16px",
      shadow: "0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
      headingFont: "var(--font-inter), system-ui, sans-serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },

  // ── 11. Wine — luxo escuro, bordeaux + dourado ────────────────────────────
  {
    id: "wine",
    name: "Wine",
    description: "Luxo escuro, bordeaux + dourado suave + preto",
    category: "Luxury",
    suggestedColorPreset: "warm-coral",
    dark: {
      bg: "#1A0A0E",
      card: "#261218",
      text: "#F5E6E8",
      muted: "#8A6B70",
      accent: "#C9A961",
      accentForeground: "#1A0A0E",
      border: "#3A1E24",
      radius: "4px",
      shadow: "0 4px 24px rgba(201, 169, 97, 0.1), 0 1px 4px rgba(0, 0, 0, 0.5)",
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
      bgPattern: "radial-gradient(circle at 30% 20%, rgba(201, 169, 97, 0.04) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 26, 47, 0.06) 0%, transparent 40%)",
    },
    light: {
      bg: "#FAF5F0",
      card: "#FFFFFF",
      text: "#1A0A0E",
      muted: "#8A6B70",
      accent: "#8B1A2F",
      accentForeground: "#FFFFFF",
      border: "#E8D5D0",
      radius: "4px",
      shadow: "0 2px 12px rgba(139, 26, 47, 0.06)",
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "var(--font-inter), system-ui, sans-serif",
    },
  },
];

export function getSkinById(id: string): Skin | undefined {
  return SKINS.find((s) => s.id === id);
}

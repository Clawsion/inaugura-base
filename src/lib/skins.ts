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
];

export function getSkinById(id: string): Skin | undefined {
  return SKINS.find((s) => s.id === id);
}

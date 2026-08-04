// ============================================================================
// JSON SCHEMA — Structured output para GLM-5.2 gerar paletas gradient
// ============================================================================
// Este schema define exatamente o que o GLM-5.2 deve devolver quando o modo
// "Gradient Pro" está ativo. Podes usar com tool_calls ou response_format.
// ============================================================================

export const gradientPaletteSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Nome evocativo da paleta (ex: 'Deep Trust Aurora', 'Obsidian Mesh')",
    },
    category: {
      type: "string",
      enum: ["fintech", "dark-premium", "nordic", "linear", "luxury", "sage", "cyber", "sunset"],
      description: "Categoria da paleta",
    },
    mood: {
      type: "string",
      description: "Mood/emoção transmitida (ex: 'Confiança, Modernidade, Profundidade')",
    },
    isDark: {
      type: "boolean",
      description: "true se a paleta é dark mode, false se é light mode",
    },
    colors: {
      type: "array",
      description: "4 cores principais com roles",
      items: {
        type: "object",
        properties: {
          hex: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$", description: "Cor em hex (ex: #0B1224)" },
          role: { type: "string", enum: ["Background", "Secundária", "Suporte", "Destaque"] },
        },
        required: ["hex", "role"],
      },
      minItems: 4,
      maxItems: 4,
    },
    extendedColors: {
      type: "array",
      description: "6 cores extra para usar nos gradientes (não nos roles)",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Nome da cor (ex: 'Base Dark', 'Primary')" },
          hex: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
        },
        required: ["name", "hex"],
      },
      minItems: 6,
      maxItems: 6,
    },
    gradients: {
      type: "object",
      description: "Gradientes CSS prontos copy-paste",
      properties: {
        hero: { type: "string", description: "linear-gradient 135deg com 3-5 stops para hero/background principal" },
        mesh: { type: "string", description: "Mesh gradient: 3-5 radial-gradient sobrepostos + cor base" },
        button: { type: "string", description: "linear-gradient 90deg para botão primário" },
        buttonHover: { type: "string", description: "linear-gradient para hover do botão" },
        card: { type: "string", description: "Gradiente subtil para cards/surfaces" },
        text: { type: "string", description: "linear-gradient para text com background-clip: text" },
        glow: { type: "string", description: "radial-gradient subtil para highlights/glow" },
      },
      required: ["hero", "mesh", "button", "buttonHover", "card", "text", "glow"],
    },
    tokens: {
      type: "object",
      description: "Design tokens",
      properties: {
        primary: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
        secondary: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
        accent: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
        background: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
        foreground: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
        muted: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
        border: { type: "string", description: "Border color (pode ser rgba)" },
      },
      required: ["primary", "secondary", "accent", "background", "foreground", "muted", "border"],
    },
    recommendedEffects: {
      type: "array",
      description: "Efeitos recomendados da app para combinar",
      items: { type: "string" },
      minItems: 3,
      maxItems: 5,
    },
    recommendedTypography: {
      type: "string",
      description: "Tipografia recomendada (ex: 'Geist (heading) + Inter (body) + Geist Mono')",
    },
    wcagNote: {
      type: "string",
      description: "Nota de acessibilidade WCAG (ex: 'AA compliant — texto #F0F9FF sobre #0B1224 tem contraste 17.2:1')",
    },
    description: {
      type: "string",
      description: "Descrição curta da paleta (1 frase)",
    },
  },
  required: [
    "name", "category", "mood", "isDark", "colors", "extendedColors",
    "gradients", "tokens", "recommendedEffects", "recommendedTypography",
    "wcagNote", "description",
  ],
} as const;

// Type TypeScript derivado do schema
export interface GradientPaletteAI {
  name: string;
  category: "fintech" | "dark-premium" | "nordic" | "linear" | "luxury" | "sage" | "cyber" | "sunset";
  mood: string;
  isDark: boolean;
  colors: { hex: string; role: "Background" | "Secundária" | "Suporte" | "Destaque" }[];
  extendedColors: { name: string; hex: string }[];
  gradients: {
    hero: string;
    mesh: string;
    button: string;
    buttonHover: string;
    card: string;
    text: string;
    glow: string;
  };
  tokens: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  recommendedEffects: string[];
  recommendedTypography: string;
  wcagNote: string;
  description: string;
}

// Schema para array de múltiplas paletas (quando se pede várias)
export const gradientPaletteArraySchema = {
  type: "object",
  properties: {
    palettes: {
      type: "array",
      items: gradientPaletteSchema,
      minItems: 1,
      maxItems: 8,
    },
  },
  required: ["palettes"],
} as const;

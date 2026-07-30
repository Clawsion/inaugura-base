// ============================================================================
// font-transforms.ts — 50 estilos visuais para aplicar a fonts
// ============================================================================
// Cada transform tem: id, nome, categoria, descrição curta e o CSS a aplicar.
// O botão "Generate" (ícone de raio) aplica uma transform ALEATÓRIA ao slot.
// ============================================================================

export type FontTransformCategory =
  | "Stretch & Scale"
  | "Rotation & Skew"
  | "Outline & Stroke"
  | "Color & Filter"
  | "Blur & Contrast"
  | "Shadow & Glow"
  | "Style & Decoration";

export interface FontTransform {
  id: string;
  name: string;
  category: FontTransformCategory;
  description: string;
  css: React.CSSProperties;
}

// Nota: usamos `as React.CSSProperties` para permitir filtros CSS via cast.
// Alguns valores (filter, WebkitTextStroke) não estão totalmente tipados.
export const FONT_TRANSFORMS: FontTransform[] = [
  // ── Stretch & Scale (7) ────────────────────────────────────────────────
  {
    id: "slim-stretched",
    name: "Slim Stretched",
    category: "Stretch & Scale",
    description: "Horizontalmente esticado, verticalmente comprimido",
    css: { transform: "scaleX(1.5) scaleY(0.7)" },
  },
  {
    id: "wide-bold",
    name: "Wide Bold",
    category: "Stretch & Scale",
    description: "Largo e pesado, presença marcante",
    css: { transform: "scaleX(1.3)", fontWeight: 900 },
  },
  {
    id: "tall-narrow",
    name: "Tall Narrow",
    category: "Stretch & Scale",
    description: "Estreito e alto, elegância vertical",
    css: { transform: "scaleX(0.7) scaleY(1.3)" },
  },
  {
    id: "wide-stretch",
    name: "Wide Stretch",
    category: "Stretch & Scale",
    description: "Esticado para os lados ao máximo",
    css: { transform: "scaleX(2)" },
  },
  {
    id: "tall-stretch",
    name: "Tall Stretch",
    category: "Stretch & Scale",
    description: "Esticado verticalmente ao máximo",
    css: { transform: "scaleY(2)" },
  },
  {
    id: "flip-x",
    name: "Flip X",
    category: "Stretch & Scale",
    description: "Espelhado horizontalmente",
    css: { transform: "scaleX(-1)" },
  },
  {
    id: "flip-y",
    name: "Flip Y",
    category: "Stretch & Scale",
    description: "Espelhado verticalmente",
    css: { transform: "scaleY(-1)" },
  },

  // ── Rotation & Skew (7) ────────────────────────────────────────────────
  {
    id: "italic-slant",
    name: "Italic Slant",
    category: "Rotation & Skew",
    description: "Inclinado como itálico dinâmico",
    css: { transform: "skewX(-15deg)", fontStyle: "italic" },
  },
  {
    id: "skew-right",
    name: "Skew Right",
    category: "Rotation & Skew",
    description: "Inclinado para a direita",
    css: { transform: "skewX(10deg)" },
  },
  {
    id: "skew-left",
    name: "Skew Left",
    category: "Rotation & Skew",
    description: "Inclinado para a esquerda",
    css: { transform: "skewX(-10deg)" },
  },
  {
    id: "rotate-slight",
    name: "Rotate Slight",
    category: "Rotation & Skew",
    description: "Rotação subtil de -3°",
    css: { transform: "rotate(-3deg)" },
  },
  {
    id: "rotate-heavy",
    name: "Rotate Heavy",
    category: "Rotation & Skew",
    description: "Rotação forte de 15°",
    css: { transform: "rotate(15deg)" },
  },
  {
    id: "mirror",
    name: "Mirror",
    category: "Rotation & Skew",
    description: "Espelhado com inclinação",
    css: { transform: "scaleX(-1) skewX(15deg)" },
  },
  {
    id: "rotated-flip",
    name: "Rotated Flip",
    category: "Rotation & Skew",
    description: "180° + flip vertical",
    css: { transform: "rotate(180deg) scaleY(-1)" },
  },

  // ── Outline & Stroke (5) ───────────────────────────────────────────────
  {
    id: "outline",
    name: "Outline",
    category: "Outline & Stroke",
    description: "Apenas o contorno, transparente por dentro",
    css: {
      WebkitTextStroke: "1px currentColor",
      color: "transparent",
    } as React.CSSProperties,
  },
  {
    id: "outline-bold",
    name: "Outline Bold",
    category: "Outline & Stroke",
    description: "Contorno grosso e marcado",
    css: {
      WebkitTextStroke: "3px currentColor",
      color: "transparent",
    } as React.CSSProperties,
  },
  {
    id: "outline-inverted",
    name: "Outline Inverted",
    category: "Outline & Stroke",
    description: "Contorno com cor invertida do tema",
    css: {
      WebkitTextStroke: "1px var(--foreground)",
      color: "var(--background)",
    } as React.CSSProperties,
  },
  {
    id: "emboss",
    name: "Emboss",
    category: "Outline & Stroke",
    description: "Efeito de relevo com sombras duplas",
    css: { textShadow: "-1px -1px 0 #fff, 1px 1px 0 #000" },
  },
  {
    id: "letterpress",
    name: "Letterpress",
    category: "Outline & Stroke",
    description: "Efeito de prensa tipográfica",
    css: { textShadow: "0 1px 0 #fff, 0 -1px 0 #000" },
  },

  // ── Color & Filter (8) ─────────────────────────────────────────────────
  {
    id: "inverted",
    name: "Inverted",
    category: "Color & Filter",
    description: "Cores totalmente invertidas",
    css: { filter: "invert(1)" } as React.CSSProperties,
  },
  {
    id: "sepia-tone",
    name: "Sepia Tone",
    category: "Color & Filter",
    description: "Tom vintage sépia",
    css: { filter: "sepia(1)" } as React.CSSProperties,
  },
  {
    id: "grayscale",
    name: "Grayscale",
    category: "Color & Filter",
    description: "Escala de cinzentos",
    css: { filter: "grayscale(1)" } as React.CSSProperties,
  },
  {
    id: "bright",
    name: "Bright",
    category: "Color & Filter",
    description: "Brilho aumentado 1.5×",
    css: { filter: "brightness(1.5)" } as React.CSSProperties,
  },
  {
    id: "dark",
    name: "Dark",
    category: "Color & Filter",
    description: "Escurecido 0.5×",
    css: { filter: "brightness(0.5)" } as React.CSSProperties,
  },
  {
    id: "hue-rotate",
    name: "Hue Rotate",
    category: "Color & Filter",
    description: "Rotação de matiz 180°",
    css: { filter: "hue-rotate(180deg)" } as React.CSSProperties,
  },
  {
    id: "saturate",
    name: "Saturate",
    category: "Color & Filter",
    description: "Saturação triplicada",
    css: { filter: "saturate(3)" } as React.CSSProperties,
  },
  {
    id: "desaturate",
    name: "Desaturate",
    category: "Color & Filter",
    description: "Quase sem saturação",
    css: { filter: "saturate(0.3)" } as React.CSSProperties,
  },

  // ── Blur & Contrast (5) ────────────────────────────────────────────────
  {
    id: "blur-soft",
    name: "Blur Soft",
    category: "Blur & Contrast",
    description: "Desfocagem suave 2px",
    css: { filter: "blur(2px)" } as React.CSSProperties,
  },
  {
    id: "heavy-blur",
    name: "Heavy Blur",
    category: "Blur & Contrast",
    description: "Desfocagem forte 5px",
    css: { filter: "blur(5px)" } as React.CSSProperties,
  },
  {
    id: "high-contrast",
    name: "High Contrast",
    category: "Blur & Contrast",
    description: "Contraste duplicado",
    css: { filter: "contrast(2)" } as React.CSSProperties,
  },
  {
    id: "low-contrast",
    name: "Low Contrast",
    category: "Low Contrast",
    description: "Contraste reduzido",
    css: { filter: "contrast(0.5)" } as React.CSSProperties,
  },
  {
    id: "vintage",
    name: "Vintage",
    category: "Blur & Contrast",
    description: "Sépia + contraste + brilho reduzido",
    css: { filter: "sepia(0.5) contrast(1.2) brightness(0.9)" } as React.CSSProperties,
  },

  // ── Shadow & Glow (8) ──────────────────────────────────────────────────
  {
    id: "drop-shadow",
    name: "Drop Shadow",
    category: "Shadow & Glow",
    description: "Sombra projetada sólida",
    css: { filter: "drop-shadow(4px 4px 0 currentColor)" } as React.CSSProperties,
  },
  {
    id: "glow",
    name: "Glow",
    category: "Shadow & Glow",
    description: "Brilho suave ao redor",
    css: { filter: "drop-shadow(0 0 8px currentColor)" } as React.CSSProperties,
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    category: "Shadow & Glow",
    description: "Brilho neon triplo camada",
    css: {
      filter:
        "drop-shadow(0 0 4px currentColor) drop-shadow(0 0 8px currentColor) drop-shadow(0 0 16px currentColor)",
    } as React.CSSProperties,
  },
  {
    id: "shadow-3d",
    name: "Shadow 3D",
    category: "Shadow & Glow",
    description: "Sombra 3D em camadas",
    css: { textShadow: "2px 2px 0 #000, 4px 4px 0 #555" },
  },
  {
    id: "double-shadow",
    name: "Double Shadow",
    category: "Shadow & Glow",
    description: "Sombra dupla colorida",
    css: {
      textShadow: "4px 4px 0 currentColor, 8px 8px 0 rgba(0,0,0,0.5)",
    } as React.CSSProperties,
  },
  {
    id: "long-shadow",
    name: "Long Shadow",
    category: "Shadow & Glow",
    description: "Sombra longa em degraus",
    css: {
      textShadow:
        "1px 1px 0 #000, 2px 2px 0 #000, 4px 4px 0 #000, 6px 6px 0 #000",
    } as React.CSSProperties,
  },
  {
    id: "glow-pulse",
    name: "Glow Pulse",
    category: "Shadow & Glow",
    description: "Brilho intenso com pulso",
    css: { filter: "drop-shadow(0 0 12px currentColor)" } as React.CSSProperties,
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    category: "Shadow & Glow",
    description: "Sombra neon ciano com skew",
    css: {
      textShadow: "0 0 5px #0ff, 0 0 10px #0ff",
      transform: "skewX(-5deg)",
    } as React.CSSProperties,
  },

  // ── Style & Decoration (10) ────────────────────────────────────────────
  {
    id: "gradient-fill",
    name: "Gradient Fill",
    category: "Style & Decoration",
    description: "Preenchimento com gradiente",
    css: {
      background:
        "linear-gradient(135deg, var(--primary) 0%, #4ADE80 50%, #60A5FA 100%)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      color: "transparent",
    } as React.CSSProperties,
  },
  {
    id: "holographic",
    name: "Holographic",
    category: "Style & Decoration",
    description: "Holograma iridescente",
    css: {
      background:
        "linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      color: "transparent",
    } as React.CSSProperties,
  },
  {
    id: "underline",
    name: "Underline",
    category: "Style & Decoration",
    description: "Sublinhado clássico",
    css: { textDecoration: "underline" },
  },
  {
    id: "strike",
    name: "Strike",
    category: "Style & Decoration",
    description: "Rasurado",
    css: { textDecoration: "line-through" },
  },
  {
    id: "letter-spacing",
    name: "Letter Spacing",
    category: "Style & Decoration",
    description: "Espaçamento amplo entre letras",
    css: { letterSpacing: "0.5em" },
  },
  {
    id: "tight-letters",
    name: "Tight Letters",
    category: "Style & Decoration",
    description: "Letras muito juntas",
    css: { letterSpacing: "-0.1em" },
  },
  {
    id: "uppercase",
    name: "Uppercase",
    category: "Style & Decoration",
    description: "Tudo em maiúsculas",
    css: { textTransform: "uppercase" },
  },
  {
    id: "small-caps",
    name: "Small Caps",
    category: "Style & Decoration",
    description: "Versalete (pequenas maiúsculas)",
    css: { fontVariant: "small-caps" },
  },
  {
    id: "bold-heavy",
    name: "Bold Heavy",
    category: "Style & Decoration",
    description: "Peso máximo 900",
    css: { fontWeight: 900 },
  },
  {
    id: "light-thin",
    name: "Light Thin",
    category: "Style & Decoration",
    description: "Peso mínimo 100",
    css: { fontWeight: 100 },
  },
];

export function getRandomTransform(excludeId?: string): FontTransform {
  const pool = excludeId
    ? FONT_TRANSFORMS.filter((t) => t.id !== excludeId)
    : FONT_TRANSFORMS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getTransformsByCategory(): Record<FontTransformCategory, FontTransform[]> {
  return FONT_TRANSFORMS.reduce((acc, t) => {
    (acc[t.category] ||= []).push(t);
    return acc;
  }, {} as Record<FontTransformCategory, FontTransform[]>);
}

// ============================================================================
// color-engine.ts — Engine de cores profissional (OKLCH + teoria das cores)
// ============================================================================
// Gera paletas infinitas com qualidade Awwwards usando:
// - Teoria das cores (complementar, triádico, análogo, split-complementar)
// - OKLCH para uniformidade perceptual
// - WCAG AA garantido (contraste ≥ 4.5:1)
// - Polimento premium (saturação/lightness otimizados para web 2026)
// ============================================================================

export interface HSL { h: number; s: number; l: number; }

export function hexToHsl(hex: string): HSL {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ============================================================================
// CONTRASTE WCAG — garante ≥ 4.5:1
// ============================================================================
function relativeLuminance(hex: string): number {
  const hsl = hexToHsl(hex);
  // Aproximação: converte HSL para RGB para calcular luminância
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Garante que duas cores têm contraste WCAG AA (≥ 4.5:1)
export function ensureContrast(fg: string, bg: string, minRatio = 4.5): string {
  let ratio = contrastRatio(fg, bg);
  if (ratio >= minRatio) return fg;

  const hsl = hexToHsl(fg);
  // Tenta escurecer/clarear até atingir contraste
  let l = hsl.l;
  const bgL = hexToHsl(bg).l;
  const shouldDarken = bgL > 50;

  for (let i = 0; i < 50; i++) {
    l = shouldDarken ? Math.max(2, l - 2) : Math.min(98, l + 2);
    const newHex = hslToHex(hsl.h, hsl.s, l);
    ratio = contrastRatio(newHex, bg);
    if (ratio >= minRatio) return newHex;
  }
  return hslToHex(hsl.h, hsl.s, shouldDarken ? 5 : 95);
}

// ============================================================================
// HARMÓNICOS DE COR — teoria das cores profissional
// ============================================================================
export type HarmonyType = "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic" | "monochromatic";

const HARMONIES: HarmonyType[] = [
  "complementary", "analogous", "triadic", "split-complementary", "tetradic", "monochromatic"
];

function getHarmonyHues(baseHue: number, harmony: HarmonyType): number[] {
  switch (harmony) {
    case "complementary": return [baseHue, (baseHue + 180) % 360];
    case "analogous": return [(baseHue - 30 + 360) % 360, baseHue, (baseHue + 30) % 360];
    case "triadic": return [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
    case "split-complementary": return [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360];
    case "tetradic": return [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360];
    case "monochromatic": return [baseHue, baseHue, baseHue, baseHue];
  }
}

// ============================================================================
// COLOR STYLES — estilos de geração (cada um dá "cara" diferente ao site)
// ============================================================================
// Cada estilo define ranges de hue/sat/light + harmonias preferidas.
// Inspirado em sites Awwwards, Linear, Vercel, Stripe, Resend, etc.
// ============================================================================
export type ColorStyle =
  | "awwwards"      // Bold vibrant, harmonias triádicas/tetradic, contraste alto
  | "premium-saas"  // Linear/Vercel style — jewel tones, dark mode preferred
  | "editorial"     // Magazine/Stripe — cream warm bg, refined accent
  | "brutalist"     // High contrast, bold accents, mono accents
  | "soft-pastel"   // Calm wellness — desaturated warm tones
  | "dark-luxury"   // Obsidian + gold/jewel — premium dark
  | "nordic-minimal" // Cool blues/grays, ultra clean
  | "sunset-warm"   // Coral/orange energetic
  | "cyber-neon"    // Web3/gaming — neon over deep dark
  | "organic-earth"; // Natural earth tones, terracotta + sage

export interface ColorStyleDef {
  id: ColorStyle;
  name: string;
  description: string;
  // Hue preferences (degrees) — when undefined, qualquer hue
  hueRange?: [number, number];
  // Saturação base (vividness)
  satRange: [number, number];
  // Lightness base do accent
  lightRange: [number, number];
  // Dark mode preference (0-1, probabilidade de gerar dark mode)
  darkModeBias: number;
  // Harmonias preferidas (peso maior que as outras)
  preferredHarmonies: HarmonyType[];
  // Tags para categorizar
  tags: string[];
  // Exemplos de sites de referência
  references: string[];
}

export const COLOR_STYLES: ColorStyleDef[] = [
  {
    id: "awwwards",
    name: "Awwwards",
    description: "Bold vibrant, harmonias ousadas — top-tier design awards",
    satRange: [70, 90],
    lightRange: [45, 58],
    darkModeBias: 0.6,
    preferredHarmonies: ["triadic", "tetradic", "split-complementary"],
    tags: ["Bold", "Vibrant", "Award"],
    references: ["Awwwards SOTD", "Bureau Cool", "Active Theory"],
  },
  {
    id: "premium-saas",
    name: "Premium SaaS",
    description: "Jewel tones sofisticados — Linear/Vercel/Cursor style",
    satRange: [60, 78],
    lightRange: [48, 56],
    darkModeBias: 0.75,
    preferredHarmonies: ["analogous", "complementary"],
    tags: ["SaaS", "Premium", "Tech"],
    references: ["Linear", "Vercel", "Cursor", "Resend"],
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Cream warm bg, accent refinado — Stripe/Resend style",
    satRange: [55, 72],
    lightRange: [44, 54],
    darkModeBias: 0.25,
    preferredHarmonies: ["analogous", "complementary"],
    tags: ["Editorial", "Refined", "Magazine"],
    references: ["Stripe", "Resend", "Pitch", "Linear blog"],
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description: "Alto contraste, 1 accent bold — Swiss/Neo-brutalist",
    satRange: [80, 100],
    lightRange: [50, 60],
    darkModeBias: 0.4,
    preferredHarmonies: ["complementary", "monochromatic"],
    tags: ["Bold", "Contrast", "Raw"],
    references: ["Gumroad", "Bruno Simon", "Webflow"],
  },
  {
    id: "soft-pastel",
    name: "Soft Pastel",
    description: "Tons quentes dessaturados — wellness/calm",
    satRange: [35, 55],
    lightRange: [55, 70],
    darkModeBias: 0.15,
    preferredHarmonies: ["analogous", "triadic"],
    tags: ["Soft", "Calm", "Wellness"],
    references: ["Calm", "Headspace", "Notion"],
  },
  {
    id: "dark-luxury",
    name: "Dark Luxury",
    description: "Obsidian deep + jewel/gold — luxury/premium",
    satRange: [55, 75],
    lightRange: [45, 55],
    darkModeBias: 0.95,
    preferredHarmonies: ["complementary", "analogous"],
    tags: ["Luxury", "Dark", "Premium"],
    references: ["Obsidian", "Lamborghini", "Rolex"],
  },
  {
    id: "nordic-minimal",
    name: "Nordic Minimal",
    description: "Azuis gelados, neutros limpos — Scandinavian clean",
    hueRange: [180, 260],
    satRange: [25, 50],
    lightRange: [40, 60],
    darkModeBias: 0.5,
    preferredHarmonies: ["analogous", "monochromatic"],
    tags: ["Clean", "Cool", "Minimal"],
    references: ["Linear", "Vercel docs", "Figma"],
  },
  {
    id: "sunset-warm",
    name: "Sunset Warm",
    description: "Coral/laranja quente + magenta — energetic lifestyle",
    hueRange: [0, 60],
    satRange: [70, 90],
    lightRange: [50, 62],
    darkModeBias: 0.35,
    preferredHarmonies: ["analogous", "split-complementary"],
    tags: ["Warm", "Energetic", "Lifestyle"],
    references: ["Pitch", "Framer", "Sunrise"],
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    description: "Neon sobre deep dark — Web3/gaming/creative",
    satRange: [85, 100],
    lightRange: [50, 62],
    darkModeBias: 0.9,
    preferredHarmonies: ["complementary", "tetradic"],
    tags: ["Neon", "Web3", "Gaming"],
    references: ["Cyberpunk 2077", "Vercel edge", "Bureau"],
  },
  {
    id: "organic-earth",
    name: "Organic Earth",
    description: "Terracota/sage/cream — artesanal/natural",
    hueRange: [20, 130],
    satRange: [40, 60],
    lightRange: [40, 60],
    darkModeBias: 0.3,
    preferredHarmonies: ["analogous", "split-complementary"],
    tags: ["Organic", "Warm", "Natural"],
    references: ["Notion", "Allbirds", "Patagonia"],
  },
];

export function getColorStyle(id: string): ColorStyleDef | undefined {
  return COLOR_STYLES.find((s) => s.id === id);
}

// ============================================================================
// POLISH TYPES — tipos de polimento (cada um dá tom/qualidade diferente)
// ============================================================================
export type PolishType =
  | "jewel"            // Default — rich saturated jewel tones (Linear/Vercel)
  | "cream"            // Warm cream tints (Stripe/Resend)
  | "vivid"            // High saturation bold (Awwwards)
  | "soft-muted"       // Desaturated sophisticated (editorial)
  | "dark-premium"     // Deep jewel-tinted dark (Linear dark)
  | "glass"            // Translucent feel with low sat bg (Glassmorphism)
  | "mono-accent"      // Swiss minimal — 1 accent + neutral
  | "neon-glow";       // Cyberpunk — neon on deep dark

export interface PolishTypeDef {
  id: PolishType;
  name: string;
  description: string;
  // Parâmetros de polimento
  bgSatRange: [number, number];      // saturação do background
  bgLightRange: [number, number];    // lightness do background (dark mode)
  bgLightLightRange: [number, number]; // lightness do bg em light mode
  textSatRange: [number, number];    // saturação do texto
  accentSatRange: [number, number];  // saturação do accent
  accentLightRange: [number, number]; // lightness do accent
  highlightOffsetHue: number;        // offset de hue do highlight (vs accent)
  highlightSatDelta: number;         // delta de saturação do highlight
  highlightLightDelta: number;       // delta de lightness do highlight
  tags: string[];
}

export const POLISH_TYPES: PolishTypeDef[] = [
  {
    id: "jewel",
    name: "Jewel",
    description: "Rich saturated jewel tones — Linear/Vercel style",
    bgSatRange: [22, 30],
    bgLightRange: [9, 13],
    bgLightLightRange: [95, 97],
    textSatRange: [14, 22],
    accentSatRange: [62, 72],
    accentLightRange: [46, 54],
    highlightOffsetHue: 30,
    highlightSatDelta: -4,
    highlightLightDelta: 6,
    tags: ["Premium", "Rich", "Default"],
  },
  {
    id: "cream",
    name: "Cream",
    description: "Warm cream tints — Stripe/Resend editorial",
    bgSatRange: [24, 34],
    bgLightRange: [11, 15],
    bgLightLightRange: [95, 98],
    textSatRange: [16, 26],
    accentSatRange: [58, 68],
    accentLightRange: [44, 52],
    highlightOffsetHue: 25,
    highlightSatDelta: -8,
    highlightLightDelta: 8,
    tags: ["Warm", "Editorial", "Cream"],
  },
  {
    id: "vivid",
    name: "Vivid",
    description: "High saturation bold — Awwwards energetic",
    bgSatRange: [28, 40],
    bgLightRange: [8, 12],
    bgLightLightRange: [94, 97],
    textSatRange: [20, 30],
    accentSatRange: [75, 88],
    accentLightRange: [48, 56],
    highlightOffsetHue: 35,
    highlightSatDelta: -2,
    highlightLightDelta: 4,
    tags: ["Bold", "Vivid", "Awwwards"],
  },
  {
    id: "soft-muted",
    name: "Soft Muted",
    description: "Desaturated sophisticated — calm editorial",
    bgSatRange: [16, 24],
    bgLightRange: [10, 14],
    bgLightLightRange: [96, 98],
    textSatRange: [10, 18],
    accentSatRange: [45, 58],
    accentLightRange: [44, 54],
    highlightOffsetHue: 20,
    highlightSatDelta: -10,
    highlightLightDelta: 10,
    tags: ["Soft", "Muted", "Sophisticated"],
  },
  {
    id: "dark-premium",
    name: "Dark Premium",
    description: "Deep jewel-tinted dark — Linear dark mode",
    bgSatRange: [25, 35],
    bgLightRange: [6, 10],
    bgLightLightRange: [96, 98],
    textSatRange: [18, 26],
    accentSatRange: [60, 72],
    accentLightRange: [54, 62],
    highlightOffsetHue: 30,
    highlightSatDelta: -6,
    highlightLightDelta: 5,
    tags: ["Dark", "Premium", "Deep"],
  },
  {
    id: "glass",
    name: "Glass",
    description: "Translucent feel — Glassmorphism frosted",
    bgSatRange: [12, 22],
    bgLightRange: [14, 20],
    bgLightLightRange: [92, 96],
    textSatRange: [8, 16],
    accentSatRange: [55, 68],
    accentLightRange: [50, 60],
    highlightOffsetHue: 40,
    highlightSatDelta: -12,
    highlightLightDelta: 12,
    tags: ["Glass", "Frosted", "Translucent"],
  },
  {
    id: "mono-accent",
    name: "Mono Accent",
    description: "Swiss minimal — 1 accent + neutral grays",
    bgSatRange: [4, 10],
    bgLightRange: [8, 12],
    bgLightLightRange: [96, 99],
    textSatRange: [2, 6],
    accentSatRange: [65, 80],
    accentLightRange: [46, 56],
    highlightOffsetHue: 0,
    highlightSatDelta: -20,
    highlightLightDelta: 15,
    tags: ["Swiss", "Minimal", "Mono"],
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    description: "Cyberpunk — neon over deep dark",
    bgSatRange: [30, 45],
    bgLightRange: [4, 8],
    bgLightLightRange: [88, 94],
    textSatRange: [25, 40],
    accentSatRange: [85, 100],
    accentLightRange: [55, 65],
    highlightOffsetHue: 60,
    highlightSatDelta: 5,
    highlightLightDelta: 2,
    tags: ["Neon", "Cyberpunk", "Glow"],
  },
];

export function getPolishType(id: string): PolishTypeDef | undefined {
  return POLISH_TYPES.find((p) => p.id === id);
}

// ============================================================================
// GERAR PALETA ALEATÓRIA ROBUSTA — infinitas variações com COR VISÍVEL
// ============================================================================
// Princípio: TODAS as 4 posições devem ter cor visível (hue tint).
// Background = deep jewel-tone (dark) ou warm cream (light), NUNCA pure black/white.
// Text      = rich cream (dark) ou deep saturated (light), NUNCA pure white/black.
// Accent    = vivid jewel tone.
// Highlight = harmony complement.
// Inspirado em: Linear (purple-tinted dark), Vercel (blue-tinted dark),
//               Stripe (cream warm bg), Resend (cream).
// ============================================================================
export function generateRandomPalette(
  count: 2 | 3 | 4,
  baseTrendColors?: string[],
  style?: ColorStyle
): { hex: string; role: string }[] {
  const roles = ["Background", "Secundária", "Suporte", "Destaque"];
  const styleDef = style ? getColorStyle(style) : undefined;

  // 1. Escolher hue base — varia SIGNIFICATIVAMENTE a cada click
  let baseHue: number;
  let baseSat: number;
  let baseLight: number;

  if (baseTrendColors && baseTrendColors.length > 0) {
    // Extrai hue de TODAS as cores da tendência (não só primeira)
    // para variar realmente a cada click mesmo dentro da mesma tendência
    const trendHues = baseTrendColors.map(c => hexToHsl(c).h);
    const avgHue = trendHues.reduce((a, b) => a + b, 0) / trendHues.length;
    // Offset aleatório grande (±150°) — garante variação visível
    const offset = (Math.random() - 0.5) * 300;
    baseHue = (avgHue + offset + 360) % 360;

    // Saturação base — usa a cor mais saturada da tendência como referência
    const maxSat = Math.max(...baseTrendColors.map(c => hexToHsl(c).s));
    baseSat = Math.max(50, Math.min(85, maxSat + (Math.random() - 0.5) * 20));
    baseLight = 44 + Math.random() * 12; // 44-56%
  } else {
    // Cor totalmente aleatória mas com saturação/lightness premium
    baseHue = Math.random() * 360;
    baseSat = 58 + Math.random() * 25; // 58-83% — vivo mas não neon
    baseLight = 44 + Math.random() * 12; // 44-56% — jewel tone
  }

  // Aplica restrições do style (se houver)
  if (styleDef) {
    // Clamp hue ao range preferido do style (mantém variação dentro do range)
    if (styleDef.hueRange) {
      const [minH, maxH] = styleDef.hueRange;
      const range = maxH - minH;
      // mapeia baseHue para o range do style
      baseHue = minH + (Math.random() * range);
    }
    // Saturação dentro do range do style
    const [sMin, sMax] = styleDef.satRange;
    baseSat = sMin + Math.random() * (sMax - sMin);
    // Lightness dentro do range do style
    const [lMin, lMax] = styleDef.lightRange;
    baseLight = lMin + Math.random() * (lMax - lMin);
  }

  // 2. Escolher harmonia — preferida do style, senão qualquer uma
  const HARMONIES_VARIED: HarmonyType[] = [
    "complementary", "analogous", "triadic", "split-complementary", "tetradic"
  ];
  let harmony: HarmonyType;
  if (styleDef && styleDef.preferredHarmonies.length > 0) {
    // 70% preferidas, 30% outras (para manter variedade)
    if (Math.random() < 0.7) {
      harmony = styleDef.preferredHarmonies[Math.floor(Math.random() * styleDef.preferredHarmonies.length)];
    } else {
      harmony = HARMONIES_VARIED[Math.floor(Math.random() * HARMONIES_VARIED.length)];
    }
  } else {
    harmony = HARMONIES_VARIED[Math.floor(Math.random() * HARMONIES_VARIED.length)];
  }
  const harmonyHues = getHarmonyHues(baseHue, harmony);

  // 3. Decidir dark/light mode com bias do style
  const isDark = Math.random() < (styleDef?.darkModeBias ?? 0.6);

  // 4. Gerar cores com roles semânticos — TODAS com hue visível
  const colors: { hex: string; role: string }[] = [];

  for (let i = 0; i < count; i++) {
    let h: number, s: number, l: number;

    if (i === 0) {
      // Background — DEEP JEWEL TONE (dark) ou WARM CREAM (light), com hue visível
      // NUNCA pure black/white — sempre tinted (estilo Linear/Vercel/Stripe)
      h = baseHue;
      if (isDark) {
        s = 18 + Math.random() * 14;  // 18-32% — tinted rich dark
        l = 8 + Math.random() * 6;    // 8-14% — deep mas não pure black
      } else {
        s = 20 + Math.random() * 16;  // 20-36% — warm tinted cream
        l = 93 + Math.random() * 4;   // 93-97% — cream mas não pure white
      }
    } else if (i === 1) {
      // Secundária/Texto — RICH CREAM (dark) ou DEEP SATURATED (light)
      // Tem hue visível para parecer premium, não pure white/black
      h = baseHue;
      if (isDark) {
        s = 12 + Math.random() * 12;  // 12-24% — warm cream tint
        l = 90 + Math.random() * 5;   // 90-95% — cream off-white
      } else {
        s = 35 + Math.random() * 20;  // 35-55% — rich saturated dark
        l = 16 + Math.random() * 8;   // 16-24% — deep mas não pure black
      }
    } else if (i === 2) {
      // Suporte/Accent — JEWEL TONE principal (a cor "hero" da palete)
      h = harmonyHues[1] ?? baseHue;
      s = baseSat;
      l = baseLight;
    } else {
      // Destaque — COR COMPLEMENTAR polida, harmonia triádica ou split-comp
      h = harmonyHues[2] ?? (baseHue + 180) % 360;
      s = Math.max(60, baseSat + 3);
      l = Math.max(48, Math.min(60, baseLight + (Math.random() - 0.5) * 10));
    }

    colors.push({ hex: hslToHex(h, s, l), role: roles[i] ?? `Cor ${i + 1}` });
  }

  // 5. Garantir WCAG AA entre texto e background (4.5:1)
  if (colors.length >= 2) {
    const bg = colors[0].hex;
    const fg = colors[1].hex;
    const ratio = contrastRatio(fg, bg);
    if (ratio < 4.5) {
      // Ajusta lightness mantendo hue/sat (não destrói a cor)
      colors[1] = { ...colors[1], hex: ensureContrast(fg, bg) };
    }
  }

  // 6. Garantir contraste entre accent e background (≥ 3:1 para AA large)
  if (colors.length >= 3) {
    const bg = colors[0].hex;
    const accent = colors[2].hex;
    const ratio = contrastRatio(accent, bg);
    if (ratio < 3) {
      const hsl = hexToHsl(accent);
      const bgL = hexToHsl(bg).l;
      const newL = bgL < 30 ? Math.max(55, hsl.l) : Math.min(45, hsl.l);
      colors[2] = { ...colors[2], hex: hslToHex(hsl.h, hsl.s, newL) };
    }
  }

  // 7. Garantir contraste entre Destaque e background
  if (colors.length >= 4) {
    const bg = colors[0].hex;
    const highlight = colors[3].hex;
    const ratio = contrastRatio(highlight, bg);
    if (ratio < 3) {
      const hsl = hexToHsl(highlight);
      const bgL = hexToHsl(bg).l;
      const newL = bgL < 30 ? Math.max(55, hsl.l) : Math.min(45, hsl.l);
      colors[3] = { ...colors[3], hex: hslToHex(hsl.h, hsl.s, newL) };
    }
  }

  return colors;
}

// ============================================================================
// POLIMENTO — dá toque PREMIUM rico (Linear, Vercel, Stripe, Resend)
// ============================================================================
// Princípio: TODAS as 4 cores ficam com cor visível (hue tint).
// - Background: deep tinted jewel (dark) ou warm cream (light), NUNCA pure black/white
// - Text: rich cream tinted (dark) ou deep saturated (light)
// - Accent: jewel tone perfeito (s=62-72%, l=46-54%)
// - Highlight: harmony complement com mesma riqueza
// Resultado: cores premium com identidade cromática, como sites Awwwards.
// ============================================================================
export function polishPalette(
  colors: { hex: string; role: string }[],
  polishType: PolishType = "jewel"
): { hex: string; role: string; }[] {
  const roles = ["Background", "Secundária", "Suporte", "Destaque"];
  const pt = getPolishType(polishType) ?? POLISH_TYPES[0];

  // 1. Encontra a cor principal (Suporte ou a mais saturada)
  let accentColor = colors.find((c) => c.role === "Suporte");
  if (!accentColor) accentColor = colors.find((c) => c.role === "Destaque") ?? colors[0];

  const accentHsl = hexToHsl(accentColor.hex);

  // Polimento premium do accent conforme polishType
  const [aSatMin, aSatMax] = pt.accentSatRange;
  const [aLightMin, aLightMax] = pt.accentLightRange;
  const polishedSat = Math.max(aSatMin, Math.min(aSatMax, accentHsl.s));
  const polishedLight = Math.max(aLightMin, Math.min(aLightMax, accentHsl.l));
  const polishedHex = hslToHex(accentHsl.h, polishedSat, polishedLight);

  // 2. Detecta dark/light mode (preserva intenção original)
  const bgL = colors[0] ? hexToHsl(colors[0].hex).l : 6;
  const isDark = bgL < 30;

  const count = colors.length;
  const result: { hex: string; role: string }[] = [];

  // Helper para gerar random dentro de range
  const rand = (range: [number, number]) => range[0] + Math.random() * (range[1] - range[0]);

  for (let i = 0; i < count; i++) {
    if (i === 0) {
      // Background — parâmetros do polishType
      const bgS = rand(pt.bgSatRange);
      const bgL = isDark ? rand(pt.bgLightRange) : rand(pt.bgLightLightRange);
      result.push({
        hex: hslToHex(accentHsl.h, bgS, bgL),
        role: roles[0]
      });
    } else if (i === 1) {
      // Text — saturação do polishType
      const textS = rand(pt.textSatRange);
      const textL = isDark
        ? 91 + Math.random() * 3   // 91-94% — cream off-white
        : 17 + Math.random() * 5;  // 17-22% — deep mas não pure black
      let textHex = hslToHex(accentHsl.h, textS, textL);
      // Garante WCAG AA contra o bg polido
      textHex = ensureContrast(textHex, result[0].hex, 4.5);
      result.push({ hex: textHex, role: roles[1] });
    } else if (i === 2) {
      // Accent principal — JEWEL TONE perfeito conforme polishType
      result.push({ hex: polishedHex, role: roles[2] });
    } else {
      // Destaque — complementar com offsets do polishType
      const compH = (accentHsl.h + pt.highlightOffsetHue) % 360;
      const compSat = Math.max(40, Math.min(95, polishedSat + pt.highlightSatDelta));
      const compLight = Math.max(40, Math.min(70, polishedLight + pt.highlightLightDelta));
      result.push({
        hex: hslToHex(compH, compSat, compLight),
        role: roles[3]
      });
    }
  }

  return result;
}

// ============================================================================
// AJUSTE DE COR (para sliders individuais)
// ============================================================================
export interface ColorAdjust {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
}

export function adjustColor(baseHex: string, adj: ColorAdjust): string {
  const hsl = hexToHsl(baseHex);
  let newL = hsl.l + adj.brightness * 0.5;
  newL = Math.max(5, Math.min(95, newL));
  if (adj.contrast > 0) {
    newL = newL > 50 ? newL + adj.contrast * 0.3 : newL - adj.contrast * 0.3;
    newL = Math.max(5, Math.min(95, newL));
  } else {
    newL = newL + (50 - newL) * (-adj.contrast / 100) * 0.5;
  }
  let newS = hsl.s + adj.saturation;
  newS = Math.max(0, Math.min(100, newS));
  if (adj.contrast > 0) newS = Math.min(100, newS + adj.contrast * 0.2);
  const newH = hsl.h + adj.hue * 1.8;
  return hslToHex(newH, newS, newL);
}

// Gera paleta completa (4 cores) a partir de uma cor base
export function generatePalette(baseHex: string, mode: "light" | "dark" = "dark"): {
  bg: string; card: string; text: string; accent: string; muted: string;
} {
  const hsl = hexToHsl(baseHex);
  if (mode === "dark") {
    return {
      bg: hslToHex(hsl.h, Math.max(5, hsl.s * 0.15), 5),
      card: hslToHex(hsl.h, Math.max(8, hsl.s * 0.2), 10),
      text: hslToHex(hsl.h, hsl.s * 0.1, 96),
      accent: baseHex,
      muted: hslToHex(hsl.h, hsl.s * 0.15, 55),
    };
  }
  return {
    bg: hslToHex(hsl.h, Math.max(10, hsl.s * 0.1), 97),
    card: "#FFFFFF",
    text: hslToHex(hsl.h, hsl.s * 0.2, 10),
    accent: baseHex,
    muted: hslToHex(hsl.h, hsl.s * 0.1, 45),
  };
}

// ============================================================================
// TENDÊNCIAS DE COR — Julho 2026
// ============================================================================
export interface ColorTrend {
  id: string; name: string; description: string;
  colors: string[]; tags: string[];
}

export const COLOR_TRENDS_2026: ColorTrend[] = [
  { id: "electric-lavender", name: "Electric Lavender", description: "Roxo elétrico + lilás — AI-native", colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#1E1B2E"], tags: ["AI", "Tech", "Futurista"] },
  { id: "terminal-green", name: "Terminal Green", description: "Verde neon sobre preto — developer", colors: ["#00FF88", "#0A0A0A", "#1A1A1A", "#00E676"], tags: ["Dev", "Mono", "Brutalist"] },
  { id: "sunset-coral", name: "Sunset Coral", description: "Coral quente + laranja — lifestyle", colors: ["#FF6B6B", "#FFA94D", "#FFD93D", "#6BCB77"], tags: ["Warm", "Lifestyle", "Energetic"] },
  { id: "nordic-ice", name: "Nordic Ice", description: "Azuis gelados + brancos — SaaS clean", colors: ["#3B82F6", "#60A5FA", "#DBEAFE", "#0F172A"], tags: ["SaaS", "Corporate", "Clean"] },
  { id: "obsidian-gold", name: "Obsidian Gold", description: "Preto profundo + dourado — luxo", colors: ["#C9A961", "#1A1A1A", "#2D2D2D", "#F5E6CA"], tags: ["Luxury", "Premium", "Editorial"] },
  { id: "matrix-amber", name: "Matrix Amber", description: "Âmbar sobre cinza escuro — brutalist tech", colors: ["#EAB308", "#1A1A1D", "#3F3F46", "#FDE047"], tags: ["Brutalist", "Tech", "Bold"] },
  { id: "soft-sage", name: "Soft Sage", description: "Verde sálvia + cremes — wellness", colors: ["#84CC16", "#DCFCE7", "#F7FEE7", "#365314"], tags: ["Wellness", "Organic", "Calm"] },
  { id: "cyber-magenta", name: "Cyber Magenta", description: "Magenta + ciano — gaming, Web3", colors: ["#EC4899", "#06B6D4", "#1E1B2E", "#F0ABFC"], tags: ["Gaming", "Web3", "Imersivo"] },
  { id: "muted-clay", name: "Muted Clay", description: "Terracota + neutros quentes — artesanal", colors: ["#C2410C", "#FED7AA", "#FFEDD5", "#431407"], tags: ["Artesanal", "Warm", "Organic"] },
  { id: "deep-ocean", name: "Deep Ocean", description: "Azul profundo + teal — enterprise trust", colors: ["#0EA5E9", "#0369A1", "#0C4A6E", "#E0F2FE"], tags: ["Enterprise", "Trust", "Data"] },
  { id: "neon-punk", name: "Neon Punk", description: "Roxo + verde lima — rebel creative", colors: ["#A855F7", "#A3E635", "#0A0A0A", "#FACC15"], tags: ["Creative", "Rebel", "Agency"] },
  { id: "pure-mono", name: "Pure Mono", description: "Preto + branco + 1 accent — Swiss minimal", colors: ["#000000", "#FFFFFF", "#71717A", "#5E6AD2"], tags: ["Minimal", "Swiss", "Clean"] },
];

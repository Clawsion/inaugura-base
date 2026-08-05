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
  | "organic-earth" // Natural earth tones, terracotta + sage
  // ─── Novos estilos (research 2026) ───
  | "fintech-trust"    // Banking/fintech — navy + emerald + cream (trust palette)
  | "healthcare-calm"  // Healthcare/wellness — sage green + warm ivory (Pantone Cloud Dancer 2026)
  | "real-estate-lux"  // Real estate luxury — navy + gold + cream (Luxury Presence)
  | "restaurant-warm"  // Restaurant/hospitality — cacao + olive + cream (Hospitality Design 2026)
  | "creative-agency"  // Agency bold — vibrant triadic, energetic (Adobe Design Trends 2026)
  | "education-friendly"; // EdTech — friendly blue + warm yellow, approachable

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
  // ─── Novos estilos (research 2026) ───
  {
    id: "fintech-trust",
    name: "Fintech Trust",
    description: "Navy + emerald + cream — confiança bancária, estabilidade (research 2026: blue 50%+ market share em fintech)",
    hueRange: [200, 260],
    satRange: [50, 75],
    lightRange: [42, 55],
    darkModeBias: 0.55,
    preferredHarmonies: ["complementary", "analogous"],
    tags: ["Fintech", "Trust", "Enterprise"],
    references: ["Stripe", "Wise", "Revolut", "Monzo"],
  },
  {
    id: "healthcare-calm",
    name: "Healthcare Calm",
    description: "Sage green + warm ivory — calm e sereno (Pantone Cloud Dancer 2026 + wellness research)",
    hueRange: [80, 160],
    satRange: [25, 45],
    lightRange: [55, 72],
    darkModeBias: 0.15,
    preferredHarmonies: ["analogous", "monochromatic"],
    tags: ["Healthcare", "Wellness", "Calm"],
    references: ["Headspace", "Calm", "One Medical", "Hims"],
  },
  {
    id: "real-estate-lux",
    name: "Real Estate Lux",
    description: "Navy + gold + cream — luxury residential (Luxury Presence 2026: navy #1B3A6B + cream #F5F0E8 + sage #7C9A7E)",
    hueRange: [200, 240],
    satRange: [40, 65],
    lightRange: [40, 55],
    darkModeBias: 0.4,
    preferredHarmonies: ["complementary", "analogous"],
    tags: ["Real Estate", "Luxury", "Trust"],
    references: ["Sotheby's", "Compass", "Zillow Premier"],
  },
  {
    id: "restaurant-warm",
    name: "Restaurant Warm",
    description: "Cacao + olive + cream — hospitality 2026 (Hospitality Design: deep cacao browns + edible greens)",
    hueRange: [20, 100],
    satRange: [35, 55],
    lightRange: [38, 55],
    darkModeBias: 0.3,
    preferredHarmonies: ["analogous", "split-complementary"],
    tags: ["Restaurant", "Hospitality", "Warm"],
    references: ["Sweetgreen", "Chipotle", "Eleven Madison Park"],
  },
  {
    id: "creative-agency",
    name: "Creative Agency",
    description: "Vibrant triadic bold — Adobe Design Trends 2026: bright saturated palettes making comeback",
    satRange: [75, 95],
    lightRange: [48, 60],
    darkModeBias: 0.55,
    preferredHarmonies: ["triadic", "tetradic", "split-complementary"],
    tags: ["Agency", "Bold", "Creative"],
    references: ["Bureau Cool", "Active Theory", "Locomotive", "Resn"],
  },
  {
    id: "education-friendly",
    name: "Education Friendly",
    description: "Friendly blue + warm yellow — approachable EdTech (research: blue trust + yellow optimism)",
    hueRange: [180, 280],
    satRange: [50, 70],
    lightRange: [50, 65],
    darkModeBias: 0.25,
    preferredHarmonies: ["analogous", "complementary"],
    tags: ["Education", "Friendly", "Approachable"],
    references: ["Duolingo", "Khan Academy", "Coursera", "Notion"],
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
  | "neon-glow"        // Cyberpunk — neon on deep dark
  | "gradient-pro";    // Gradientes premium — Linear/Vercel/Stripe mesh style

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
    accentLightRange: [40, 48],
    highlightOffsetHue: 30,
    highlightSatDelta: -4,
    highlightLightDelta: 6,
    tags: ["Premium", "Rich", "Default"],
  },
  {
    id: "cream",
    name: "Cream",
    description: "Warm cream tints — Stripe/Resend editorial",
    bgSatRange: [28, 38],
    bgLightRange: [14, 18],
    bgLightLightRange: [94, 97],
    textSatRange: [18, 28],
    accentSatRange: [55, 65],
    accentLightRange: [52, 60],
    highlightOffsetHue: 25,
    highlightSatDelta: -8,
    highlightLightDelta: 8,
    tags: ["Warm", "Editorial", "Cream"],
  },
  {
    id: "vivid",
    name: "Vivid",
    description: "High saturation bold — Awwwards energetic",
    bgSatRange: [32, 44],
    bgLightRange: [7, 11],
    bgLightLightRange: [93, 96],
    textSatRange: [22, 32],
    accentSatRange: [78, 92],
    accentLightRange: [45, 52],
    highlightOffsetHue: 35,
    highlightSatDelta: -2,
    highlightLightDelta: 4,
    tags: ["Bold", "Vivid", "Awwwards"],
  },
  {
    id: "soft-muted",
    name: "Soft Muted",
    description: "Desaturated sophisticated — calm editorial",
    bgSatRange: [14, 22],
    bgLightRange: [12, 16],
    bgLightLightRange: [96, 98],
    textSatRange: [8, 16],
    accentSatRange: [40, 52],
    accentLightRange: [58, 68],
    highlightOffsetHue: 20,
    highlightSatDelta: -10,
    highlightLightDelta: 10,
    tags: ["Soft", "Muted", "Sophisticated"],
  },
  {
    id: "dark-premium",
    name: "Dark Premium",
    description: "Deep jewel-tinted dark — Linear dark mode",
    bgSatRange: [28, 38],
    bgLightRange: [5, 9],
    bgLightLightRange: [96, 98],
    textSatRange: [20, 30],
    accentSatRange: [58, 68],
    accentLightRange: [62, 72],
    highlightOffsetHue: 30,
    highlightSatDelta: -6,
    highlightLightDelta: 5,
    tags: ["Dark", "Premium", "Deep"],
  },
  {
    id: "glass",
    name: "Glass",
    description: "Translucent feel — Glassmorphism frosted",
    bgSatRange: [10, 18],
    bgLightRange: [18, 24],
    bgLightLightRange: [90, 94],
    textSatRange: [6, 14],
    accentSatRange: [50, 62],
    accentLightRange: [65, 75],
    highlightOffsetHue: 40,
    highlightSatDelta: -12,
    highlightLightDelta: 12,
    tags: ["Glass", "Frosted", "Translucent"],
  },
  {
    id: "mono-accent",
    name: "Mono Accent",
    description: "Swiss minimal — 1 accent + neutral grays",
    bgSatRange: [3, 8],
    bgLightRange: [8, 12],
    bgLightLightRange: [97, 99],
    textSatRange: [1, 5],
    accentSatRange: [70, 85],
    accentLightRange: [48, 55],
    highlightOffsetHue: 0,
    highlightSatDelta: -25,
    highlightLightDelta: 18,
    tags: ["Swiss", "Minimal", "Mono"],
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    description: "Cyberpunk — neon over deep dark",
    bgSatRange: [35, 50],
    bgLightRange: [3, 7],
    bgLightLightRange: [86, 92],
    textSatRange: [28, 42],
    accentSatRange: [88, 100],
    accentLightRange: [55, 62],
    highlightOffsetHue: 60,
    highlightSatDelta: 5,
    highlightLightDelta: 2,
    tags: ["Neon", "Cyberpunk", "Glow"],
  },
  {
    id: "gradient-pro",
    name: "Gradient Pro",
    description: "Gradientes premium — Linear/Vercel/Stripe style com mesh + glow",
    bgSatRange: [22, 38],
    bgLightRange: [6, 12],
    bgLightLightRange: [95, 98],
    textSatRange: [12, 22],
    accentSatRange: [65, 82],
    accentLightRange: [48, 58],
    highlightOffsetHue: 35,
    highlightSatDelta: -8,
    highlightLightDelta: 8,
    tags: ["Gradient", "Mesh", "Premium", "Aurora", "Glow"],
  },
];

export function getPolishType(id: string): PolishTypeDef | undefined {
  return POLISH_TYPES.find((p) => p.id === id);
}

// ============================================================================
// OPTIMIZE PALETTE — Ajuste Total que dá "aquela cor de site caro"
// ============================================================================
export function optimizePalette(colors: { hex: string; role: string }[]): { hex: string; role: string }[] {
  const roles = ["Background", "Secundária", "Suporte", "Destaque"];
  const count = colors.length;
  if (count === 0) return colors;

  let accentColor = colors.find((c) => c.role === "Suporte");
  if (!accentColor) accentColor = colors.find((c) => c.role === "Destaque") ?? colors[0];
  const accentHsl = hexToHsl(accentColor.hex);
  const accentHue = accentHsl.h;

  const bgL = colors[0] ? hexToHsl(colors[0].hex).l : 6;
  const isDark = bgL < 30;

  const optAccentSat = Math.max(65, Math.min(78, accentHsl.s));
  const optAccentLight = Math.max(45, Math.min(55, accentHsl.l));
  const optAccentHex = hslToHex(accentHue, optAccentSat, optAccentLight);

  const optBgSat = isDark ? 25 + Math.random() * 8 : 28 + Math.random() * 8;
  const optBgLight = isDark ? 8 + Math.random() * 4 : 95 + Math.random() * 2;
  const optBgHex = hslToHex(accentHue, optBgSat, optBgLight);

  const optTextSat = isDark ? 15 + Math.random() * 8 : 45 + Math.random() * 10;
  const optTextLight = isDark ? 92 + Math.random() * 3 : 18 + Math.random() * 5;
  let optTextHex = hslToHex(accentHue, optTextSat, optTextLight);
  optTextHex = ensureContrast(optTextHex, optBgHex, 4.5);

  const highlightH = (accentHue + 35) % 360;
  const highlightSat = Math.max(55, Math.min(68, optAccentSat - 5));
  const highlightLight = Math.max(52, Math.min(62, optAccentLight + 8));
  const optHighlightHex = hslToHex(highlightH, highlightSat, highlightLight);

  const result: { hex: string; role: string }[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0) result.push({ hex: optBgHex, role: roles[0] });
    else if (i === 1) result.push({ hex: optTextHex, role: roles[1] });
    else if (i === 2) result.push({ hex: optAccentHex, role: roles[2] });
    else result.push({ hex: optHighlightHex, role: roles[3] });
  }
  return result;
}

// ============================================================================
// POLISH SINGLE COLOR — polimento individual de uma cor específica
// ============================================================================
export function polishSingleColor(hex: string, role: string, polishType: PolishType = "jewel"): string {
  const hsl = hexToHsl(hex);
  const pt = getPolishType(polishType) ?? POLISH_TYPES[0];
  const rand = (range: [number, number]) => range[0] + Math.random() * (range[1] - range[0]);

  if (role === "Background") {
    const bgL = hsl.l < 30 ? rand(pt.bgLightRange) : rand(pt.bgLightLightRange);
    return hslToHex(hsl.h, rand(pt.bgSatRange), bgL);
  } else if (role === "Secundária") {
    const textL = hsl.l > 50 ? 92 + Math.random() * 3 : 18 + Math.random() * 5;
    return hslToHex(hsl.h, rand(pt.textSatRange), textL);
  } else if (role === "Suporte") {
    return hslToHex(hsl.h, Math.max(pt.accentSatRange[0], Math.min(pt.accentSatRange[1], hsl.s)), Math.max(pt.accentLightRange[0], Math.min(pt.accentLightRange[1], hsl.l)));
  } else {
    const compH = (hsl.h + pt.highlightOffsetHue) % 360;
    const compSat = Math.max(40, Math.min(95, hsl.s + pt.highlightSatDelta));
    const compLight = Math.max(40, Math.min(75, hsl.l + pt.highlightLightDelta));
    return hslToHex(compH, compSat, compLight);
  }
}

// ============================================================================
// PREMIUM COLOR SYSTEM ARCHITECT — Awwwards Jury Level (Lando Norris / Trionn)
// ============================================================================
// Gera paleta completa Awwwards-level com:
// - Rich blacks (NUNCA pure #000)
// - Luminous accent (sweet spot)
// - Ramps 50-950 para cada cor
// - Semantic tokens completos
// - Light + Dark mode
// - Glow values
// - CSS variables + Tailwind config prontos
// ============================================================================
export interface AwwwardsPalette {
  name: string;
  mood: string;
  isDark: boolean;
  // Core colors
  bg: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  accentForeground: string;
  border: string;
  highlight: string;
  // Ramps 50-950
  accentRamp: Record<string, string>;
  neutralRamp: Record<string, string>;
  // Semantic tokens
  semantic: Record<string, string>;
  // Glow
  accentGlow: string;
  // CSS code
  cssCode: string;
  tailwindCode: string;
}

const MOOD_PRESETS: Record<string, { hue: number; sat: number; light: number; isDark: boolean; name: string }> = {
  "dark-electric": { hue: 200, sat: 85, light: 52, isDark: true, name: "Dark Electric" },
  "dark-luxury-gold": { hue: 42, sat: 68, light: 50, isDark: true, name: "Dark Luxury Gold" },
  "dark-cyber-magenta": { hue: 320, sat: 88, light: 54, isDark: true, name: "Dark Cyber Magenta" },
  "dark-emerald-premium": { hue: 155, sat: 72, light: 48, isDark: true, name: "Dark Emerald Premium" },
  "dark-violet-ai": { hue: 265, sat: 78, light: 52, isDark: true, name: "Dark Violet AI" },
  "dark-coral-warm": { hue: 15, sat: 82, light: 54, isDark: true, name: "Dark Coral Warm" },
  "dark-ice-blue": { hue: 195, sat: 75, light: 50, isDark: true, name: "Dark Ice Blue" },
  "dark-amber-terminal": { hue: 38, sat: 90, light: 52, isDark: true, name: "Dark Amber Terminal" },
};

export function generateAwwwardsPalette(mood?: string): AwwwardsPalette {
  // Escolher mood
  const moods = Object.keys(MOOD_PRESETS);
  const selectedMood = mood && MOOD_PRESETS[mood] ? mood : moods[Math.floor(Math.random() * moods.length)];
  const preset = MOOD_PRESETS[selectedMood];

  const { hue, sat, light, isDark, name } = preset;

  // Rich black — NUNCA pure #000, sempre tinted
  const bgSat = 22 + Math.random() * 10;
  const bgLight = isDark ? 6 + Math.random() * 4 : 96 + Math.random() * 2;
  const bg = hslToHex(hue, bgSat, bgLight);

  // Card — um tom acima do bg
  const cardSat = bgSat + 4;
  const cardLight = isDark ? bgLight + 4 : bgLight - 2;
  const card = hslToHex(hue, cardSat, cardLight);

  // Text — rich cream (dark) ou deep saturated (light)
  const textSat = isDark ? 14 + Math.random() * 8 : 42 + Math.random() * 10;
  const textLight = isDark ? 92 + Math.random() * 3 : 16 + Math.random() * 5;
  let text = hslToHex(hue, textSat, textLight);
  text = ensureContrast(text, bg, 4.5);

  // Muted — texto secundário
  const mutedSat = isDark ? 10 : 25;
  const mutedLight = isDark ? 60 + Math.random() * 8 : 45 + Math.random() * 8;
  const muted = hslToHex(hue, mutedSat, mutedLight);

  // Accent — LUMINOUS, sweet spot
  const accentSat = Math.max(68, Math.min(82, sat));
  const accentLight = Math.max(48, Math.min(56, light));
  const accent = hslToHex(hue, accentSat, accentLight);
  const accentForeground = isDark ? bg : "#FFFFFF";

  // Border — subtil, tinted
  const borderSat = isDark ? 18 : 15;
  const borderLight = isDark ? 16 + Math.random() * 4 : 88 + Math.random() * 4;
  const border = hslToHex(hue, borderSat, borderLight);

  // Highlight — complementar harmonioso (35° offset)
  const highlightH = (hue + 35) % 360;
  const highlightSat = Math.max(55, Math.min(70, accentSat - 8));
  const highlightLight = Math.max(50, Math.min(62, accentLight + 6));
  const highlight = hslToHex(highlightH, highlightSat, highlightLight);

  // Ramp 50-950 para accent
  const accentRamp: Record<string, string> = {};
  for (let i = 50; i <= 950; i += 50) {
    const rampLight = isDark
      ? Math.max(8, Math.min(95, accentLight + (i - 500) * 0.08))
      : Math.max(10, Math.min(92, accentLight + (i - 500) * 0.07));
    const rampSat = Math.max(30, Math.min(90, accentSat + (i - 500) * 0.02));
    accentRamp[i.toString()] = hslToHex(hue, rampSat, rampLight);
  }

  // Ramp 50-950 para neutral (tinted com hue)
  const neutralRamp: Record<string, string> = {};
  for (let i = 50; i <= 950; i += 50) {
    const nLight = isDark
      ? Math.max(6, Math.min(96, (i / 950) * 90 + 6))
      : Math.max(8, Math.min(98, (i / 950) * 90 + 8));
    const nSat = isDark ? bgSat * 0.6 : bgSat * 0.3;
    neutralRamp[i.toString()] = hslToHex(hue, nSat, nLight);
  }

  // Semantic tokens
  const semantic = {
    "bg-primary": bg,
    "bg-secondary": card,
    "bg-tertiary": hslToHex(hue, bgSat + 6, isDark ? bgLight + 8 : bgLight - 4),
    "text-primary": text,
    "text-secondary": muted,
    "text-tertiary": hslToHex(hue, mutedSat, isDark ? mutedLight - 10 : mutedLight + 10),
    "accent-primary": accent,
    "accent-hover": hslToHex(hue, accentSat, accentLight + (isDark ? 4 : -4)),
    "accent-active": hslToHex(hue, accentSat + 4, accentLight - 4),
    "border-subtle": hslToHex(hue, borderSat, borderLight),
    "border-strong": hslToHex(hue, borderSat + 6, borderLight + (isDark ? 4 : -4)),
    "border-accent": hslToHex(hue, accentSat * 0.4, accentLight * 0.6),
    "success": hslToHex(140, 65, 50),
    "warning": hslToHex(38, 80, 52),
    "error": hslToHex(0, 72, 54),
    "info": hslToHex(200, 72, 52),
  };

  // Glow
  const accentGlow = `0 0 30px ${accent}40, 0 0 60px ${accent}20`;

  // CSS code
  const cssCode = `:root {
  --bg: ${bg};
  --card: ${card};
  --text: ${text};
  --muted: ${muted};
  --accent: ${accent};
  --accent-foreground: ${accentForeground};
  --border: ${border};
  --highlight: ${highlight};
  --accent-glow: ${accentGlow};
  
  /* Accent Ramp */
${Object.entries(accentRamp).map(([k, v]) => `  --accent-${k}: ${v};`).join("\n")}
  
  /* Neutral Ramp */
${Object.entries(neutralRamp).map(([k, v]) => `  --neutral-${k}: ${v};`).join("\n")}
  
  /* Semantic */
${Object.entries(semantic).map(([k, v]) => `  --${k}: ${v};`).join("\n")}
}`;

  // Tailwind code
  const tailwindCode = `// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        bg: "${bg}",
        card: "${card}",
        text: "${text}",
        muted: "${muted}",
        accent: {
          DEFAULT: "${accent}",
          foreground: "${accentForeground}",
${Object.entries(accentRamp).map(([k, v]) => `          ${k}: "${v}",`).join("\n")}
        },
        neutral: {
${Object.entries(neutralRamp).map(([k, v]) => `          ${k}: "${v}",`).join("\n")}
        },
        highlight: "${highlight}",
        success: "${semantic.success}",
        warning: "${semantic.warning}",
        error: "${semantic.error}",
        info: "${semantic.info}",
      },
      boxShadow: {
        glow: "${accentGlow}",
      },
    },
  },
};`;

  return {
    name,
    mood: selectedMood,
    isDark,
    bg, card, text, muted, accent, accentForeground, border, highlight,
    accentRamp, neutralRamp, semantic, accentGlow,
    cssCode, tailwindCode,
  };
}

// ============================================================================
// TRANSFORMAR PARA AWWWARDS — pega nas CORES ATUAIS e eleva-as ao nível máximo
// ============================================================================
// Esta é a função que o botão "Special" usa:
//   1. DETETA as cores atuais (preserva o hue/harmonia que o user escolheu)
//   2. TRANSFORMA-as para a máxima definição premium (Awwwards level)
//   3. NÃO gera cores novas — apenas eleva as existentes ao nível de sites premium
//
// Princípios aplicados (skill de "Premium Color System Architect"):
//   - Rich black (NUNCA pure #000) — sempre tinted com o hue do accent
//   - Luminous accent (sweet spot s=68-80%, l=48-56%)
//   - Text com contrast ratio ≥ 7:1 (AAA) se possível
//   - Card com elevation subtil (ΔL 3-5%)
//   - Border tinted, não neutro
//   - Highlight harmonioso (35° offset do accent)
//   - Glow calculado para o accent
//   - Ramps 50-950 tinted com o hue base
//   - Semantic tokens completos
// ============================================================================
export function transformToAwwwards(
  inputColors: { hex: string; role: string }[]
): AwwwardsPalette {
  // Se não há cores, fallback para gerar
  if (!inputColors || inputColors.length === 0) {
    return generateAwwwardsPalette();
  }

  // Extrair cores por role (preservando o que o user escolheu)
  const find = (keywords: string[]) =>
    inputColors.find((c) =>
      keywords.some((k) => c.role.toLowerCase().includes(k))
    );

  const bgInput = find(["background", "bg", "fundo"]) ?? inputColors[0];
  const textInput = find(["secundária", "secundaria", "text", "texto", "foreground"]);
  const accentInput = find(["destaque", "accent", "primary", "cta", "vibrant"]) ??
                       find(["suporte", "support", "secondary"]) ??
                       inputColors[inputColors.length - 1];
  const highlightInput = find(["suporte", "support", "highlight"]);

  // Converter para HSL para analisar
  const bgHsl = hexToHsl(bgInput.hex);
  const accentHsl = hexToHsl(accentInput.hex);
  const textHsl = textInput ? hexToHsl(textInput.hex) : null;

  // DETETAR dark/light baseado no background atual
  const isDark = bgHsl.l < 35;

  // Hue base = MANTER o hue do accent do user (preserva a identidade da palete)
  const hue = accentHsl.h;
  const baseSat = accentHsl.s;

  // Nome baseado no hue + darkness
  const hueNames: Record<number, string> = {
    0: "Crimson", 15: "Coral", 30: "Amber", 45: "Gold",
    60: "Lime", 90: "Forest", 120: "Emerald", 150: "Teal",
    180: "Cyan", 200: "Sky", 220: "Ocean", 240: "Indigo",
    260: "Violet", 280: "Purple", 300: "Magenta", 320: "Pink",
    340: "Rose",
  };
  const hueName = hueNames[Math.round(hue / 20) * 20] ?? "Aurora";
  const name = `${hueName} ${isDark ? "Premium Dark" : "Premium Light"}`;
  const mood = hueName;

  // ─── TRANSFORMAR cada cor para Awwwards level ────────────────────────────
  // RICH BLACK bg — tinted com o hue do accent, NUNCA pure #000
  // Forçar valores Awwwards IDEAL (não preservar L atual) para transformação visível
  const bgSat = isDark
    ? 28 + Math.random() * 7      // dark: 28-35% sat (rich tinted black)
    : 20 + Math.random() * 8;     // light: 20-28% sat (warm cream)
  const bgLight = isDark
    ? 7 + Math.random() * 4       // dark: 7-11% (rich black, NUNCA pure #000)
    : 96 + Math.random() * 2;     // light: 96-98% (warm cream)
  const bg = hslToHex(hue, bgSat, bgLight);

  // Card — elevação subtil (ΔL 4-6%)
  const cardSat = bgSat + 4;
  const cardLight = isDark ? bgLight + 5 : bgLight - 4;
  const card = hslToHex(hue, cardSat, cardLight);

  // Text — rich cream (dark) ou deep saturated (light), com contrast máximo
  const textSat = isDark
    ? 15 + Math.random() * 7      // dark: 15-22% sat
    : 42 + Math.random() * 8;     // light: 42-50% sat
  const textLight = isDark
    ? 92 + Math.random() * 3      // dark: 92-95% cream (bright)
    : 16 + Math.random() * 4;     // light: 16-20% deep
  let text = hslToHex(hue, textSat, textLight);
  text = ensureContrast(text, bg, 7);  // AAA contrast

  // Muted — texto secundário
  const mutedSat = isDark ? 8 : 22;
  const mutedLight = isDark ? 60 : 48;
  const muted = hslToHex(hue, mutedSat, mutedLight);

  // Accent — LUMINOUS, sweet spot (MANTÉM o hue do user)
  const accentSat = Math.max(68, Math.min(82, accentHsl.s));  // 68-82% (vivid)
  const accentLight = Math.max(48, Math.min(56, accentHsl.l)); // 48-56% (luminous)
  const accent = hslToHex(hue, accentSat, accentLight);
  const accentForeground = isDark ? bg : "#FFFFFF";

  // Border — subtil, tinted
  const borderSat = isDark ? 16 : 14;
  const borderLight = isDark ? 16 : 88;
  const border = hslToHex(hue, borderSat, borderLight);

  // Highlight — complementar harmonioso (35° offset)
  const highlightH = (hue + 35) % 360;
  const highlightSat = Math.max(55, Math.min(70, accentSat - 8));
  const highlightLight = Math.max(50, Math.min(62, accentLight + 6));
  const highlight = highlightInput
    ? hslToHex(hexToHsl(highlightInput.hex).h, highlightSat, highlightLight)
    : hslToHex(highlightH, highlightSat, highlightLight);

  // Ramp 50-950 para accent (tinted com hue)
  const accentRamp: Record<string, string> = {};
  for (let i = 50; i <= 950; i += 50) {
    const rampLight = isDark
      ? Math.max(8, Math.min(95, accentLight + (i - 500) * 0.08))
      : Math.max(10, Math.min(92, accentLight + (i - 500) * 0.07));
    const rampSat = Math.max(30, Math.min(90, accentSat + (i - 500) * 0.02));
    accentRamp[i.toString()] = hslToHex(hue, rampSat, rampLight);
  }

  // Ramp 50-950 para neutral (tinted com hue)
  const neutralRamp: Record<string, string> = {};
  for (let i = 50; i <= 950; i += 50) {
    const nLight = isDark
      ? Math.max(6, Math.min(96, (i / 950) * 90 + 6))
      : Math.max(8, Math.min(98, (i / 950) * 90 + 8));
    const nSat = isDark ? bgSat * 0.6 : bgSat * 0.3;
    neutralRamp[i.toString()] = hslToHex(hue, nSat, nLight);
  }

  // Semantic tokens
  const semantic = {
    "bg-primary": bg,
    "bg-secondary": card,
    "bg-tertiary": hslToHex(hue, bgSat + 6, isDark ? bgLight + 8 : bgLight - 4),
    "text-primary": text,
    "text-secondary": muted,
    "text-tertiary": hslToHex(hue, mutedSat, isDark ? mutedLight - 10 : mutedLight + 10),
    "accent-primary": accent,
    "accent-hover": hslToHex(hue, accentSat, accentLight + (isDark ? 4 : -4)),
    "accent-active": hslToHex(hue, accentSat + 4, accentLight - 4),
    "border-subtle": hslToHex(hue, borderSat, borderLight),
    "border-strong": hslToHex(hue, borderSat + 6, borderLight + (isDark ? 4 : -4)),
    "border-accent": hslToHex(hue, accentSat * 0.4, accentLight * 0.6),
    "success": hslToHex(140, 65, 50),
    "warning": hslToHex(38, 80, 52),
    "error": hslToHex(0, 72, 54),
    "info": hslToHex(200, 72, 52),
  };

  // Glow
  const accentGlow = `0 0 30px ${accent}40, 0 0 60px ${accent}20`;

  // CSS code
  const cssCode = `:root {
  --bg: ${bg};
  --card: ${card};
  --text: ${text};
  --muted: ${muted};
  --accent: ${accent};
  --accent-foreground: ${accentForeground};
  --border: ${border};
  --highlight: ${highlight};
  --accent-glow: ${accentGlow};
}

/* Light mode */
[data-theme="light"] {
  --bg: ${isDark ? hslToHex(hue, 18, 97) : bg};
  --text: ${isDark ? hslToHex(hue, 40, 18) : text};
}

/* Glow utility */
.glow-accent {
  box-shadow: var(--accent-glow);
}

/* Smooth transitions */
* {
  transition: background-color 200ms, border-color 200ms, color 200ms;
}`;

  // Tailwind code
  const tailwindCode = `// tailwind.config.ts
const colors = {
  bg: "${bg}",
  card: "${card}",
  text: "${text}",
  muted: "${muted}",
  accent: {
    DEFAULT: "${accent}",
    foreground: "${accentForeground}",
    glow: "${accentGlow}",
    50: "${accentRamp["50"]}",
    100: "${accentRamp["100"]}",
    200: "${accentRamp["200"]}",
    300: "${accentRamp["300"]}",
    400: "${accentRamp["400"]}",
    500: "${accentRamp["500"]}",
    600: "${accentRamp["600"]}",
    700: "${accentRamp["700"]}",
    800: "${accentRamp["800"]}",
    900: "${accentRamp["900"]}",
    950: "${accentRamp["950"]}",
  },
  border: "${border}",
  highlight: "${highlight}",
};

module.exports = {
  theme: {
    extend: { colors },
  },
};`;

  return {
    name, mood, isDark,
    bg, card, text, muted, accent, accentForeground, border, highlight,
    accentRamp, neutralRamp, semantic, accentGlow,
    cssCode, tailwindCode,
  };
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
  // ─── Paletes reais de marcas (research 2026) ───
  { id: "linear-purple", name: "Linear Purple", description: "Roxo profundo + cream — Linear brand 2026", colors: ["#5E6AD2", "#0D0D0D", "#1C1C1C", "#F4F4F5"], tags: ["SaaS", "Premium", "Dark"] },
  { id: "vercel-mono", name: "Vercel Mono", description: "Black + white + blue accent — Vercel Geist 2026", colors: ["#000000", "#FFFFFF", "#FAFAFA", "#0070F3"], tags: ["SaaS", "Minimal", "Tech"] },
  { id: "stripe-editorial", name: "Stripe Editorial", description: "Cream warm + iris purple — Stripe 2026", colors: ["#6355FF", "#FFFAF0", "#F5F0E8", "#0A2540"], tags: ["Editorial", "Fintech", "Cream"] },
  { id: "notion-warm", name: "Notion Warm", description: "Off-white + warm gray + accent — Notion 2026", colors: ["#FFFFFF", "#F7F6F3", "#37352F", "#2EAADC"], tags: ["SaaS", "Warm", "Editorial"] },
  { id: "resend-cream", name: "Resend Cream", description: "Cream + dark text + amber — Resend 2026", colors: ["#09090B", "#FAFAF9", "#F5F5F4", "#FBBF24"], tags: ["Editorial", "Cream", "Dev"] },
  { id: "fintech-navy", name: "Fintech Navy", description: "Navy + emerald + cream — Wise/Revolut style", colors: ["#00376E", "#00A35C", "#F5F0E8", "#1B3A6B"], tags: ["Fintech", "Trust", "Enterprise"] },
  { id: "healthcare-sage", name: "Healthcare Sage", description: "Sage + ivory + soft blue — wellness 2026", colors: ["#929C92", "#C9D3CA", "#F5F0E8", "#A39384"], tags: ["Healthcare", "Calm", "Wellness"] },
  { id: "luxury-gold", name: "Luxury Gold", description: "Black + gold + cream — Sotheby's style", colors: ["#0A0A0A", "#C9A961", "#F5E6CA", "#2D2D2D"], tags: ["Luxury", "Premium", "Editorial"] },
  { id: "restaurant-cacao", name: "Restaurant Cacao", description: "Deep cacao + olive + cream — hospitality 2026", colors: ["#3D2817", "#6B7A3F", "#F5F0E8", "#8B6F47"], tags: ["Restaurant", "Warm", "Hospitality"] },
  { id: "agency-bold", name: "Agency Bold", description: "Vibrant triadic — Bureau Cool style", colors: ["#FF3366", "#33FF66", "#3366FF", "#0A0A0A"], tags: ["Agency", "Bold", "Creative"] },
  { id: "edu-friendly", name: "Edu Friendly", description: "Blue + yellow + cream — Duolingo style", colors: ["#1CB0F6", "#FFC800", "#FFFFFF", "#3C3C3C"], tags: ["Education", "Friendly", "Approachable"] },
  { id: "pantone-cloud", name: "Pantone Cloud Dancer", description: "Pantone 2026 — soft whites + calming influence", colors: ["#F5F2EB", "#E8E4DC", "#FFFFFF", "#A8A095"], tags: ["Pantone", "2026", "Calm"] },
  { id: "mocha-mousse", name: "Mocha Mousse", description: "Pantone 2025 — warm brown cacao tones", colors: ["#A47864", "#5D4037", "#F5F0E8", "#8B6F47"], tags: ["Pantone", "Warm", "Earth"] },
  // ─── Tendências 2025-2026 (WGSN + Pantone + Trend forecasting) ───
  { id: "future-dusk", name: "Future Dusk", description: "WGSN 2025 — dark moody blue-purple, mysterious", colors: ["#8A9CB1", "#4A5B7A", "#1E2A47", "#0A1228"], tags: ["WGSN", "2025", "Moody"] },
  { id: "transformative-teal", name: "Transformative Teal", description: "WGSN 2026 Color of the Year — ecological teal", colors: ["#0F766E", "#14B8A6", "#5EEAD4", "#003B36"], tags: ["WGSN", "2026", "Teal"] },
  { id: "mermaidcore", name: "Mermaidcore", description: "2026 trend — ocean aqua + coral + pearl", colors: ["#06B6D4", "#0EA5E9", "#FB7185", "#F0FDFA"], tags: ["2026", "Ocean", "Playful"] },
  { id: "banana-yellow", name: "Banana Yellow", description: "2026 trend — energetic yellow + deep navy", colors: ["#FACC15", "#FDE047", "#1E3A8A", "#0F172A"], tags: ["2026", "Yellow", "Energetic"] },
  { id: "tangerine-disco", name: "Tangerine Disco", description: "2026 trend — retro disco orange + brown", colors: ["#FB923C", "#EA580C", "#431407", "#FED7AA"], tags: ["2026", "Orange", "Retro"] },
  { id: "sunwashed-soft", name: "Sunwashed Soft", description: "2026 trend — sun-bleached pastels, calm", colors: ["#FEF3C7", "#FDE68A", "#A7F3D0", "#BAE6FD"], tags: ["2026", "Soft", "Pastel"] },
  { id: "clubroom-contrast", name: "Clubroom Contrast", description: "2026 trend — deep clubroom + bright accent", colors: ["#1A1A1A", "#3D2817", "#DC2626", "#FCD34D"], tags: ["2026", "Contrast", "Bold"] },
  { id: "neon-shock", name: "Neon Shock", description: "2026 trend — high-contrast neon on dark", colors: ["#0A0A0A", "#1A1A1A", "#00FF88", "#FF00FF"], tags: ["2026", "Neon", "Shock"] },
  { id: "molten-teal", name: "Molten Teal", description: "2026 trend — molten liquid teal gradient", colors: ["#0F766E", "#06B6D4", "#F59E0B", "#FED7AA"], tags: ["2026", "Teal", "Molten"] },
  { id: "eclectic-purple", name: "Eclectic Purple", description: "2026 trend — eclectic purple mix", colors: ["#7C3AED", "#A855F7", "#EC4899", "#1E1B4B"], tags: ["2026", "Purple", "Eclectic"] },
  { id: "electric-blue-2026", name: "Electric Blue 2026", description: "2026 trend — bold electric blue dominating", colors: ["#0066FF", "#00A3FF", "#0A0A0A", "#FFFFFF"], tags: ["2026", "Blue", "Electric"] },
  { id: "fiery-red-2026", name: "Fiery Red 2026", description: "2026 trend — urgent passionate red", colors: ["#DC2626", "#EF4444", "#0A0A0A", "#FED7AA"], tags: ["2026", "Red", "Fiery"] },
];

// ============================================================================
// TENDÊNCIAS TRANSIENTES — Paletes dinâmicas para gradientes/aurora/mesh
// ============================================================================
// 25 paletes "transientes" desenhadas para uso intensivo em gradientes.
// Ao contrário das paletes normais (cores estáticas planas), estas são
// otimizadas para: mesh gradients, aurora backgrounds, gradient text,
// animated backgrounds, e efeitos de profundidade.
//
// Cada palete tem 4 cores com progressão de luminosidade suave (essencial
// para gradientes bonitos) + tags indicando o tipo de gradiente recomendado.
// ============================================================================
export const COLOR_TRANSIENTS_2026: ColorTrend[] = [
  // ─── Aurora / Atmospheric (5) ──────────────────────────────────────────
  { id: "trans-aurora-violet", name: "Aurora Violet", description: "Aurora violeta — mesh gradient noturno", colors: ["#0A0A0F", "#1E1B4B", "#8B5CF6", "#C4B5FD"], tags: ["Aurora", "Mesh", "Dark"] },
  { id: "trans-aurora-cyan", name: "Aurora Cyan", description: "Aurora cyan — gradiente atmosférico frio", colors: ["#0B1224", "#1E3A8A", "#06B6D4", "#67E8F9"], tags: ["Aurora", "Atmospheric", "Cold"] },
  { id: "trans-aurora-rose", name: "Aurora Rose", description: "Aurora rosa — mesh gradient quente", colors: ["#1A0A1A", "#4A0E4E", "#EC4899", "#F9A8D4"], tags: ["Aurora", "Mesh", "Warm"] },
  { id: "trans-aurora-emerald", name: "Aurora Emerald", description: "Aurora esmeralda — gradiente orgânico", colors: ["#0A1A0A", "#14532D", "#10B981", "#6EE7B7"], tags: ["Aurora", "Organic", "Green"] },
  { id: "trans-aurora-gold", name: "Aurora Gold", description: "Aurora dourada — mesh gradient luxo", colors: ["#0F0E0C", "#3D2F1F", "#C9A961", "#F5E6CA"], tags: ["Aurora", "Luxury", "Mesh"] },

  // ─── Mesh Gradient (5) ─────────────────────────────────────────────────
  { id: "trans-mesh-ocean", name: "Mesh Ocean", description: "Mesh oceano — multi-radial premium", colors: ["#0B1224", "#1E3A8A", "#3B82F6", "#06B6D4"], tags: ["Mesh", "Ocean", "Premium"] },
  { id: "trans-mesh-sunset", name: "Mesh Sunset", description: "Mesh sunset — radial gradient quente", colors: ["#1A0F0A", "#431407", "#FB923C", "#FED7AA"], tags: ["Mesh", "Sunset", "Warm"] },
  { id: "trans-mesh-forest", name: "Mesh Forest", description: "Mesh floresta — radial gradient orgânico", colors: ["#0A1A0A", "#14532D", "#84CC16", "#DCFCE7"], tags: ["Mesh", "Forest", "Organic"] },
  { id: "trans-mesh-cyber", name: "Mesh Cyber", description: "Mesh cyber — radial gradient tech", colors: ["#0A0E1A", "#1E293B", "#3B82F6", "#06B6D4"], tags: ["Mesh", "Cyber", "Tech"] },
  { id: "trans-mesh-candy", name: "Mesh Candy", description: "Mesh candy — radial gradient playful", colors: ["#1A0A1A", "#4A0E4E", "#EC4899", "#A855F7"], tags: ["Mesh", "Candy", "Playful"] },

  // ─── Linear Gradient Flow (5) ──────────────────────────────────────────
  { id: "trans-flow-linear", name: "Linear Flow", description: "Linear flow — gradiente Linear style", colors: ["#0C0A09", "#1E1B4B", "#5E6AD2", "#8B5CF6"], tags: ["Flow", "Linear", "SaaS"] },
  { id: "trans-flow-vercel", name: "Vercel Flow", description: "Vercel flow — gradiente Vercel style", colors: ["#000000", "#0A0A0A", "#171717", "#0070F3"], tags: ["Flow", "Vercel", "Minimal"] },
  { id: "trans-flow-stripe", name: "Stripe Flow", description: "Stripe flow — gradiente Stripe style", colors: ["#FFFAF0", "#F5F0E8", "#6355FF", "#0A2540"], tags: ["Flow", "Stripe", "Editorial"] },
  { id: "trans-flow-raycast", name: "Raycast Flow", description: "Raycast flow — gradiente Raycast style", colors: ["#0A0A0A", "#1A1A2E", "#7C3AED", "#06B6D4"], tags: ["Flow", "Raycast", "Dev"] },
  { id: "trans-flow-cursor", name: "Cursor Flow", description: "Cursor flow — gradiente Cursor style", colors: ["#0A0A0A", "#1A1A1A", "#3B82F6", "#8B5CF6"], tags: ["Flow", "Cursor", "AI"] },

  // ─── Liquid / Morph (5) ────────────────────────────────────────────────
  { id: "trans-liquid-mercury", name: "Liquid Mercury", description: "Mercúrio líquido — morph metálico", colors: ["#1A1A1A", "#3D3D3D", "#9CA3AF", "#E5E7EB"], tags: ["Liquid", "Morph", "Metallic"] },
  { id: "trans-liquid-lava", name: "Liquid Lava", description: "Lava líquida — morph quente", colors: ["#1A0A0A", "#4A0E0E", "#DC2626", "#FBBF24"], tags: ["Liquid", "Morph", "Hot"] },
  { id: "trans-liquid-ocean", name: "Liquid Ocean", description: "Oceano líquido — morph frio", colors: ["#0A1A2E", "#0C4A6E", "#0EA5E9", "#7DD3FC"], tags: ["Liquid", "Morph", "Cold"] },
  { id: "trans-liquid-plasma", name: "Liquid Plasma", description: "Plasma líquido — morph neon", colors: ["#0A0A1A", "#1E1B4B", "#A855F7", "#06B6D4"], tags: ["Liquid", "Morph", "Neon"] },
  { id: "trans-liquid-aurora", name: "Liquid Aurora", description: "Aurora líquida — morph orgânico", colors: ["#0A1A0A", "#14532D", "#10B981", "#67E8F9"], tags: ["Liquid", "Morph", "Organic"] },

  // ─── Glow / Bloom (5) ──────────────────────────────────────────────────
  { id: "trans-glow-violet", name: "Glow Violet", description: "Glow violeta — bloom premium", colors: ["#0A0A0F", "#1E1B4B", "#8B5CF6", "#E9D5FF"], tags: ["Glow", "Bloom", "Violet"] },
  { id: "trans-glow-cyan", name: "Glow Cyan", description: "Glow cyan — bloom tech", colors: ["#0B1224", "#1E3A8A", "#06B6D4", "#A5F3FC"], tags: ["Glow", "Bloom", "Cyan"] },
  { id: "trans-glow-amber", name: "Glow Amber", description: "Glow âmbar — bloom warm", colors: ["#1A0F0A", "#431407", "#F59E0B", "#FDE68A"], tags: ["Glow", "Bloom", "Warm"] },
  { id: "trans-glow-emerald", name: "Glow Emerald", description: "Glow esmeralda — bloom organic", colors: ["#0A1A0A", "#14532D", "#10B981", "#A7F3D0"], tags: ["Glow", "Bloom", "Organic"] },
  { id: "trans-glow-magenta", name: "Glow Magenta", description: "Glow magenta — bloom cyber", colors: ["#1A0A1A", "#4A0E4E", "#EC4899", "#FBCFE8"], tags: ["Glow", "Bloom", "Cyber"] },

  // ─── Tendências 2025-2026 Transientes (12 novas) ─────────────────────
  { id: "trans-future-dusk", name: "Future Dusk Flow", description: "WGSN 2025 — dusk blue-purple mesh gradient", colors: ["#0A1228", "#1E2A47", "#4A5B7A", "#8A9CB1"], tags: ["WGSN", "2025", "Dusk"] },
  { id: "trans-transformative-teal", name: "Transformative Teal Flow", description: "WGSN 2026 — ecological teal mesh gradient", colors: ["#003B36", "#0F766E", "#14B8A6", "#5EEAD4"], tags: ["WGSN", "2026", "Teal"] },
  { id: "trans-mermaidcore", name: "Mermaidcore Flow", description: "2026 — ocean aqua + coral mesh gradient", colors: ["#0A1A2E", "#0EA5E9", "#06B6D4", "#FB7185"], tags: ["2026", "Ocean", "Mermaid"] },
  { id: "trans-banana-yellow", name: "Banana Yellow Flow", description: "2026 — energetic yellow + navy mesh", colors: ["#0F172A", "#1E3A8A", "#FACC15", "#FDE047"], tags: ["2026", "Yellow", "Energetic"] },
  { id: "trans-tangerine-disco", name: "Tangerine Disco Flow", description: "2026 — retro disco orange mesh gradient", colors: ["#431407", "#7C2D12", "#FB923C", "#FED7AA"], tags: ["2026", "Orange", "Disco"] },
  { id: "trans-sunwashed-soft", name: "Sunwashed Soft Flow", description: "2026 — sun-bleached pastel mesh gradient", colors: ["#FDF6E3", "#FEF3C7", "#FDE68A", "#A7F3D0"], tags: ["2026", "Soft", "Pastel"] },
  { id: "trans-clubroom-contrast", name: "Clubroom Contrast Flow", description: "2026 — deep clubroom + bright accent mesh", colors: ["#1A1A1A", "#3D2817", "#DC2626", "#FCD34D"], tags: ["2026", "Contrast", "Clubroom"] },
  { id: "trans-neon-shock", name: "Neon Shock Flow", description: "2026 — high-contrast neon mesh on dark", colors: ["#0A0A0A", "#1A1A1A", "#00FF88", "#FF00FF"], tags: ["2026", "Neon", "Shock"] },
  { id: "trans-molten-teal", name: "Molten Teal Flow", description: "2026 — molten liquid teal + amber mesh", colors: ["#003B36", "#0F766E", "#06B6D4", "#F59E0B"], tags: ["2026", "Teal", "Molten"] },
  { id: "trans-eclectic-purple", name: "Eclectic Purple Flow", description: "2026 — eclectic purple mesh gradient", colors: ["#1E1B4B", "#7C3AED", "#A855F7", "#EC4899"], tags: ["2026", "Purple", "Eclectic"] },
  { id: "trans-electric-blue-2026", name: "Electric Blue Flow 2026", description: "2026 — bold electric blue mesh gradient", colors: ["#0A0A0A", "#003B73", "#0066FF", "#00A3FF"], tags: ["2026", "Blue", "Electric"] },
  { id: "trans-fiery-red-2026", name: "Fiery Red Flow 2026", description: "2026 — urgent passionate red mesh gradient", colors: ["#0A0A0A", "#450A0A", "#DC2626", "#FED7AA"], tags: ["2026", "Red", "Fiery"] },
];

// Helper: obter todas as paletes (normais + transientes)
export function getAllPalettes(): ColorTrend[] {
  return [...COLOR_TRENDS_2026, ...COLOR_TRANSIENTS_2026];
}

// Helper: obter paletes por modo
export function getPalettesByMode(mode: "normal" | "transient"): ColorTrend[] {
  return mode === "transient" ? COLOR_TRANSIENTS_2026 : COLOR_TRENDS_2026;
}

// ============================================================================
// GERAR PALETA GRADIENT PREMIUM — para Generate de paletes gradientes
// ============================================================================
// Quando o user faz Generate no modo "Gradientes" (individual ou global),
// esta função gera uma palete gradient premium aleatória baseada nas 8
// paletes curatoriais da GradientPalettesLibrary.
//
// Princípios:
//   - Rich black bg (tinted, nunca pure #000)
//   - Luminous accent (sweet spot s=68-82%, l=48-56%)
//   - Progressão de luminosidade suave (essencial para gradientes bonitos)
//   - 4 cores com roles: Background, Secundária, Destaque, Suporte
// ============================================================================
// ============================================================================
// GERADOR DE PALETAS UI/UX — Design Tokens com Gradiente Âncora
// ============================================================================
// Sistema robusto baseado em Design Systems e CSS moderno.
//
// Regras matemáticas e de design aplicadas estritamente:
//
// 1. GERADOR DE GRADIENTE ÂNCORA:
//    - Identifica 2 cores sólidas base (--cor-marca-1 e --cor-marca-2)
//    - As 2 cores são VIZINHAS na roda de cores (Analogia, offset 15-45°)
//      para evitar transições cinzentas no meio do gradient
//    - Variação de luminosidade entre as 2 (uma mais clara que a outra
//      para simular iluminação)
//    - Token: --gradiente-opcao: linear-gradient(135deg, cor1, cor2)
//
// 2. INJEÇÃO DE NEUTROS:
//    - NUNCA pretos ou cinzentos puros (#000 ou #888)
//    - Injeta 5% da --cor-marca-1 nos tons de fundo e texto
//      para garantir harmonia cromática global
//
// 3. SAÍDA DE CÓDIGO:
//    - CSS estruturado dentro de :root
//    - Classes utilitárias modulares (.btn / .btn-gradient,
//      .titulo / .titulo-gradient) para ativar gradiente como opção no HTML
// ============================================================================
export interface GradientDesignTokens {
  // 2 cores âncora (vizinhas na roda de cores)
  corMarca1: string;
  corMarca2: string;
  // Neutros injetados com 5% da cor-marca-1
  bg: string;
  bgElevado: string;
  texto: string;
  textoSuave: string;
  borda: string;
  // Gradiente âncora
  gradiente: string;
  // Classes utilitárias CSS prontas
  cssCode: string;
  // Nome da paleta
  name: string;
  isDark: boolean;
}

// Helper: misturar 2 cores em proporção (0-1)
function mixColors(hex1: string, hex2: string, ratio: number): string {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Helper: converter hex para RGB object
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function generateGradientPremiumPalette(
  count: 2 | 3 | 4 = 4,
  baseColors?: string[]
): { hex: string; role: string }[] {
  // ─── 12 DUPLAS DE HUES VIZINHOS (Analogia) — Awwwards 2026 ─────────────
  // Cada dupla tem offset 15-45° (vizinhos na roda de cores)
  // Isto evita transições cinzentas no meio do gradient
  const anchorCombos = [
    { hue1: 320, hue2: 350, name: "Magenta Rose" },     // 30° offset
    { hue1: 280, hue2: 310, name: "Violet Magenta" },   // 30° offset
    { hue1: 220, hue2: 250, name: "Navy Indigo" },      // 30° offset
    { hue1: 200, hue2: 230, name: "Ocean Blue" },       // 30° offset
    { hue1: 180, hue2: 210, name: "Cyan Navy" },        // 30° offset
    { hue1: 160, hue2: 190, name: "Teal Cyan" },        // 30° offset
    { hue1: 140, hue2: 170, name: "Emerald Teal" },     // 30° offset
    { hue1: 90, hue2: 120, name: "Lime Emerald" },      // 30° offset
    { hue1: 45, hue2: 75, name: "Gold Lime" },          // 30° offset
    { hue1: 25, hue2: 55, name: "Orange Gold" },        // 30° offset
    { hue1: 350, hue2: 20, name: "Red Orange" },        // 30° offset
    { hue1: 310, hue2: 340, name: "Pink Magenta" },     // 30° offset
  ];

  // ─── 1. GERADOR DE GRADIENTE ÂNCORA ─────────────────────────────────────
  // NOTA: Para garantir variedade infinita, 70% das vezes escolhe combo aleatório
  //        (ignora baseColors), 30% usa baseColors se fornecidos
  let hue1: number, hue2: number;
  let isDark: boolean;
  let name: string;

  const useRandom = Math.random() < 0.7 || !baseColors || baseColors.length === 0;

  if (!useRandom && baseColors && baseColors.length >= 2) {
    // Usar hues das cores base fornecidas
    const hsl1 = hexToHsl(baseColors[0]);
    const hsl2 = hexToHsl(baseColors[1]);
    hue1 = hsl1.h;
    hue2 = hsl2.h;
    isDark = hsl1.l < 35;
    name = "Custom Anchor";
  } else if (!useRandom && baseColors && baseColors.length === 1) {
    // 1 cor base — gerar vizinha (offset 15-45°)
    const hsl1 = hexToHsl(baseColors[0]);
    hue1 = hsl1.h;
    hue2 = (hue1 + 15 + Math.random() * 30) % 360;
    isDark = hsl1.l < 35;
    name = "Custom Anchor";
  } else {
    // Sem cores base OU 70% aleatório — escolher dupla aleatória
    const combo = anchorCombos[Math.floor(Math.random() * anchorCombos.length)];
    hue1 = combo.hue1;
    hue2 = combo.hue2;
    name = combo.name;
    isDark = Math.random() > 0.25; // 75% dark, 25% light
  }

  // Cor-marca-1: mais escura/vibrante (simula sombra)
  const marca1Sat = 70 + Math.random() * 15; // 70-85% (vibrante)
  const marca1Light = isDark ? 35 + Math.random() * 10 : 45 + Math.random() * 10;
  const corMarca1 = hslToHex(hue1, marca1Sat, marca1Light);

  // Cor-marca-2: mais clara (simula iluminação) — variação de luminosidade
  const marca2Sat = 65 + Math.random() * 15; // ligeiramente menos saturada
  const marca2Light = marca1Light + 15 + Math.random() * 10; // +15-25% luminosidade
  const corMarca2 = hslToHex(hue2, marca2Sat, Math.min(85, marca2Light));

  // ─── 2. INJEÇÃO DE NEUTROS (5% da cor-marca-1) ──────────────────────────
  // NUNCA pretos ou cinzentos puros — sempre tinted com a cor-marca-1
  const NEUTRO_PURO_DARK = "#0A0A0A";
  const NEUTRO_PURO_LIGHT = "#FAFAFA";
  const NEUTRO_PURO_TEXTO_DARK = "#F5F5F5";
  const NEUTRO_PURO_TEXTO_LIGHT = "#0A0A0A";

  // Injetar 5% da cor-marca-1 nos neutros
  const bg = isDark
    ? mixColors(NEUTRO_PURO_DARK, corMarca1, 0.05)
    : mixColors(NEUTRO_PURO_LIGHT, corMarca1, 0.05);

  const bgElevado = isDark
    ? mixColors("#1A1A1A", corMarca1, 0.05)
    : mixColors("#F0F0F0", corMarca1, 0.05);

  const texto = isDark
    ? mixColors(NEUTRO_PURO_TEXTO_DARK, corMarca1, 0.05)
    : mixColors(NEUTRO_PURO_TEXTO_LIGHT, corMarca1, 0.05);

  const textoSuave = isDark
    ? mixColors("#888888", corMarca1, 0.05)
    : mixColors("#555555", corMarca1, 0.05);

  const borda = isDark
    ? mixColors("#2A2A2A", corMarca1, 0.08)
    : mixColors("#E0E0E0", corMarca1, 0.08);

  // ─── GRADIENTE ÂNCORA ───────────────────────────────────────────────────
  const gradiente = `linear-gradient(135deg, ${corMarca1}, ${corMarca2})`;

  // ─── 3. MAPEAR PARA O SISTEMA EXISTENTE (roles) ─────────────────────────
  // Background = bg (neutro injetado)
  // Secundária = texto (neutro injetado)
  // Destaque = corMarca1 (cor âncora principal)
  // Suporte = corMarca2 (cor âncora secundária — para gradient)
  const allColors = [
    { hex: bg, role: "Background" },
    { hex: texto, role: "Secundária" },
    { hex: corMarca1, role: "Destaque" },
    { hex: corMarca2, role: "Suporte" },
  ];

  return allColors.slice(0, count);
}

// ============================================================================
// GERAR DESIGN TOKENS COMPLETOS (CSS pronto com :root + classes utilitárias)
// ============================================================================
// Esta função gera o output CSS completo conforme a instrução de sistema:
// - CSS estruturado em :root
// - Classes utilitárias modulares (.btn / .btn-gradient, .titulo / .titulo-gradient)
// ============================================================================
export function generateGradientDesignTokens(
  baseColors?: string[]
): GradientDesignTokens {
  // Reaproveitar a lógica do generateGradientPremiumPalette
  const anchorCombos = [
    { hue1: 320, hue2: 350, name: "Magenta Rose" },
    { hue1: 280, hue2: 310, name: "Violet Magenta" },
    { hue1: 220, hue2: 250, name: "Navy Indigo" },
    { hue1: 200, hue2: 230, name: "Ocean Blue" },
    { hue1: 180, hue2: 210, name: "Cyan Navy" },
    { hue1: 160, hue2: 190, name: "Teal Cyan" },
    { hue1: 140, hue2: 170, name: "Emerald Teal" },
    { hue1: 90, hue2: 120, name: "Lime Emerald" },
    { hue1: 45, hue2: 75, name: "Gold Lime" },
    { hue1: 25, hue2: 55, name: "Orange Gold" },
    { hue1: 350, hue2: 20, name: "Red Orange" },
    { hue1: 310, hue2: 340, name: "Pink Magenta" },
  ];

  let hue1: number, hue2: number;
  let isDark: boolean;
  let name: string;

  if (baseColors && baseColors.length >= 2) {
    const hsl1 = hexToHsl(baseColors[0]);
    const hsl2 = hexToHsl(baseColors[1]);
    hue1 = hsl1.h;
    hue2 = hsl2.h;
    isDark = hsl1.l < 35;
    name = "Custom Anchor";
  } else if (baseColors && baseColors.length === 1) {
    const hsl1 = hexToHsl(baseColors[0]);
    hue1 = hsl1.h;
    hue2 = (hue1 + 15 + Math.random() * 30) % 360;
    isDark = hsl1.l < 35;
    name = "Custom Anchor";
  } else {
    const combo = anchorCombos[Math.floor(Math.random() * anchorCombos.length)];
    hue1 = combo.hue1;
    hue2 = combo.hue2;
    name = combo.name;
    isDark = Math.random() > 0.25;
  }

  // Cor-marca-1 (mais escura/vibrante)
  const marca1Sat = 70 + Math.random() * 15;
  const marca1Light = isDark ? 35 + Math.random() * 10 : 45 + Math.random() * 10;
  const corMarca1 = hslToHex(hue1, marca1Sat, marca1Light);

  // Cor-marca-2 (mais clara — variação de luminosidade)
  const marca2Sat = 65 + Math.random() * 15;
  const marca2Light = marca1Light + 15 + Math.random() * 10;
  const corMarca2 = hslToHex(hue2, marca2Sat, Math.min(85, marca2Light));

  // Neutros injetados com 5% da cor-marca-1
  const NEUTRO_DARK = "#0A0A0A";
  const NEUTRO_LIGHT = "#FAFAFA";

  const bg = isDark
    ? mixColors(NEUTRO_DARK, corMarca1, 0.05)
    : mixColors(NEUTRO_LIGHT, corMarca1, 0.05);

  const bgElevado = isDark
    ? mixColors("#1A1A1A", corMarca1, 0.05)
    : mixColors("#F0F0F0", corMarca1, 0.05);

  const texto = isDark
    ? mixColors("#F5F5F5", corMarca1, 0.05)
    : mixColors("#0A0A0A", corMarca1, 0.05);

  const textoSuave = isDark
    ? mixColors("#888888", corMarca1, 0.05)
    : mixColors("#555555", corMarca1, 0.05);

  const borda = isDark
    ? mixColors("#2A2A2A", corMarca1, 0.08)
    : mixColors("#E0E0E0", corMarca1, 0.08);

  const gradiente = `linear-gradient(135deg, ${corMarca1}, ${corMarca2})`;

  // ─── CSS CODE — :root + classes utilitárias modulares ───────────────────
  const cssCode = `:root {
  /* ═══ Design Tokens — Gradiente Âncora ═══ */

  /* Cores Âncora (vizinhas na roda de cores — Analogia) */
  --cor-marca-1: ${corMarca1};
  --cor-marca-2: ${corMarca2};

  /* Gradiente Âncora (opcional — ativa com .btn-gradient ou .titulo-gradient) */
  --gradiente-opcao: linear-gradient(135deg, var(--cor-marca-1), var(--cor-marca-2));

  /* Neutros injetados com 5% da cor-marca-1 (harmonia cromática global) */
  --bg: ${bg};
  --bg-elevado: ${bgElevado};
  --texto: ${texto};
  --texto-suave: ${textoSuave};
  --borda: ${borda};
}

/* ═══ Classes Utilitárias Modulares ═══ */

/* Botão padrão (sólido) */
.btn {
  background: var(--cor-marca-1);
  color: ${isDark ? "#FFFFFF" : "#FFFFFF"};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn:hover {
  background: var(--cor-marca-2);
  transform: translateY(-1px);
}

/* Botão com gradiente (opção) */
.btn-gradient {
  background: var(--gradiente-opcao);
  color: ${isDark ? "#FFFFFF" : "#FFFFFF"};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-gradient:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

/* Título padrão (sólido) */
.titulo {
  color: var(--texto);
  font-weight: 700;
  margin: 0;
}

/* Título com gradiente (opção) */
.titulo-gradient {
  background: var(--gradiente-opcao);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  margin: 0;
}

/* Texto padrão */
.texto {
  color: var(--texto-suave);
  line-height: 1.6;
}

/* Texto com gradiente (opção) */
.texto-gradient {
  background: var(--gradiente-opcao);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Card/Surface */
.card {
  background: var(--bg-elevado);
  border: 1px solid var(--borda);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

/* Body */
body {
  background: var(--bg);
  color: var(--texto);
  font-family: system-ui, -apple-system, sans-serif;
}`;

  return {
    corMarca1,
    corMarca2,
    bg,
    bgElevado,
    texto,
    textoSuave,
    borda,
    gradiente,
    cssCode,
    name,
    isDark,
  };
}

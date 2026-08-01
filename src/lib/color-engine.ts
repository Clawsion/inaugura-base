// ============================================================================
// color-engine.ts — Engine de manipulação de cores HSL (sem transparência)
// ============================================================================
// Ajusta HEX diretamente via HSL — nunca gera transparência ou "cor morta".
// Sliders de brilho/contraste/saturação/tonalidade atuam SÓ na cor.
// ============================================================================

export interface HSL { h: number; s: number; l: number; }

export function hexToHsl(hex: string): HSL {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
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

export interface ColorAdjust {
  brightness: number; // -50 a +50 → ajusta lightness
  contrast: number;   // -50 a +50 → ajusta saturação + clamping de lightness
  saturation: number; // -50 a +50 → ajusta saturação
  hue: number;        // -50 a +50 → ajusta matiz (hue shift)
}

export function adjustColor(baseHex: string, adj: ColorAdjust): string {
  const hsl = hexToHsl(baseHex);

  // Brilho: ajusta lightness (nunca abaixo de 5% nem acima de 95% — evita preto/branco morto)
  let newL = hsl.l + adj.brightness * 0.5;
  newL = Math.max(5, Math.min(95, newL));

  // Contraste: aumenta diferença — empurra lightness para extremos + aumenta saturação
  if (adj.contrast > 0) {
    newL = newL > 50 ? newL + adj.contrast * 0.3 : newL - adj.contrast * 0.3;
    newL = Math.max(5, Math.min(95, newL));
  } else {
    newL = newL + (50 - newL) * (-adj.contrast / 100) * 0.5;
  }

  // Saturação: ajusta saturação (nunca abaixo de 0% nem acima de 100%)
  let newS = hsl.s + adj.saturation * 1.0;
  newS = Math.max(0, Math.min(100, newS));

  // Contraste também afeta saturação ligeiramente
  if (adj.contrast > 0) {
    newS = Math.min(100, newS + adj.contrast * 0.2);
  }

  // Hue: desloca matiz
  let newH = hsl.h + adj.hue * 1.8;

  return hslToHex(newH, newS, newL);
}

// Gera paleta completa (4 cores) a partir de uma cor base
export function generatePalette(baseHex: string, mode: "light" | "dark" = "dark"): {
  bg: string;
  card: string;
  text: string;
  accent: string;
  muted: string;
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
  id: string;
  name: string;
  description: string;
  colors: string[];
  tags: string[];
}

export const COLOR_TRENDS_2026: ColorTrend[] = [
  {
    id: "electric-lavender",
    name: "Electric Lavender",
    description: "Roxo elétrico + lilás suave — AI-native, futurista",
    colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#1E1B2E"],
    tags: ["AI", "Tech", "Futurista"],
  },
  {
    id: "terminal-green",
    name: "Terminal Green",
    description: "Verde neon sobre preto — developer, hacker aesthetic",
    colors: ["#00FF88", "#0A0A0A", "#1A1A1A", "#00E676"],
    tags: ["Dev", "Mono", "Brutalist"],
  },
  {
    id: "sunset-coral",
    name: "Sunset Coral",
    description: "Coral quente + laranja + roxo — lifestyle, wellness",
    colors: ["#FF6B6B", "#FFA94D", "#FFD93D", "#6BCB77"],
    tags: ["Warm", "Lifestyle", "Energetic"],
  },
  {
    id: "nordic-ice",
    name: "Nordic Ice",
    description: "Azuis gelados + brancos — clean, corporate, SaaS",
    colors: ["#3B82F6", "#60A5FA", "#DBEAFE", "#0F172A"],
    tags: ["SaaS", "Corporate", "Clean"],
  },
  {
    id: "obsidian-gold",
    name: "Obsidian Gold",
    description: "Preto profundo + dourado — luxo, premium, editorial",
    colors: ["#C9A961", "#1A1A1A", "#2D2D2D", "#F5E6CA"],
    tags: ["Luxury", "Premium", "Editorial"],
  },
  {
    id: "matrix-amber",
    name: "Matrix Amber",
    description: "Âmbar neon sobre cinza escuro — brutalist tech",
    colors: ["#EAB308", "#1A1A1D", "#3F3F46", "#FDE047"],
    tags: ["Brutalist", "Tech", "Bold"],
  },
  {
    id: "soft-sage",
    name: "Soft Sage",
    description: "Verde sálvia + cremes — wellness, organic, calm",
    colors: ["#84CC16", "#DCFCE7", "#F7FEE7", "#365314"],
    tags: ["Wellness", "Organic", "Calm"],
  },
  {
    id: "cyber-magenta",
    name: "Cyber Magenta",
    description: "Magenta + ciano — gaming, Web3, imersivo",
    colors: ["#EC4899", "#06B6D4", "#1E1B2E", "#F0ABFC"],
    tags: ["Gaming", "Web3", "Imersivo"],
  },
  {
    id: "muted-clay",
    name: "Muted Clay",
    description: "Terracota + neutros quentes — artesanal, handcraft",
    colors: ["#C2410C", "#FED7AA", "#FFEDD5", "#431407"],
    tags: ["Artesanal", "Warm", "Organic"],
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    description: "Azul profundo + teal — enterprise, trust, data",
    colors: ["#0EA5E9", "#0369A1", "#0C4A6E", "#E0F2FE"],
    tags: ["Enterprise", "Trust", "Data"],
  },
  {
    id: "neon-punk",
    name: "Neon Punk",
    description: "Roxo + verde lima + preto — rebel, creative agency",
    colors: ["#A855F7", "#A3E635", "#0A0A0A", "#FACC15"],
    tags: ["Creative", "Rebel", "Agency"],
  },
  {
    id: "pure-mono",
    name: "Pure Mono",
    description: "Branco + preto + 1 accent — Swiss, minimalista",
    colors: ["#000000", "#FFFFFF", "#71717A", "#5E6AD2"],
    tags: ["Minimal", "Swiss", "Clean"],
  },
];

// ============================================================================
// color-families.ts — Famílias de cor (RAL-style) + transformações avançadas
// ============================================================================
// Permite ao utilizador:
//  1. Escolher uma família de cor (Azul, Verde, Vermelho, etc.) estilo RAL
//  2. Controlar 3 sliders 0-100: Brilho / Mate (saturação) / Contraste
//  3. Estilo: Moderno Minimalista, Mais Brilho, Mate, Mais Contrastada
// ============================================================================

import chroma from "chroma-js";

export type ColorFamily =
  | "azul"
  | "verde"
  | "vermelho"
  | "amarelo"
  | "roxo"
  | "rosa"
  | "ciano"
  | "laranja"
  | "castanho"
  | "cinza"
  | "preto"
  | "branco";

export interface ColorFamilyInfo {
  id: ColorFamily;
  nome: string;
  nomeEn: string;
  ralExamples: string[]; // códigos RAL reais aproximados
  baseHex: string; // cor base da família
}

// 12 famílias de cor (estilo RAL Classic)
export const COLOR_FAMILIES: ColorFamilyInfo[] = [
  { id: "azul", nome: "Azul", nomeEn: "Blue", ralExamples: ["RAL 5002", "RAL 5015", "RAL 5024"], baseHex: "#1E40AF" },
  { id: "verde", nome: "Verde", nomeEn: "Green", ralExamples: ["RAL 6002", "RAL 6018", "RAL 6029"], baseHex: "#15803D" },
  { id: "vermelho", nome: "Vermelho", nomeEn: "Red", ralExamples: ["RAL 3000", "RAL 3020", "RAL 3018"], baseHex: "#B91C1C" },
  { id: "amarelo", nome: "Amarelo", nomeEn: "Yellow", ralExamples: ["RAL 1018", "RAL 1023", "RAL 1003"], baseHex: "#CA8A04" },
  { id: "roxo", nome: "Roxo", nomeEn: "Purple", ralExamples: ["RAL 4008", "RAL 4010", "RAL 4006"], baseHex: "#7C3AED" },
  { id: "rosa", nome: "Rosa", nomeEn: "Pink", ralExamples: ["RAL 3015", "RAL 3014", "RAL 4010"], baseHex: "#DB2777" },
  { id: "ciano", nome: "Ciano", nomeEn: "Cyan", ralExamples: ["RAL 5012", "RAL 5021", "RAL 6027"], baseHex: "#0891B2" },
  { id: "laranja", nome: "Laranja", nomeEn: "Orange", ralExamples: ["RAL 2004", "RAL 2008", "RAL 2017"], baseHex: "#EA580C" },
  { id: "castanho", nome: "Castanho", nomeEn: "Brown", ralExamples: ["RAL 8003", "RAL 8007", "RAL 8014"], baseHex: "#78350F" },
  { id: "cinza", nome: "Cinza", nomeEn: "Gray", ralExamples: ["RAL 7001", "RAL 7035", "RAL 7043"], baseHex: "#6B7280" },
  { id: "preto", nome: "Preto", nomeEn: "Black", ralExamples: ["RAL 9004", "RAL 9005", "RAL 9011"], baseHex: "#0A0A0A" },
  { id: "branco", nome: "Branco", nomeEn: "White", ralExamples: ["RAL 9003", "RAL 9010", "RAL 9016"], baseHex: "#FAFAFA" },
];

// Estilos de cor pré-definidos
export type ColorStyle =
  | "moderno"
  | "brilho"
  | "mate"
  | "contraste"
  | "neon"
  | "pastel";

export interface ColorStyleInfo {
  id: ColorStyle;
  nome: string;
  desc: string;
  // Valores padrão dos sliders para este estilo
  defaults: {
    brilho: number;  // 0-100
    saturacao: number; // 0-100 (mate = baixo, brilho/neon = alto)
    contraste: number; // 0-100
  };
}

export const COLOR_STYLES: ColorStyleInfo[] = [
  { id: "moderno", nome: "Moderno Minimalista", desc: "Saturação média, brilho médio — equilibrado e profissional", defaults: { brilho: 50, saturacao: 60, contraste: 50 } },
  { id: "brilho", nome: "Mais Brilho", desc: "Cores vivas e luminosas — chama atenção", defaults: { brilho: 85, saturacao: 80, contraste: 60 } },
  { id: "mate", nome: "Mate", desc: "Baixa saturação, tons suaves — sofisticado e discreto", defaults: { brilho: 40, saturacao: 25, contraste: 40 } },
  { id: "contraste", nome: "Mais Contrastada", desc: "Alto contraste — impacto visual forte", defaults: { brilho: 50, saturacao: 70, contraste: 90 } },
  { id: "neon", nome: "Neon", desc: "Saturação máxima + brilho alto — estilo cyberpunk/gaming", defaults: { brilho: 95, saturacao: 100, contraste: 80 } },
  { id: "pastel", nome: "Pastel", desc: "Baixa saturação + alto brilho — suave e calmante", defaults: { brilho: 80, saturacao: 40, contraste: 30 } },
];

// ============================================================================
// Gerar cor a partir de família + 3 sliders
// ============================================================================
// brilho: 0-100 (0 = escuro, 100 = claro)
// saturacao: 0-100 (0 = cinza, 100 = saturado)
// contraste: 0-100 (ajusta a luminância para mais contraste com fundo)
export function generateColor(
  family: ColorFamily,
  brilho: number,
  saturacao: number,
  contraste: number
): string {
  const info = COLOR_FAMILIES.find((f) => f.id === family);
  if (!info) return "#6B7280";

  const base = chroma(info.baseHex);
  // Para preto/branco puro, usa grayscale diretamente (chroma.js lida mal com saturação 0)
  const isAchromatic = base.get("hsl.s") < 0.01;

  // Brilho: 0 = escuro, 50 = médio, 100 = claro
  // Converte diretamente para luminância 0-1
  const targetLuma = Math.max(0.01, Math.min(0.99, brilho / 100));

  let adjusted: chroma.Color;

  if (isAchromatic) {
    // Para preto/branco/cinza, usa apenas luminância (sem saturação)
    adjusted = chroma.lch(targetLuma * 100, 0, 0);
  } else {
    // Saturação: 0 = dessaturar para cinza, 100 = manter saturação original
    const baseSat = base.get("hsl.s");
    const targetSat = Math.max(0, baseSat * (saturacao / 100));
    // Mantém o hue original
    const baseHue = base.get("hsl.h");
    adjusted = chroma.hsl(baseHue, targetSat, targetLuma);
    // Usa luminance() para ajustar precisamente
    try {
      adjusted = adjusted.luminance(targetLuma);
    } catch {
      // fallback se chroma não conseguir
    }
  }

  // Contraste: se > 50, afasta do cinza médio (mais escuro ou mais claro conforme brilho)
  if (contraste > 50) {
    const factor = (contraste - 50) / 50; // 0 a 1
    if (brilho < 50) {
      // Escurece ainda mais
      adjusted = adjusted.darken(factor * 0.8);
    } else {
      // Clareia ainda mais
      adjusted = adjusted.brighten(factor * 0.8);
    }
  } else if (contraste < 50) {
    // Aproxima do cinza médio
    const factor = (50 - contraste) / 50;
    const midGray = chroma("#808080");
    adjusted = adjusted.mix(midGray, factor * 0.5);
  }

  return adjusted.hex().toUpperCase();
}

// Gerar paleta completa (5 cores) a partir de família + estilo
export function generatePaletteFromFamily(
  family: ColorFamily,
  style: ColorStyle
): { nome: string; hex: string; uso: string }[] {
  const styleInfo = COLOR_STYLES.find((s) => s.id === style);
  if (!styleInfo) return [];

  const { brilho, saturacao, contraste } = styleInfo.defaults;

  // Background: muito escuro (brilho baixo)
  const bg = generateColor(family, Math.max(3, brilho - 75), Math.max(5, saturacao - 40), contraste);
  // Card: ligeiramente mais claro que bg
  const card = generateColor(family, Math.max(8, brilho - 65), Math.max(10, saturacao - 35), Math.max(10, contraste - 10));
  // Text: claro (alto brilho) — se família é escura, usa branco
  const textFamily = (family === "preto" || family === "castanho") ? "branco" : family;
  const text = generateColor(textFamily, Math.min(95, brilho + 40), Math.max(5, saturacao - 50), contraste);
  // Accent: usa uma família com cor se a original é acromática
  const accentFamily = (family === "preto" || family === "branco" || family === "cinza") ? "azul" : family;
  const accent = generateColor(accentFamily, Math.min(95, brilho + 10), Math.min(100, saturacao + 20), Math.min(100, contraste + 10));
  // Muted: meio termo
  const muted = generateColor(family, Math.max(10, brilho - 20), Math.max(5, saturacao - 30), Math.max(20, contraste - 30));

  return [
    { nome: "Background", hex: bg, uso: "Background" },
    { nome: "Card", hex: card, uso: "Card/Surface" },
    { nome: "Text", hex: text, uso: "Text/Foreground" },
    { nome: "Accent", hex: accent, uso: "Accent/Primary" },
    { nome: "Muted", hex: muted, uso: "Muted" },
  ];
}

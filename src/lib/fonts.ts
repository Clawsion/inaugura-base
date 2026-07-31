// ============================================================================
// fonts.ts — Configuração central de fontes via next/font
// ============================================================================
// Usamos Inter para body e Plus Jakarta Sans para headings, conforme spec.
// Geist Mono é usado para previews mono e código.
// ============================================================================

import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";

export const fontInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const fontJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Lista de fontes disponíveis para o utilizador escolher no formulário
 * (usado no PaletteInput / TypographyInput).
 */
export const FONTES_DISPONIVEIS = [
  "Inter",
  "Geist",
  "Plus Jakarta Sans",
  "Outfit",
  "Montserrat",
  "Satoshi",
] as const;

export type NomeFonte = (typeof FONTES_DISPONIVEIS)[number];

/**
 * Mapeia o nome de fonte escolhido pelo utilizador para a classe CSS
 * correspondente. Satoshi não está em next/font/google; usamos fallback.
 */
export function classeFonte(nome: string): string {
  switch (nome.toLowerCase()) {
    case "inter":
      return "var(--font-inter)";
    case "geist":
      return "var(--font-geist-sans)"; // definido no layout
    case "plus jakarta sans":
    case "plus jakarta":
      return "var(--font-jakarta)";
    case "geist mono":
      return "var(--font-mono)";
    default:
      return "var(--font-inter)";
  }
}

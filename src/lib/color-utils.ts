// ============================================================================
// color-utils.ts — Validação e ajuste de contraste com chroma.js
// ============================================================================
// Camada de segurança: após receber a paleta do modelo, validamos o
// contraste WCAG. Se uma cor não passar, ajustamos ligeiramente para
// garantir AA. Esta camada corre no servidor (server action).
// ============================================================================

import chroma from "chroma-js";

export interface CorValidada {
  nome: string;
  hex: string;
  uso: string;
  contrasteOk: boolean;
  contrasteVersusBg?: number;
}

/**
 * Valida uma paleta de cores. Verifica pares críticos:
 *  - text vs background (deve ser >= 4.5)
 *  - accent vs background (deve ser >= 3.0 para elementos grandes)
 *  - text vs card (deve ser >= 4.5)
 *
 * Se uma cor falhar, ajusta ligeiramente a luminância para passar AA.
 */
export function validarEAnalisarPaleta(
  cores: { nome: string; hex: string; uso: string }[]
): CorValidada[] {
  // Identifica fundo, card, texto, accent por palavras-chave no nome ou uso.
  const findCor = (keywords: string[]) =>
    cores.find((c) =>
      keywords.some(
        (k) =>
          c.nome.toLowerCase().includes(k) ||
          c.uso.toLowerCase().includes(k)
      )
    );

  const bg = findCor(["fundo", "background", "bg", "base"]) || cores[0];
  const card =
    findCor(["card", "surface", "superfície", "superficie", "elevated"]) ||
    cores[1] ||
    cores[0];
  const text = findCor(["text", "texto", "foreground", "fg"]) || cores[2];
  const accent =
    findCor(["accent", "primary", "cta", "vibrant", "destaque"]) || cores[3];

  const result: CorValidada[] = cores.map((c) => ({
    ...c,
    contrasteOk: true,
  }));

  // Helper: validar e ajustar contraste
  const ajustar = (
    idxCor: number,
    idxBg: number,
    minContraste: number
  ) => {
    if (idxCor === -1 || idxBg === -1) return;
    const cor = result[idxCor].hex;
    const bgHex = result[idxBg].hex;
    let ratio = chroma.contrast(cor, bgHex);
    if (ratio >= minContraste) {
      result[idxCor].contrasteVersusBg = Number(ratio.toFixed(2));
      return;
    }
    // Ajusta: escurece se for texto sobre fundo claro, clareia se sobre fundo escuro.
    let ajustada = chroma(cor);
    const bgLuma = chroma(bgHex).luminance();
    for (let i = 0; i < 20 && ratio < minContraste; i++) {
      if (bgLuma < 0.5) {
        // Fundo escuro → clarear texto
        ajustada = ajustada.brighten(0.15);
      } else {
        // Fundo claro → escurecer texto
        ajustada = ajustada.darken(0.15);
      }
      ratio = chroma.contrast(ajustada.hex(), bgHex);
    }
    result[idxCor].hex = ajustada.hex().toUpperCase();
    result[idxCor].contrasteOk = ratio >= minContraste;
    result[idxCor].contrasteVersusBg = Number(ratio.toFixed(2));
  };

  const idxBg = cores.indexOf(bg);
  const idxCard = cores.indexOf(card);
  const idxText = cores.indexOf(text);
  const idxAccent = cores.indexOf(accent);

  ajustar(idxText, idxBg, 4.5);
  ajustar(idxText, idxCard, 4.5);
  ajustar(idxAccent, idxBg, 3.0);

  return result;
}

/**
 * Gera CSS variables a partir da paleta.
 */
export function paletaParaCssVariables(
  cores: { nome: string; hex: string }[]
): string {
  const lines = cores.map((c) => {
    const slug = c.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `  --color-${slug}: ${c.hex};`;
  });
  return `:root {\n${lines.join("\n")}\n}`;
}

/**
 * Gera configuração Tailwind (cores) a partir da paleta.
 */
export function paletaParaTailwind(
  cores: { nome: string; hex: string }[]
): string {
  const obj: Record<string, string> = {};
  for (const c of cores) {
    const slug = c.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    obj[slug] = c.hex;
  }
  return `// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: ${JSON.stringify(obj, null, 8).replace(/^/gm, "      ").trim()},
    },
  },
} satisfies Config;`;
}

/**
 * Verifica se um hex é válido.
 */
export function isHexValido(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

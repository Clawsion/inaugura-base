// ============================================================================
// font-installation.ts — Sistema de instalação de fonts para spec/prompt/zip
// ============================================================================
// Para CADA font do catálogo, gera:
//   1. @font-face CSS code (pronto para colar no projeto)
//   2. Download instructions (URL + como instalar)
//   3. License info (para incluir no .zip)
//
// 3 cenários:
//   A. Font no Google Fonts → @font-face com CDN URL (carrega automaticamente)
//   B. Font no Fontshare → @font-face com CDN URL (carrega automaticamente)
//   C. Font SCRAPED (não em CDN) → download instructions + @font-face template
//      com placeholder para o path local (ex: /fonts/AmazingSweety.woff2)
// ============================================================================

import { FONT_CATALOG, getFontInfo, type FontDef } from "./font-catalog";
import { GOOGLE_FONTS_CONFIRMED, FONTSHARE_FONTS_CONFIRMED } from "./use-font-loader";

export interface FontInstallation {
  fontName: string;
  cdn: "google" | "fontshare" | "none";
  sourceUrl: string;
  licenseType: string;
  // @font-face CSS pronto
  fontFaceCss: string;
  // Instruções de instalação para o AI
  installInstructions: string;
  // Se precisa download manual
  needsDownload: boolean;
}

// Helper: obter URL de download para uma font scraped
function getSourceUrl(font: FontDef): string {
  if (font.sourceUrl) return font.sourceUrl;

  // Construir URL baseada no foundry/source
  const source = font.source.toLowerCase();
  const slug = font.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  if (source.includes("befonts")) {
    return `https://befonts.com/${slug}-font`;
  }
  if (source.includes("fontesk")) {
    return `https://fontesk.com/${slug}`;
  }
  if (source.includes("freefaces")) {
    return `https://freefaces.gallery/font/${slug}`;
  }
  if (source.includes("usemodify")) {
    return `https://usemodify.com/fonts/${slug}`;
  }
  if (source.includes("google")) {
    return `https://fonts.google.com/specimen/${font.name.replace(/\s+/g, "+")}`;
  }
  if (source.includes("fontshare")) {
    return `https://www.fontshare.com/fonts/${slug}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(font.name + " font download free commercial")}`;
}

// Helper: obter tipo de licença
function getLicenseType(font: FontDef): string {
  if (font.licenseType) return font.licenseType;

  const source = font.source.toLowerCase();
  if (source.includes("google")) return "OFL (SIL Open Font License)";
  if (source.includes("fontshare")) return "ITF-FFL (Fontshare Free Font License)";
  if (source.includes("befonts") || source.includes("fontesk") || source.includes("freefaces") || source.includes("usemodify")) {
    return "Free for Commercial Use (verificar no site original)";
  }
  return "Free for Commercial Use";
}

// Helper: determinar CDN
function getCdn(fontName: string): "google" | "fontshare" | "none" {
  if (GOOGLE_FONTS_CONFIRMED.has(fontName)) return "google";
  if (FONTSHARE_FONTS_CONFIRMED.has(fontName)) return "fontshare";
  return "none";
}

// Função principal: gerar instalação completa para uma font
export function generateFontInstallation(fontName: string): FontInstallation | null {
  const font = getFontInfo(fontName);
  if (!font) return null;

  const cdn = getCdn(fontName);
  const sourceUrl = getSourceUrl(font);
  const licenseType = getLicenseType(font);
  const slug = fontName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  let fontFaceCss: string;
  let installInstructions: string;
  let needsDownload: boolean;

  if (cdn === "google") {
    // Google Fonts — carrega via CDN
    const family = fontName.replace(/\s+/g, "+");
    fontFaceCss = `/* ${fontName} — Google Fonts (CDN) */
@import url('https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800;900&display=swap');

/* Ou via <link> no <head>: */
/* <link href="https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"> */

/* CSS variable */
:root {
  --font-${slug}: '${fontName}', system-ui, sans-serif;
}`;
    installInstructions = `${fontName} está disponível no Google Fonts.
1. Adiciona o @import ou <link> acima no CSS/HTML
2. Usa a CSS variable: var(--font-${slug})
3. Licença: ${licenseType}`;
    needsDownload = false;

  } else if (cdn === "fontshare") {
    // Fontshare — carrega via CDN
    fontFaceCss = `/* ${fontName} — Fontshare (CDN) */
@import url('https://api.fontshare.com/v2/css?f[]=${slug}@400,500,600,700,800,900&display=swap');

/* Ou via <link> no <head>: */
/* <link href="https://api.fontshare.com/v2/css?f[]=${slug}@400,500,600,700,800,900&display=swap" rel="stylesheet"> */

/* CSS variable */
:root {
  --font-${slug}: '${fontName}', system-ui, sans-serif;
}`;
    installInstructions = `${fontName} está disponível no Fontshare (CDN gratuito).
1. Adiciona o @import ou <link> acima no CSS/HTML
2. Usa a CSS variable: var(--font-${slug})
3. Licença: ${licenseType}
4. Download: ${sourceUrl}`;
    needsDownload = false;

  } else {
    // Font scraped — precisa download manual
    const fileName = fontName.replace(/\s+/g, "");
    fontFaceCss = `/* ${fontName} — Self-hosted (download required) */
/* 1. Descarrega a font de: ${sourceUrl} */
/* 2. Coloca os ficheiros em: /public/fonts/${fileName}.woff2 */
/* 3. Adiciona este @font-face ao CSS: */

@font-face {
  font-family: '${fontName}';
  src: url('/fonts/${fileName}.woff2') format('woff2'),
       url('/fonts/${fileName}.woff') format('woff');
  font-weight: 400 900;
  font-display: swap;
  font-style: normal;
}

/* CSS variable */
:root {
  --font-${slug}: '${fontName}', system-ui, sans-serif;
}`;
    installInstructions = `${fontName} NÃO está disponível em CDN (Google Fonts / Fontshare).

INSTALAÇÃO:
1. Vai a: ${sourceUrl}
2. Descarrega a font (formato .woff2 ou .woff)
3. Coloca os ficheiros em: /public/fonts/${fileName}.woff2
4. Adiciona o @font-face acima ao CSS
5. Usa a CSS variable: var(--font-${slug})
6. Licença: ${licenseType}
7. Inclui o ficheiro de licença no projeto (LICENÇA-${fileName}.txt)

ALTERNATIVA (sem download):
- Substitui por uma font similar do Google Fonts:
  ${font.freeAlternative ?? "Inter (sans), Playfair Display (serif), JetBrains Mono (mono)"}`;
    needsDownload = true;
  }

  return {
    fontName,
    cdn,
    sourceUrl,
    licenseType,
    fontFaceCss,
    installInstructions,
    needsDownload,
  };
}

// Gerar instalação para MÚLTIPLAS fonts (heading + body + mono)
export function generateFontPack(fonts: { heading?: string; body?: string; mono?: string }): {
  installations: FontInstallation[];
  combinedCss: string;
  summary: string;
  needsDownloadFonts: FontInstallation[];
} {
  const names = [fonts.heading, fonts.body, fonts.mono].filter(Boolean) as string[];
  const installations = names
    .map((n) => generateFontInstallation(n))
    .filter(Boolean) as FontInstallation[];

  const combinedCss = installations
    .map((inst) => inst.fontFaceCss)
    .join("\n\n/* ════════════════════════════════════════ */\n\n");

  const needsDownloadFonts = installations.filter((inst) => inst.needsDownload);

  const summary = `FONT INSTALLATION SUMMARY
═══════════════════════════════════════════════════════════

Fonts selecionadas: ${installations.length}
  • CDN (carregam automaticamente): ${installations.filter((i) => !i.needsDownload).length}
  • Download manual necessário: ${needsDownloadFonts.length}

${installations
  .map(
    (inst, i) =>
      `${i + 1}. ${inst.fontName}
   CDN: ${inst.cdn.toUpperCase()}
   Licença: ${inst.licenseType}
   ${inst.needsDownload ? "⚠ DOWNLOAD: " + inst.sourceUrl : "✓ Auto-carrega via CDN"}
   ${inst.needsDownload ? "   Ficheiro: /public/fonts/" + inst.fontName.replace(/\s+/g, "") + ".woff2" : ""}`
  )
  .join("\n\n")}

${needsDownloadFonts.length > 0 ? `
═══════════════════════════════════════════════════════════
DOWNLOADS NECESSÁRIOS (para o .zip)
═══════════════════════════════════════════════════════════
${needsDownloadFonts
  .map(
    (inst) =>
      `• ${inst.fontName}
  URL: ${inst.sourceUrl}
  Ficheiro: /public/fonts/${inst.fontName.replace(/\s+/g, "")}.woff2
  Licença: ${inst.licenseType}`
  )
  .join("\n\n")}
` : ""}`;

  return {
    installations,
    combinedCss,
    summary,
    needsDownloadFonts,
  };
}

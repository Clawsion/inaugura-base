// ============================================================================
// test-polish-audit.ts — Auditar diferenças visuais entre os 8 tipos de polimento
// ============================================================================
import { generateRandomPalette, polishPalette, hexToHsl, POLISH_TYPES, COLOR_TRENDS_2026 } from "../src/lib/color-engine";

console.log("=".repeat(90));
console.log("AUDITORIA: 8 tipos de polimento — cada um deve produzir resultado VISUALMENTE DISTINTO");
console.log("=".repeat(90));

// Gerar 3 paletes base diferentes para testar
const trends = [COLOR_TRENDS_2026[0], COLOR_TRENDS_2026[4], COLOR_TRENDS_2026[7]];

for (const trend of trends) {
  const base = generateRandomPalette(4, trend.colors);
  console.log(`\n${"=".repeat(90)}`);
  console.log(`TENDÊNCIA: ${trend.name} (cores: ${trend.colors.join(", ")})`);
  console.log(`${"=".repeat(90)}`);
  console.log(`\nBase (antes do polimento):`);
  base.forEach((c, i) => {
    const hsl = hexToHsl(c.hex);
    console.log(`  [${i}] ${c.role.padEnd(12)} ${c.hex}  h=${Math.round(hsl.h).toString().padStart(3)}° s=${Math.round(hsl.s).toString().padStart(3)}% l=${Math.round(hsl.l).toString().padStart(3)}%`);
  });

  console.log(`\nPolimentos (cada um deve ser VISUALMENTE DIFERENTE):`);
  
  const results: { name: string; bgSat: number; bgLight: number; accentSat: number; accentLight: number; highlightHue: number }[] = [];
  
  for (const pt of POLISH_TYPES) {
    const polished = polishPalette(base, pt.id);
    const bg = hexToHsl(polished[0].hex);
    const accent = hexToHsl(polished[2].hex);
    const highlight = hexToHsl(polished[3].hex);
    
    results.push({
      name: pt.name,
      bgSat: Math.round(bg.s),
      bgLight: Math.round(bg.l),
      accentSat: Math.round(accent.s),
      accentLight: Math.round(accent.l),
      highlightHue: Math.round(highlight.h),
    });
    
    console.log(`\n  ${pt.name.toUpperCase()} (${pt.id}):`);
    console.log(`    BG:       s=${Math.round(bg.s).toString().padStart(3)}% l=${Math.round(bg.l).toString().padStart(3)}%  ${polished[0].hex}`);
    console.log(`    Accent:   s=${Math.round(accent.s).toString().padStart(3)}% l=${Math.round(accent.l).toString().padStart(3)}%  ${polished[2].hex}`);
    console.log(`    Highlight: h=${Math.round(highlight.h).toString().padStart(3)}° s=${Math.round(highlight.s).toString().padStart(3)}% l=${Math.round(highlight.l).toString().padStart(3)}%  ${polished[3].hex}`);
  }
  
  // Verificar variedade
  console.log(`\n--- VARIEDADE (quanto maior = melhor) ---`);
  const bgSats = results.map(r => r.bgSat);
  const bgLights = results.map(r => r.bgLight);
  const accentSats = results.map(r => r.accentSat);
  const accentLights = results.map(r => r.accentLight);
  const highlightHues = results.map(r => r.highlightHue);
  
  const range = (arr: number[]) => Math.max(...arr) - Math.min(...arr);
  const unique = (arr: number[]) => new Set(arr).size;
  
  console.log(`  BG saturação:     range=${range(bgSats)}%  únicos=${unique(bgSats)}/8`);
  console.log(`  BG lightness:     range=${range(bgLights)}%  únicos=${unique(bgLights)}/8`);
  console.log(`  Accent saturação: range=${range(accentSats)}%  únicos=${unique(accentSats)}/8`);
  console.log(`  Accent lightness: range=${range(accentLights)}%  únicos=${unique(accentLights)}/8`);
  console.log(`  Highlight hue:    range=${range(highlightHues)}°  únicos=${unique(highlightHues)}/8`);
  
  const totalUnique = unique(bgSats) + unique(bgLights) + unique(accentSats) + unique(accentLights) + unique(highlightHues);
  console.log(`  TOTAL únicos: ${totalUnique}/40  ${totalUnique >= 25 ? "✅ BOA VARIEDADE" : totalUnique >= 15 ? "⚠️ VARIEDADE MÉDIA" : "❗ POUCA VARIEDADE"}`);
}

// Validação visual: 10 estilos × 8 polimentos — mostra como cada combo gera cores diferentes
import { generateRandomPalette, polishPalette, hexToHsl, COLOR_STYLES, POLISH_TYPES } from "../src/lib/color-engine";

console.log("=".repeat(90));
console.log("TESTE: 10 Estilos de Geração — comparar outputs (4 cores cada)");
console.log("=".repeat(90));

const trendColors = ["#8B5CF6", "#A78BFA", "#C4B5FD", "#1E1B2E"]; // electric-lavender

console.log("\nStyle: AUTO (sem restrições)");
for (let i = 0; i < 2; i++) {
  const p = generateRandomPalette(4, trendColors);
  const bg = `${p[0].hex} (s=${Math.round(hexToHsl(p[0].hex).s)}% l=${Math.round(hexToHsl(p[0].hex).l)}%)`;
  const acc = `${p[2].hex} (s=${Math.round(hexToHsl(p[2].hex).s)}% l=${Math.round(hexToHsl(p[2].hex).l)}%)`;
  console.log(`  Gen ${i+1}: bg=${bg}  accent=${acc}`);
}

for (const style of COLOR_STYLES) {
  console.log(`\nStyle: ${style.name} — ${style.description}`);
  console.log(`  Refs: ${style.references.join(", ")}`);
  for (let i = 0; i < 2; i++) {
    const p = generateRandomPalette(4, trendColors, style.id);
    const bg = `${p[0].hex} (s=${Math.round(hexToHsl(p[0].hex).s)}% l=${Math.round(hexToHsl(p[0].hex).l)}%)`;
    const acc = `${p[2].hex} (s=${Math.round(hexToHsl(p[2].hex).s)}% l=${Math.round(hexToHsl(p[2].hex).l)}%)`;
    const hi = `${p[3].hex} (s=${Math.round(hexToHsl(p[3].hex).s)}% l=${Math.round(hexToHsl(p[3].hex).l)}%)`;
    console.log(`  Gen ${i+1}: bg=${bg}  accent=${acc}  highlight=${hi}`);
  }
}

console.log("\n" + "=".repeat(90));
console.log("TESTE: 8 Tipos de Polimento — comparar outputs sobre a mesma palete base");
console.log("=".repeat(90));

const basePalette = generateRandomPalette(4, trendColors);
console.log("\nBase (antes do polimento):");
basePalette.forEach((c, i) => {
  const hsl = hexToHsl(c.hex);
  console.log(`  [${i}] ${c.role.padEnd(12)} ${c.hex}  s=${Math.round(hsl.s)}% l=${Math.round(hsl.l)}%`);
});

for (const pt of POLISH_TYPES) {
  console.log(`\nPolimento: ${pt.name} — ${pt.description}`);
  const polished = polishPalette(basePalette, pt.id);
  polished.forEach((c, i) => {
    const hsl = hexToHsl(c.hex);
    console.log(`  [${i}] ${c.role.padEnd(12)} ${c.hex}  s=${Math.round(hsl.s).toString().padStart(3)}% l=${Math.round(hsl.l).toString().padStart(3)}%`);
  });
}

console.log("\n" + "=".repeat(90));
console.log("VALIDAÇÃO: Cada polimento produz BGs com saturação diferente");
console.log("=".repeat(90));

const bgSats = POLISH_TYPES.map(pt => {
  const polished = polishPalette(basePalette, pt.id);
  return { name: pt.name, sat: Math.round(hexToHsl(polished[0].hex).s), light: Math.round(hexToHsl(polished[0].hex).l) };
});

console.log("\nComparação de BG (s= saturação, l= lightness):");
bgSats.forEach(b => console.log(`  ${b.name.padEnd(15)} s=${b.sat.toString().padStart(3)}%  l=${b.light.toString().padStart(3)}%`));

const uniqueSats = new Set(bgSats.map(b => b.sat)).size;
console.log(`\nSaturações de BG únicas: ${uniqueSats}/8 ${uniqueSats >= 6 ? "✅ POLIMENTOS DIFEREN" : "❌ MUITO SIMILARES"}`);

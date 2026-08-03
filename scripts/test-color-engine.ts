// Teste rápido do color-engine — valida que TODAS as 4 cores têm hue visível
import { generateRandomPalette, polishPalette, hexToHsl } from "../src/lib/color-engine";

console.log("=".repeat(80));
console.log("TESTE 1: generateRandomPalette — 5 gerações (4 cores cada)");
console.log("=".repeat(80));

let allHaveColor = true;
for (let i = 0; i < 5; i++) {
  const palette = generateRandomPalette(4);
  console.log(`\nGeração ${i + 1}:`);
  palette.forEach((c, idx) => {
    const hsl = hexToHsl(c.hex);
    // Cor visível = saturação >= 12% E não é pure black (l<=2) nem pure white (l>=99 com s<=2)
    const hasVisibleColor = hsl.s >= 12;
    const isPureBlack = hsl.l <= 2 && hsl.s <= 3;
    const isPureWhite = hsl.l >= 99 && hsl.s <= 3;
    const status = (hasVisibleColor && !isPureBlack && !isPureWhite) ? "✅ COR" : "❌ SEM COR";
    console.log(`  [${idx}] ${c.role.padEnd(12)} ${c.hex}  h=${Math.round(hsl.h).toString().padStart(3)}° s=${Math.round(hsl.s).toString().padStart(3)}% l=${Math.round(hsl.l).toString().padStart(3)}%  ${status}`);
    if (!hasVisibleColor || isPureBlack || isPureWhite) allHaveColor = false;
  });
}

console.log("\n" + "=".repeat(80));
console.log("TESTE 2: polishPalette — aplicar polimento a uma palete");
console.log("=".repeat(80));

const base = generateRandomPalette(4);
console.log("\nAntes do polimento:");
base.forEach((c, i) => {
  const hsl = hexToHsl(c.hex);
  console.log(`  [${i}] ${c.role.padEnd(12)} ${c.hex}  s=${Math.round(hsl.s)}% l=${Math.round(hsl.l)}%`);
});

const polished = polishPalette(base);
console.log("\nDepois do polimento (deve estar PREMIUM com cor visível em todas):");
let polishAllHaveColor = true;
polished.forEach((c, i) => {
  const hsl = hexToHsl(c.hex);
  const hasVisibleColor = hsl.s >= 12;
  const isPureBlack = hsl.l <= 2 && hsl.s <= 3;
  const isPureWhite = hsl.l >= 99 && hsl.s <= 3;
  const status = (hasVisibleColor && !isPureBlack && !isPureWhite) ? "✅ PREMIUM" : "❌ FLAT";
  console.log(`  [${i}] ${c.role.padEnd(12)} ${c.hex}  s=${Math.round(hsl.s).toString().padStart(3)}% l=${Math.round(hsl.l).toString().padStart(3)}%  ${status}`);
  if (!hasVisibleColor || isPureBlack || isPureWhite) polishAllHaveColor = false;
});

console.log("\n" + "=".repeat(80));
console.log("TESTE 3: Variação entre cliques (deve ser DIFERENTE a cada click)");
console.log("=".repeat(80));

const trendColors = ["#8B5CF6", "#A78BFA", "#C4B5FD", "#1E1B2E"]; // electric-lavender
const gens = [generateRandomPalette(4, trendColors), generateRandomPalette(4, trendColors), generateRandomPalette(4, trendColors)];
console.log("\n3 gerações a partir da mesma tendência 'electric-lavender':");
gens.forEach((g, i) => {
  const hues = g.map(c => Math.round(hexToHsl(c.hex).h));
  console.log(`  Gen ${i + 1}: hues=[${hues.join(", ")}]  bg=${g[0].hex}  accent=${g[2].hex}`);
});

// Verificar que pelo menos os backgrounds diferem
const bgs = gens.map(g => g[0].hex);
const uniqueBgs = new Set(bgs).size;
console.log(`\nBackgrounds únicos: ${uniqueBgs}/3 ${uniqueBgs >= 2 ? "✅ VARIA" : "❌ ESTÁTICO"}`);

console.log("\n" + "=".repeat(80));
console.log(`RESULTADO FINAL:`);
console.log(`  Generate: ${allHaveColor ? "✅ TODAS as 4 cores têm cor visível" : "❌ Ainda há cores sem hue"}`);
console.log(`  Polimento: ${polishAllHaveColor ? "✅ Premium com cor visível" : "❌ Ainda flat"}`);
console.log(`  Variação: ${uniqueBgs >= 2 ? "✅ Cada click gera combinação diferente" : "❌ Não varia"}`);
console.log("=".repeat(80));

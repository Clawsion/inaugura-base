// Converte skills-catalog.ts (3268 LOC) para JSON unificado
// Mantém todas as skills + integrações + helpers de nicho
import * as fs from "node:fs";
import * as path from "node:path";

// Importa do TS via require dinâmico após compilar
// Mais simples: parse direto do TS para extrair dados

const src = fs.readFileSync("src/lib/skills-catalog.ts", "utf8");

// Helper: extrair objetos { ... } com regex multiline
function extractObjects(text: string, startMarker: string): string[] {
  const startIdx = text.indexOf(startMarker);
  if (startIdx === -1) return [];
  const afterMarker = text.slice(startIdx + startMarker.length);
  const objects: string[] = [];
  let i = 0;
  let depth = 0;
  let current = "";
  let inString = false;
  let stringChar = "";
  let started = false;

  while (i < afterMarker.length) {
    const c = afterMarker[i];
    const next = afterMarker[i + 1];

    if (inString) {
      current += c;
      if (c === "\\") {
        current += next;
        i += 2;
        continue;
      }
      if (c === stringChar) {
        inString = false;
      }
      i++;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      inString = true;
      stringChar = c;
      current += c;
      i++;
      continue;
    }

    if (c === "{") {
      if (depth === 0 && !started) {
        started = true;
      }
      depth++;
      current += c;
      i++;
      continue;
    }

    if (c === "}") {
      depth--;
      current += c;
      if (depth === 0 && started) {
        objects.push(current);
        current = "";
        started = false;
      }
      i++;
      continue;
    }

    if (started) {
      current += c;
    }
    i++;
  }
  return objects;
}

// Parse de um objeto JS simples (campos primitivos)
function parseObject(objStr: string): Record<string, unknown> | null {
  // Remove chaves exteriores
  const inner = objStr.trim().slice(1, -1).trim();
  const result: Record<string, unknown> = {};
  const lines: string[] = [];
  let current = "";
  let inString = false;
  let stringChar = "";
  let depth = 0;

  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    const next = inner[i + 1];

    if (inString) {
      current += c;
      if (c === "\\") {
        current += next;
        i++;
        continue;
      }
      if (c === stringChar) inString = false;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      inString = true;
      stringChar = c;
      current += c;
      continue;
    }

    if (c === "{" || c === "[") depth++;
    if (c === "}" || c === "]") depth--;

    if (c === "," && depth === 0) {
      lines.push(current);
      current = "";
      continue;
    }
    current += c;
  }
  if (current.trim()) lines.push(current);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let value: unknown = trimmed.slice(colonIdx + 1).trim();

    // String quoted
    if (typeof value === "string") {
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
      } else if (value.startsWith("`") && value.endsWith("`")) {
        value = value.slice(1, -1);
      }
    }
    result[key] = value;
  }
  return result;
}

console.log("Extraindo skills...");
const skillObjs = extractObjects(src, "export const SKILLS_CATALOG: Skill[] = [");
const skills = skillObjs
  .map(parseObject)
  .filter((s): s is Record<string, string> => !!s && typeof s.id === "string");

console.log(`Encontradas ${skills.length} skills`);

console.log("Extraindo integrações...");
const intObjs = extractObjects(src, "export const INTEGRACOES_CATALOG: Integracao[] = [");
const integracoes = intObjs
  .map(parseObject)
  .filter((s): s is Record<string, string> => !!s && typeof s.id === "string");

console.log(`Encontradas ${integracoes.length} integrações`);

// Mapeamento de nichos para skills adicionais (extraído manualmente do helper)
const skillsPorNicho: Record<string, string[]> = {
  "SaaS B2B": ["cmdk", "posthog", "better-auth", "biome", "knip", "vitest", "playwright", "shadcn-mcp", "chrome-devtools-mcp", "vercel-speed-insights", "vercel-web-analytics", "react-scan", "tweakcn"],
  "E-commerce Moda": ["cloudinary", "algolia", "stripe-mcp", "speculation-rules", "next-ppr"],
  "E-commerce Geral": ["stripe", "cloudinary", "algolia", "stripe-mcp", "speculation-rules", "next-ppr"],
  "FinTech": ["sentry", "posthog", "better-auth", "highlight-io", "sentry-mcp"],
  "HealthTech": ["sentry", "posthog", "better-auth", "highlight-io"],
  "EdTech": ["better-auth", "convex"],
  "Gaming": ["react-three-fiber", "rive", "ogl", "theatre-js"],
  "Crypto / Web3": ["react-three-fiber", "ogl"],
  "Agência Criativa": ["gsap", "react-three-fiber", "21st-mcp", "theatre-js", "splitting-js", "curtains-js", "scroll-timeline-polyfill"],
  "Portfólio Pessoal": ["gsap", "splitting-js", "next-view-transitions"],
  "Blog / Media": ["algolia", "speculation-rules", "next-view-transitions"],
  "Imobiliário": ["next-ppr", "speculation-rules"],
  "Restaurantes / Food": ["speculation-rules", "next-ppr"],
  "Viagens & Turismo": ["speculation-rules", "next-ppr"],
  "Fitness / Wellness": ["rive", "lottie"],
  "Beleza / Cosmética": ["rive", "lottie"],
};

const intPorNicho: Record<string, string[]> = {
  "SaaS B2B": ["clerk", "calendly", "zipchat-ai", "typeform"],
  "E-commerce Moda": ["stripe", "cloudinary", "algolia", "yotpo", "loyaltylion", "picreel", "social-feed-widget"],
  "E-commerce Geral": ["stripe", "cloudinary", "reviews-io", "loyaltylion", "wheel-fortune"],
  "FinTech": ["stripe", "sentry"],
  "HealthTech": ["calendly", "cal-com", "zipchat-ai", "google-reviews-widget", "callpage"],
  "EdTech": ["typeform", "calendly"],
  "Imobiliário": ["mapbox", "callpage", "typeform", "whatsapp-widget"],
  "Restaurantes / Food": ["menu-digital", "tripadvisor-widget", "google-reviews-widget", "whatsapp-widget", "social-feed-widget"],
  "Viagens & Turismo": ["tripadvisor-widget", "google-reviews-widget", "calendly", "whatsapp-widget", "mapbox"],
  "Agência Criativa": ["typeform", "calendly", "trustpilot-widget"],
  "Portfólio Pessoal": ["trustpilot-widget", "social-feed-widget"],
  "Blog / Media": ["algolia", "social-feed-widget", "disqus"],
  "Gaming": ["app-store-reviews", "social-feed-widget"],
  "Crypto / Web3": ["trustpilot-widget"],
  "Fitness / Wellness": ["calendly", "cal-com", "google-reviews-widget", "whatsapp-widget"],
  "Beleza / Cosmética": ["social-feed-widget", "google-reviews-widget", "calendly", "reviews-io"],
  "Imobiliário de Luxo": ["callpage", "trustpilot-widget", "typeform", "mapbox"],
  "Advocacia / Jurídico": ["calendly", "callpage", "typeform", "google-reviews-widget"],
  "Consultoria": ["calendly", "callpage", "typeform", "trustpilot-widget"],
  "ONG / Impacto Social": ["trustpilot-widget", "social-feed-widget", "typeform"],
};

const output = {
  version: "1.0.0",
  _source: "Migrated from src/lib/skills-catalog.ts (3268 LOC) — unificado com SSOT",
  _migratedAt: new Date().toISOString(),
  skills,
  integracoes,
  skillsPorNicho,
  integracoesPorNicho: intPorNicho,
};

const outPath = "src/lib/catalog/data/skills-catalog-legacy.json";
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`\n✅ Escrito: ${outPath}`);
console.log(`   ${skills.length} skills, ${integracoes.length} integrações`);
console.log(`   ${Object.keys(skillsPorNicho).length} nichos mapeados`);

// Verificação
const sample = skills[0];
console.log(`\nSample skill: ${JSON.stringify(sample, null, 2).slice(0, 200)}...`);

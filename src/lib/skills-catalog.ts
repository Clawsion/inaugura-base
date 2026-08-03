// ============================================================================
// skills-catalog.ts — Compatibility shim sobre JSON unificado
// ============================================================================
// MIGRADO: anteriormente 3268 LOC de catálogo hardcoded em TS.
// Agora lê do JSON em src/lib/catalog/data/skills-catalog-legacy.json.
// Mantém a mesma API exportada para não quebrar os 8 componentes que dependem dele.
// ============================================================================

import legacyData from "@/lib/catalog/data/skills-catalog-legacy.json";

export type SkillMode = "recomendada" | "alternativa" | "opcional" | "manual" | "off";

export type Licenca = "Free" | "Freemium" | "Subscrição";

export interface Skill {
  id: string;
  nome: string;
  categoria: "UI" | "Animações" | "MCP" | "Backend" | "IA" | "DevOps" | "Design";
  icone: string;
  descricao: string;
  quandoUsar: string;
  exemplo: string;
  url?: string;
  modoDefault: SkillMode;
  licenca: Licenca;
}

export interface Integracao {
  id: string;
  nome: string;
  categoria: "Pagamentos" | "Email" | "Analytics" | "Auth" | "Storage" | "Search" | "Comunicação" | "CMS" | "Cloud" | "Monitoring" | "Marketing" | "Maps" | "Apps & Widgets" | "Outro";
  icone: string;
  descricao: string;
  quandoUsar: string;
  exemplo: string;
  url?: string;
  modoDefault: SkillMode;
  licenca: Licenca;
}

// ============================================================================
// Catálogos em memória (cache de leitura do JSON)
// ============================================================================
export const SKILLS_CATALOG: Skill[] = legacyData.skills as Skill[];
export const INTEGRACOES_CATALOG: Integracao[] = legacyData.integracoes as Integracao[];

// ============================================================================
// Helpers: recomendar skills por nicho (mantém API original)
// ============================================================================
export function getSkillsForNicho(nicho: string): Skill[] {
  const base = SKILLS_CATALOG.filter((s) => s.modoDefault === "recomendada");
  const extraIds = (legacyData.skillsPorNicho as Record<string, string[]>)[nicho] ?? [];
  const extras = SKILLS_CATALOG.filter((s) => extraIds.includes(s.id));
  const seen = new Set(base.map((b) => b.id));
  const uniqueExtras = extras.filter((e) => !seen.has(e.id));
  return [...base, ...uniqueExtras];
}

export function getIntegracoesForNicho(nicho: string): Integracao[] {
  const base = INTEGRACOES_CATALOG.filter((i) => i.modoDefault === "recomendada");
  const extraIds = (legacyData.integracoesPorNicho as Record<string, string[]>)[nicho] ?? [];
  const extras = INTEGRACOES_CATALOG.filter((i) => extraIds.includes(i.id));
  const seen = new Set(base.map((b) => b.id));
  const uniqueExtras = extras.filter((e) => !seen.has(e.id));
  return [...base, ...uniqueExtras];
}

// Helper extra: lookup por ID
export function getSkillById(id: string): Skill | undefined {
  return SKILLS_CATALOG.find((s) => s.id === id);
}

export function getIntegracaoById(id: string): Integracao | undefined {
  return INTEGRACOES_CATALOG.find((i) => i.id === id);
}

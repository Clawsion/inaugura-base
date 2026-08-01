// ============================================================================
// catalog/index.ts — Loader do catálogo SSOT (Single Source of Truth)
// ============================================================================
// Lê os ficheiros JSON versionados e expõe funções de lookup.
// O catálogo é estático (mudado via PR) e cacheado em memória após 1ª leitura.
// ============================================================================

import skillsData from "./data/skills.json";
import mcpsData from "./data/mcps.json";
import integrationsData from "./data/integrations.json";
import modelsData from "./data/models.json";
import functionsData from "./data/functions.json";
import sectionsData from "./data/sections.json";
import effectsData from "./data/effects.json";
import presetsData from "./data/presets.json";
import tiersData from "./data/tiers.json";

export interface Skill {
  id: string;
  name: string;
  category: "core" | "project" | "advanced";
  install: string;
  best_models: string[];
}

export interface Mcp {
  id: string;
  name: string;
  install: string;
  phase: string[];
  context_cost: "low" | "mid" | "high";
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  requires_backend: boolean;
}

export interface Model {
  id: string;
  name: string;
  provider: "anthropic" | "openai" | "google" | "moonshot" | "zhipu" | "deepseek" | "alibaba" | "minimax" | "nvidia" | "meta" | "mistral" | "xai" | "other";
  access: "api" | "subscription" | "open_weight" | "both";
  tier: "frontier" | "strong" | "value" | "flash" | "local";
  roles: string[];
  hosts: string[];
  strengths: string[];
  weaknesses: string[];
  cost: "free" | "low" | "mid" | "high" | "max";
  tool_calling: "excellent" | "good" | "fragile" | "unknown";
  notes?: string;
  enabled: boolean;
}

export interface AgentFunction {
  id: string;
  name: string;
  default_model: string;
  skills: string[];
  mcps: string[];
}

export interface Section {
  id: string;
  name: string;
  default_priority: "P0" | "P1" | "P2";
}

export interface Effect {
  id: string;
  name: string;
  perf_cost: "low" | "mid" | "high";
  skill: string;
}

export interface Preset {
  id: string;
  name: string;
  tagline: string;
  category: "portfolio" | "agency" | "saas" | "commerce" | "content" | "local" | "product" | "experimental";
  badge?: "awwwards" | "conversion" | "speed" | "enterprise" | "flagship";

  // o que o preset aplica no Forge
  project_type: string;
  level: "lite" | "pro" | "awwwards";
  cost_profile: "free_open" | "balanced" | "max";
  execution: {
    mode: "individual" | "team";
    tier?: string;
    team_size?: number;
    host_preference: "opencode" | "claude" | "codex" | "hybrid";
  };

  visual: {
    theme_id: string;
    locks: Record<string, string>;
  };

  sections: { id: string; priority: "P0" | "P1" | "P2" }[];
  effects: { id: string; perf: "low" | "mid" | "high" }[];
  features: string[];
  skills: string[];
  mcps: string[];
  integrations?: string[];

  excellence: {
    lighthouse_perf: number;
    a11y: "AA" | "AAA";
    max_high_cost_effects: number;
    must_have_done_when: string[];
  };

  brief_seed?: string;
  anti_slop: string[];
}

export interface Tier {
  id: string;
  name: string;
  icon: string;
  team_size: number;
  team_functions: string[];
  description: string;
  use_when: string;
  cost_profile: "free_open" | "balanced" | "max";
  estimated_days: string;
  estimated_cost: string;
  avg_efficiency: number;
  function_routing: Record<string, {
    model: string;
    alt: string;
    host: string;
    efficiency: number;
    why: string;
  }>;
}

// ============================================================================
// Catálogo em memória (cache de leitura)
// ============================================================================
export const CATALOG = {
  skills: skillsData.skills as Skill[],
  mcps: mcpsData.mcps as Mcp[],
  integrations: integrationsData.integrations as Integration[],
  models: modelsData.models as Model[],
  functions: functionsData.functions as AgentFunction[],
  sections: sectionsData.sections as Section[],
  effects: effectsData.effects as Effect[],
  presets: presetsData.presets as Preset[],
  tiers: tiersData.tiers as Tier[],
  version: "1.0.0",
};

// ============================================================================
// Helpers de lookup
// ============================================================================
export function getSkill(id: string): Skill | undefined {
  return CATALOG.skills.find((s) => s.id === id);
}
export function getMcp(id: string): Mcp | undefined {
  return CATALOG.mcps.find((m) => m.id === id);
}
export function getIntegration(id: string): Integration | undefined {
  return CATALOG.integrations.find((i) => i.id === id);
}
export function getModel(id: string): Model | undefined {
  return CATALOG.models.find((m) => m.id === id);
}
export function getFunction(id: string): AgentFunction | undefined {
  return CATALOG.functions.find((f) => f.id === id);
}
export function getSection(id: string): Section | undefined {
  return CATALOG.sections.find((s) => s.id === id);
}
export function getEffect(id: string): Effect | undefined {
  return CATALOG.effects.find((e) => e.id === id);
}
export function getPreset(id: string): Preset | undefined {
  return CATALOG.presets.find((p) => p.id === id);
}
export function getTier(id: string): Tier | undefined {
  return CATALOG.tiers.find((t) => t.id === id);
}

// Valida se um ID existe em qualquer catálogo
export function isValidId(id: string, type?: "skill" | "mcp" | "integration" | "section" | "effect" | "function" | "model"): boolean {
  if (type === "skill") return !!getSkill(id);
  if (type === "mcp") return !!getMcp(id);
  if (type === "integration") return !!getIntegration(id);
  if (type === "section") return !!getSection(id);
  if (type === "effect") return !!getEffect(id);
  if (type === "function") return !!getFunction(id);
  if (type === "model") return !!getModel(id);
  // sem tipo: procura em todos
  return (
    !!getSkill(id) ||
    !!getMcp(id) ||
    !!getIntegration(id) ||
    !!getSection(id) ||
    !!getEffect(id) ||
    !!getFunction(id) ||
    !!getModel(id)
  );
}

// Skills core (always-on hardcoded conforme spec §5)
export const SKILLS_CORE_ALWAYS = [
  "superpowers-using",
  "frontend-design",
  "ui-ux-pro-max",
  "premium-motion-principles",
  "react-best-practices",
  "web-design-guidelines",
];

// MCPs essenciais base
export const MCPS_ESSENTIAL_BASE = ["context7", "github"];

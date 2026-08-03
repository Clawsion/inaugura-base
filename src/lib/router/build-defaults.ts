// ============================================================================
// router/build-defaults.ts — Model routing por cost_profile
// ============================================================================
// Mapeia função agente → model_id, conforme catálogo models.json (v1.1.0).
// O router usa estes defaults; o user pode override no Execute.
// ============================================================================
// R9 (free_open): SÓ modelos free/open (DeepSeek V3, Qwen Coder, GLM-4.6, Llama 3.3)
// R10 (max): Topo frontier (Claude Opus 4.5, GPT-5, DeepSeek R1, Kimi K2)
// ============================================================================

export const BuildDefaults: Record<string, Record<string, string>> = {
  // R9: free_open — SÓ modelos open/free ou low-cost
  free_open: {
    architect: "deepseek-r1",            // reasoning open-weight
    architect_design: "glm-4-6",         // Bronze (funde architect+design)
    design_system: "qwen-2-5-coder",
    frontend: "qwen-2-5-coder",
    frontend_motion: "qwen-2-5-coder",   // Titanium (funde frontend+motion)
    motion: "qwen-2-5-coder",
    backend: "deepseek-v3",
    security: "deepseek-v3",
    qa: "glm-4-6",
    qa_deploy: "glm-4-6",                // Bronze/Prata (funde qa+deploy)
    deploy: "glm-4-6",
    reviewer: "deepseek-r1",
    content: "glm-4-6",
    builder: "qwen-2-5-coder",           // Bronze (funde ui+logic)
    builder_ui: "qwen-2-5-coder",        // Individual
    builder_logic: "deepseek-v3",        // Individual
    ship: "glm-4-6",                     // Individual + Bronze
    spec_compiler: "glm-4-6",
  },
  // balanced — open + Sonnet/Haiku/Gemini Flash
  balanced: {
    architect: "claude-sonnet-4-5",
    architect_design: "claude-sonnet-4-5",
    design_system: "kimi-k2",
    frontend: "kimi-k2",
    frontend_motion: "kimi-k2",
    motion: "kimi-k2",
    backend: "deepseek-v3",
    security: "deepseek-v3",
    qa: "claude-sonnet-4-5",
    qa_deploy: "claude-sonnet-4-5",
    deploy: "claude-sonnet-4-5",
    reviewer: "claude-sonnet-4-5",
    content: "claude-haiku-4-5",
    builder: "kimi-k2",
    builder_ui: "kimi-k2",
    builder_logic: "deepseek-v3",
    ship: "claude-sonnet-4-5",
    spec_compiler: "glm-4-6",
  },
  // R10: max — frontier máximo (Opus/GPT-5/R1/K2)
  max: {
    architect: "claude-opus-4-5",
    architect_design: "claude-opus-4-5",
    design_system: "claude-opus-4-5",
    frontend: "kimi-k2",
    frontend_motion: "kimi-k2",
    motion: "kimi-k2",
    backend: "gpt-5",
    security: "claude-opus-4-5",
    qa: "claude-sonnet-4-5",
    qa_deploy: "claude-sonnet-4-5",
    deploy: "claude-sonnet-4-5",
    reviewer: "claude-opus-4-5",
    content: "gpt-5-mini",
    builder: "kimi-k2",
    builder_ui: "kimi-k2",
    builder_logic: "gpt-5",
    ship: "claude-sonnet-4-5",
    spec_compiler: "glm-4-6", // compiler mantém GLM mesmo no max (custo)
  },
};

export function getBuildModel(functionId: string, costProfile: string): string {
  const profile = BuildDefaults[costProfile] ?? BuildDefaults.free_open;
  return profile[functionId] ?? "glm-4-6";
}

// Alternativas por função (para mostrar no Execute "Trocar AI")
export const BuildAlternatives: Record<string, string[]> = {
  architect: ["claude-opus-4-5", "gpt-5", "gemini-2-5-pro", "deepseek-r1"],
  design_system: ["kimi-k2", "claude-opus-4-5", "claude-sonnet-4-5", "qwen-2-5-coder"],
  frontend: ["kimi-k2", "claude-sonnet-4-5", "qwen-2-5-coder", "gemini-2-5-flash"],
  motion: ["kimi-k2", "claude-sonnet-4-5", "qwen-2-5-coder"],
  backend: ["deepseek-v3", "gpt-5", "claude-opus-4-5", "qwen-2-5-coder", "codestral"],
  security: ["claude-opus-4-5", "deepseek-v3", "deepseek-r1"],
  qa: ["claude-sonnet-4-5", "claude-haiku-4-5", "gemini-2-5-flash", "minimax-m2"],
  deploy: ["claude-sonnet-4-5", "gpt-5-mini", "gemini-2-5-flash"],
  reviewer: ["claude-opus-4-5", "gpt-5", "deepseek-r1"],
  content: ["claude-haiku-4-5", "gpt-5-mini", "minimax-m2", "glm-4-6"],
  patch: ["gpt-5-mini", "claude-haiku-4-5", "gemini-2-5-flash", "qwen-2-5-coder"],
  spec_compiler: ["glm-4-6", "deepseek-v3", "qwen-2-5-max"],
};

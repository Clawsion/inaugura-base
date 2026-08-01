// ============================================================================
// router/build-defaults.ts — Model routing por cost_profile
// ============================================================================
// Mapeia função agente → model_id, conforme catálogo models.json.
// O router usa estes defaults; o user pode override no Execute.
// ============================================================================

export const BuildDefaults: Record<string, Record<string, string>> = {
  free_open: {
    // Só modelos open/free
    architect: "glm-5.2",
    architect_design: "glm-5.2",      // Bronze (funde architect+design)
    design_system: "kimi-k3",
    frontend: "kimi-k3",
    frontend_motion: "kimi-k3",       // Titanium (funde frontend+motion)
    motion: "kimi-k3",
    backend: "deepseek-v4-pro",
    security: "glm-5.2",
    qa: "kimi-k2.7",
    qa_deploy: "kimi-k2.7",           // Bronze/Prata (funde qa+deploy)
    deploy: "deepseek-v4-flash",
    reviewer: "minimax-m3",
    content: "glm-5.2",
    builder: "kimi-k3",               // Bronze (funde ui+logic)
    builder_ui: "kimi-k3",            // Individual
    builder_logic: "deepseek-v4-pro", // Individual
    ship: "deepseek-v4-flash",        // Individual + Bronze
    spec_compiler: "glm-5.2",
  },
  balanced: {
    // Open + Sonnet/Haiku/Terra
    architect: "claude-sonnet-5",
    architect_design: "claude-sonnet-5",
    design_system: "kimi-k3",
    frontend: "kimi-k3",
    frontend_motion: "kimi-k3",
    motion: "kimi-k3",
    backend: "deepseek-v4-pro",
    security: "deepseek-v4-pro",
    qa: "claude-sonnet-5",
    qa_deploy: "claude-sonnet-5",
    deploy: "claude-sonnet-5",
    reviewer: "claude-sonnet-5",
    content: "claude-sonnet-5",
    builder: "kimi-k3",
    builder_ui: "kimi-k3",
    builder_logic: "deepseek-v4-pro",
    ship: "claude-sonnet-5",
    spec_compiler: "glm-5.2",
  },
  max: {
    // Tudo: Fable/Opus/Sol + K3 + DS Pro
    architect: "claude-fable-5",
    architect_design: "claude-fable-5",
    design_system: "claude-fable-5",
    frontend: "kimi-k3",
    frontend_motion: "kimi-k3",
    motion: "kimi-k3",
    backend: "claude-opus-4.8",
    security: "claude-opus-4.8",
    qa: "claude-sonnet-5",
    qa_deploy: "claude-sonnet-5",
    deploy: "claude-sonnet-5",
    reviewer: "claude-fable-5",
    content: "gpt-5.6-luna",
    builder: "kimi-k3",
    builder_ui: "kimi-k3",
    builder_logic: "claude-opus-4.8",
    ship: "claude-sonnet-5",
    spec_compiler: "glm-5.2", // compiler mantém GLM mesmo no max (custo)
  },
};

export function getBuildModel(functionId: string, costProfile: string): string {
  const profile = BuildDefaults[costProfile] ?? BuildDefaults.free_open;
  return profile[functionId] ?? "glm-5.2";
}

// Alternativas por função (para mostrar no Execute "Trocar AI")
export const BuildAlternatives: Record<string, string[]> = {
  architect: ["claude-fable-5", "gpt-5.6-sol", "glm-5.2", "qwen-3.8-max"],
  design_system: ["kimi-k3", "claude-fable-5", "claude-sonnet-5", "glm-5.2"],
  frontend: ["kimi-k3", "claude-sonnet-5", "gpt-5.6-terra", "kimi-k2.7"],
  motion: ["kimi-k3", "claude-sonnet-5", "gpt-5.3-codex-spark", "gpt-5.6-luna"],
  backend: ["deepseek-v4-pro", "claude-opus-4.8", "gpt-5.6-sol", "qwen-3.8-max", "codestral"],
  security: ["claude-opus-4.8", "deepseek-v4-pro", "glm-5.2"],
  qa: ["claude-sonnet-5", "kimi-k2.7", "gpt-5.6-terra", "minimax-m3", "claude-haiku-4.5"],
  deploy: ["claude-sonnet-5", "gpt-5.6-terra", "deepseek-v4-flash", "gpt-5.6-luna"],
  reviewer: ["claude-fable-5", "gpt-5.6-sol", "claude-opus-4.8"],
  content: ["claude-sonnet-5", "gpt-5.6-luna", "minimax-m3", "glm-5.2"],
  patch: ["gpt-5.6-luna", "claude-haiku-4.5", "deepseek-v4-flash", "qwen-3.8-flash", "kimi-k2.7"],
  spec_compiler: ["glm-5.2", "deepseek-v4-pro", "qwen-3.8-max", "minimax-m3"],
};

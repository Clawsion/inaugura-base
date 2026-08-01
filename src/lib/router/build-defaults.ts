// ============================================================================
// router/build-defaults.ts — Defaults de model routing por cost_profile
// ============================================================================

export const BuildDefaults: Record<string, Record<string, string>> = {
  free_open: {
    architect: "glm-5.2",
    design_system: "kimi-k3",
    frontend: "kimi-k3",
    motion: "kimi-k3",
    backend: "deepseek-v4-pro",
    qa: "kimi-k2.7",
    deploy: "deepseek-v4-flash",
    security: "glm-5.2",
    content: "glm-5.2",
    reviewer: "kimi-k3",
    // individual slots
    builder_ui: "kimi-k3",
    builder_logic: "deepseek-v4-pro",
    ship: "deepseek-v4-flash",
  },
  balanced: {
    architect: "claude-sonnet",
    design_system: "kimi-k3",
    frontend: "kimi-k3",
    motion: "kimi-k3",
    backend: "deepseek-v4-pro",
    qa: "claude-sonnet",
    deploy: "claude-sonnet",
    security: "deepseek-v4-pro",
    content: "glm-5.2",
    reviewer: "claude-sonnet",
    builder_ui: "kimi-k3",
    builder_logic: "deepseek-v4-pro",
    ship: "claude-sonnet",
  },
  max: {
    architect: "claude-fable",
    design_system: "claude-fable",
    frontend: "kimi-k3",
    motion: "kimi-k3",
    backend: "claude-opus",
    qa: "claude-sonnet",
    deploy: "claude-sonnet",
    security: "claude-opus",
    content: "glm-5.2",
    reviewer: "claude-fable",
    builder_ui: "kimi-k3",
    builder_logic: "claude-opus",
    ship: "claude-sonnet",
  },
};

export function getBuildModel(functionId: string, costProfile: string): string {
  const profile = BuildDefaults[costProfile] ?? BuildDefaults.free_open;
  return profile[functionId] ?? "glm-5.2";
}

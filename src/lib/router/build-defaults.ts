// ============================================================================
// router/build-defaults.ts — Model routing por cost_profile
// ============================================================================
// Mapeia função agente → model_id, conforme catálogo models.json (v1.2.0).
// O router usa estes defaults; o user pode override no Execute.
// ============================================================================
// IDs verificados via web search em 2026-08-03:
//   Anthropic: claude-fable-5 (Jun 2026), claude-opus-5 (Jul 2026), claude-sonnet-5 (Jun 2026)
//   OpenAI: gpt-5-5 (Abr 2026), gpt-5-3-codex (Fev 2026), gpt-5-3-codex-spark (Fev 2026)
//   Google: gemini-3-1-pro (Fev 2026), gemini-3-1-flash
//   Zhipu: glm-5-2 (Jun 2026), glm-4-6 (legacy)
//   DeepSeek: deepseek-v4-pro (Abr 2026), deepseek-v4-flash (Abr 2026)
//   Moonshot: kimi-k3 (Jul 2026)
//   Alibaba: qwen-3-5-coder (Mar 2026), qwen-3-6 (Mai 2026)
//   xAI: grok-4-5 (Jul 2026), grok-4-3 (Mai 2026)
//   Meta: llama-4-maverick (Abr 2025)
//   Mistral: mistral-large-3 (Dez 2025), codestral
//   NVIDIA: nemotron-3-ultra
//   MiniMax: minimax-m2-7 (Mar 2026)
// ============================================================================
// R9 (free_open): SÓ modelos open/free (DeepSeek V4 Flash, Qwen 3.5 Coder, GLM-5.2, Llama 4, Nemotron)
// R10 (max): Topo frontier (Claude Fable 5, GPT-5.5, Grok 4.5, Kimi K3, DeepSeek V4 Pro)
// ============================================================================

export const BuildDefaults: Record<string, Record<string, string>> = {
  // R9: free_open — SÓ modelos open/free ou low-cost
  // Custo total aproximado para 1 pack: < $1
  free_open: {
    architect: "glm-5-2",                  // open weight, coding top
    architect_design: "glm-5-2",           // Bronze (funde architect+design)
    design_system: "qwen-3-5-coder",
    frontend: "qwen-3-5-coder",
    frontend_motion: "qwen-3-5-coder",     // Titanium (funde frontend+motion)
    motion: "qwen-3-5-coder",
    backend: "deepseek-v4-flash",
    security: "deepseek-v4-flash",
    qa: "glm-5-2",
    qa_deploy: "glm-5-2",                  // Bronze/Prata (funde qa+deploy)
    deploy: "glm-5-2",
    reviewer: "glm-5-2",
    content: "glm-5-2",
    builder: "qwen-3-5-coder",             // Bronze (funde ui+logic)
    builder_ui: "qwen-3-5-coder",          // Individual
    builder_logic: "deepseek-v4-flash",    // Individual
    ship: "glm-5-2",                       // Individual + Bronze
    spec_compiler: "glm-5-2",
  },
  // balanced — open + Sonnet 5/Haiku 4.5/Gemini 3.1 Flash/Kimi K3
  // Custo total aproximado para 1 pack: $2-5
  balanced: {
    architect: "claude-sonnet-5",
    architect_design: "claude-sonnet-5",
    design_system: "kimi-k3",
    frontend: "kimi-k3",
    frontend_motion: "kimi-k3",
    motion: "kimi-k3",
    backend: "deepseek-v4-flash",
    security: "deepseek-v4-flash",
    qa: "claude-sonnet-5",
    qa_deploy: "claude-sonnet-5",
    deploy: "claude-sonnet-5",
    reviewer: "claude-sonnet-5",
    content: "claude-haiku-4-5",
    builder: "kimi-k3",
    builder_ui: "kimi-k3",
    builder_logic: "deepseek-v4-flash",
    ship: "claude-sonnet-5",
    spec_compiler: "glm-5-2",
  },
  // R10: max — frontier máximo (Fable 5/Opus 5/GPT-5.5/Grok 4.5/K3/V4 Pro)
  // Custo total aproximado para 1 pack: $10-25
  max: {
    architect: "claude-fable-5",
    architect_design: "claude-fable-5",
    design_system: "claude-fable-5",
    frontend: "kimi-k3",
    frontend_motion: "kimi-k3",
    motion: "kimi-k3",
    backend: "gpt-5-5",
    security: "claude-opus-5",
    qa: "claude-sonnet-5",
    qa_deploy: "claude-sonnet-5",
    deploy: "claude-sonnet-5",
    reviewer: "claude-fable-5",
    content: "gpt-5-3-codex-spark",
    builder: "kimi-k3",
    builder_ui: "kimi-k3",
    builder_logic: "gpt-5-3-codex",
    ship: "claude-sonnet-5",
    spec_compiler: "glm-5-2", // compiler mantém GLM mesmo no max (custo)
  },
};

export function getBuildModel(functionId: string, costProfile: string): string {
  const profile = BuildDefaults[costProfile] ?? BuildDefaults.free_open;
  return profile[functionId] ?? "glm-5-2";
}

// Alternativas por função (para mostrar no Execute "Trocar AI")
export const BuildAlternatives: Record<string, string[]> = {
  architect: ["claude-fable-5", "claude-opus-5", "gpt-5-5", "grok-4-5", "glm-5-2", "deepseek-v4-pro"],
  design_system: ["kimi-k3", "claude-fable-5", "claude-sonnet-5", "qwen-3-5-coder"],
  frontend: ["kimi-k3", "claude-sonnet-5", "qwen-3-5-coder", "gemini-3-1-flash"],
  motion: ["kimi-k3", "claude-sonnet-5", "qwen-3-5-coder"],
  backend: ["deepseek-v4-pro", "gpt-5-3-codex", "claude-opus-5", "qwen-3-5-coder", "codestral"],
  security: ["claude-opus-5", "deepseek-v4-pro", "glm-5-2"],
  qa: ["claude-sonnet-5", "claude-haiku-4-5", "gemini-3-1-flash", "minimax-m2-7"],
  deploy: ["claude-sonnet-5", "gemini-3-1-flash", "deepseek-v4-flash", "grok-4-3"],
  reviewer: ["claude-fable-5", "gpt-5-5", "grok-4-5", "claude-opus-5"],
  content: ["claude-haiku-4-5", "gpt-5-3-codex-spark", "grok-4-3", "minimax-m2-7", "glm-5-2"],
  patch: ["gpt-5-3-codex-spark", "claude-haiku-4-5", "gemini-3-1-flash", "qwen-3-5-coder", "deepseek-v4-flash"],
  spec_compiler: ["glm-5-2", "deepseek-v4-flash", "qwen-3-6"],
};

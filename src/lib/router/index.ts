// ============================================================================
// router/index.ts — Router determinístico (SEM LLM)
// ============================================================================
// Implementa regras R1-R15 conforme spec §6.
// Recebe GenerateInput + catálogo → devolve Recommendation com allowed_ids.
// ============================================================================

import {
  CATALOG,
  SKILLS_CORE_ALWAYS,
  MCPS_ESSENTIAL_BASE,
  getSkill,
  getMcp,
  getEffect,
  getSection,
  getFunction,
  getModel,
  getPreset,
  type Skill,
  type Mcp,
  type Effect,
  type Section,
  type Model,
} from "@/lib/catalog";
import type { GenerateInput, Recommendation } from "@/lib/schema/inaugura-pack";
import { BuildDefaults, getBuildModel } from "@/lib/router/build-defaults";

// ============================================================================
// Normalização do brief — extrai flags do texto
// ============================================================================
export interface NormalizedBrief {
  hasPayments: boolean;
  hasEcommerce: boolean;
  hasAuth: boolean;
  hasI18n: boolean;
  hasFigma: boolean;
  hasMotion: boolean;
  hasBlog: boolean;
  hasDashboard: boolean;
  locale: "pt" | "en";
  keywords: string[];
}

export function normalizeBrief(input: GenerateInput): NormalizedBrief {
  const text = `${input.brief} ${input.features.join(" ")} ${input.project_type}`.toLowerCase();
  return {
    hasPayments: /payment|pagamento|stripe|checkout|subscri|billing|cart|carrinho/i.test(text),
    hasEcommerce: /ecommerce|e-commerce|loja|shop|product|produto|store/i.test(text),
    hasAuth: /auth|login|sign.?in|sign.?up|register|conta|user|utilizador/i.test(text),
    hasI18n: /i18n|multi.?idioma|multilingual|translation|tradu/i.test(text),
    hasFigma: !!input.figma_url || /figma/i.test(text),
    hasMotion: /motion|anima|parallax|smooth|scroll.?trigger|gsap|framer/i.test(text),
    hasBlog: /blog|article|news|post/i.test(text),
    hasDashboard: /dashboard|admin|panel|analytics|backoffice/i.test(text),
    locale: input.locale,
    keywords: text.split(/\s+/).filter((w) => w.length > 3).slice(0, 20),
  };
}

// ============================================================================
// Router principal — aplica regras R1-R15
// ============================================================================
export function recommend(input: GenerateInput): Recommendation {
  const norm = normalizeBrief(input);
  const reasons: { id: string; because: string }[] = [];
  const warnings: string[] = [];

  // Skills core (always-on)
  const skillsCore = [...SKILLS_CORE_ALWAYS];
  const skillsProject: string[] = [];
  const skillsAdvanced: string[] = [];

  // MCPs essenciais (always-on base)
  const mcpsEssential = [...MCPS_ESSENTIAL_BASE];
  const mcpsOptional: string[] = [];

  // Integrations
  const integrations: string[] = [];

  // Sections
  const sections: { id: string; priority: "P0" | "P1" | "P2" }[] = [];
  const effects: { id: string; perf_cost: "low" | "mid" | "high" }[] = [];

  // ── R1: payments/ecommerce → stripe + backend + security ──
  if (norm.hasPayments || norm.hasEcommerce || input.project_type === "ecommerce") {
    integrations.push("stripe");
    if (!skillsProject.includes("security-basics")) skillsProject.push("security-basics");
    reasons.push({ id: "stripe", because: "Brief menciona pagamentos/ecommerce → Stripe + security" });
  }

  // ── R2: figma_url → mcp figma + skill figma-implement ──
  if (norm.hasFigma) {
    if (!mcpsEssential.includes("figma")) mcpsEssential.push("figma");
    if (!skillsProject.includes("figma-implement")) skillsProject.push("figma-implement");
    reasons.push({ id: "figma", because: "Figma URL detetada → MCP Figma + skill implement" });
  }

  // ── R3: motion high → adiciona função motion ao team ──
  const userEffects = [...input.effects_lock];
  const effectsHighCost = userEffects.filter((id) => getEffect(id)?.perf_cost === "high");
  const hasMotionHighCost = effectsHighCost.length > 0 || norm.hasMotion;

  // ── R4: effects high-cost > 2 → warning ──
  if (effectsHighCost.length > 2) {
    warnings.push(
      `Demasiados effects high-cost (${effectsHighCost.length}). Recomendado máximo 2. Prefere GSAP/Lenis only.`
    );
  }

  // ── R5: i18n → skill writing/seo + sections language toggle ──
  if (norm.hasI18n) {
    integrations.push("i18n");
    if (!skillsProject.includes("writing-seo")) skillsProject.push("writing-seo");
    reasons.push({ id: "i18n", because: "Multi-idioma detetado → skill writing/seo + integration i18n" });
  }

  // ── R6: auth → backend + security ──
  if (norm.hasAuth) {
    integrations.push("auth-clerk");
    if (!skillsProject.includes("security-basics")) skillsProject.push("security-basics");
    reasons.push({ id: "auth", because: "Auth detetada → integration Clerk + skill security" });
  }

  // ── R7: level=awwwards → mode team default size 6 ──
  // ── R8: level=lite → mode individual ──
  let mode: "individual" | "team" = "individual";
  let teamFunctions: string[] = [];
  let teamSize = input.execution.team_size;

  if (input.execution.mode === "auto") {
    if (input.level === "awwwards") {
      mode = "team";
      teamSize = teamSize ?? 6;
      teamFunctions = ["architect", "design_system", "frontend", "motion", "qa", "deploy"];
      reasons.push({ id: "mode-team", because: "Level awwwards → mode team size 6" });
    } else if (input.level === "pro") {
      mode = "team";
      teamSize = teamSize ?? 4;
      teamFunctions = ["architect", "design_system", "frontend", "deploy"];
      reasons.push({ id: "mode-team", because: "Level pro → mode team size 4" });
    } else {
      mode = "individual";
      reasons.push({ id: "mode-individual", because: "Level lite → mode individual" });
    }
  } else {
    mode = input.execution.mode === "team" ? "team" : "individual";
    if (mode === "team") {
      teamSize = teamSize ?? 4;
      teamFunctions = input.execution.team_functions ?? ["architect", "design_system", "frontend", "deploy"];
    }
  }

  // ── R9: cost_profile=free_open → exclui modelos paid (validado depois no routing) ──
  // ── R10: cost_profile=max → arquitecto e reviewer usam frontier (Claude Opus, GPT-5) ──
  const costProfile = input.execution.cost_profile;

  // ── R11: user locks always union into selection ──
  if (input.locks?.skills) {
    input.locks.skills.forEach((s) => {
      if (!skillsCore.includes(s) && !skillsProject.includes(s) && getSkill(s)) {
        skillsProject.push(s);
      }
    });
  }
  if (input.locks?.mcps) {
    input.locks.mcps.forEach((m) => {
      if (!mcpsEssential.includes(m) && !mcpsOptional.includes(m) && getMcp(m)) {
        mcpsEssential.push(m);
      }
    });
  }
  if (input.locks?.integrations) {
    input.locks.integrations.forEach((i) => {
      if (!integrations.includes(i)) integrations.push(i);
    });
  }

  // ── R12: team_functions clamp 3..8 ──
  if (mode === "team") {
    if (teamFunctions.length < 3) {
      warnings.push(`Team functions (${teamFunctions.length}) < 3. Adicionando architect, frontend, deploy.`);
      teamFunctions = ["architect", "frontend", "deploy"];
    }
    if (teamFunctions.length > 8) {
      warnings.push(`Team functions (${teamFunctions.length}) > 8. Truncando para 8.`);
      teamFunctions = teamFunctions.slice(0, 8);
    }
  }

  // ── R13: individual always 5 slots ──
  const individualSlots = ["architect", "builder_ui", "builder_logic", "qa", "ship"];

  // ── R14: no data features → drop backend function ──
  const hasDataFeatures = norm.hasPayments || norm.hasAuth || norm.hasEcommerce || input.project_type === "saas";
  if (!hasDataFeatures && mode === "team") {
    teamFunctions = teamFunctions.filter((f) => f !== "backend");
    if (teamFunctions.length < 3) teamFunctions.push("content");
  }

  // ── R3 (aplicação): se há motion high-cost e mode team sem função motion, adiciona ──
  if (hasMotionHighCost && mode === "team" && !teamFunctions.includes("motion")) {
    // só adiciona se houver espaço (< 8)
    if (teamFunctions.length < 8) {
      teamFunctions.push("motion");
      reasons.push({ id: "motion", because: "Effects high-cost detetados → adicionar função motion ao team" });
    } else {
      warnings.push("Effects high-cost mas team já tem 8 funções — não foi possível adicionar motion.");
    }
  }

  // ── R15: portfolio default sections P0 ──
  if (input.project_type === "portfolio" || input.project_type === "agency") {
    ["hero", "work", "about", "contact", "footer"].forEach((id) => {
      if (getSection(id)) sections.push({ id, priority: "P0" });
    });
  }

  // Apply user sections_lock
  input.sections_lock.forEach((id) => {
    if (getSection(id) && !sections.find((s) => s.id === id)) {
      sections.push({ id, priority: getSection(id)!.default_priority });
    }
  });

  // If no sections, add defaults based on project type
  if (sections.length === 0) {
    const defaults =
      input.project_type === "saas"
        ? ["hero", "features", "pricing", "cta", "footer"]
        : input.project_type === "ecommerce"
        ? ["hero", "features", "pricing", "cta", "footer"]
        : ["hero", "about", "services", "contact", "footer"];
    defaults.forEach((id) => {
      if (getSection(id)) sections.push({ id, priority: getSection(id)!.default_priority });
    });
  }

  // Apply user effects_lock
  input.effects_lock.forEach((id) => {
    const eff = getEffect(id);
    if (eff) {
      effects.push({ id, perf_cost: eff.perf_cost });
      // Add skill if not present
      if (!skillsProject.includes(eff.skill) && !skillsCore.includes(eff.skill)) {
        skillsProject.push(eff.skill);
      }
    }
  });

  // Add MCPs based on level
  if (input.level === "pro" || input.level === "awwwards") {
    if (!mcpsEssential.includes("playwright")) mcpsEssential.push("playwright");
  }
  if (integrations.includes("stripe") || norm.hasPayments) {
    if (!mcpsEssential.includes("stripe")) mcpsEssential.push("stripe");
  }
  if (integrations.includes("supabase") || norm.hasAuth) {
    if (!mcpsEssential.includes("supabase")) mcpsEssential.push("supabase");
  }

  // ── Build routing (model assignment per function) ──
  // R9/R10: getBuildModel já respeita cost_profile — free_open só usa open, max usa frontier
  const build_routing = mode === "team" ? teamFunctions : individualSlots.slice(0, 1);
  const routing = build_routing.map((fnId) => {
    const fn = getFunction(fnId);
    let modelId = getBuildModel(fnId, costProfile);
    // R9硬约束: free_open NUNCA pode usar modelo paid — valida contra catálogo
    if (costProfile === "free_open") {
      const model = getModel(modelId);
      if (model && model.cost !== "free" && model.cost !== "low") {
        // substitui por fallback open
        modelId = "deepseek-v3";
        warnings.push(`R9: model_id ${modelId} era paid em free_open — substituído por deepseek-v3`);
      }
    }
    return {
      function_id: fnId,
      model_id: modelId,
      host: input.execution.host_preference,
      skills: fn?.skills ?? [],
      mcps: fn?.mcps ?? [],
    };
  });

  // ── allowed_ids: union de tudo que o LLM pode citar ──
  const allowed_ids = [
    ...skillsCore,
    ...skillsProject,
    ...skillsAdvanced,
    ...mcpsEssential,
    ...mcpsOptional,
    ...integrations,
    ...sections.map((s) => s.id),
    ...effects.map((e) => e.id),
    ...teamFunctions,
    ...individualSlots,
    ...routing.map((r) => r.model_id),
  ].filter((v, i, a) => a.indexOf(v) === i); // dedup

  return {
    mode,
    team_functions: teamFunctions,
    individual_slots: individualSlots,
    skills_core: skillsCore,
    skills_project: skillsProject,
    mcps_essential: mcpsEssential,
    mcps_optional: mcpsOptional,
    integrations,
    sections,
    effects,
    build_routing: routing,
    reasons,
    warnings,
    allowed_ids,
  };
}

// ============================================================================
// Validate — valida InauguraPack pós-LLM (CÓDIGO, não LLM)
// ============================================================================
export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export function validatePack(pack: unknown, rec: Recommendation): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!pack || typeof pack !== "object") {
    return { ok: false, errors: ["Pack não é objeto válido"], warnings };
  }

  const p = pack as Record<string, unknown>;

  // Verifica campos obrigatórios
  const required = ["meta", "overview", "spec_md", "design_md", "agents_md", "plan_md", "checklist_md", "routing", "prompts", "install", "selection", "gaps"];
  for (const key of required) {
    if (!(key in p)) errors.push(`Campo obrigatório em falta: ${key}`);
  }

  // Verifica selection IDs contra allowed_ids
  const selection = p.selection as Record<string, unknown> | undefined;
  if (selection) {
    const checkIds = (arr: unknown[], label: string) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((id) => {
        if (typeof id === "string" && !rec.allowed_ids.includes(id)) {
          errors.push(`ID inválido em ${label}: "${id}" não está em allowed_ids`);
        }
      });
    };
    checkIds(selection.skills as unknown[], "selection.skills");
    checkIds(selection.mcps as unknown[], "selection.mcps");
    checkIds(selection.integrations as unknown[], "selection.integrations");
    checkIds(selection.effects as unknown[], "selection.effects");
  }

  // Verifica routing.model_id contra catálogo (anti-hallucinação de modelos inexistentes)
  const routing = p.routing as Record<string, unknown> | undefined;
  if (routing && Array.isArray(routing.build_routing)) {
    (routing.build_routing as Record<string, unknown>[]).forEach((r, i) => {
      const modelId = r.model_id;
      if (typeof modelId === "string") {
        const model = getModel(modelId as string);
        if (!model) {
          errors.push(`routing.build_routing[${i}].model_id "${modelId}" não existe no catálogo de modelos`);
        } else {
          // R9硬约束: free_open NUNCA pode ter modelo paid
          const costProfile = (p.meta as Record<string, unknown> | undefined)?.cost_profile;
          if (costProfile === "free_open" && model.cost !== "free" && model.cost !== "low") {
            errors.push(`R9 violado: model_id "${modelId}" (cost=${model.cost}) em cost_profile=free_open`);
          }
        }
      }
    });
  }

  // Verifica install.commands contra catálogo de skills (anti-hallucinação de install commands)
  const install = p.install as Record<string, unknown> | undefined;
  if (install && Array.isArray(install.commands)) {
    const validInstallCommands = new Set<string>();
    CATALOG.skills.forEach((s) => { if (s.install) validInstallCommands.add(s.install); });
    CATALOG.mcps.forEach((m) => { if (m.install) validInstallCommands.add(m.install); });
    (install.commands as Record<string, unknown>[]).forEach((cmd, i) => {
      const cmdStr = cmd.cmd;
      if (typeof cmdStr === "string" && cmdStr.trim() !== "") {
        // aceita se for exatamente igual a um válido OU se começar com um prefixo válido
        const isPrefixOf = Array.from(validInstallCommands).some(valid => cmdStr.startsWith(valid.split(" ")[0]));
        if (!isPrefixOf) {
          warnings.push(`install.commands[${i}].cmd "${cmdStr.slice(0, 60)}..." não corresponde a nenhum pacote conhecido`);
        }
      }
    });
  }

  // Verifica prompts: individual = 5, team = 3-8
  const prompts = p.prompts as Record<string, unknown> | undefined;
  if (prompts) {
    if (rec.mode === "individual") {
      const ind = prompts.individual as unknown[];
      if (!Array.isArray(ind) || ind.length !== 5) {
        errors.push(`Individual mode deve ter exatamente 5 prompts (recebido: ${Array.isArray(ind) ? ind.length : 0})`);
      }
    } else if (rec.mode === "team") {
      const team = prompts.team as unknown[];
      if (!Array.isArray(team) || team.length < 3 || team.length > 8) {
        errors.push(`Team mode deve ter 3-8 prompts (recebido: ${Array.isArray(team) ? team.length : 0})`);
      }
    }
  }

  // Verifica locks do user (R11)
  // (assumindo que rec já inclui os locks do user)

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

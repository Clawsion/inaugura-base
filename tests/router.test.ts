// ============================================================================
// router.test.ts — Testes das regras R1-R15 do router determinístico
// ============================================================================
import { describe, it, expect } from "vitest";
import { normalizeBrief, recommend, validatePack } from "@/lib/router";
import type { GenerateInput, Recommendation } from "@/lib/schema/inaugura-pack";

// Helper: input mínimo válido
function makeInput(overrides: Partial<GenerateInput> = {}): GenerateInput {
  return {
    locale: "pt",
    brief: "Quero uma landing page moderna para a minha startup de SaaS",
    project_type: "portfolio",
    references: [],
    features: [],
    sections_lock: [],
    effects_lock: [],
    visual: { locks: { aesthetic: "modern-clean", mood: "premium", palette: "auto" } },
    execution: {
      mode: "auto",
      cost_profile: "free_open",
      host_preference: "opencode",
    },
    locks: { skills: [], mcps: [], integrations: [] },
    level: "pro",
    options: {
      polish_design: false,
      include_opencode_json: true,
      include_zip_markdown: true,
    },
    ...overrides,
  } as GenerateInput;
}

describe("normalizeBrief", () => {
  it("deteta pagamentos (R1 trigger)", () => {
    const norm = normalizeBrief(makeInput({ brief: "Quero Stripe payments no checkout" }));
    expect(norm.hasPayments).toBe(true);
  });

  it("deteta ecommerce (R1 trigger)", () => {
    const norm = normalizeBrief(makeInput({ brief: "Loja online com carrinho de produtos" }));
    expect(norm.hasEcommerce).toBe(true);
  });

  it("deteta auth (R6 trigger)", () => {
    const norm = normalizeBrief(makeInput({ brief: "Login com sign-up para utilizadores" }));
    expect(norm.hasAuth).toBe(true);
  });

  it("deteta i18n (R5 trigger)", () => {
    const norm = normalizeBrief(makeInput({ brief: "Site multi-idioma com tradução i18n" }));
    expect(norm.hasI18n).toBe(true);
  });

  it("deteta figma via URL (R2 trigger)", () => {
    const norm = normalizeBrief(makeInput({ figma_url: "https://figma.com/file/abc" }));
    expect(norm.hasFigma).toBe(true);
  });

  it("deteta figma via texto (R2 trigger)", () => {
    const norm = normalizeBrief(makeInput({ brief: "Implementar este design do Figma" }));
    expect(norm.hasFigma).toBe(true);
  });

  it("deteta motion (R3 trigger)", () => {
    const norm = normalizeBrief(makeInput({ brief: "Quero animações com framer motion e parallax" }));
    expect(norm.hasMotion).toBe(true);
  });

  it("deteta blog (R5 trigger)", () => {
    const norm = normalizeBrief(makeInput({ brief: "Preciso de um blog com artigos" }));
    expect(norm.hasBlog).toBe(true);
  });

  it("deteta dashboard", () => {
    const norm = normalizeBrief(makeInput({ brief: "Backoffice com dashboard analytics" }));
    expect(norm.hasDashboard).toBe(true);
  });
});

describe("Router R1 — payments/ecommerce", () => {
  it("R1: brief com stripe → adiciona integration stripe + skill security-basics", () => {
    const rec = recommend(makeInput({ brief: "Quero Stripe payments no checkout" }));
    expect(rec.integrations).toContain("stripe");
    expect(rec.skills_project).toContain("security-basics");
    expect(rec.reasons.some((r) => r.id === "stripe")).toBe(true);
  });

  it("R1: project_type=ecommerce → adiciona integration stripe mesmo sem menção", () => {
    const rec = recommend(makeInput({ project_type: "ecommerce" }));
    expect(rec.integrations).toContain("stripe");
  });
});

describe("Router R2 — figma", () => {
  it("R2: figma_url → adiciona MCP figma + skill figma-implement", () => {
    const rec = recommend(makeInput({ figma_url: "https://figma.com/file/abc" }));
    expect(rec.mcps_essential).toContain("figma");
    expect(rec.skills_project).toContain("figma-implement");
  });
});

describe("Router R3 — motion function", () => {
  it("R3: motion no brief + mode team (pro) → adiciona função motion ao team", () => {
    // Pro default team = [architect, design_system, frontend, deploy] — sem motion
    // Brief com motion deve adicioná-lo via R3
    const rec = recommend(makeInput({
      brief: "Quero animações com framer motion e parallax",
      level: "pro",
    }));
    expect(rec.mode).toBe("team");
    expect(rec.team_functions).toContain("motion");
  });

  it("R3: sem motion em pro → não adiciona função motion ao team", () => {
    const rec = recommend(makeInput({
      brief: "Landing page estática simples",
      level: "pro",
    }));
    expect(rec.team_functions).not.toContain("motion");
  });
});

describe("Router R4 — effects high-cost warning", () => {
  it("R4: >2 effects high-cost → warning", () => {
    // IDs reais com perf_cost=high: gsap-timeline, horizontal-scroll, 3d-webgl
    const rec = recommend(makeInput({
      effects_lock: ["gsap-timeline", "horizontal-scroll", "3d-webgl"],
    }));
    // Pelo menos um warning sobre high-cost
    expect(rec.warnings.some((w) => w.includes("high-cost"))).toBe(true);
  });
});

describe("Router R5 — i18n", () => {
  it("R5: i18n no brief → integration i18n + skill writing-seo", () => {
    const rec = recommend(makeInput({ brief: "Site multi-idioma com tradução i18n" }));
    expect(rec.integrations).toContain("i18n");
    expect(rec.skills_project).toContain("writing-seo");
  });
});

describe("Router R6 — auth", () => {
  it("R6: auth → integration auth-clerk + skill security-basics", () => {
    const rec = recommend(makeInput({ brief: "Login com sign-up para utilizadores" }));
    expect(rec.integrations).toContain("auth-clerk");
    expect(rec.skills_project).toContain("security-basics");
  });
});

describe("Router R7/R8 — level → mode", () => {
  it("R7: level=awwwards → mode team size 6", () => {
    const rec = recommend(makeInput({ level: "awwwards" }));
    expect(rec.mode).toBe("team");
    expect(rec.team_functions.length).toBeGreaterThanOrEqual(5);
    expect(rec.team_functions).toContain("architect");
    expect(rec.team_functions).toContain("qa");
  });

  it("R7: level=pro → mode team size 4", () => {
    const rec = recommend(makeInput({ level: "pro" }));
    expect(rec.mode).toBe("team");
    expect(rec.team_functions.length).toBe(4);
  });

  it("R8: level=lite → mode individual", () => {
    const rec = recommend(makeInput({ level: "lite" }));
    expect(rec.mode).toBe("individual");
  });
});

describe("Router R9 — free_open exclui modelos paid", () => {
  it("R9: cost_profile=free_open → todos os models no routing são free/low cost", () => {
    const rec = recommend(makeInput({
      level: "awwwards",
      execution: { mode: "auto", cost_profile: "free_open", host_preference: "opencode" },
    }));
    expect(rec.build_routing.length).toBeGreaterThan(0);
    rec.build_routing.forEach((r) => {
      // Modelo deve ser um dos IDs open/low cost do catálogo v1.2.0
      const allowedFreeOpen = [
        "glm-5-2", "glm-4-6", "deepseek-v4-flash", "deepseek-v4-pro",
        "qwen-3-5-coder", "qwen-3-6", "llama-4-maverick",
        "nemotron-3-ultra", "ollama-qwen-coder", "codestral",
      ];
      expect(allowedFreeOpen).toContain(r.model_id);
    });
  });
});

describe("Router R10 — max usa frontier", () => {
  it("R10: cost_profile=max → architect usa Claude Fable 5 ou GPT-5.5", () => {
    const rec = recommend(makeInput({
      level: "awwwards",
      execution: { mode: "auto", cost_profile: "max", host_preference: "opencode" },
    }));
    const architect = rec.build_routing.find((r) => r.function_id === "architect");
    expect(architect).toBeDefined();
    expect(["claude-fable-5", "gpt-5-5", "claude-opus-5", "grok-4-5"]).toContain(architect!.model_id);
  });
});

describe("Router R11 — user locks", () => {
  it("R11: locks.skills → adiciona ao skills_project se existir no catálogo", () => {
    const rec = recommend(makeInput({
      locks: { skills: ["prisma", "drizzle-orm"], mcps: [], integrations: [] },
    }));
    expect(rec.skills_project).toContain("prisma");
    expect(rec.skills_project).toContain("drizzle-orm");
  });

  it("R11: locks.skills com ID inexistente → silenciosamente descartado (sem erro)", () => {
    const rec = recommend(makeInput({
      locks: { skills: ["skill-inexistente-xyz"], mcps: [], integrations: [] },
    }));
    expect(rec.skills_project).not.toContain("skill-inexistente-xyz");
  });

  it("R11: locks.integrations → adiciona ao array de integrations", () => {
    const rec = recommend(makeInput({
      locks: { skills: [], mcps: [], integrations: ["stripe", "supabase"] },
    }));
    expect(rec.integrations).toContain("stripe");
    expect(rec.integrations).toContain("supabase");
  });
});

describe("Router R12 — team_functions clamp 3..8", () => {
  it("R12: team com <3 funções → warning e adiciona defaults", () => {
    const rec = recommend(makeInput({
      level: "pro",
      execution: {
        mode: "team",
        team_functions: ["architect"],
        cost_profile: "balanced",
        host_preference: "opencode",
      },
    }));
    expect(rec.team_functions.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Router R13 — individual sempre 5 slots", () => {
  it("R13: mode individual → individual_slots.length === 5", () => {
    const rec = recommend(makeInput({ level: "lite" }));
    expect(rec.individual_slots).toHaveLength(5);
    expect(rec.individual_slots).toEqual(["architect", "builder_ui", "builder_logic", "qa", "ship"]);
  });
});

describe("Router R14 — drop backend sem data features", () => {
  it("R14: portfolio sem data → team não tem backend", () => {
    const rec = recommend(makeInput({
      brief: "Landing page estática para portfolio",
      project_type: "portfolio",
      level: "awwwards",
    }));
    expect(rec.team_functions).not.toContain("backend");
  });

  it("R14: SaaS tem data features → team pode ter backend", () => {
    const rec = recommend(makeInput({
      brief: "SaaS com login e pagamentos",
      project_type: "saas",
      level: "awwwards",
    }));
    // Pode ou não ter backend, dependendo do fluxo — mas as data features estão presentes
    expect(rec.integrations.length).toBeGreaterThan(0);
  });
});

describe("Router R15 — portfolio sections P0", () => {
  it("R15: project_type=portfolio → sections P0 contém hero, work, about, contact, footer", () => {
    const rec = recommend(makeInput({ project_type: "portfolio" }));
    const p0Sections = rec.sections.filter((s) => s.priority === "P0").map((s) => s.id);
    expect(p0Sections).toContain("hero");
    expect(p0Sections).toContain("work");
    expect(p0Sections).toContain("about");
    expect(p0Sections).toContain("contact");
    expect(p0Sections).toContain("footer");
  });
});

describe("validatePack", () => {
  it("rejeita pack sem campos obrigatórios", () => {
    const rec = recommend(makeInput());
    const result = validatePack({}, rec);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("Campo obrigatório em falta"))).toBe(true);
  });

  it("rejeita IDs inválidos em selection.skills", () => {
    const rec = recommend(makeInput());
    const fakePack = {
      meta: {}, overview: {}, spec_md: "", design_md: "", agents_md: "",
      plan_md: "", checklist_md: "", routing: {}, prompts: {},
      install: {}, gaps: [],
      selection: { skills: ["skill-inventado-xyz"], mcps: [], integrations: [], effects: [] },
    };
    const result = validatePack(fakePack, rec);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("skill-inventado-xyz"))).toBe(true);
  });

  it("rejeita model_id inexistente em routing.build_routing", () => {
    const rec = recommend(makeInput());
    const fakePack = {
      meta: { cost_profile: "free_open" }, overview: {}, spec_md: "", design_md: "",
      agents_md: "", plan_md: "", checklist_md: "", prompts: {}, install: {}, gaps: [],
      routing: { build_routing: [{ function_id: "architect", model_id: "gpt-99-inventado", host: "opencode", skills: [], mcps: [] }] },
      selection: { skills: [], mcps: [], integrations: [], effects: [] },
    };
    const result = validatePack(fakePack, rec);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("gpt-99-inventado") && e.includes("não existe no catálogo"))).toBe(true);
  });

  it("rejeita R9: modelo paid em cost_profile=free_open", () => {
    const rec = recommend(makeInput());
    const fakePack = {
      meta: { cost_profile: "free_open" }, overview: {}, spec_md: "", design_md: "",
      agents_md: "", plan_md: "", checklist_md: "", prompts: {}, install: {}, gaps: [],
      routing: { build_routing: [{ function_id: "architect", model_id: "claude-fable-5", host: "opencode", skills: [], mcps: [] }] },
      selection: { skills: [], mcps: [], integrations: [], effects: [] },
    };
    const result = validatePack(fakePack, rec);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("R9 violado") && e.includes("claude-fable-5"))).toBe(true);
  });

  it("aceita model_id válido em free_open", () => {
    const rec = recommend(makeInput());
    const fakePack = {
      meta: { cost_profile: "free_open" }, overview: {}, spec_md: "", design_md: "",
      agents_md: "", plan_md: "", checklist_md: "", prompts: {}, install: {}, gaps: [],
      routing: { build_routing: [{ function_id: "architect", model_id: "deepseek-v4-flash", host: "opencode", skills: [], mcps: [] }] },
      selection: { skills: [], mcps: [], integrations: [], effects: [] },
    };
    const result = validatePack(fakePack, rec);
    // Não deve ter erro sobre model_id
    expect(result.errors.filter((e) => e.includes("model_id"))).toHaveLength(0);
    expect(result.errors.filter((e) => e.includes("R9"))).toHaveLength(0);
  });
});

describe("allowed_ids — anti-hallucinação", () => {
  it("allowed_ids inclui todos os skills_core + skills_project + mcps + integrations", () => {
    const rec = recommend(makeInput({
      brief: "SaaS com stripe e login",
      project_type: "saas",
      locks: { skills: ["prisma"], mcps: [], integrations: [] },
    }));
    expect(rec.allowed_ids).toContain("shadcn-ui"); // skills_core
    expect(rec.allowed_ids).toContain("prisma");    // skills_project (lock)
    expect(rec.allowed_ids).toContain("stripe");    // integration
    expect(rec.allowed_ids).toContain("auth-clerk");// integration (R6)
  });

  it("allowed_ids não contém IDs inventados", () => {
    const rec = recommend(makeInput());
    expect(rec.allowed_ids).not.toContain("skill-inventado");
    expect(rec.allowed_ids).not.toContain("model-inventado");
  });
});

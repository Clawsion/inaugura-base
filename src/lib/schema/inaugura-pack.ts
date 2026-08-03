// ============================================================================
// schema/inaugura-pack.ts — Zod schemas para InauguraPack + GenerateInput
// ============================================================================

import { z } from "zod";

// ----------------------------------------------------------------------------
// GenerateInput — o que a UI envia
// ----------------------------------------------------------------------------
export const GenerateInputSchema = z.object({
  locale: z.enum(["pt", "en"]).default("pt"),
  brief: z.string().min(20, "Briefing deve ter pelo menos 20 caracteres."),
  project_type: z.enum([
    "portfolio",
    "agency",
    "saas",
    "ecommerce",
    "corporate",
    "local_business",
    "other",
  ]),
  references: z
    .array(
      z.object({
        url: z.string(),
        role: z.enum(["visual_anchor", "competitor", "content"]).default("visual_anchor"),
      })
    )
    .max(3)
    .default([]),
  figma_url: z.string().optional(),

  features: z.array(z.string()).default([]),
  sections_lock: z.array(z.string()).default([]),
  effects_lock: z.array(z.string()).default([]),

  visual: z
    .object({
      theme_id: z.string().optional(),
      locks: z.record(z.string(), z.string()),
      font_prefs: z
        .object({
          display: z.string().optional(),
          body: z.string().optional(),
          mono: z.string().optional(),
        })
        .optional(),
      palette_lock: z
        .object({
          primary: z.string().optional(),
          secondary: z.string().optional(),
          accent: z.string().optional(),
          bg: z.string().optional(),
          fg: z.string().optional(),
        })
        .optional(),
    })
    .optional(),

  execution: z.object({
    mode: z.enum(["individual", "team", "auto"]).default("auto"),
    team_size: z.number().int().min(3).max(8).optional(),
    team_functions: z.array(z.string()).optional(),
    cost_profile: z.enum(["free_open", "balanced", "max"]).default("free_open"),
    host_preference: z.enum(["opencode", "claude", "codex", "hybrid"]).default("opencode"),
  }),

  locks: z
    .object({
      skills: z.array(z.string()),
      mcps: z.array(z.string()),
      integrations: z.array(z.string()),
    })
    .optional(),

  level: z.enum(["lite", "pro", "awwwards"]).default("pro"),
  options: z
    .object({
      polish_design: z.boolean(),
      include_opencode_json: z.boolean(),
      include_zip_markdown: z.boolean(),
    })
    .optional(),
});

export type GenerateInput = z.infer<typeof GenerateInputSchema>;

// ----------------------------------------------------------------------------
// Recommendation — saída do router (SEM LLM)
// ----------------------------------------------------------------------------
export const RecommendationSchema = z.object({
  mode: z.enum(["individual", "team"]),
  team_functions: z.array(z.string()),
  individual_slots: z.array(z.string()).default([
    "architect",
    "builder_ui",
    "builder_logic",
    "qa",
    "ship",
  ]),

  skills_core: z.array(z.string()),
  skills_project: z.array(z.string()),
  mcps_essential: z.array(z.string()),
  mcps_optional: z.array(z.string()),
  integrations: z.array(z.string()),

  sections: z.array(
    z.object({
      id: z.string(),
      priority: z.enum(["P0", "P1", "P2"]),
    })
  ),
  effects: z.array(
    z.object({
      id: z.string(),
      perf_cost: z.enum(["low", "mid", "high"]),
    })
  ),

  build_routing: z.array(
    z.object({
      function_id: z.string(),
      model_id: z.string(),
      host: z.string(),
      skills: z.array(z.string()),
      mcps: z.array(z.string()),
    })
  ),

  reasons: z.array(
    z.object({
      id: z.string(),
      because: z.string(),
    })
  ),
  warnings: z.array(z.string()),
  allowed_ids: z.array(z.string()),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

// ----------------------------------------------------------------------------
// InauguraPack — saída do compiler (COM LLM + validate)
// ----------------------------------------------------------------------------
export const InauguraPackSchema = z.object({
  meta: z.object({
    slug: z.string(),
    title: z.string(),
    locale: z.enum(["pt", "en"]),
    level: z.enum(["lite", "pro", "awwwards"]),
    mode: z.enum(["individual", "team"]),
    cost_profile: z.enum(["free_open", "balanced", "max"]),
    created_at: z.string(),
    compiler_model: z.string(),
    polish_model: z.string().optional(),
    // Versionamento (P0)
    catalog_version: z.string().default("1.0.0"),
    schema_version: z.string().default("1.0.0"),
  }),

  overview: z.object({
    summary: z.string(),
    stack: z.array(z.string()),
    days_estimate: z.string(),
    token_cost_estimate: z.string(),
    risks: z.array(
      z.object({
        level: z.enum(["low", "mid", "high"]),
        text: z.string(),
      })
    ),
  }),

  spec_md: z.string(),
  design_md: z.string(),
  agents_md: z.string(),
  plan_md: z.string(),
  checklist_md: z.string(),

  routing: z.object({
    build_routing: z.array(
      z.object({
        function_id: z.string(),
        model_id: z.string(),
        host: z.string(),
        skills: z.array(z.string()),
        mcps: z.array(z.string()),
      })
    ),
    opencode_json: z.any().optional(),
  }),

  prompts: z.object({
    individual: z
      .array(
        z.object({
          slot: z.string(),
          title: z.string(),
          model_target: z.string(),
          body: z.string(),
        })
      )
      .max(5)
      .optional(),
    team: z
      .array(
        z.object({
          function_id: z.string(),
          system: z.string(),
          task: z.string(),
          reads: z.array(z.string()),
          writes: z.array(z.string()),
          done_when: z.array(z.string()),
          handoff_to: z.array(z.string()).optional(),
          model_target: z.string(),
          host: z.string(),
        })
      )
      .optional(),
  }),

  install: z.object({
    skills: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        install_commands: z.array(z.string()),
        best_models: z.array(z.string()),
      })
    ),
    mcps: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        install_commands: z.array(z.string()),
        phase: z.array(z.string()),
      })
    ),
  }),

  selection: z.object({
    skills: z.array(z.string()),
    mcps: z.array(z.string()),
    integrations: z.array(z.string()),
    sections: z.array(
      z.object({
        id: z.string(),
        priority: z.enum(["P0", "P1", "P2"]),
      })
    ),
    effects: z.array(z.string()),
  }),

  gaps: z.array(z.string()),
});

export type InauguraPack = z.infer<typeof InauguraPackSchema>;

// ----------------------------------------------------------------------------
// JSON Schema para o tool_call do LLM
// ----------------------------------------------------------------------------
export function inauguraPackToJsonSchema() {
  return {
    type: "object",
    properties: {
      meta: {
        type: "object",
        properties: {
          slug: { type: "string" },
          title: { type: "string" },
          locale: { type: "string", enum: ["pt", "en"] },
          level: { type: "string", enum: ["lite", "pro", "awwwards"] },
          mode: { type: "string", enum: ["individual", "team"] },
          cost_profile: { type: "string", enum: ["free_open", "balanced", "max"] },
          created_at: { type: "string" },
          compiler_model: { type: "string" },
        },
        required: ["slug", "title", "locale", "level", "mode", "cost_profile", "created_at", "compiler_model"],
      },
      overview: {
        type: "object",
        properties: {
          summary: { type: "string" },
          stack: { type: "array", items: { type: "string" } },
          days_estimate: { type: "string" },
          token_cost_estimate: { type: "string" },
          risks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                level: { type: "string", enum: ["low", "mid", "high"] },
                text: { type: "string" },
              },
              required: ["level", "text"],
            },
          },
        },
        required: ["summary", "stack", "days_estimate", "token_cost_estimate", "risks"],
      },
      spec_md: { type: "string", description: "SPEC em Markdown" },
      design_md: { type: "string", description: "DESIGN em Markdown" },
      agents_md: { type: "string", description: "AGENTS em Markdown" },
      plan_md: { type: "string", description: "PLAN em Markdown" },
      checklist_md: { type: "string", description: "CHECKLIST em Markdown" },
      routing: {
        type: "object",
        properties: {
          build_routing: {
            type: "array",
            items: {
              type: "object",
              properties: {
                function_id: { type: "string" },
                model_id: { type: "string" },
                host: { type: "string" },
                skills: { type: "array", items: { type: "string" } },
                mcps: { type: "array", items: { type: "string" } },
              },
              required: ["function_id", "model_id", "host", "skills", "mcps"],
            },
          },
        },
        required: ["build_routing"],
      },
      prompts: {
        type: "object",
        properties: {
          individual: {
            type: "array",
            maxItems: 5,
            items: {
              type: "object",
              properties: {
                slot: { type: "string" },
                title: { type: "string" },
                model_target: { type: "string" },
                body: { type: "string" },
              },
              required: ["slot", "title", "model_target", "body"],
            },
          },
          team: {
            type: "array",
            items: {
              type: "object",
              properties: {
                function_id: { type: "string" },
                system: { type: "string" },
                task: { type: "string" },
                reads: { type: "array", items: { type: "string" } },
                writes: { type: "array", items: { type: "string" } },
                done_when: { type: "array", items: { type: "string" } },
                handoff_to: { type: "array", items: { type: "string" } },
                model_target: { type: "string" },
                host: { type: "string" },
              },
              required: ["function_id", "system", "task", "reads", "writes", "done_when", "model_target", "host"],
            },
          },
        },
      },
      install: {
        type: "object",
        properties: {
          skills: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                install_commands: { type: "array", items: { type: "string" } },
                best_models: { type: "array", items: { type: "string" } },
              },
              required: ["id", "name", "install_commands", "best_models"],
            },
          },
          mcps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                install_commands: { type: "array", items: { type: "string" } },
                phase: { type: "array", items: { type: "string" } },
              },
              required: ["id", "name", "install_commands", "phase"],
            },
          },
        },
        required: ["skills", "mcps"],
      },
      selection: {
        type: "object",
        properties: {
          skills: { type: "array", items: { type: "string" } },
          mcps: { type: "array", items: { type: "string" } },
          integrations: { type: "array", items: { type: "string" } },
          sections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                priority: { type: "string", enum: ["P0", "P1", "P2"] },
              },
              required: ["id", "priority"],
            },
          },
          effects: { type: "array", items: { type: "string" } },
        },
        required: ["skills", "mcps", "integrations", "sections", "effects"],
      },
      gaps: { type: "array", items: { type: "string" } },
    },
    required: [
      "meta",
      "overview",
      "spec_md",
      "design_md",
      "agents_md",
      "plan_md",
      "checklist_md",
      "routing",
      "prompts",
      "install",
      "selection",
      "gaps",
    ],
  } as const;
}

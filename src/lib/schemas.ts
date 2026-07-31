import { z } from "zod";

// ============================================================================
// ProjectForge AI — Zod Schemas
// ============================================================================
// Estes schemas definem:
//  1. A estrutura dos dados que o modelo GLM-5.2 EMITE via tool call
//     (`emitProjectSpec`).
//  2. A estrutura dos dados do formulário (input do utilizador).
//
// O schema de output é usado:
//   - No backend, para converter em JSON Schema e enviar como `parameters`
//     da tool definition para o GLM (function calling nativo).
//   - No backend, para validar (`ProjectSpecSchema.parse()`) a resposta.
//   - No frontend, para tipar correctamente os resultados.
// ============================================================================

// ----------------------------------------------------------------------------
// Schema principal: ProjectSpecSchema
// Deve corresponder EXATAMENTE ao schema definido no enunciado.
// ----------------------------------------------------------------------------
export const ProjectSpecSchema = z.object({
  analysis: z.object({
    nicho: z.string(),
    tomDeVoz: z.string(),
    publicoAlvo: z.string(),
  }),
  palette: z
    .array(
      z.object({
        nome: z.string(),
        hex: z.string(),
        uso: z.string(),
      })
    )
    .min(3)
    .max(8),
  typography: z.object({
    heading: z.string(),
    body: z.string(),
    mono: z.string().optional(),
    justificacao: z.string(),
  }),
  designTokens: z.object({
    spacing: z.array(z.string()),
    radii: z.array(z.string()),
    shadows: z.array(z.string()),
  }),
  layoutRecommendation: z.object({
    tipo: z.string(),
    efeitos: z.array(z.string()),
    descricao: z.string(),
  }),
  skillsAndTools: z.array(
    z.object({
      categoria: z.enum([
        "Animações",
        "MCP",
        "UI",
        "Backend",
        "IA",
        "DevOps",
        "Outro",
      ]),
      nome: z.string(),
      justificacao: z.string(),
    })
  ),
  mockups: z.array(
    z.object({
      seccao: z.string(),
      descricao: z.string(),
    })
  ),
  prompts: z.array(
    z.object({
      fase: z.string().optional(), // só no modo Extended
      titulo: z.string(),
      conteudo: z.string(),
    })
  ),
  roadmap: z.array(z.string()).optional(),
});

export type ProjectSpec = z.infer<typeof ProjectSpecSchema>;

// ----------------------------------------------------------------------------
// Schema do formulário (input do utilizador)
// ----------------------------------------------------------------------------
export const SiteTypeEnum = z.enum([
  "single-page",
  "multi-page",
  "dashboard",
  "ecommerce",
  "outro",
]);
export type SiteType = z.infer<typeof SiteTypeEnum>;

export const FormSchema = z.object({
  briefing: z.string().min(20, "Briefing deve ter pelo menos 20 caracteres."),
  nicho: z.string(), // "" = auto-detect
  siteType: SiteTypeEnum,
  seccoes: z.array(z.string()),
  efeitos: z.array(z.string()),
  paletaMode: z.enum(["auto", "manual"]),
  paletaManual: z
    .array(z.object({ nome: z.string(), hex: z.string(), uso: z.string(), locked: z.boolean().optional() }))
    .optional(),
  typographyMode: z.enum(["auto", "manual"]),
  typographyManual: z
    .object({ heading: z.string(), body: z.string(), mono: z.string() })
    .optional(),
  promptMode: z.enum(["compact", "extended"]),
  // NOVO: até 3 skins escolhidos pelo utilizador (ids do array SKINS)
  skinsSelecionados: z.array(z.string()).max(3).default([]),
  // NOVO: fonts escolhidas no playground (5 slots)
  fontsPlayground: z
    .array(
      z.object({
        fonte: z.string(),
        transformId: z.string().optional(),
        customFontName: z.string().optional(),
        pesos: z.array(z.number()).optional(),
        italic: z.boolean().optional(),
        locked: z.boolean().optional(),
      })
    )
    .max(5)
    .default([]),
  incluirMockups: z.boolean(),
  incluirDesignTokens: z.boolean(),
  incluirRoadmap: z.boolean(),
  nivel: z.enum(["mvp", "production"]),
  idioma: z.enum(["pt", "en"]),
  // NOVOS: skills e integrações selecionadas
  selectedSkills: z.array(z.string()).default([]),
  selectedIntegrations: z.array(z.string()).default([]),
});

export type FormValues = z.infer<typeof FormSchema>;

// ----------------------------------------------------------------------------
// Conversão Zod -> JSON Schema (para enviar como `parameters` da tool).
// O Zod v4 traz `zod-to-json-schema` embutido parcialmente; fazemos à mão
// para garantir compatibilidade com o formato OpenAI function calling.
// ----------------------------------------------------------------------------
export function projectSpecToJsonSchema() {
  return {
    type: "object",
    properties: {
      analysis: {
        type: "object",
        properties: {
          nicho: { type: "string", description: "Nicho de mercado detetado" },
          tomDeVoz: { type: "string", description: "Tom de voz recomendado" },
          publicoAlvo: { type: "string", description: "Público-alvo ideal" },
        },
        required: ["nicho", "tomDeVoz", "publicoAlvo"],
      },
      palette: {
        type: "array",
        description: "3-8 cores, cada uma com nome, hex e uso",
        items: {
          type: "object",
          properties: {
            nome: { type: "string" },
            hex: { type: "string", description: "Formato #RRGGBB" },
            uso: { type: "string" },
          },
          required: ["nome", "hex", "uso"],
        },
      },
      typography: {
        type: "object",
        properties: {
          heading: { type: "string" },
          body: { type: "string" },
          mono: { type: "string" },
          justificacao: { type: "string" },
        },
        required: ["heading", "body", "justificacao"],
      },
      designTokens: {
        type: "object",
        properties: {
          spacing: { type: "array", items: { type: "string" } },
          radii: { type: "array", items: { type: "string" } },
          shadows: { type: "array", items: { type: "string" } },
        },
        required: ["spacing", "radii", "shadows"],
      },
      layoutRecommendation: {
        type: "object",
        properties: {
          tipo: { type: "string" },
          efeitos: { type: "array", items: { type: "string" } },
          descricao: { type: "string" },
        },
        required: ["tipo", "efeitos", "descricao"],
      },
      skillsAndTools: {
        type: "array",
        items: {
          type: "object",
          properties: {
            categoria: {
              type: "string",
              enum: [
                "Animações",
                "MCP",
                "UI",
                "Backend",
                "IA",
                "DevOps",
                "Outro",
              ],
            },
            nome: { type: "string" },
            justificacao: { type: "string" },
          },
          required: ["categoria", "nome", "justificacao"],
        },
      },
      mockups: {
        type: "array",
        items: {
          type: "object",
          properties: {
            seccao: { type: "string" },
            descricao: { type: "string" },
          },
          required: ["seccao", "descricao"],
        },
      },
      prompts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            fase: { type: "string" },
            titulo: { type: "string" },
            conteudo: { type: "string" },
          },
          required: ["titulo", "conteudo"],
        },
      },
      roadmap: { type: "array", items: { type: "string" } },
    },
    required: [
      "analysis",
      "palette",
      "typography",
      "designTokens",
      "layoutRecommendation",
      "skillsAndTools",
      "mockups",
      "prompts",
    ],
  } as const;
}

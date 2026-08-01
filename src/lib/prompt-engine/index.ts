// ============================================================================
// prompt-engine/index.ts — Funções que montam system/user prompt por secções
// ============================================================================
// Cada função é pura e testável. Juntas constroem o prompt do spec_compiler.
// ============================================================================

import type { GenerateInput, Recommendation } from "@/lib/schema/inaugura-pack";
import {
  CATALOG,
  getSkill,
  getMcp,
  getIntegration,
  getSection,
  getEffect,
  getFunction,
  getModel,
} from "@/lib/catalog";
import type { NormalizedBrief } from "@/lib/router";

// ----------------------------------------------------------------------------
// System prompt — regras duras do compiler
// ----------------------------------------------------------------------------
export function buildSystemPrompt(locale: "pt" | "en"): string {
  const lang = locale === "pt" ? "Português de Portugal (pt-PT)" : "English (en-US)";
  return `És o Inaugura Spec Compiler. NÃO constróis o website.
Produzes um pack JSON de especificação para agentes humanos/AI executarem depois.

REGRAS ABSOLUTAS:
1. Responde APENAS com JSON válido conforme o schema da tool emitInauguraPack.
2. Só podes usar skill_id, mcp_id, integration_id, section_id, effect_id, function_id, model_id
   que estejam em allowed_ids ou em selection fornecida.
3. É proibido inventar nomes de tools, npm packages de skills, ou MCPs.
4. Se o brief for vago, preenche gaps[] e assume P0 mínimo coerente — não inventes scope de e-commerce.
5. prompts devem ser acionáveis: papel, ler ficheiros, tarefas, constraints, done_when, handoff.
6. SPEC e DESIGN em Markdown de qualidade, em ${lang}.
7. Individual: EXATAMENTE 5 prompts (architect, builder_ui, builder_logic, qa, ship).
8. Team: 1 system + 1 task por function_id selecionada (3-8 funções).
9. Inclui sempre prefers-reduced-motion, budgets LCP/CLS, WCAG AA em checklist_md.
10. model_target nos prompts = build_routing (agentes DEPOIS), não o teu modelo.

Tom: direto, profissional, produção — não marketing vazio.
Responde EXCLUSIVAMENTE via tool call emitInauguraPack.`;
}

// ----------------------------------------------------------------------------
// User prompt — montagem por secções
// ----------------------------------------------------------------------------
export function buildUserPrompt(
  input: GenerateInput,
  rec: Recommendation,
  norm: NormalizedBrief
): string {
  return [
    sectionBrief(input, norm),
    sectionRecommendation(rec),
    sectionCatalogSlice(rec),
    sectionExecutionMode(rec),
    sectionBuildRouting(rec),
    sectionLevel(input),
    "Gera o InauguraPack completo agora via tool call.",
  ].join("\n\n---\n\n");
}

// ----------------------------------------------------------------------------
// Secções individuais (cada uma é função separada e testável)
// ----------------------------------------------------------------------------
function sectionBrief(input: GenerateInput, norm: NormalizedBrief): string {
  return `## BRIEFING

${input.brief}

**Tipo de projeto:** ${input.project_type}
**Idioma:** ${input.locale}
**Flags detetadas:** ${[
    norm.hasPayments && "payments",
    norm.hasEcommerce && "ecommerce",
    norm.hasAuth && "auth",
    norm.hasI18n && "i18n",
    norm.hasFigma && "figma",
    norm.hasMotion && "motion",
    norm.hasBlog && "blog",
    norm.hasDashboard && "dashboard",
  ]
    .filter(Boolean)
    .join(", ") || "nenhuma especial"}

${input.references.length > 0 ? `**Referências:**\n${input.references.map((r) => `- ${r.url} (${r.role})`).join("\n")}` : ""}`;
}

function sectionRecommendation(rec: Recommendation): string {
  return `## RECOMENDAÇÃO (router determinístico)

**Modo:** ${rec.mode}
${rec.mode === "team" ? `**Funções team:** ${rec.team_functions.join(", ")} (${rec.team_functions.length})` : `**Slots individual:** ${rec.individual_slots.join(" → ")}`}

**Skills core:** ${rec.skills_core.join(", ")}
**Skills projeto:** ${rec.skills_project.join(", ") || "—"}
**MCPs essenciais:** ${rec.mcps_essential.join(", ")}
**MCPs opcionais:** ${rec.mcps_optional.join(", ") || "—"}
**Integrações:** ${rec.integrations.join(", ") || "—"}

**Secções:**
${rec.sections.map((s) => `- [${s.priority}] ${s.id}`).join("\n")}

**Efeitos:**
${rec.effects.map((e) => `- ${e.id} (perf: ${e.perf_cost})`).join("\n") || "—"}

${rec.warnings.length > 0 ? `**⚠️ Warnings:**\n${rec.warnings.map((w) => `- ${w}`).join("\n")}` : ""}

${rec.reasons.length > 0 ? `**Razões:**\n${rec.reasons.map((r) => `- ${r.id}: ${r.because}`).join("\n")}` : ""}`;
}

function sectionCatalogSlice(rec: Recommendation): string {
  // Só metadados dos IDs escolhidos (não o catálogo inteiro)
  const skillsMeta = rec.skills_core.concat(rec.skills_project).map((id) => {
    const s = getSkill(id);
    return s ? `- ${s.id}: ${s.name} [${s.category}] install: \`${s.install}\`` : null;
  }).filter(Boolean).join("\n");

  const mcpsMeta = rec.mcps_essential.concat(rec.mcps_optional).map((id) => {
    const m = getMcp(id);
    return m ? `- ${m.id}: ${m.name} phases: [${m.phase.join(",")}] install: \`${m.install}\`` : null;
  }).filter(Boolean).join("\n");

  const integrationsMeta = rec.integrations.map((id) => {
    const i = getIntegration(id);
    return i ? `- ${i.id}: ${i.name} [${i.category}] backend: ${i.requires_backend}` : null;
  }).filter(Boolean).join("\n");

  const sectionsMeta = rec.sections.map((s) => {
    const sec = getSection(s.id);
    return sec ? `- ${sec.id}: ${sec.name} [${s.priority}]` : null;
  }).filter(Boolean).join("\n");

  const effectsMeta = rec.effects.map((e) => {
    const eff = getEffect(e.id);
    return eff ? `- ${eff.id}: ${eff.name} (perf: ${e.perf_cost}) skill: ${eff.skill}` : null;
  }).filter(Boolean).join("\n");

  const functionsMeta = rec.mode === "team"
    ? rec.team_functions.map((id) => {
        const f = getFunction(id);
        return f ? `- ${f.id}: ${f.name} default_model: ${f.default_model}` : null;
      }).filter(Boolean).join("\n")
    : `Slots: ${rec.individual_slots.join(", ")}`;

  return `## CATÁLOGO SLICE (só IDs permitidos)

### Skills
${skillsMeta}

### MCPs
${mcpsMeta}

### Integrações
${integrationsMeta}

### Secções
${sectionsMeta}

### Efeitos
${effectsMeta}

### Funções/Slots
${functionsMeta}

### allowed_ids (NÃO inventar IDs fora desta lista)
${rec.allowed_ids.join(", ")}`;
}

function sectionExecutionMode(rec: Recommendation): string {
  if (rec.mode === "individual") {
    return `## MODO: Individual Agent

Gera EXATAMENTE 5 prompts sequenciais:
1. architect — define estrutura, schema, routing
2. builder_ui — implementa UI/UX com shadcn + Tailwind
3. builder_logic — implementa lógica/API/DB
4. qa — testa (Vitest + Playwright), valida WCAG
5. ship — deploy Vercel, env vars, dominio

Cada prompt deve ter: slot, title, model_target, body (instruções acionáveis).`;
  }

  return `## MODO: Agents Team (${rec.team_functions.length} funções)

Gera 1 system + 1 task por function_id:
${rec.team_functions.map((f) => `- ${f}`).join("\n")}

Cada team prompt deve ter: function_id, system, task, reads, writes, done_when, handoff_to, model_target, host.`;
}

function sectionBuildRouting(rec: Recommendation): string {
  return `## BUILD ROUTING (modelos para agentes DEPOIS, não o teu)

${rec.build_routing.map((r) => `- ${r.function_id} → ${r.model_id} @ ${r.host} | skills: [${r.skills.join(",")}] | mcps: [${r.mcps.join(",")}]`).join("\n")}

Importa ESTE routing no campo routing.build_routing do pack. Os prompts devem referenciar estes model_target.`;
}

function sectionLevel(input: GenerateInput): string {
  const levels: Record<string, string> = {
    lite: "LITE — MVP essencial, sem over-engineering. 3-5 dias.",
    pro: "PRO — produção com boas práticas. 7-14 dias. Inclui testes, a11y, SEO.",
    awwwards: "AWWWARDS — premium com animações avançadas, WebGL opcional, polish máximo. 21-40 dias.",
  };
  return `## NÍVEL: ${input.level.toUpperCase()}

${levels[input.level]}

**Cost profile:** ${input.execution.cost_profile}
**Host preference:** ${input.execution.host_preference}`;
}

// ----------------------------------------------------------------------------
// Design polish prompt (opcional, para 2º LLM como Kimi K3)
// ----------------------------------------------------------------------------
export function buildDesignPolishPrompt(designMd: string, brief: string): string {
  return `És um Design Polish specialist. Melhora APENAS o tom visual do DESIGN.md abaixo.
Não reescrevas a arquitetura. Foca em: hierarquia visual, paleta, tipografia, spacing, motion.

BRIEF: ${brief}

DESIGN.md atual:
${designMd}

Devolve APENAS o DESIGN.md melhorado em Markdown.`;
}

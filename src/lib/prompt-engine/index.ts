// ============================================================================
// prompt-engine/index.ts — System Prompt Unificado Definitivo + funções
// ============================================================================
// Versão completa com HARD CONSTRAINTS, Agent Layer R1-R10, Motion & Awwwards,
// Stack Combos, Cores & Tipografia, output estruturado e self-check.
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
// System prompt — UNIFICADO DEFINITIVO (com HARD CONSTRAINTS)
// ----------------------------------------------------------------------------
export function buildSystemPrompt(locale: "pt" | "en"): string {
  const lang = locale === "pt" ? "Português de Portugal (pt-PT)" : "English (en-US)";
  return `És o Inaugura-Core, o motor de especificação production-ready mais avançado de 2026.
Atuas como Product Architect + Design System Lead + Tech Lead + Creative Director de elite.
NÃO constróis o website. Produzes um pack JSON de especificação para agentes AI executarem depois.

# PRINCÍPIOS INVIOLÁVEIS
1. Qualidade Absoluta: tudo digno de Linear, Vercel, Raycast, Arc, Resend, Stripe. Zero mediocridade.
2. Coesão Total: estética + cores + tipografia + layout + motion + stack + tom = sistema único.
3. Acessibilidade Real: WCAG-AA (preferir AAA em texto). Contraste ≥4.5:1 texto, ≥3:1 UI.
4. Modernidade 2026: Next.js 15/16, React 19, Tailwind v4, shadcn/ui, TypeScript strict, RSC, Turbopack.
5. Modo Simplificada/Auto: autonomia total — escolhe o melhor de tudo e declara.
6. Modo Avançada: respeita 100% as escolhas do utilizador (locks + modos).
7. Output Acionável: tudo copiável (tokens, prompts, estrutura de pastas).
8. Idioma: responde em ${lang}.
9. ZERO INVENÇÃO — nunca inventes packages npm, skills, MCPs, APIs ou libs.

# STACK & COMBOS
1. SaaS God Tier: Next.js 16 + React 19 + Tailwind v4 + shadcn + Better Auth + Drizzle + Neon + Stripe + Resend + Vercel + PostHog
2. Supabase Power: Next.js + Supabase (Auth+DB+Storage+Realtime) + shadcn + Stripe + Resend
3. AI-Native: Next.js + Vercel AI SDK + Supabase/Neon + Drizzle + Better Auth + OpenAI/Anthropic + shadcn + Stripe
4. Indie Lightweight: Next.js + Cloudflare D1/Drizzle + Better Auth + Polar/Lemon Squeezy + Resend
5. Enterprise B2B: Next.js + Clerk/WorkOS + Drizzle + Neon/PlanetScale + Stripe + Resend + PostHog
6. E-commerce: Next.js + Shopify Hydrogen ou Medusa + Stripe + shadcn
7. Python Hybrid: Next.js + FastAPI + SQLModel + PostgreSQL
8. Modern Frontend Only: Next.js + Tailwind v4 + shadcn + Motion (+ CMS se necessário)

# MOTION & AWWWARDS LAYER
Standard: Emil Kowalski Polish, Cinematic Scroll, 3D Immersive, WebGL Shader, Micro-interactions Max, Text Animation, Page Transitions, Rive Interactive, Command Palette Pro, Scroll Story Deluxe.
Secretos (só Enterprise/Premium): Darkroom Core, Theatre.js Director, GSAP Flip Magic, WebGPU Shader Lab, Perfect Typography Engine.
Regras: animar SÓ transform/opacity/filter. NUNCA width/height/top/left/margin. prefers-reduced-motion SEMPRE. Combinações proibidas: WebGL+MVP<4sem, Scroll Story+Dashboard B2B, WebGPU sem fallback Safari.

# CORES & TIPOGRAFIA
- Cores: paleta completa com roles semânticos (bg, fg, primary, secondary, accent, muted, destructive, success, warning, border, ring, card, popover). Light+Dark. WCAG.
- Quantidade ideal: 3 cores (mín 2, máx 4). Distribuição 60% bg / 20% secundária / 10% suporte / 10% destaque.
- Tipografia: Perfect Combo (Heading+Body+Mono). Máx 3 fontes. Fonts: Geist, Inter, Plus Jakarta, Satoshi, General Sans, Instrument Sans, SWitzer, Cabinet Grotesk, Clash Display, Outfit, Space Grotesk, Sora, Syne.

# HARD CONSTRAINTS — AGENT LAYER (R1-R10)
R1: PROIBIDO inventar packages, skills, MCPs. Só usar whitelist do INPUT ou DEFAULTS.
R2: Bootstrap skills: npx skills add vercel-labs/skills --skill find-skills -g -y (sempre se agent_layer ≠ Off).
R3: Core skills default: vercel-react-best-practices, web-design-guidelines, vercel-composition-patterns, frontend-design. Máx 6 skills de domínio.
R4: Context7 MCP obrigatório se código e agent_layer ≠ Off.
R5: Libraries só do combo declarado + motion + integrações. Sem libs mágicas.
R6: Secção "Agent & Execute Setup" obrigatória no output (ordem: Scaffold→Packages→shadcn→Skills→MCP→Env→Prompts).
R7: Whitelist do INPUT prevalece sobre defaults. Mapa agent_layer: Off/Mínimo/Auto/UI Max/AI/Full.
R8: Skills: npx skills add <owner/repo> --skill <nome> -y. Packages: pnpm add em code blocks.
R9: Self-check antes de enviar: zero invenções? find-skills primeiro? Context7? secção completa? porquê+when-not? ≤6 skills?
R10: Tom: "Instala isto" + comando. Não "podes considerar".

# REGRAS DO PACK
1. Responde APENAS com JSON válido conforme schema da tool emitInauguraPack.
2. Só usa skill_id, mcp_id, integration_id, section_id, effect_id, function_id, model_id de allowed_ids.
3. Proibido inventar tools/npm packages/MCPs.
4. Brief vago → preenche gaps[] + assume P0 mínimo coerente.
5. Prompts acionáveis: papel, ler ficheiros, tarefas, constraints, done_when, handoff.
6. SPEC e DESIGN em Markdown de qualidade (mín. 2000 chars cada).
7. Individual: EXATAMENTE 5 prompts (architect, builder_ui, builder_logic, qa, ship).
8. Team: 1 system + 1 task por function_id (3-8 funções).
9. Inclui sempre prefers-reduced-motion, LCP/CLS budgets, WCAG AA em checklist_md.
10. model_target = build_routing (agentes DEPOIS), não o teu modelo.
11. overview.stack deve listar o combo escolhido + justificação.
12. checklist_md com secções: Acessibilidade, Performance, SEO, Design, Código, Segurança.
13. agents_md deve incluir secção "Agent & Execute Setup" com packages, skills, MCP, env, ordem.

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
// Secções individuais
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
  ].filter(Boolean).join(", ") || "nenhuma especial"}

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

import { NextRequest, NextResponse } from "next/server";
import type { InauguraPack } from "@/lib/schema/inaugura-pack";
import { withRateLimit } from "@/lib/security";

export const runtime = "nodejs";

/**
 * POST /api/v1/export/zip
 * Recebe um InauguraPack e devolve os ficheiros Markdown estruturados.
 * (No browser, o download do ZIP real é feito client-side com JSZip.)
 * Aqui devolvemos o JSON com todos os ficheiros para o cliente empacotar.
 */
export async function POST(req: NextRequest) {
  const rl = withRateLimit(req);
  if (rl) return rl;

  const pack = (await req.json()) as InauguraPack;

  const files: Record<string, string> = {
    "README.md": buildReadme(pack),
    "OVERVIEW.md": pack.overview.summary,
    "SPEC.md": pack.spec_md,
    "DESIGN.md": pack.design_md,
    "AGENTS.md": pack.agents_md,
    "PLAN.md": pack.plan_md,
    "CHECKLIST-ENTREGA.md": pack.checklist_md,
    "routing/model-routing.md": buildModelRoutingMd(pack),
    "routing/opencode.json": JSON.stringify(buildOpencodeJson(pack), null, 2),
    "skills/INSTALL.md": buildSkillsInstall(pack),
    "mcp/INSTALL.md": buildMcpInstall(pack),
    "stack/folder-structure.md": buildFolderStructure(pack),
    "stack/env.example.md": buildEnvExample(pack),
    "client/brief-summary.md": buildBriefSummary(pack),
    "pack.json": JSON.stringify(pack, null, 2),
  };

  // Adiciona prompts individual/team
  if (pack.prompts.individual) {
    pack.prompts.individual.forEach((p) => {
      files[`prompts/individual/${p.slot}-${p.title.replace(/\s+/g, "-").toLowerCase()}.md`] =
        `# ${p.title}\n\n**Model target:** ${p.model_target}\n\n---\n\n${p.body}`;
    });
  }
  if (pack.prompts.team) {
    pack.prompts.team.forEach((p) => {
      files[`prompts/team/${p.function_id}/system.md`] = p.system;
      files[`prompts/team/${p.function_id}/task.md`] = p.task;
    });
  }

  return NextResponse.json({ ok: true, files });
}

function buildReadme(pack: InauguraPack): string {
  return `# ${pack.meta.title}

**Slug:** ${pack.meta.slug}
**Nível:** ${pack.meta.level}
**Modo:** ${pack.meta.mode}
**Cost profile:** ${pack.meta.cost_profile}
**Compiler:** ${pack.meta.compiler_model}
**Criado:** ${pack.meta.created_at}

## Estrutura do pack

- \`OVERVIEW.md\` — resumo executivo
- \`SPEC.md\` — especificação técnica
- \`DESIGN.md\` — design system
- \`AGENTS.md\` — agentes/prompts
- \`PLAN.md\` — plano de execução
- \`CHECKLIST-ENTREGA.md\` — checklist de entrega
- \`routing/\` — model routing + opencode.json
- \`prompts/\` — prompts individual ou team
- \`skills/INSTALL.md\` — instalação de skills
- \`mcp/INSTALL.md\` — instalação de MCPs
- \`pack.json\` — pack cru em JSON

## Ordem de execução

${pack.meta.mode === "individual"
    ? "Individual: 1.architect → 2.builder_ui → 3.builder_logic → 4.qa → 5.ship"
    : `Team: ${pack.routing.build_routing.map((r) => r.function_id).join(" → ")}`}
`;
}

function buildModelRoutingMd(pack: InauguraPack): string {
  return `# Model Routing

${pack.routing.build_routing.map((r) => `## ${r.function_id}

- **Model:** ${r.model_id}
- **Host:** ${r.host}
- **Skills:** ${r.skills.join(", ") || "—"}
- **MCPs:** ${r.mcps.join(", ") || "—"}`).join("\n\n")}
`;
}

function buildOpencodeJson(pack: InauguraPack): Record<string, unknown> {
  const agents: Record<string, unknown> = {};
  pack.routing.build_routing.forEach((r) => {
    agents[r.function_id] = {
      model: r.model_id,
      host: r.host,
      skills: r.skills,
      mcps: r.mcps,
    };
  });
  return { agents, version: "1.0.0" };
}

function buildSkillsInstall(pack: InauguraPack): string {
  return `# Skills Installation

${pack.install.skills.map((s) => `## ${s.name} (\`${s.id}\`)

\`\`\`bash
${s.install_commands.join("\n")}
\`\`\`

**Best models:** ${s.best_models.join(", ")}`).join("\n\n")}
`;
}

function buildMcpInstall(pack: InauguraPack): string {
  return `# MCPs Installation

${pack.install.mcps.map((m) => `## ${m.name} (\`${m.id}\`)

\`\`\`bash
${m.install_commands.join("\n")}
\`\`\`

**Phases:** ${m.phase.join(", ")}`).join("\n\n")}
`;
}

function buildFolderStructure(pack: InauguraPack): string {
  return `# Folder Structure

\`\`\`
${pack.meta.slug}/
├── app/
│   ├── (routes)/
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── ui/          # shadcn
│   └── sections/    # hero, features, etc.
├── lib/
├── public/
├── package.json
└── .env.local
\`\`\`

**Stack:** ${pack.overview.stack.join(", ")}
`;
}

function buildEnvExample(pack: InauguraPack): string {
  return `# Environment Variables

\`\`\`env
# Database
DATABASE_URL=postgresql://...

# Auth
AUTH_SECRET=...

${pack.selection.integrations.includes("stripe") ? "# Stripe\nSTRIPE_SECRET_KEY=...\nSTRIPE_WEBHOOK_SECRET=...\n" : ""}
${pack.selection.integrations.includes("supabase") ? "# Supabase\nNEXT_PUBLIC_SUPABASE_URL=...\nSUPABASE_SERVICE_ROLE_KEY=...\n" : ""}
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`
`;
}

function buildBriefSummary(pack: InauguraPack): string {
  return `# Brief Summary

**Project:** ${pack.meta.title}
**Type:** ${pack.meta.level}
**Mode:** ${pack.meta.mode}

${pack.overview.summary}

## Stack
${pack.overview.stack.map((s) => `- ${s}`).join("\n")}

## Estimativa
- **Dias:** ${pack.overview.days_estimate}
- **Tokens:** ${pack.overview.token_cost_estimate}

## Riscos
${pack.overview.risks.map((r) => `- [${r.level}] ${r.text}`).join("\n")}
`;
}

"use client";

// ============================================================================
// WorkflowsSection — 3 metodologias para construir o website
// ============================================================================
// 3 workflows distintos, cada um com:
//  - Nome + descrição + quando usar
//  - Passos numerados step-by-step
//  - Skills/ferramentas usadas em cada passo
//  - Botão Copiar (copia markdown)
//  - Botão Download .md
// ============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CopyButton } from "@/components/copy-button";
import {
  Rocket,
  Palette as PaletteIcon,
  Code2,
  Download,
  ChevronDown,
  Check,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectSpec } from "@/lib/schemas";

interface Workflow {
  id: string;
  nome: string;
  icon: any;
  cor: string;
  tagline: string;
  quandoUsar: string;
  tempoEstimado: string;
  dificuldade: "Iniciante" | "Intermédio" | "Avançado";
  melhorPara: string[];
  passos: {
    titulo: string;
    descricao: string;
    ferramentas: string[];
    duracao: string;
  }[];
}

const WORKFLOWS: Workflow[] = [
  // ── 1. AI-First ──────────────────────────────────────────────────────
  {
    id: "ai-first",
    nome: "AI-First",
    icon: Rocket,
    cor: "text-primary",
    tagline: "Mais rápido — UI gerada por IA, refinada à mão",
    quandoUsar:
      "Queres lançar em horas, não dias. Ideal para MVPs, landings pages, protótipos rápidos.",
    tempoEstimado: "2-6 horas",
    dificuldade: "Iniciante",
    melhorPara: ["MVPs", "Landing pages", "Protótipos", "Side projects"],
    passos: [
      {
        titulo: "Gerar UI inicial com v0.dev ou Lovable",
        descricao:
          "Cola o prompt gerado (Compact mode) no v0.dev ou Lovable. A IA gera código Next.js + Tailwind + shadcn pronto a usar. Faz 2-3 variações e escolhe a melhor.",
        ferramentas: ["v0.dev", "Lovable", "Prompt Compact"],
        duracao: "30 min",
      },
      {
        titulo: "Exportar para o teu editor (Cursor)",
        descricao:
          "Copia o código gerado para um novo projeto Next.js no Cursor. Usa o GitHub MCP para criar repo e fazer commit inicial. Instala as dependências com bun.",
        ferramentas: ["Cursor", "GitHub MCP", "bun"],
        duracao: "15 min",
      },
      {
        titulo: "Refinar com Claude Code / Cursor Composer",
        descricao:
          "Usa o prompt Extended (fase Código) para refinar componentes, adicionar features específicas e corrigir detalhes. O Claude Code com Context7 MCP acessa docs atualizadas.",
        ferramentas: ["Claude Code", "Cursor Composer", "Context7 MCP"],
        duracao: "1-2h",
      },
      {
        titulo: "Adicionar animações com Motion",
        descricao:
          "Aplica as animações recomendadas (Reveal on scroll, Parallax, etc.) usando Motion (antigo Framer Motion). Usa Lenis para smooth scroll se recomendado.",
        ferramentas: ["Motion", "Lenis", "Prompt Extended - Animações"],
        duracao: "30-60 min",
      },
      {
        titulo: "Deploy para Vercel",
        descricao:
          "Conecta o repo GitHub à Vercel. Deploy automático. Configura variáveis de ambiente. O site fica live em <2 min.",
        ferramentas: ["Vercel", "GitHub MCP"],
        duracao: "10 min",
      },
    ],
  },

  // ── 2. Design-First ──────────────────────────────────────────────────
  {
    id: "design-first",
    nome: "Design-First",
    icon: PaletteIcon,
    cor: "text-pink-500",
    tagline: "Qualidade premium — design tokens do Figma ao código",
    quandoUsar:
      "Cliente exige pixel-perfect, há designer na equipa, ou o projeto tem 10+ páginas únicas.",
    tempoEstimado: "1-3 dias",
    dificuldade: "Intermédio",
    melhorPara: ["Sites premium", "Brands fortes", "Multi-page", "E-commerce"],
    passos: [
      {
        titulo: "Criar Figma file com design tokens",
        descricao:
          "No Figma, define Variables para: cores (com roles Background/Card/Text/Accent/Muted), tipografia (heading/body/mono), spacing, radii, shadows. Usa a paleta gerada pelo ProjectForge.",
        ferramentas: ["Figma", "Figma Variables", "Paleta gerada"],
        duracao: "2-4h",
      },
      {
        titulo: "Sincronizar tokens via Figma MCP",
        descricao:
          "Usa o Figma MCP Server no Cursor/Claude Code para importar tokens automaticamente para CSS variables no teu projeto Next.js. Evita erros manuais.",
        ferramentas: ["Figma MCP", "Cursor", "Claude Code"],
        duracao: "30 min",
      },
      {
        titulo: "Construir componente base (shadcn/ui)",
        descricao:
          "Instala shadcn/ui e customiza os componentes base (Button, Card, Input, etc.) com os teus tokens. Usa Magic MCP (21st.dev) para gerar componentes premium sob demanda.",
        ferramentas: ["shadcn/ui", "Magic MCP", "Tailwind 4"],
        duracao: "3-5h",
      },
      {
        titulo: "Construir layouts de página",
        descricao:
          "Implementa cada secção (Hero, Features, Pricing, etc.) com os componentes base. Usa o prompt Extended (fase UI/Layout) como guia. Adiciona Motion animations.",
        ferramentas: ["Motion", "Prompt Extended - UI/Layout", "Next.js 16"],
        duracao: "4-8h",
      },
      {
        titulo: "QA visual com Browser Tools MCP",
        descricao:
          "Usa o Browser Tools MCP para inspecionar CSS em runtime, auditar contraste WCAG, e correr Lighthouse. Corrige problemas de acessibilidade e performance.",
        ferramentas: ["Browser Tools MCP", "Lighthouse", "chroma.js"],
        duracao: "1-2h",
      },
      {
        titulo: "Deploy + monitoring",
        descricao:
          "Deploy para Vercel. Configura Sentry para error tracking e PostHog para analytics. GitHub Actions para CI/CD com tests automáticos.",
        ferramentas: ["Vercel", "Sentry", "PostHog", "GitHub Actions"],
        duracao: "30 min",
      },
    ],
  },

  // ── 3. Code-First ────────────────────────────────────────────────────
  {
    id: "code-first",
    nome: "Code-First",
    icon: Code2,
    cor: "text-blue-400",
    tagline: "Controlo total — developer-focused, sem dependências de IA",
    quandoUsar:
      "És developer experiente, queres controlo total do código, ou o projeto é complexo/dashboards.",
    tempoEstimado: "3-7 dias",
    dificuldade: "Avançado",
    melhorPara: ["Dashboards", "Web apps", "SaaS complexo", "Equipas dev"],
    passos: [
      {
        titulo: "Inicializar projeto Next.js 16",
        descricao:
          "Cria projeto com \`bun create next-app\` (TypeScript, App Router, Turbopack). Instala Tailwind 4, shadcn/ui, Motion, Zod, react-hook-form. Configura next-themes.",
        ferramentas: ["Next.js 16", "bun", "Turbopack"],
        duracao: "30 min",
      },
      {
        titulo: "Configurar design tokens (CSS variables)",
        descricao:
          "Define tokens no globals.css com \`@theme inline\` do Tailwind 4. Mapeia as cores da paleta gerada para --background, --card, --primary, etc. Configura dark/light themes.",
        ferramentas: ["Tailwind 4", "CSS Variables", "Paleta gerada"],
        duracao: "1h",
      },
      {
        titulo: "Construir design system local",
        descricao:
          "Cria componentes base reutilizáveis: Button, Card, Input, Select, Modal, Toast. Usa shadcn/ui como foundation e customiza. Documenta com Storybook.",
        ferramentas: ["shadcn/ui", "Radix UI", "Storybook"],
        duracao: "1-2 dias",
      },
      {
        titulo: "Implementar páginas (App Router)",
        descricao:
          "Cria routes em app/. Usa Server Components por defeito, Client Components só quando necessário. Implementa data fetching com server actions ou Supabase/Prisma.",
        ferramentas: ["Next.js App Router", "Server Actions", "Prisma/Supabase"],
        duracao: "2-3 dias",
      },
      {
        titulo: "Adicionar MCP servers ao teu editor",
        descricao:
          "Configura Cursor ou Claude Code com: Figma MCP (handoff), GitHub MCP (PRs), Browser Tools MCP (QA), Context7 MCP (docs), Filesystem MCP (assets).",
        ferramentas: ["Cursor", "Claude Code", "Todos MCPs recomendados"],
        duracao: "30 min",
      },
      {
        titulo: "Animações + micro-interactions",
        descricao:
          "Implementa animações com Motion (useScroll, useTransform, whileInView). Adiciona Lenis para smooth scroll. Para micro-interactions orgânicas, considera Rive.",
        ferramentas: ["Motion", "Lenis", "Rive (opcional)"],
        duracao: "1-2 dias",
      },
      {
        titulo: "Tests + CI/CD + deploy",
        descricao:
          "Escreve unit tests (Vitest), integration tests (Playwright via Puppeteer MCP). Configura GitHub Actions para CI. Deploy para Vercel com preview por branch.",
        ferramentas: ["Vitest", "Playwright", "GitHub Actions", "Vercel"],
        duracao: "1 dia",
      },
    ],
  },
];

interface WorkflowsSectionProps {
  spec: ProjectSpec;
}

export function WorkflowsSection({ spec }: WorkflowsSectionProps) {
  const [activeWorkflow, setActiveWorkflow] = useState<string>(WORKFLOWS[0].id);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepKey)) next.delete(stepKey);
      else next.add(stepKey);
      return next;
    });
  };

  const workflow = WORKFLOWS.find((w) => w.id === activeWorkflow)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Target className="h-4 w-4" />
          3 Workflows para construir o teu site
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Escolhe o método que melhor se adapta à tua equipa e timeline. Cada
          workflow tem passos detalhados, ferramentas e tempo estimado.
          Marca os passos como concluídos à medida que avanças.
        </p>
      </div>

      {/* Selector de workflow (pills) */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {WORKFLOWS.map((w) => {
          const active = w.id === activeWorkflow;
          const Icon = w.icon;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => setActiveWorkflow(w.id)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all",
                active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", active ? w.cor : "text-muted-foreground")} />
                <span className="text-sm font-bold">{w.nome}</span>
              </div>
              <span className="text-[11px] text-muted-foreground">{w.tagline}</span>
              <div className="mt-1 flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-0.5 text-muted-foreground">
                  <Clock className="h-2.5 w-2.5" /> {w.tempoEstimado}
                </span>
                <span
                  className={cn(
                    "rounded px-1 py-0 font-semibold uppercase",
                    w.dificuldade === "Iniciante" && "bg-emerald-500/10 text-emerald-500",
                    w.dificuldade === "Intermédio" && "bg-amber-500/10 text-amber-500",
                    w.dificuldade === "Avançado" && "bg-rose-500/10 text-rose-500"
                  )}
                >
                  {w.dificuldade}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalhes do workflow ativo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={workflow.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          {/* Header com info + ações */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="flex items-center gap-2 text-base font-bold">
                  <workflow.icon className={cn("h-5 w-5", workflow.cor)} />
                  Workflow: {workflow.nome}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  {workflow.quandoUsar}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {workflow.melhorPara.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-background/50 px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <CopyButton
                  text={buildMarkdown(workflow, spec)}
                  label="Copiar .md"
                  size="md"
                />
                <DownloadButton
                  content={buildMarkdown(workflow, spec)}
                  filename={`workflow-${workflow.id}.md`}
                />
              </div>
            </div>
          </div>

          {/* Passos step-by-step */}
          <div className="space-y-2">
            {workflow.passos.map((passo, i) => {
              const stepKey = `${workflow.id}-${i}`;
              const done = completedSteps.has(stepKey);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "rounded-2xl border p-4 transition-all",
                    done
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleStep(stepKey)}
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                        done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      {done ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <span className="text-xs font-bold">{i + 1}</span>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h5
                          className={cn(
                            "text-sm font-semibold",
                            done && "line-through opacity-60"
                          )}
                        >
                          {passo.titulo}
                        </h5>
                        <span className="flex items-center gap-1 rounded-md bg-background/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" /> {passo.duracao}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "mt-1 text-xs leading-relaxed text-muted-foreground",
                          done && "opacity-50"
                        )}
                      >
                        {passo.descricao}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {passo.ferramentas.map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-1.5 py-0.5 text-[10px] font-medium text-foreground/80"
                          >
                            <TrendingUp className="h-2 w-2 text-primary" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          {completedSteps.size > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-border bg-card p-3"
            >
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-semibold">Progresso do workflow</span>
                <span className="text-primary">
                  {completedSteps.size} / {workflow.passos.length} passos
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-background">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(completedSteps.size / workflow.passos.length) * 100}%`,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// DownloadButton — botão que faz download de conteúdo como ficheiro
// ============================================================================
function DownloadButton({
  content,
  filename,
}: {
  content: string;
  filename: string;
}) {
  const onDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={onDownload}
      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/50 px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
    >
      <Download className="h-3.5 w-3.5" />
      Download .md
    </button>
  );
}

// ============================================================================
// buildMarkdown — converte workflow + spec em markdown para download
// ============================================================================
function buildMarkdown(workflow: Workflow, spec: ProjectSpec): string {
  const date = new Date().toISOString().split("T")[0];
  return `# Workflow: ${workflow.nome}

> Gerado por ProjectForge AI em ${date}
> Projeto: ${spec.analysis.nicho}

## Meta
- **Tagline:** ${workflow.tagline}
- **Quando usar:** ${workflow.quandoUsar}
- **Tempo estimado:** ${workflow.tempoEstimado}
- **Dificuldade:** ${workflow.dificuldade}
- **Melhor para:** ${workflow.melhorPara.join(", ")}

## Passos

${workflow.passos
  .map(
    (p, i) => `### ${i + 1}. ${p.titulo}
**Duração:** ${p.duracao}

${p.descricao}

**Ferramentas:** ${p.ferramentas.join(", ")}
`
  )
  .join("\n---\n\n")}

## Contexto do Projeto

- **Nicho:** ${spec.analysis.nicho}
- **Tom de Voz:** ${spec.analysis.tomDeVoz}
- **Público-Alvo:** ${spec.analysis.publicoAlvo}

### Paleta
${spec.palette.map((c) => `- **${c.nome}** \`${c.hex}\` — ${c.uso}`).join("\n")}

### Tipografia
- Heading: ${spec.typography.heading}
- Body: ${spec.typography.body}
${spec.typography.mono ? `- Mono: ${spec.typography.mono}` : ""}

### Skills / MCP / Tools recomendados
${spec.skillsAndTools
  .map((s) => `- [${s.categoria}] **${s.nome}** — ${s.justificacao}`)
  .join("\n")}

---

*Workflow gerado por ProjectForge AI. Marca os passos como concluídos na app para tracking de progresso.*
`;
}

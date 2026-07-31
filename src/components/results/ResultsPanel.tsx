"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { ColorSwatch } from "./ColorSwatch";
import { FontPreview } from "./FontPreview";
import { PromptCard } from "./PromptCard";
import { PalettePreviews } from "@/components/palette/PalettePreviews";
import { WorkflowsSection } from "./WorkflowsSection";
import {
  paletaParaCssVariables,
  paletaParaTailwind,
  type CorValidada,
} from "@/lib/color-utils";
import type { ProjectSpec } from "@/lib/schemas";
import {
  Sparkles,
  Palette as PaletteIcon,
  Type,
  Layers,
  Cpu,
  FileText,
  Layout as LayoutIcon,
  Map,
  Copy,
  Target,
  RefreshCw,
} from "lucide-react";

interface ResultsPanelProps {
  spec: ProjectSpec & { paletaValidada?: CorValidada[] };
  tentativas?: number;
  onRegenerate?: () => void;
  regenerating?: boolean;
}

const CATEGORIA_COLOR: Record<string, string> = {
  "Animações": "bg-purple-500/10 text-purple-300 border-purple-500/30",
  "MCP": "bg-blue-500/10 text-blue-300 border-blue-500/30",
  "UI": "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  "Backend": "bg-amber-500/10 text-amber-300 border-amber-500/30",
  "IA": "bg-pink-500/10 text-pink-300 border-pink-500/30",
  "DevOps": "bg-orange-500/10 text-orange-300 border-orange-500/30",
  "Outro": "bg-zinc-500/10 text-zinc-300 border-zinc-500/30",
};

export function ResultsPanel({ spec, tentativas, onRegenerate, regenerating }: ResultsPanelProps) {
  const cssVars = paletaParaCssVariables(spec.palette);
  const tailwindConfig = paletaParaTailwind(spec.palette);

  const markdownExport = buildMarkdown(spec);
  const jsonExport = JSON.stringify(spec, null, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
      className="space-y-4"
    >
      {/* Header com tentativas + export global */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Especificação gerada</h3>
            <p className="text-xs text-muted-foreground">
              {tentativas && tentativas > 1
                ? `${tentativas} tentativas (auto-correção Zod)`
                : "Validada à primeira"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={regenerating}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/20 active:scale-95 disabled:opacity-50"
              title="Gera novas alternativas (paleta, tipografia, layout) mantendo o briefing"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
              {regenerating ? "A regenerar..." : "Regenerar alternativas"}
            </button>
          )}
          <CopyButton text={markdownExport} label="Markdown" />
          <CopyButton text={jsonExport} label="JSON" />
        </div>
      </div>

      <Tabs defaultValue="resumo" className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 bg-card p-1.5">
          <TabsTrigger value="resumo" className="text-xs">
            <Sparkles className="mr-1.5 h-3 w-3" /> Resumo
          </TabsTrigger>
          <TabsTrigger value="paleta" className="text-xs">
            <PaletteIcon className="mr-1.5 h-3 w-3" /> Paleta
          </TabsTrigger>
          <TabsTrigger value="tipo" className="text-xs">
            <Type className="mr-1.5 h-3 w-3" /> Tipografia
          </TabsTrigger>
          <TabsTrigger value="layout" className="text-xs">
            <LayoutIcon className="mr-1.5 h-3 w-3" /> Layout
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">
            <Cpu className="mr-1.5 h-3 w-3" /> Skills
          </TabsTrigger>
          <TabsTrigger value="mockups" className="text-xs">
            <Layers className="mr-1.5 h-3 w-3" /> Mockups
          </TabsTrigger>
          <TabsTrigger value="prompts" className="text-xs">
            <FileText className="mr-1.5 h-3 w-3" /> Prompts
          </TabsTrigger>
          <TabsTrigger value="workflows" className="text-xs">
            <Target className="mr-1.5 h-3 w-3" /> Workflows
          </TabsTrigger>
          {spec.roadmap && spec.roadmap.length > 0 && (
            <TabsTrigger value="roadmap" className="text-xs">
              <Map className="mr-1.5 h-3 w-3" /> Roadmap
            </TabsTrigger>
          )}
        </TabsList>

        {/* RESUMO */}
        <TabsContent value="resumo">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" /> Análise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Stat label="Nicho" value={spec.analysis.nicho} />
                <Stat label="Tom de Voz" value={spec.analysis.tomDeVoz} />
                <Stat label="Público-Alvo" value={spec.analysis.publicoAlvo} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PALETA */}
        <TabsContent value="paleta" className="space-y-4">
          {/* Botão de previews em mockups reais */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
            <div>
              <h4 className="text-sm font-semibold">Vê a paleta em ação</h4>
              <p className="text-[11px] text-muted-foreground">
                3 mockups (Hero, Dashboard, Pricing) usam exatamente estas cores.
                Avalia contraste e harmonia antes de avançar.
              </p>
            </div>
            <PalettePreviews spec={spec} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {spec.palette.map((cor, i) => (
              <ColorSwatch
                key={i}
                cor={cor}
                validada={spec.paletaValidada?.[i]}
              />
            ))}
          </div>

          {/* Export CSS variables + Tailwind */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <ExportBlock title="CSS Variables" content={cssVars} />
            <ExportBlock title="Tailwind Config" content={tailwindConfig} />
          </div>
        </TabsContent>

        {/* TIPOGRAFIA */}
        <TabsContent value="tipo">
          <FontPreview
            heading={spec.typography.heading}
            body={spec.typography.body}
            mono={spec.typography.mono}
            justificacao={spec.typography.justificacao}
          />
        </TabsContent>

        {/* LAYOUT */}
        <TabsContent value="layout">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LayoutIcon className="h-4 w-4 text-primary" /> Layout & Animações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Stat label="Tipo de Layout" value={spec.layoutRecommendation.tipo} />
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Efeitos recomendados
                </span>
                <div className="flex flex-wrap gap-2">
                  {spec.layoutRecommendation.efeitos.map((e, i) => (
                    <Badge key={i} variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                      {e}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Descrição
                </span>
                <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                  {spec.layoutRecommendation.descricao}
                </p>
              </div>
              {spec.designTokens &&
                spec.designTokens.spacing.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-border pt-4">
                    <TokenList label="Spacing" tokens={spec.designTokens.spacing} />
                    <TokenList label="Radii" tokens={spec.designTokens.radii} />
                    <TokenList label="Shadows" tokens={spec.designTokens.shadows} />
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SKILLS */}
        <TabsContent value="skills">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Cpu className="h-4 w-4 text-primary" /> Skills / MCP / Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(
                groupBy(spec.skillsAndTools, (s) => s.categoria)
              ).map(([cat, items]) => (
                <div key={cat} className="mb-4 last:mb-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        CATEGORIA_COLOR[cat] ?? CATEGORIA_COLOR["Outro"]
                      }`}
                    >
                      {cat}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {items.length} {items.length === 1 ? "item" : "itens"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {items.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border bg-card/30 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{s.nome}</span>
                          <CopyButton text={s.nome} size="icon" label="Copiar" />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {s.justificacao}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MOCKUPS */}
        <TabsContent value="mockups">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-4 w-4 text-primary" /> Mockups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {spec.mockups.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum mockup solicitado.
                </p>
              ) : (
                spec.mockups.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-card/30 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {m.seccao}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                      {m.descricao}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROMPTS — máximo destaque visual */}
        <TabsContent value="prompts" className="space-y-3">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {spec.prompts.length} prompts prontos a copiar
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Cada prompt é autossuficiente — contém briefing, paleta,
              tipografia, skills e secções embutidos.
            </p>
          </div>
          <div className="space-y-3">
            {spec.prompts.map((p, i) => (
              <PromptCard key={i} prompt={p} index={i} defaultOpen={i === 0} />
            ))}
          </div>
        </TabsContent>

        {/* WORKFLOWS — 3 metodologias com copy + download .md */}
        <TabsContent value="workflows">
          <WorkflowsSection spec={spec} />
        </TabsContent>

        {/* ROADMAP */}
        {spec.roadmap && spec.roadmap.length > 0 && (
          <TabsContent value="roadmap">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Map className="h-4 w-4 text-primary" /> Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative space-y-4 border-l border-border pl-6">
                  {spec.roadmap.map((r, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[27px] flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 ring-4 ring-background">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>
                      <p className="text-sm leading-relaxed">{r}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </motion.div>
  );
}

// ============================================================================
// Helpers (sub-componentes + funções locais)
// ============================================================================

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/30 p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium leading-snug">{value}</div>
    </div>
  );
}

function TokenList({ label, tokens }: { label: string; tokens: string[] }) {
  return (
    <div>
      <div className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="space-y-1">
        {tokens.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-md bg-card/40 px-2 py-1 font-mono text-xs"
          >
            <span className="text-foreground/80">{t}</span>
            <CopyButton text={t} size="icon" label="Copiar" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/30">
      <div className="flex items-center justify-between border-b border-border bg-card/40 px-3 py-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <CopyButton text={content} size="icon" label="Copiar" />
      </div>
      <pre className="max-h-48 overflow-y-auto p-3 text-xs leading-relaxed">
        {content}
      </pre>
    </div>
  );
}

function groupBy<T, K extends string>(arr: T[], fn: (t: T) => K): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = fn(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

function buildMarkdown(spec: ProjectSpec): string {
  return `# ProjectForge AI — Especificação

## Análise
- **Nicho:** ${spec.analysis.nicho}
- **Tom de Voz:** ${spec.analysis.tomDeVoz}
- **Público-Alvo:** ${spec.analysis.publicoAlvo}

## Paleta
${spec.palette.map((c) => `- **${c.nome}** \`${c.hex}\` — ${c.uso}`).join("\n")}

## Tipografia
- Heading: ${spec.typography.heading}
- Body: ${spec.typography.body}
${spec.typography.mono ? `- Mono: ${spec.typography.mono}` : ""}
- _Justificação:_ ${spec.typography.justificacao}

## Layout & Animações
- **Tipo:** ${spec.layoutRecommendation.tipo}
- **Efeitos:** ${spec.layoutRecommendation.efeitos.join(", ")}
- ${spec.layoutRecommendation.descricao}

## Skills / MCP / Tools
${spec.skillsAndTools.map((s) => `- [${s.categoria}] **${s.nome}** — ${s.justificacao}`).join("\n")}

## Mockups
${spec.mockups.map((m) => `### ${m.seccao}\n${m.descricao}`).join("\n\n")}

## Prompts
${spec.prompts.map((p, i) => `### ${i + 1}. ${p.titulo}${p.fase ? ` _(${p.fase})_` : ""}\n\n\`\`\`\n${p.conteudo}\n\`\`\``).join("\n\n")}

${spec.roadmap && spec.roadmap.length > 0 ? `## Roadmap\n${spec.roadmap.map((r, i) => `${i + 1}. ${r}`).join("\n")}` : ""}
`;
}

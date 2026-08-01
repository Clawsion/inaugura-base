"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import type { InauguraPack, Recommendation } from "@/lib/schema/inaugura-pack";
import {
  Sparkles,
  FileText,
  Palette,
  Cpu,
  Map,
  CheckSquare,
  Users,
  Package,
  RefreshCw,
  Download,
} from "lucide-react";

interface Props {
  pack: InauguraPack;
  rec: Recommendation | null;
  onRegenerate?: () => void;
  regenerating?: boolean;
}

export function InauguraPackResults({ pack, rec, onRegenerate, regenerating }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const response = await fetch("/api/v1/export/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pack),
      });
      const data = await response.json();
      if (data.ok && data.files) {
        // Cria um blob com todos os ficheiros como JSON (simplificado)
        // Em produção real, usaria JSZip para criar .zip
        const blob = new Blob([JSON.stringify(data.files, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${pack.meta.slug}-pack.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">InauguraPack gerado</h3>
            <p className="text-xs text-muted-foreground">
              {pack.meta.mode === "team"
                ? `Team mode · ${pack.routing.build_routing.length} funções`
                : "Individual mode · 5 prompts"}{" "}
              · {pack.meta.level}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {onRegenerate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={regenerating}
            >
              <RefreshCw className={`mr-1.5 h-3 w-3 ${regenerating ? "animate-spin" : ""}`} />
              {regenerating ? "A regenerar..." : "Regenerar"}
            </Button>
          )}
          <Button size="sm" onClick={handleDownloadZip} disabled={downloading}>
            <Download className="mr-1.5 h-3 w-3" />
            {downloading ? "A exportar..." : "Export pack"}
          </Button>
          <CopyButton text={JSON.stringify(pack, null, 2)} label="JSON" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 bg-card p-1.5">
          <TabsTrigger value="overview" className="text-xs">
            <Sparkles className="mr-1.5 h-3 w-3" /> Overview
          </TabsTrigger>
          <TabsTrigger value="spec" className="text-xs">
            <FileText className="mr-1.5 h-3 w-3" /> Spec
          </TabsTrigger>
          <TabsTrigger value="design" className="text-xs">
            <Palette className="mr-1.5 h-3 w-3" /> Design
          </TabsTrigger>
          <TabsTrigger value="agents" className="text-xs">
            <Users className="mr-1.5 h-3 w-3" /> Agents/Prompts
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">
            <Cpu className="mr-1.5 h-3 w-3" /> Skills&MCP
          </TabsTrigger>
          <TabsTrigger value="plan" className="text-xs">
            <Map className="mr-1.5 h-3 w-3" /> Plan
          </TabsTrigger>
          <TabsTrigger value="checklist" className="text-xs">
            <CheckSquare className="mr-1.5 h-3 w-3" /> Checklist
          </TabsTrigger>
          <TabsTrigger value="routing" className="text-xs">
            <Package className="mr-1.5 h-3 w-3" /> Routing
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed">{pack.overview.summary}</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat label="Nível" value={pack.meta.level} />
                <Stat label="Modo" value={pack.meta.mode} />
                <Stat label="Dias estimados" value={pack.overview.days_estimate} />
                <Stat label="Tokens" value={pack.overview.token_cost_estimate} />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Stack</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {pack.overview.stack.map((s, i) => (
                    <span key={i} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {pack.overview.risks.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Riscos</span>
                  <div className="mt-1 space-y-1">
                    {pack.overview.risks.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={`rounded px-1.5 py-0.5 font-mono ${
                          r.level === "high" ? "bg-red-500/20 text-red-400" :
                          r.level === "mid" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-green-500/20 text-green-400"
                        }`}>
                          {r.level}
                        </span>
                        <span>{r.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {pack.gaps.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Gaps detetados</span>
                  <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                    {pack.gaps.map((g, i) => (
                      <li key={i}>• {g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spec */}
        <TabsContent value="spec">
          <MarkdownCard title="SPEC.md" content={pack.spec_md} />
        </TabsContent>

        {/* Design */}
        <TabsContent value="design">
          <MarkdownCard title="DESIGN.md" content={pack.design_md} />
        </TabsContent>

        {/* Agents/Prompts */}
        <TabsContent value="agents">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">
                {pack.meta.mode === "team" ? "Team Prompts" : "Individual Prompts"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pack.prompts.individual?.map((p, i) => (
                <PromptBlock
                  key={i}
                  title={`${p.slot}: ${p.title}`}
                  model={p.model_target}
                  content={p.body}
                />
              ))}
              {pack.prompts.team?.map((p, i) => (
                <PromptBlock
                  key={i}
                  title={p.function_id}
                  model={p.model_target}
                  content={`**System:** ${p.system}\n\n**Task:** ${p.task}\n\n**Reads:** ${p.reads.join(", ")}\n\n**Writes:** ${p.writes.join(", ")}\n\n**Done when:** ${p.done_when.join("; ")}`}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills & MCP */}
        <TabsContent value="skills">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Skills & MCP Installation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-semibold">Skills ({pack.install.skills.length})</h4>
                <div className="space-y-2">
                  {pack.install.skills.map((s, i) => (
                    <div key={i} className="rounded-lg border border-border bg-card/30 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{s.name}</span>
                        <code className="text-xs text-muted-foreground">{s.id}</code>
                      </div>
                      <pre className="mt-1 overflow-x-auto text-xs text-muted-foreground">
                        {s.install_commands.join("\n")}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold">MCPs ({pack.install.mcps.length})</h4>
                <div className="space-y-2">
                  {pack.install.mcps.map((m, i) => (
                    <div key={i} className="rounded-lg border border-border bg-card/30 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{m.name}</span>
                        <code className="text-xs text-muted-foreground">{m.id}</code>
                      </div>
                      <pre className="mt-1 overflow-x-auto text-xs text-muted-foreground">
                        {m.install_commands.join("\n")}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan */}
        <TabsContent value="plan">
          <MarkdownCard title="PLAN.md" content={pack.plan_md} />
        </TabsContent>

        {/* Checklist */}
        <TabsContent value="checklist">
          <MarkdownCard title="CHECKLIST.md" content={pack.checklist_md} />
        </TabsContent>

        {/* Routing */}
        <TabsContent value="routing">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Model Routing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pack.routing.build_routing.map((r, i) => (
                <div key={i} className="rounded-lg border border-border bg-card/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{r.function_id}</span>
                    <span className="text-xs text-primary">{r.model_id}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>@ {r.host}</span>
                    {r.skills.length > 0 && <span>skills: {r.skills.join(", ")}</span>}
                    {r.mcps.length > 0 && <span>mcps: {r.mcps.join(", ")}</span>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/30 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}

function MarkdownCard({ title, content }: { title: string; content: string }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-mono">{title}</CardTitle>
          <CopyButton text={content} label="Copiar" />
        </div>
      </CardHeader>
      <CardContent>
        <pre className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
          {content}
        </pre>
      </CardContent>
    </Card>
  );
}

function PromptBlock({ title, model, content }: { title: string; model: string; content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-card/30">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-3 text-left"
      >
        <div>
          <span className="text-sm font-semibold">{title}</span>
          <span className="ml-2 text-xs text-primary">{model}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {content.length} chars · {open ? "fechar" : "expandir"}
        </span>
      </button>
      {open && (
        <div className="border-t border-border p-3">
          <pre className="whitespace-pre-wrap text-xs leading-relaxed">{content}</pre>
          <div className="mt-2 flex justify-end">
            <CopyButton text={content} label="Copiar prompt" />
          </div>
        </div>
      )}
    </div>
  );
}

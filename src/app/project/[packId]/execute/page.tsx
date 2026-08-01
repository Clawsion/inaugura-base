"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Zap,
  Target,
  Cpu,
} from "lucide-react";
import type { InauguraPack } from "@/lib/schema/inaugura-pack";
import { toast } from "sonner";

interface ExecutionState {
  id: string;
  stepId: string;
  stepIndex: number;
  status: "todo" | "in_progress" | "blocked" | "done";
  aiUsed: string | null;
  notes: string | null;
  blockedReason: string | null;
  completedAt: string | null;
}

interface ExecuteData {
  ok: boolean;
  project: { id: string; title: string; status: string };
  pack: InauguraPack;
  states: ExecutionState[];
  progress: { total: number; done: number; inProgress: number; blocked: number; percent: number };
  nextAction: { stepId: string; stepIndex: number } | null;
}

export default function ExecutePage() {
  const params = useParams();
  const router = useRouter();
  const packId = params.packId as string;

  const [data, setData] = useState<ExecuteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/execute/${packId}`);
      const json = await res.json();
      setData(json);
      if (json.ok && json.nextAction) setExpandedStep(json.nextAction.stepId);
    } catch {
      toast.error("Erro ao carregar execução");
    } finally {
      setLoading(false);
    }
  }, [packId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStepStatus = async (stepId: string, status: ExecutionState["status"], aiUsed?: string) => {
    try {
      const res = await fetch(`/api/v1/execute/${packId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId, status, aiUsed }),
      });
      if (res.ok) {
        toast.success(`Step marcado como ${status}`);
        fetchData();
      }
    } catch {
      toast.error("Erro ao atualizar step");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || !data.ok) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-sm text-muted-foreground">Pack não encontrado</p>
        <Button onClick={() => router.push("/")}>Voltar ao início</Button>
      </div>
    );
  }

  const { project, pack, states, progress, nextAction } = data;
  const prompts = pack.prompts.individual ?? pack.prompts.team ?? [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">{project.title}</h1>
              <p className="text-xs text-muted-foreground">
                {pack.meta.mode === "team"
                  ? `Team · ${pack.routing.build_routing.length} funções`
                  : "Individual · 5 prompts"} · {pack.meta.level}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{progress.percent}%</div>
            <p className="text-xs text-muted-foreground">{progress.done}/{progress.total} concluídos</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percent}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>

        {/* Próxima ação */}
        {nextAction && (
          <Card className="mb-6 border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-primary">
                <Target className="h-4 w-4" />
                Próxima ação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Cola o prompt <strong>{nextAction.stepId}</strong> na AI indicada. Mira o botão "Copiar prompt" abaixo.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Steps */}
        <div className="space-y-2">
          {states.map((state, idx) => {
            const prompt = prompts[idx];
            const isExpanded = expandedStep === state.stepId;
            const routing = pack.routing.build_routing[idx] ?? pack.routing.build_routing.find((r) => r.function_id === state.stepId);
            const promptText = prompt ? ("system" in prompt ? `${prompt.system}\n\n${prompt.task}` : prompt.body) : "";

            return (
              <Card key={state.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : state.stepId)}
                  className="flex w-full items-center gap-3 p-4 text-left hover:bg-accent/5"
                >
                  <StatusIcon status={state.status} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
                      <span className="text-sm font-semibold">{state.stepId}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      {routing && (<><Cpu className="h-3 w-3" /><span>{routing.model_id}</span><span>·</span><span>@ {routing.host}</span></>)}
                      {state.aiUsed && (<span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">usado: {state.aiUsed}</span>)}
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </button>

                {isExpanded && prompt && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-border bg-card/30">
                    <div className="space-y-3 p-4">
                      {routing && routing.skills.length > 0 && (
                        <div>
                          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Skills a ativar</h4>
                          <div className="flex flex-wrap gap-1">
                            {routing.skills.map((s) => (<code key={s} className="rounded bg-muted px-1.5 py-0.5 text-xs">/{s}</code>))}
                          </div>
                        </div>
                      )}
                      {routing && routing.mcps.length > 0 && (
                        <div>
                          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">MCPs</h4>
                          <div className="flex flex-wrap gap-1">
                            {routing.mcps.map((m) => (<code key={m} className="rounded bg-muted px-1.5 py-0.5 text-xs">{m}</code>))}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prompt a colar</h4>
                          <CopyButton text={promptText} label="Copiar prompt" />
                        </div>
                        <pre className="max-h-60 overflow-y-auto rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed">{promptText}</pre>
                      </div>
                      {"done_when" in prompt && prompt.done_when.length > 0 && (
                        <div>
                          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Done when</h4>
                          <ul className="space-y-1 text-xs">
                            {prompt.done_when.map((d, i) => (<li key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" /><span>{d}</span></li>))}
                          </ul>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                        {state.status === "todo" && (
                          <Button size="sm" onClick={() => updateStepStatus(state.stepId, "in_progress", routing?.model_id)}>
                            <Zap className="mr-1.5 h-3 w-3" />Começar
                          </Button>
                        )}
                        {state.status === "in_progress" && (
                          <Button size="sm" onClick={() => updateStepStatus(state.stepId, "done", routing?.model_id)}>
                            <CheckCircle2 className="mr-1.5 h-3 w-3" />Marcar concluído
                          </Button>
                        )}
                        {(state.status === "todo" || state.status === "in_progress") && (
                          <Button size="sm" variant="outline" onClick={() => updateStepStatus(state.stepId, "blocked")}>
                            <AlertCircle className="mr-1.5 h-3 w-3" />Bloqueado
                          </Button>
                        )}
                        {state.status === "blocked" && (
                          <Button size="sm" onClick={() => updateStepStatus(state.stepId, "in_progress")}>Desbloquear</Button>
                        )}
                        {state.status === "done" && (
                          <Button size="sm" variant="outline" onClick={() => updateStepStatus(state.stepId, "todo")}>Reabrir</Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Resumo */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-card/30 p-3 text-center">
            <div className="text-xl font-bold text-green-500">{progress.done}</div>
            <div className="text-xs text-muted-foreground">Concluídos</div>
          </div>
          <div className="rounded-lg border border-border bg-card/30 p-3 text-center">
            <div className="text-xl font-bold text-yellow-500">{progress.inProgress}</div>
            <div className="text-xs text-muted-foreground">Em curso</div>
          </div>
          <div className="rounded-lg border border-border bg-card/30 p-3 text-center">
            <div className="text-xl font-bold text-red-500">{progress.blocked}</div>
            <div className="text-xs text-muted-foreground">Bloqueados</div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusIcon({ status }: { status: ExecutionState["status"] }) {
  switch (status) {
    case "done": return <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />;
    case "in_progress": return <Loader2 className="h-5 w-5 shrink-0 animate-spin text-yellow-500" />;
    case "blocked": return <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />;
    default: return <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />;
  }
}

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATALOG, type Model } from "@/lib/catalog";
import { BuildDefaults, BuildAlternatives } from "@/lib/router/build-defaults";
import { Badge } from "@/components/ui/badge";
import { Cpu, Key, ChevronDown, Settings2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelsAgentsBlockProps {
  mode: "individual" | "team" | "auto";
  tier: string;
  costProfile: "free_open" | "balanced" | "max";
  hostPreference: "opencode" | "claude" | "codex" | "hybrid";
  onChange: (patch: {
    mode?: "individual" | "team" | "auto";
    tier?: string;
    costProfile?: "free_open" | "balanced" | "max";
    hostPreference?: "opencode" | "claude" | "codex" | "hybrid";
  }) => void;
}

// Providers para toggle de keys
const PROVIDERS = [
  { id: "anthropic", label: "Anthropic", icon: "🅰️" },
  { id: "openai", label: "OpenAI/Codex", icon: "🅾️" },
  { id: "moonshot", label: "Kimi", icon: "🌙" },
  { id: "zhipu", label: "GLM", icon: "⚡" },
  { id: "deepseek", label: "DeepSeek", icon: "🌊" },
  { id: "alibaba", label: "Qwen", icon: "🀄" },
  { id: "minimax", label: "MiniMax", icon: "🎯" },
  { id: "nvidia", label: "NVIDIA", icon: "🟢" },
  { id: "google", label: "Gemini", icon: "🔷" },
  { id: "mistral", label: "Mistral", icon: "🌬️" },
  { id: "meta", label: "Meta/Llama", icon: "🦙" },
] as const;

// Slots individual mode
const INDIVIDUAL_SLOTS = [
  { id: "architect", label: "Architect" },
  { id: "builder_ui", label: "Builder UI" },
  { id: "builder_logic", label: "Builder Logic" },
  { id: "qa", label: "QA" },
  { id: "ship", label: "Ship" },
];

// Tier → funções
const TIER_FUNCTIONS: Record<string, string[]> = {
  bronze: ["architect_design", "builder", "ship"],
  prata: ["architect", "frontend", "backend", "qa_deploy"],
  ouro: ["architect", "design_system", "frontend", "motion", "backend", "qa", "deploy"],
  diamante: ["architect", "design_system", "frontend", "motion", "backend", "security", "qa", "deploy"],
  titanium: ["architect", "design_system", "frontend_motion", "backend", "security", "qa", "reviewer", "deploy"],
  custom: ["architect", "frontend", "deploy"],
};

const ROLE_LABELS: Record<string, string> = {
  architect: "Architect",
  architect_design: "Architect+Design",
  design_system: "Design System",
  frontend: "Frontend",
  frontend_motion: "Frontend+Motion",
  motion: "Motion",
  backend: "Backend",
  security: "Security",
  qa: "QA",
  qa_deploy: "QA+Deploy",
  deploy: "Deploy",
  reviewer: "Reviewer",
  content: "Content",
  builder: "Builder (UI+Logic)",
  builder_ui: "Builder UI",
  builder_logic: "Builder Logic",
  ship: "Ship",
};

const COST_COLORS: Record<string, string> = {
  free: "bg-green-500/20 text-green-400",
  low: "bg-blue-500/20 text-blue-400",
  mid: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  max: "bg-red-500/20 text-red-400",
};

const TOOL_CALLING_COLORS: Record<string, string> = {
  excellent: "text-green-400",
  good: "text-blue-400",
  fragile: "text-yellow-400",
  unknown: "text-muted-foreground",
};

export function ModelsAgentsBlock({ mode, tier, costProfile, hostPreference, onChange }: ModelsAgentsBlockProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [enabledProviders, setEnabledProviders] = useState<Set<string>>(
    new Set(["anthropic", "openai", "moonshot", "zhipu", "deepseek", "alibaba", "minimax", "nvidia"])
  );

  // Filtra modelos enabled pelo provider + cost_profile
  const availableModels = useMemo(() => {
    return CATALOG.models.filter((m) => {
      if (!m.enabled) return false;
      if (!enabledProviders.has(m.provider)) return false;
      // Cost profile filter
      if (costProfile === "free_open" && (m.cost === "high" || m.cost === "max")) return false;
      if (costProfile === "balanced" && m.cost === "max") return false;
      return true;
    });
  }, [enabledProviders, costProfile]);

  // Funções ativas baseado no mode + tier
  const activeFunctions = useMemo(() => {
    if (mode === "individual") return INDIVIDUAL_SLOTS;
    const tierFns = TIER_FUNCTIONS[tier] ?? TIER_FUNCTIONS.ouro;
    return tierFns.map((fn) => ({ id: fn, label: ROLE_LABELS[fn] ?? fn }));
  }, [mode, tier]);

  // Modelo recomendado por função
  const getRecommendedModel = (fnId: string) => {
    const modelId = BuildDefaults[costProfile]?.[fnId] ?? "glm-5.2";
    return CATALOG.models.find((m) => m.id === modelId);
  };

  const toggleProvider = (providerId: string) => {
    setEnabledProviders((prev) => {
      const next = new Set(prev);
      if (next.has(providerId)) next.delete(providerId);
      else next.add(providerId);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-2xl border border-border bg-card/30 p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Modelos & Agentes</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {availableModels.length} modelos disponíveis
        </span>
      </div>

      {/* Keys ativas */}
      <div>
        <div className="mb-1.5 flex items-center gap-1.5">
          <Key className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Keys ativas (clica para ativar/desativar)</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {PROVIDERS.map((p) => {
            const isActive = enabledProviders.has(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleProvider(p.id)}
                className={cn(
                  "rounded-md border px-2 py-1 text-[10px] font-medium transition-all",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card/30 text-muted-foreground opacity-50 hover:opacity-100"
                )}
              >
                {p.icon} {p.label} {isActive ? "✓" : "○"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compiler do Pack (Inaugura) */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Compiler do Pack (Inaugura)
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono">glm-5.2</code>
          <span className="text-muted-foreground">→ fallback</span>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono">deepseek-v4-pro</code>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">
          O compiler gera o pack. Os modelos abaixo são para os agentes que constroem o site depois.
        </p>
      </div>

      {/* Tabela Função → Modelo */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Routing ({activeFunctions.length} {mode === "individual" ? "slots" : "funções"})
          </span>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
          >
            <Settings2 className="h-3 w-3" />
            {showAdvanced ? "Ocultar detalhes" : "Ver detalhes"}
            <ChevronDown className={cn("h-3 w-3 transition-transform", showAdvanced && "rotate-180")} />
          </button>
        </div>

        <div className="space-y-1">
          {activeFunctions.map((fn) => {
            const model = getRecommendedModel(fn.id);
            if (!model) return null;
            const alts = BuildAlternatives[fn.id]?.filter((a) => availableModels.some((m) => m.id === a)) ?? [];

            return (
              <div key={fn.id} className="rounded-lg border border-border bg-card/20 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-xs font-semibold">{fn.label}</div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-primary">{model.id}</code>
                      <span className={cn("rounded px-1 py-0.5 font-medium", COST_COLORS[model.cost])}>{model.cost}</span>
                      <span className="text-muted-foreground">@ {hostPreference}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-[9px] font-medium", TOOL_CALLING_COLORS[model.tool_calling])}>
                      {model.tool_calling}
                    </div>
                    {alts.length > 0 && (
                      <div className="text-[9px] text-muted-foreground">
                        alt: {alts.length}
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalhes avançados */}
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2 space-y-1 border-t border-border pt-2 text-[10px]"
                    >
                      <div className="text-muted-foreground">
                        <span className="font-medium">Fortes:</span> {model.strengths.join(", ")}
                      </div>
                      {model.weaknesses.length > 0 && (
                        <div className="text-muted-foreground">
                          <span className="font-medium">Fraco:</span> {model.weaknesses.join(", ")}
                        </div>
                      )}
                      {alts.length > 0 && (
                        <div className="text-muted-foreground">
                          <span className="font-medium">Alternativas:</span>{" "}
                          {alts.map((a) => (
                            <code key={a} className="mr-1 rounded bg-muted px-1 py-0.5 font-mono">{a}</code>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo custo por tier */}
      <div className="rounded-lg border border-border bg-card/20 p-2 text-[10px] text-muted-foreground">
        <span className="font-medium">Custo estimado: </span>
        {(() => {
          const tierData = CATALOG.tiers.find((t) => t.id === tier);
          if (tierData) {
            return (
              <>
                <span className="text-foreground">{tierData.estimated_cost}</span>
                <span> · </span>
                <span>{tierData.estimated_days}</span>
                <span> · eficiência {tierData.avg_efficiency}/10</span>
              </>
            );
          }
          return <span>variável</span>;
        })()}
      </div>
    </motion.div>
  );
}

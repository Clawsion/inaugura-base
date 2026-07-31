"use client";

// ============================================================================
// IntegrationsSection — seleção de integrações com modos (igual Skills)
// ============================================================================

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Pin, X, Plug } from "lucide-react";
import {
  INTEGRACOES_CATALOG, getIntegracoesForNicho,
  type Integracao, type SkillMode,
} from "@/lib/skills-catalog";
import { detectarNicho } from "@/lib/perfect-combo";
import { cn } from "@/lib/utils";

interface IntegrationsSectionProps {
  briefing: string;
  nicho: string;
  selectedIntegrations: string[];
  onChange: (integrations: string[]) => void;
}

const MODE_LABELS: Record<SkillMode, string> = {
  recomendada: "Recomendada",
  alternativa: "Alternativa",
  opcional: "Opcional",
  manual: "Manual",
  off: "Off",
};

const MODE_COLORS: Record<SkillMode, string> = {
  recomendada: "border-emerald-500 bg-emerald-500/10 text-emerald-500",
  alternativa: "border-blue-500 bg-blue-500/10 text-blue-500",
  opcional: "border-amber-500 bg-amber-500/10 text-amber-500",
  manual: "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500",
  off: "border-border bg-card/40 text-muted-foreground",
};

export function IntegrationsSection({
  briefing, nicho, selectedIntegrations, onChange,
}: IntegrationsSectionProps) {
  const [modes, setModes] = useState<Record<string, SkillMode>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  const nichoDetetado = nicho || (briefing ? detectarNicho(briefing) : null);

  useEffect(() => {
    if (!nichoDetetado) return;
    const recommended = getIntegracoesForNicho(nichoDetetado);
    const newModes: Record<string, SkillMode> = {};
    for (const integ of INTEGRACOES_CATALOG) {
      const isRec = recommended.some((r) => r.id === integ.id);
      if (isRec) {
        newModes[integ.id] = integ.modoDefault === "alternativa" ? "alternativa" : "recomendada";
      } else if (integ.modoDefault === "alternativa") {
        newModes[integ.id] = "alternativa";
      } else if (integ.modoDefault === "opcional") {
        newModes[integ.id] = "opcional";
      } else {
        newModes[integ.id] = "off";
      }
    }
    setModes(newModes);
  }, [nichoDetetado]);

  useEffect(() => {
    const activeIds = Object.entries(modes)
      .filter(([_, mode]) => mode !== "off")
      .map(([id]) => id);
    onChange(activeIds);
  }, [modes]);

  const toggleMode = (id: string) => {
    setModes((prev) => {
      const current = prev[id] ?? "off";
      const cycle: SkillMode[] = ["off", "recomendada", "alternativa", "opcional", "manual"];
      const idx = cycle.indexOf(current);
      const next = cycle[(idx + 1) % cycle.length];
      return { ...prev, [id]: next };
    });
  };

  const setAllOff = () => {
    const cleared: Record<string, SkillMode> = {};
    for (const i of INTEGRACOES_CATALOG) cleared[i.id] = "off";
    setModes(cleared);
  };

  const setAllRecommended = () => {
    if (!nichoDetetado) return;
    const recommended = getIntegracoesForNicho(nichoDetetado);
    const newModes: Record<string, SkillMode> = {};
    for (const integ of INTEGRACOES_CATALOG) {
      const isRec = recommended.some((r) => r.id === integ.id);
      newModes[integ.id] = isRec ? "recomendada" : "off";
    }
    setModes(newModes);
  };

  const activeInfo = pinned ?? hovered;
  const activeItem = activeInfo ? INTEGRACOES_CATALOG.find((i) => i.id === activeInfo) : null;

  const byCategory = useMemo(() => {
    const groups: Record<string, Integracao[]> = {};
    for (const integ of INTEGRACOES_CATALOG) {
      (groups[integ.categoria] ||= []).push(integ);
    }
    return groups;
  }, []);

  const activeCount = Object.values(modes).filter((m) => m !== "off").length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold">
            <Plug className="h-3.5 w-3.5 text-primary" />
            Integrações
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Pagamentos, email, analytics, auth, storage, search. Clica para mudar modo.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {activeCount} ativas
          </span>
          <button
            type="button"
            onClick={setAllRecommended}
            disabled={!nichoDetetado}
            className="rounded-md border border-primary/40 px-2 py-0.5 text-[9px] font-medium text-primary hover:bg-primary/10 disabled:opacity-40"
          >
            Auto
          </button>
          <button
            type="button"
            onClick={setAllOff}
            className="rounded-md border border-border px-2 py-0.5 text-[9px] font-medium text-muted-foreground hover:text-foreground"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-1.5">
        {(["recomendada", "alternativa", "opcional", "manual", "off"] as SkillMode[]).map((mode) => (
          <div
            key={mode}
            className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium", MODE_COLORS[mode])}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {MODE_LABELS[mode]}
          </div>
        ))}
      </div>

      {/* Grid por categoria */}
      <div className="space-y-3">
        {Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat}>
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {cat} ({items.filter((i) => modes[i.id] !== "off").length}/{items.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
              {items.map((item) => {
                const mode = modes[item.id] ?? "off";
                const isHovered = hovered === item.id;
                const isPinned = pinned === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      toggleMode(item.id);
                      setPinned((p) => (p === item.id ? null : item.id));
                    }}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "relative flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all active:scale-95",
                      MODE_COLORS[mode]
                    )}
                    title={item.nome}
                  >
                    {isPinned && (
                      <Pin className="absolute right-1 top-1 h-2.5 w-2.5" fill="currentColor" />
                    )}
                    {!isPinned && (
                      <span className={cn("absolute right-1 top-1 transition-opacity", isHovered ? "opacity-100" : "opacity-30")}>
                        <Info className="h-2.5 w-2.5" />
                      </span>
                    )}
                    <span className="text-[10px] font-bold leading-tight">{item.nome}</span>
                    <span className="text-[8px] uppercase opacity-70">{MODE_LABELS[mode]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Info painel */}
      <AnimatePresence mode="wait">
        {activeItem && (
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className={cn(
              "overflow-hidden rounded-xl border bg-card/50",
              pinned ? "border-primary/40" : "border-primary/30"
            )}
          >
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">{activeItem.nome}</h4>
                <div className="flex items-center gap-1.5">
                  <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-medium", MODE_COLORS[modes[activeItem.id] ?? "off"])}>
                    {MODE_LABELS[modes[activeItem.id] ?? "off"]}
                  </span>
                  {pinned && (
                    <button onClick={() => setPinned(null)} className="text-[10px] text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-foreground/90">{activeItem.descricao}</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <div className="text-[9px] font-bold uppercase text-muted-foreground">Quando usar</div>
                  <p className="text-[10px] text-foreground/80">{activeItem.quandoUsar}</p>
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase text-muted-foreground">Exemplos</div>
                  <p className="text-[10px] italic text-muted-foreground">{activeItem.exemplo}</p>
                </div>
              </div>
              {activeItem.url && (
                <a
                  href={activeItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-block text-[10px] text-primary hover:underline"
                >
                  {activeItem.url} →
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

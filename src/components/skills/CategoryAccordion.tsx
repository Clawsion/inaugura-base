"use client";

// ============================================================================
// CategoryAccordion — componente partilhado (apenas expand/collapse + lock)
// ============================================================================
// Os botões R/A/O/M foram movidos para o header PRINCIPAL de cada secção.
// Aqui fica só o expand/collapse da categoria + lock individual + grid de items.
// ============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Lock, Unlock } from "lucide-react";
import type { SkillMode } from "@/lib/skills-catalog";
import { cn } from "@/lib/utils";

const MODE_COLORS: Record<SkillMode, string> = {
  recomendada: "border-emerald-500 bg-emerald-500/10 text-emerald-500",
  alternativa: "border-blue-500 bg-blue-500/10 text-blue-500",
  opcional: "border-amber-500 bg-amber-500/10 text-amber-500",
  manual: "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500",
  off: "border-border bg-card/40 text-muted-foreground",
};

const MODE_DOT: Record<SkillMode, string> = {
  recomendada: "bg-emerald-500",
  alternativa: "bg-blue-500",
  opcional: "bg-amber-500",
  manual: "bg-fuchsia-500",
  off: "bg-zinc-500",
};

interface CategoryAccordionProps {
  categoria: string;
  items: { id: string; nome: string }[];
  modes: Record<string, SkillMode>;
  locked: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleLock: () => void;
  onToggleMode: (id: string) => void;
  onHover: (id: string | null) => void;
  onPin: (id: string) => void;
  pinnedId: string | null;
}

export function CategoryAccordion({
  categoria, items, modes, locked, isExpanded,
  onToggleExpand, onToggleLock, onToggleMode,
  onHover, onPin, pinnedId,
}: CategoryAccordionProps) {
  const activeInCat = items.filter((i) => modes[i.id] !== "off").length;

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", locked && "opacity-60")}>
      {/* Category header */}
      <div className="flex items-center justify-between p-2">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex items-center gap-1.5 text-left"
        >
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {categoria}
          </span>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Contador */}
          <span className={cn(
            "rounded-full px-1.5 py-0 text-[8px] font-bold",
            activeInCat > 0 ? "bg-primary/15 text-primary" : "bg-card/50 text-muted-foreground"
          )}>
            {activeInCat}/{items.length}
          </span>

          {/* Lock button */}
          <button
            type="button"
            onClick={onToggleLock}
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded transition-all",
              locked ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            title={locked ? "Desbloquear categoria" : "Bloquear categoria"}
          >
            {locked ? <Lock className="h-2.5 w-2.5" /> : <Unlock className="h-2.5 w-2.5" />}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-1 p-2 pt-0 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {items.map((item) => {
                const mode = modes[item.id] ?? "off";
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={locked}
                    onClick={() => {
                      onToggleMode(item.id);
                      onPin(item.id);
                    }}
                    onMouseEnter={() => onHover(item.id)}
                    onMouseLeave={() => onHover(null)}
                    className={cn(
                      "relative flex flex-col items-center gap-0.5 rounded-lg border p-1.5 text-center transition-all active:scale-95",
                      MODE_COLORS[mode],
                      locked && "cursor-not-allowed"
                    )}
                    title={item.nome}
                  >
                    <span className={cn("absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full", MODE_DOT[mode])} />
                    <span className="text-[9px] font-bold leading-tight line-clamp-2">{item.nome}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


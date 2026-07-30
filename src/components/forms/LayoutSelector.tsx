"use client";

// ============================================================================
// LayoutSelector — multi-select de efeitos com hover tooltips descritivos
// ============================================================================
// Cada efeito tem agora:
//  - Ícone
//  - Nome
//  - Tooltip on-hover com: descrição, quando aplicar, onde aplicar, exemplo
// ============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { EfeitosInfo } from "@/lib/form-options";
import { cn } from "@/lib/utils";
import {
  Film,
  Eye,
  Layers,
  MoveHorizontal,
  Maximize,
  Box,
  Sparkles,
  Wine,
  MousePointerClick,
  Info,
} from "lucide-react";

const ICONS: Record<string, any> = {
  Film,
  Eye,
  Layers,
  Sparkles,
  Wine,
  MoveHorizontal,
  Maximize,
  Box,
  MousePointerClick,
};

interface LayoutSelectorProps {
  efeitos: string[];
  onToggle: (e: string) => void;
}

export function LayoutSelector({ efeitos, onToggle }: LayoutSelectorProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredInfo = hovered
    ? EfeitosInfo.find((e) => e.nome === hovered)
    : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <Label className="text-sm font-semibold">Estilo de Layout & Efeitos</Label>

      {/* Grid de efeitos com hover */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {EfeitosInfo.map((e) => {
          const active = efeitos.includes(e.nome);
          const Icon = ICONS[e.icon] ?? Sparkles;
          const isHovered = hovered === e.nome;
          return (
            <button
              key={e.nome}
              type="button"
              onClick={() => onToggle(e.nome)}
              onMouseEnter={() => setHovered(e.nome)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all active:scale-95",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] font-medium leading-tight">{e.nome}</span>
              {/* Info icon */}
              <span
                className={cn(
                  "absolute right-1 top-1 transition-opacity",
                  isHovered ? "opacity-100" : "opacity-30"
                )}
              >
                <Info className="h-2.5 w-2.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Painel de descrição — aparece no hover */}
      <AnimatePresence mode="wait">
        {hoveredInfo && (
          <motion.div
            key={hoveredInfo.nome}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="overflow-hidden rounded-xl border border-primary/30 bg-primary/5"
          >
            <div className="p-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-primary">
                  {hoveredInfo.nome}
                </h4>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                {hoveredInfo.descricao}
              </p>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Sparkles className="h-2.5 w-2.5" /> Quando aplicar
                  </div>
                  <p className="text-[11px] leading-snug text-foreground/80">
                    {hoveredInfo.quandoAplicar}
                  </p>
                </div>
                <div>
                  <div className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Layers className="h-2.5 w-2.5" /> Onde aplicar
                  </div>
                  <p className="text-[11px] leading-snug text-foreground/80">
                    {hoveredInfo.ondeAplicar}
                  </p>
                </div>
              </div>

              <div className="mt-2 border-t border-border/50 pt-2">
                <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Exemplos do mercado
                </div>
                <p className="text-[11px] italic text-muted-foreground">
                  {hoveredInfo.exemplo}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint quando nada está hovered */}
      {!hoveredInfo && (
        <p className="text-[11px] text-muted-foreground">
          Passa o rato por cima de cada efeito para verdescrição,
          quando aplicar e exemplos do mercado.
        </p>
      )}
    </motion.div>
  );
}

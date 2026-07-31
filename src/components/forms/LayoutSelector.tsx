"use client";

// ============================================================================
// LayoutSelector — multi-select de efeitos com hover/click tooltips
// ============================================================================
// BUG CORRIGIDO: info agora persiste quando clicas (click-to-pin).
// Antes só aparecia on-hover e desaparecia ao tirar o rato.
// Agora: hover mostra info temporário, click FIXA o info (mantém visível).
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
  Grid3x3,
  Maximize2,
  LayoutGrid,
  SplitSquareHorizontal,
  Magnet,
  Type,
  BarChart3,
  Image as ImageIcon,
  Hash,
  Palette,
  ChevronDown,
  Pin,
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
  Grid3x3,
  Maximize2,
  LayoutGrid,
  SplitSquareHorizontal,
  Magnet,
  Type,
  BarChart3,
  Image: ImageIcon,
  Hash,
  Palette,
  ChevronDown,
};

interface LayoutSelectorProps {
  efeitos: string[];
  onToggle: (e: string) => void;
}

export function LayoutSelector({ efeitos, onToggle }: LayoutSelectorProps) {
  // NOVO: estado separado para hovered (temp) e pinned (fixo)
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  // Info ativo = pinned (prioridade) ou hovered
  const activeInfo = pinned ?? hovered;
  const activeInfoData = activeInfo
    ? EfeitosInfo.find((e) => e.nome === activeInfo)
    : null;

  const handleClick = (nome: string) => {
    // Toggle do efeito
    onToggle(nome);
    // Toggle do pin (se já está pinned, remove; senão, pin)
    setPinned((prev) => (prev === nome ? null : nome));
  };

  const handleHover = (nome: string) => {
    setHovered(nome);
  };

  const handleLeave = () => {
    setHovered(null);
    // NÃO remove o pinned — só o hovered
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <Label className="text-sm font-semibold">Estilo de Layout & Efeitos</Label>

      {/* Grid de efeitos com hover + click */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
        {EfeitosInfo.map((e) => {
          const active = efeitos.includes(e.nome);
          const Icon = ICONS[e.icon] ?? Sparkles;
          const isHovered = hovered === e.nome;
          const isPinned = pinned === e.nome;
          return (
            <button
              key={e.nome}
              type="button"
              onClick={() => handleClick(e.nome)}
              onMouseEnter={() => handleHover(e.nome)}
              onMouseLeave={handleLeave}
              className={cn(
                "relative flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all active:scale-95",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] font-medium leading-tight">{e.nome}</span>
              {/* Pin icon quando fixado */}
              {isPinned && (
                <Pin className="absolute right-1 top-1 h-2.5 w-2.5 text-primary" fill="currentColor" />
              )}
              {/* Info icon (sempre visível para indicar que há info) */}
              {!isPinned && (
                <span
                  className={cn(
                    "absolute right-1 top-1 transition-opacity",
                    isHovered ? "opacity-100" : "opacity-30"
                  )}
                >
                  <Info className="h-2.5 w-2.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Painel de descrição — aparece on-hover E persiste se pinned */}
      <AnimatePresence mode="wait">
        {activeInfoData && (
          <motion.div
            key={activeInfoData.nome}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={cn(
              "overflow-hidden rounded-xl border",
              pinned ? "border-primary/40 bg-primary/5" : "border-primary/30 bg-primary/5"
            )}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-primary">
                    {activeInfoData.nome}
                  </h4>
                  {pinned && (
                    <span className="flex items-center gap-0.5 rounded bg-primary/20 px-1 py-0 text-[9px] font-bold uppercase text-primary">
                      <Pin className="h-2 w-2" fill="currentColor" /> Fixado
                    </span>
                  )}
                </div>
                {pinned && (
                  <button
                    type="button"
                    onClick={() => setPinned(null)}
                    className="text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    Desafixar
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                {activeInfoData.descricao}
              </p>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Sparkles className="h-2.5 w-2.5" /> Quando aplicar
                  </div>
                  <p className="text-[11px] leading-snug text-foreground/80">
                    {activeInfoData.quandoAplicar}
                  </p>
                </div>
                <div>
                  <div className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Layers className="h-2.5 w-2.5" /> Onde aplicar
                  </div>
                  <p className="text-[11px] leading-snug text-foreground/80">
                    {activeInfoData.ondeAplicar}
                  </p>
                </div>
              </div>

              <div className="mt-2 border-t border-border/50 pt-2">
                <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Exemplos do mercado
                </div>
                <p className="text-[11px] italic text-muted-foreground">
                  {activeInfoData.exemplo}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint quando nada está ativo */}
      {!activeInfoData && (
        <p className="text-[11px] text-muted-foreground">
          Passa o rato por cima de cada efeito para ver a descrição, ou clica para fixar a info.
        </p>
      )}
    </motion.div>
  );
}

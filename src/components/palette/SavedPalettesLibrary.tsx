"use client";

// ============================================================================
// SavedPalettesLibrary — popup com todas as paletas guardadas no localStorage
// ============================================================================
// Funcionalidades:
//  - Lista todas as paletas guardadas (localStorage: "inaugura:savedPalettes")
//  - Mostra mini-preview das cores de cada paleta (combinação visual)
//  - Botão "Carregar" — aplica a paleta ao state do SimpleForge
//  - Botão "Apagar" — remove 1 paleta
//  - Botão "Limpar tudo" — remove todas
//  - Badge com contagem no trigger
//  - Toast de confirmação
//  - Empty state quando não há paletas guardadas
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Trash2,
  Upload,
  Layers,
  Calendar,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ── Tipo da paleta guardada (igual ao que SimpleForge guarda) ──────────────
export interface SavedPalette {
  id: string;
  colors: { hex: string; role: string }[];
  colorCount: 2 | 3 | 4;
  colorPreset: string;
  colorStyle: string;
  polishType: string;
  savedAt: string;
  // Opcional: nome guardado (se user adicionou)
  name?: string;
}

interface SavedPalettesLibraryProps {
  onLoad: (palette: SavedPalette) => void;
}

const STORAGE_KEY = "inaugura:savedPalettes";

// Helper: carregar paletas do localStorage
function loadPalettes(): SavedPalette[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

// Helper: formatar data relativa (ex: "há 2h", "ontem", "há 3 dias")
function relativeTime(iso: string): string {
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);
    if (diffMin < 1) return "agora mesmo";
    if (diffMin < 60) return `há ${diffMin}min`;
    if (diffH < 24) return `há ${diffH}h`;
    if (diffD === 1) return "ontem";
    if (diffD < 7) return `há ${diffD} dias`;
    return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });
  } catch {
    return "—";
  }
}

// Helper: nome default da paleta (baseado na contagem + preset)
function defaultName(p: SavedPalette, idx: number): string {
  if (p.name) return p.name;
  const presetMap: Record<string, string> = {
    "trend-aurora": "Aurora",
    "trend-cyber": "Cyber",
    "trend-sunset": "Sunset",
    "trend-forest": "Forest",
    "trend-mono": "Mono",
    "trend-coral": "Coral",
    "trend-deepsea": "Deep Sea",
    "trend-volcano": "Volcano",
  };
  const preset = presetMap[p.colorPreset] ?? "Palete";
  return `${preset} #${idx + 1}`;
}

export function SavedPalettesLibrary({ onLoad }: SavedPalettesLibraryProps) {
  const [open, setOpen] = useState(false);
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  // Sempre que o popup abre, refresh das paletas
  useEffect(() => {
    if (open) {
      setPalettes(loadPalettes());
      setConfirmClear(false);
    }
  }, [open]);

  // Atualizar contagem quando something muda (não crítico mas útil)
  const refresh = useCallback(() => {
    setPalettes(loadPalettes());
  }, []);

  // Apagar 1 paleta
  const handleDelete = (id: string) => {
    try {
      const all = loadPalettes();
      const next = all.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setPalettes(next);
      toast.success("Palete apagada.");
    } catch {
      toast.error("Erro ao apagar.");
    }
  };

  // Carregar 1 paleta → aplica ao state e fecha
  const handleLoad = (p: SavedPalette) => {
    onLoad(p);
    setOpen(false);
    const name = defaultName(p, palettes.findIndex((x) => x.id === p.id));
    const colorCount = p.colors?.length ?? 0;
    toast.success(`Palete "${name}" carregada!`, {
      description: `${colorCount} cores aplicadas ao editor — vê abaixo ↓`,
      duration: 4000,
    });
  };

  // Limpar tudo (com confirmação)
  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
      setPalettes([]);
      setConfirmClear(false);
      toast.success("Todas as paletas foram apagadas.");
    } catch {
      toast.error("Erro ao limpar.");
    }
  };

  const count = palettes.length;

  // Trigger button — small icon button com badge
  const trigger = (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="relative h-6 gap-1 px-2 text-[10px]"
      title="Ver as tuas paletes guardadas"
    >
      <Bookmark className="h-3 w-3" />
      <span className="hidden sm:inline">Biblioteca</span>
      {count > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-primary px-1 text-[8px] font-bold text-primary-foreground"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl gap-0 border-border bg-card p-0 sm:rounded-2xl">
        <DialogTitle className="sr-only">Paletes guardadas</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Bookmark className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">As tuas paletes guardadas</h3>
              <p className="text-[11px] text-muted-foreground">
                {count === 0
                  ? "Ainda não guardaste nenhuma palete."
                  : `${count} ${count === 1 ? "palete" : "paletes"} no total · clica numa para a carregar`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {count > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-7 gap-1 px-2 text-[11px] text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                {confirmClear ? "Confirmar limpar tudo" : "Limpar tudo"}
              </Button>
            )}
            {/* X removido — o Dialog já tem botão de fechar próprio no canto superior direito */}
          </div>
        </div>

        {/* Conteúdo — grid de paletas */}
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {count === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {palettes.map((p, idx) => (
                <PaletteCard
                  key={p.id}
                  palette={p}
                  idx={idx}
                  onLoad={handleLoad}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        {count > 0 && (
          <div className="border-t border-border p-3 text-center text-[10px] text-muted-foreground">
            <Sparkles className="mr-1 inline h-2.5 w-2.5" />
            As paletes são guardadas localmente neste navegador. Para as partilhar, usa o botão "Especificar" e copia o JSON.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Card individual de paleta guardada ─────────────────────────────────────
function PaletteCard({
  palette,
  idx,
  onLoad,
  onDelete,
}: {
  palette: SavedPalette;
  idx: number;
  onLoad: (p: SavedPalette) => void;
  onDelete: (id: string) => void;
}) {
  const colors = palette.colors ?? [];
  const name = defaultName(palette, idx);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.03 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-background/50 p-3 transition-all hover:border-primary/50 hover:bg-card/50"
    >
      {/* Header: nome + data */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold">{name}</div>
          <div className="mt-0.5 flex items-center gap-1 text-[9px] text-muted-foreground">
            <Calendar className="h-2.5 w-2.5" />
            {relativeTime(palette.savedAt)}
            <span className="mx-1">·</span>
            {palette.colorCount} cores
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(palette.id);
          }}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          title="Apagar esta palete"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* Preview das cores — combinação visual */}
      <div className="mb-3 overflow-hidden rounded-lg border border-border">
        {/* Faixa principal: cores lado a lado com altura proporcional */}
        <div className="flex h-16">
          {colors.map((c, i) => (
            <div
              key={i}
              className="flex-1 transition-all hover:flex-[1.5]"
              style={{ backgroundColor: c.hex }}
              title={`${c.role}: ${c.hex}`}
            />
          ))}
        </div>
        {/* Labels dos roles por baixo */}
        <div className="flex border-t border-border bg-card/50 text-[8px]">
          {colors.map((c, i) => (
            <div
              key={i}
              className="flex-1 truncate border-r border-border/50 px-1 py-0.5 text-center font-medium text-muted-foreground last:border-r-0"
              title={c.role}
            >
              {c.role}
            </div>
          ))}
        </div>
      </div>

      {/* Hex codes — pequenos chips */}
      <div className="mb-3 flex flex-wrap gap-1">
        {colors.map((c, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground"
          >
            <span
              className="h-2 w-2 rounded-sm border border-border"
              style={{ backgroundColor: c.hex }}
            />
            {c.hex.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Meta info: estilo + polimento */}
      {(palette.colorStyle || palette.polishType) && (
        <div className="mb-2 flex flex-wrap gap-1 text-[8px]">
          {palette.colorStyle && palette.colorStyle !== "auto" && (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
              {palette.colorStyle}
            </span>
          )}
          {palette.polishType && (
            <span className="rounded bg-muted/60 px-1.5 py-0.5 font-medium text-muted-foreground">
              {palette.polishType}
            </span>
          )}
        </div>
      )}

      {/* Botão Carregar */}
      <Button
        type="button"
        size="sm"
        onClick={() => onLoad(palette)}
        className="h-7 w-full gap-1 text-[10px] font-semibold"
      >
        <Upload className="h-3 w-3" />
        Carregar esta palete
      </Button>
    </motion.div>
  );
}

// ─── Empty state — quando ainda não há paletas guardadas ────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40">
        <Layers className="h-7 w-7 text-muted-foreground" />
      </div>
      <h4 className="text-sm font-semibold">Ainda não tens paletes guardadas</h4>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
        Quando gereres uma palete que gostes, clica em <strong>Save</strong> ao lado
        do seletor de cores. Ela vai aparecer aqui com preview visual e podes
        carregá-la a qualquer momento com 1 clique.
      </p>
      <div className="mt-4 flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/20 px-3 py-2 text-[10px] text-muted-foreground">
        <AlertCircle className="h-3 w-3" />
        Dica: também podes usar o botão <strong>Special</strong> para gerar paletes Awwwards-level.
      </div>
    </motion.div>
  );
}

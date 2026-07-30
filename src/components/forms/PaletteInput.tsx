"use client";

// ============================================================================
// PaletteInput — redesenhado com lock + copy/paste + preview popup por cor
// ============================================================================
// Features:
//  - Auto: GLM-5.2 decide cores + roles
//  - Manual: retângulo grande com HEX + role + swatches
//  - LOCK individual (cadeado): bloqueia a cor para não ser afetada por regenerações
//  - COPY/PASTE individual por cor
//  - PREVIEW POPUP: 3 mockups (Hero, Dashboard, Pricing) com a cor em tempo real
// ============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus, Trash2, Sparkles, Info, Palette as PaletteIcon,
  Lock, Unlock, Copy, ClipboardPaste, Eye,
} from "lucide-react";
import { isHexValido } from "@/lib/color-utils";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ColorPreviewPopup } from "@/components/palette/ColorPreviewPopup";
import { toast } from "sonner";

export interface Cor {
  nome: string;
  hex: string;
  uso: string;
  locked?: boolean;
}

interface PaletteInputProps {
  mode: "auto" | "manual";
  manual: Cor[];
  onModeChange: (m: "auto" | "manual") => void;
  onManualChange: (c: Cor[]) => void;
  // NOVO: fonts do playground (para usar no preview)
  fontsPlayground?: { fonte: string }[];
}

const ROLES = [
  { value: "Background", label: "Background", desc: "Fundo principal do site" },
  { value: "Card/Surface", label: "Card/Surface", desc: "Superfícies elevadas, modais" },
  { value: "Text/Foreground", label: "Text/Foreground", desc: "Texto principal" },
  { value: "Accent/Primary", label: "Accent/Primary", desc: "CTAs, links, detalhes" },
  { value: "Muted", label: "Muted", desc: "Texto secundário, bordas" },
  { value: "Custom", label: "Custom", desc: "Outro uso" },
];

const SWATCHES_POPULARES = [
  "#0A0A0B", "#141416", "#1A1A1A", "#0F0F1A", "#1E1E2E",
  "#FFFFFF", "#FAFAFA", "#F5F5F7", "#E5E5E5", "#F4F4F5",
  "#00E5A0", "#10B981", "#22C55E", "#4ADE80", "#16A34A",
  "#0071E3", "#3B82F6", "#0A84FF", "#6366F1", "#818CF8",
  "#7C3AED", "#A78BFA", "#9333EA", "#C084FC", "#6D28D9",
  "#EC4899", "#F472B6", "#FF6B9D", "#FF4D4D", "#DC2626",
  "#FCD34D", "#F59E0B", "#FFB84D", "#FF6B35", "#FB923C",
  "#06B6D4", "#22D3EE", "#14B8A6", "#5EEAD4", "#0EA5E9",
  "#C9A961", "#9A7A2E", "#B8954A", "#D4AF37", "#E5C76B",
  "#595959", "#A1A1AA", "#71717A", "#737373", "#A3A3A3",
];

export function PaletteInput({
  mode, manual, onModeChange, onManualChange, fontsPlayground,
}: PaletteInputProps) {
  const [showSwatches, setShowSwatches] = useState<number | null>(null);
  const [clipboard, setClipboard] = useState<Cor | null>(null);

  const adicionar = () =>
    onManualChange([
      ...manual,
      { nome: `Cor ${manual.length + 1}`, hex: "#0A0A0B", uso: "Background" },
    ]);

  const remover = (i: number) => onManualChange(manual.filter((_, idx) => idx !== i));

  const atualizar = (i: number, patch: Partial<Cor>) =>
    onManualChange(manual.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  const toggleLock = (i: number) => {
    atualizar(i, { locked: !manual[i].locked });
    toast.success(manual[i].locked ? `Cor ${i + 1} desbloqueada` : `Cor ${i + 1} bloqueada`);
  };

  const copyCor = (i: number) => {
    setClipboard({ ...manual[i] });
    toast.success(`Cor ${i + 1} copiada`);
  };

  const pasteCor = (i: number) => {
    if (!clipboard) {
      toast.error("Copia uma cor primeiro.");
      return;
    }
    atualizar(i, { ...clipboard });
    toast.success(`Cor colada no slot ${i + 1}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="flex items-center gap-1.5 text-sm font-semibold">
          <PaletteIcon className="h-3.5 w-3.5 text-primary" />
          Paleta de Cores
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Info className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-xs">
              <strong>Auto:</strong> Após gerar, o GLM-5.2 decide as cores E as roles
              com base no briefing. Clica "Regenerar alternativas" nos resultados para
              pedir outras opções. Cores bloqueadas (cadeado) são mantidas.
              <br /><br />
              <strong>Manual:</strong> Defines tu cada cor com role. Color picker,
              hex input, swatches, copy/paste e preview popup.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Tabs value={mode} onValueChange={(v) => onModeChange(v as "auto" | "manual")}>
        <TabsList className="grid w-full grid-cols-2 bg-card/50">
          <TabsTrigger value="auto" className="text-xs">
            <Sparkles className="mr-1.5 h-3 w-3" /> Auto
          </TabsTrigger>
          <TabsTrigger value="manual" className="text-xs">Manual</TabsTrigger>
        </TabsList>

        {/* AUTO MODE */}
        <TabsContent value="auto" className="mt-3">
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
            <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
            No modo <strong>Auto</strong>, o GLM-5.2 decide tudo após clicares "Generate":
            cores + roles otimizadas para o nicho. Depois podes clicar
            <strong> "Regenerar alternativas"</strong> nos resultados para o modelo
            gerar outras variações harmoniosas.
          </div>
        </TabsContent>

        {/* MANUAL MODE */}
        <TabsContent value="manual" className="mt-3 space-y-3">
          <AnimatePresence>
            {manual.map((cor, i) => {
              const isDark = isDarkColor(cor.hex);
              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-card/40 transition-colors",
                    cor.locked ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
                  )}
                >
                  {/* RETÂNGULO GRANDE com HEX visível + actions */}
                  <div
                    className="relative flex min-h-[90px] items-center justify-between px-4 py-3"
                    style={{ backgroundColor: cor.hex }}
                  >
                    <input
                      type="color"
                      value={cor.hex}
                      onChange={(e) => atualizar(i, { hex: e.target.value })}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <div className="pointer-events-none flex flex-col">
                      <span
                        className="text-xs font-semibold uppercase tracking-wider opacity-70"
                        style={{ color: isDark ? "#fff" : "#000" }}
                      >
                        {cor.uso || "Role"}
                      </span>
                      <span
                        className="font-mono text-2xl font-bold tracking-wider"
                        style={{ color: isDark ? "#fff" : "#000" }}
                      >
                        {cor.hex.toUpperCase()}
                      </span>
                    </div>

                    {/* Actions overlay (não afetam o color picker) */}
                    <div className="pointer-events-auto z-10 flex items-center gap-1">
                      {/* Lock */}
                      <ActionBtn
                        onClick={(e) => { e.stopPropagation(); toggleLock(i); }}
                        active={cor.locked}
                        isDark={isDark}
                        title={cor.locked ? "Desbloquear" : "Bloquear"}
                      >
                        {cor.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                      </ActionBtn>
                      {/* Copy */}
                      <ActionBtn
                        onClick={(e) => { e.stopPropagation(); copyCor(i); }}
                        isDark={isDark}
                        title="Copiar cor"
                      >
                        <Copy className="h-3 w-3" />
                      </ActionBtn>
                      {/* Paste */}
                      <ActionBtn
                        onClick={(e) => { e.stopPropagation(); pasteCor(i); }}
                        isDark={isDark}
                        disabled={!clipboard}
                        title="Colar cor"
                      >
                        <ClipboardPaste className="h-3 w-3" />
                      </ActionBtn>
                      {/* Preview popup */}
                      <ColorPreviewPopup
                        cor={cor}
                        outrasCores={manual}
                        fontEscolhida={fontsPlayground?.[0]?.fonte}
                      />
                      {/* Swatches toggle */}
                      <ActionBtn
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSwatches(showSwatches === i ? null : i);
                        }}
                        isDark={isDark}
                        active={showSwatches === i}
                        title="Swatches populares"
                      >
                        <PaletteIcon className="h-3 w-3" />
                      </ActionBtn>
                    </div>
                  </div>

                  {/* Controlos: nome + role + hex input + delete */}
                  <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
                    <Input
                      placeholder="Nome"
                      value={cor.nome}
                      onChange={(e) => atualizar(i, { nome: e.target.value })}
                      className="h-8 border-border bg-card/50 text-xs"
                    />
                    <Select
                      value={cor.uso || "Custom"}
                      onValueChange={(v) => atualizar(i, { uso: v })}
                    >
                      <SelectTrigger className="h-8 border-border bg-card/50 text-xs">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value} className="text-xs">
                            <span className="font-medium">{r.label}</span>
                            <span className="ml-1 text-muted-foreground">— {r.desc}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="#RRGGBB"
                      value={cor.hex}
                      onChange={(e) => atualizar(i, { hex: e.target.value })}
                      className={cn(
                        "h-8 border-border bg-card/50 font-mono text-xs",
                        !isHexValido(cor.hex) && "border-destructive"
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remover(i)}
                      className="h-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="mr-1 h-3 w-3" /> Remover
                    </Button>
                  </div>

                  {/* SWATCHES PEQUENOS — expansível */}
                  <AnimatePresence>
                    {showSwatches === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="p-3">
                          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Swatches populares (clica para aplicar)
                          </div>
                          <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-15">
                            {SWATCHES_POPULARES.map((hex) => (
                              <button
                                key={hex}
                                type="button"
                                onClick={() => atualizar(i, { hex })}
                                className={cn(
                                  "aspect-square rounded-md border transition-all hover:scale-110",
                                  cor.hex.toUpperCase() === hex.toUpperCase()
                                    ? "border-primary ring-2 ring-primary/40"
                                    : "border-border"
                                )}
                                style={{ backgroundColor: hex }}
                                title={hex}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={adicionar}
            className="border-dashed"
          >
            <Plus className="mr-1 h-3 w-3" /> Adicionar cor
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// ActionBtn — botão de ícone sobre o retângulo colorido (contraste adaptativo)
// ============================================================================
function ActionBtn({
  onClick, children, active, disabled, isDark, title,
}: {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  isDark: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md backdrop-blur-sm transition-all",
        active ? "bg-primary/30" : "bg-black/20 hover:bg-black/40",
        disabled && "opacity-40 cursor-not-allowed"
      )}
      style={{ color: isDark ? "#fff" : "#000" }}
    >
      {children}
    </button>
  );
}

// Helper: determinar se uma cor é escura
function isDarkColor(hex: string): boolean {
  if (!isHexValido(hex)) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma < 0.5;
}

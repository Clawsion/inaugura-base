"use client";

// ============================================================================
// PaletteInput — redesenhado com opções avançadas de cor
// ============================================================================
// Modos:
//  - Auto: GLM-5.2 decide tudo
//  - Manual: retângulo grande + swatches + role
//  - Família (NOVO): escolhe família RAL + 3 sliders + estilo
// ============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus, Trash2, Sparkles, Info, Palette as PaletteIcon,
  Lock, Unlock, Copy, ClipboardPaste, Eye,
  Sliders, Wand2,
} from "lucide-react";
import { isHexValido } from "@/lib/color-utils";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ColorPreviewPopup } from "@/components/palette/ColorPreviewPopup";
import {
  COLOR_FAMILIES, COLOR_STYLES, generateColor, generatePaletteFromFamily,
  type ColorFamily, type ColorStyle,
} from "@/lib/color-families";
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

  // NOVO: estado para modo família (RAL + sliders)
  const [familyMode, setFamilyMode] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<ColorFamily>("azul");
  const [selectedStyle, setSelectedStyle] = useState<ColorStyle>("moderno");
  const [brilho, setBrilho] = useState(50);
  const [saturacao, setSaturacao] = useState(60);
  const [contraste, setContraste] = useState(50);

  // Cor gerada em tempo real pelos sliders
  const generatedColor = useMemo(
    () => generateColor(selectedFamily, brilho, saturacao, contraste),
    [selectedFamily, brilho, saturacao, contraste]
  );

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

  // Aplicar paleta gerada pela família
  const applyFamilyPalette = () => {
    const palette = generatePaletteFromFamily(selectedFamily, selectedStyle);
    // Mantém locks: só substitui cores não bloqueadas
    const next = manual.map((c, i) => c.locked ? c : (palette[i] ?? c));
    onManualChange(next);
    toast.success(`Paleta ${selectedFamily} (${selectedStyle}) aplicada!`);
  };

  // Aplicar a cor gerada pelos sliders a uma cor específica
  const applyGeneratedToCor = (i: number) => {
    if (manual[i].locked) {
      toast.warning(`Cor ${i + 1} está bloqueada. Desbloqueia primeiro.`);
      return;
    }
    atualizar(i, { hex: generatedColor });
    toast.success(`Cor ${i + 1} = ${generatedColor}`);
  };

  // Atualizar sliders quando muda o estilo
  const applyStyle = (style: ColorStyle) => {
    setSelectedStyle(style);
    const styleInfo = COLOR_STYLES.find((s) => s.id === style);
    if (styleInfo) {
      setBrilho(styleInfo.defaults.brilho);
      setSaturacao(styleInfo.defaults.saturacao);
      setContraste(styleInfo.defaults.contraste);
    }
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
              <strong>Auto:</strong> GLM-5.2 decide cores + roles. <strong>Manual:</strong> defines tu cada cor.
              <strong> Família (avançado):</strong> escolhe família RAL + 3 sliders (brilho/mate/contraste) + estilo.
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
          {/* NOVO: toggle para mostrar opções avançadas de família */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-2.5">
            <div className="flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold">Opções avançadas de cor</span>
              <span className="text-[10px] text-muted-foreground">Famílias RAL + sliders</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFamilyMode(!familyMode)}
              className="h-6 text-[10px]"
            >
              {familyMode ? "Ocultar" : "Mostrar"}
            </Button>
          </div>

          {/* Opções avançadas — Família + Sliders + Estilo */}
          <AnimatePresence>
            {familyMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl border border-primary/30 bg-primary/5"
              >
                <div className="space-y-3 p-3">
                  {/* Família de cor (RAL) */}
                  <div>
                    <Label className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Família de Cor (RAL)
                    </Label>
                    <div className="grid grid-cols-6 gap-1.5">
                      {COLOR_FAMILIES.map((fam) => (
                        <button
                          key={fam.id}
                          type="button"
                          onClick={() => setSelectedFamily(fam.id)}
                          title={`${fam.nome} — ${fam.ralExamples.join(", ")}`}
                          className={cn(
                            "flex flex-col items-center gap-0.5 rounded-lg border p-1.5 transition-all",
                            selectedFamily === fam.id
                              ? "border-primary ring-1 ring-primary/30"
                              : "border-border hover:border-primary/40"
                          )}
                        >
                          <div
                            className="h-6 w-6 rounded-md border border-border"
                            style={{ backgroundColor: fam.baseHex }}
                          />
                          <span className="text-[9px] font-medium">{fam.nome}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estilo de cor */}
                  <div>
                    <Label className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Estilo
                    </Label>
                    <div className="flex flex-wrap gap-1">
                      {COLOR_STYLES.map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => applyStyle(st.id)}
                          title={st.desc}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium transition-all",
                            selectedStyle === st.id
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {st.nome}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3 Sliders 0-100 */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <SliderControl
                      label="Brilho"
                      value={brilho}
                      onChange={setBrilho}
                      desc="0 = escuro · 100 = claro"
                    />
                    <SliderControl
                      label="Mate (Saturação)"
                      value={saturacao}
                      onChange={setSaturacao}
                      desc="0 = cinza · 100 = saturado"
                    />
                    <SliderControl
                      label="Contraste"
                      value={contraste}
                      onChange={setContraste}
                      desc="0 = suave · 100 = intenso"
                    />
                  </div>

                  {/* Preview da cor gerada + botão aplicar paleta */}
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 p-2">
                    <div
                      className="h-12 w-12 shrink-0 rounded-md border-2 border-border"
                      style={{ backgroundColor: generatedColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                        Cor gerada
                      </div>
                      <div className="font-mono text-sm font-bold">{generatedColor}</div>
                      <div className="text-[9px] text-muted-foreground">
                        {COLOR_FAMILIES.find(f => f.id === selectedFamily)?.ralExamples[0]} · {selectedStyle}
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={applyFamilyPalette}
                      className="h-7 gap-1 bg-primary text-[10px] text-primary-foreground hover:bg-primary/90"
                    >
                      <Wand2 className="h-3 w-3" /> Aplicar paleta
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lista de cores — CORRIGIDO: grid responsivo sem sobreposição */}
          <div className="space-y-2">
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
                    {/* Retângulo grande com HEX visível + actions */}
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

                      {/* Actions overlay */}
                      <div className="pointer-events-auto z-10 flex items-center gap-1">
                        <ActionBtn onClick={(e) => { e.stopPropagation(); toggleLock(i); }} active={cor.locked} isDark={isDark} title={cor.locked ? "Desbloquear" : "Bloquear"}>
                          {cor.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        </ActionBtn>
                        <ActionBtn onClick={(e) => { e.stopPropagation(); copyCor(i); }} isDark={isDark} title="Copiar cor">
                          <Copy className="h-3 w-3" />
                        </ActionBtn>
                        <ActionBtn onClick={(e) => { e.stopPropagation(); pasteCor(i); }} isDark={isDark} disabled={!clipboard} title="Colar cor">
                          <ClipboardPaste className="h-3 w-3" />
                        </ActionBtn>
                        {/* NOVO: aplicar cor gerada pelos sliders a esta cor */}
                        {familyMode && (
                          <ActionBtn onClick={(e) => { e.stopPropagation(); applyGeneratedToCor(i); }} isDark={isDark} title={`Aplicar ${generatedColor}`}>
                            <Wand2 className="h-3 w-3" />
                          </ActionBtn>
                        )}
                        <ColorPreviewPopup cor={cor} outrasCores={manual} fontEscolhida={fontsPlayground?.[0]?.fonte} />
                        <ActionBtn
                          onClick={(e) => { e.stopPropagation(); setShowSwatches(showSwatches === i ? null : i); }}
                          isDark={isDark}
                          active={showSwatches === i}
                          title="Swatches populares"
                        >
                          <PaletteIcon className="h-3 w-3" />
                        </ActionBtn>
                      </div>
                    </div>

                    {/* Controlos: CORRIGIDO layout flex responsivo sem sobreposição */}
                    <div className="flex flex-wrap items-center gap-2 p-3">
                      <Input
                        placeholder="Nome"
                        value={cor.nome}
                        onChange={(e) => atualizar(i, { nome: e.target.value })}
                        className="h-8 min-w-[100px] flex-1 border-border bg-card/50 text-xs"
                      />
                      <Select
                        value={cor.uso || "Custom"}
                        onValueChange={(v) => atualizar(i, { uso: v })}
                      >
                        <SelectTrigger className="h-8 w-full min-w-[140px] flex-1 border-border bg-card/50 text-xs sm:w-auto">
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
                          "h-8 min-w-[100px] flex-1 border-border bg-card/50 font-mono text-xs",
                          !isHexValido(cor.hex) && "border-destructive"
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remover(i)}
                        className="h-8 shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="mr-1 h-3 w-3" /> Remover
                      </Button>
                    </div>

                    {/* Swatches expansíveis */}
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
          </div>

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
// SliderControl — slider 0-100 com label e valor
// ============================================================================
function SliderControl({
  label, value, onChange, desc,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  desc: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-2">
      <div className="mb-1 flex items-center justify-between">
        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </Label>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
          {value}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={0}
        max={100}
        step={1}
        className="w-full"
      />
      <p className="mt-1 text-[9px] text-muted-foreground">{desc}</p>
    </div>
  );
}

// ============================================================================
// ActionBtn — botão de ícone sobre o retângulo colorido
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

function isDarkColor(hex: string): boolean {
  if (!isHexValido(hex)) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma < 0.5;
}

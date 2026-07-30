"use client";

// ============================================================================
// FontPlayground — 5 barras horizontais com tudo
// ============================================================================
// Features:
//  - Filtro por categoria (todos/sans/serif/mono/geist/awwwards)
//  - Generate All Fonts: SÓ muda as 5 fonts (mantém transforms), respeita locks
//  - Generate All Transforms: SÓ muda as 5 transforms (mantém fonts), respeita locks
//  - Generate Font (por slot): SÓ muda a font desse slot (mantém transform)
//  - Generate Transform (ícone Shuffle, por slot): SÓ muda a transform (mantém font)
//  - Lock individual (cadeado): bloqueia o slot para não ser afetado pelos Generate All
//  - Copy/Paste individual por slot
//  - Pesos multi-seleção (Bold, Italic, Regular, Thin, etc.)
//  - Italic toggle
//  - Expand/collapse por barra
// ============================================================================

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type, Zap, ChevronDown, ChevronUp, Wand2,
  Lock, Unlock, Copy, ClipboardPaste, Shuffle,
  Bold, Italic, Eye, Globe,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FONT_TRANSFORMS, getRandomTransform, getTransformsByCategory,
  type FontTransform,
} from "@/lib/font-transforms";
import {
  FONTS_MODERNAS, FONT_FILTERS, PESOS_LABELS, PESOS_DISPONIVEIS,
  loadFont, getRandomFontByFilterAsync, fontStackFor,
  countFontsBySource, getAllFonts,
  type FontInfo,
} from "@/lib/fonts-modernas";
import { FONTES_DISPONIVEIS } from "@/lib/fonts";
import { FontPreviewPopup } from "./FontPreviewPopup";
import { UploadWithSuggestions } from "./UploadWithSuggestions";
import { FontSources } from "./FontSources";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface FontSlotState {
  fonte: string;
  transformId?: string;
  customFontName?: string;
  pesos?: number[];
  italic?: boolean;
  locked?: boolean;
}

interface FontPlaygroundProps {
  states: FontSlotState[];
  onChange: (states: FontSlotState[]) => void;
}

const DEFAULT_STATES: FontSlotState[] = [
  { fonte: "Inter", pesos: [400, 700] },
  { fonte: "Geist", pesos: [400, 600] },
  { fonte: "Plus Jakarta Sans", pesos: [400, 700] },
  { fonte: "Outfit", pesos: [400, 500] },
  { fonte: "Montserrat", pesos: [400, 600] },
];

interface UploadedFont {
  name: string;
  family: string;
}

export function FontPlayground({ states, onChange }: FontPlaygroundProps) {
  const allSlotStates = states.length === 5 ? states : DEFAULT_STATES;
  // NOVO: utilizador escolhe quantas fonts quer ver (1, 3, ou 5)
  const [visibleCount, setVisibleCount] = useState<1 | 3 | 5>(5);
  const slotStates = allSlotStates.slice(0, visibleCount);
  const [uploadedFonts, setUploadedFonts] = useState<UploadedFont[]>([]);
  const [expanded, setExpanded] = useState<boolean[]>([false, false, false, false, false]);
  const [textoGlobal, setTextoGlobal] = useState("The quick brown fox jumps over the lazy dog");
  const [filtro, setFiltro] = useState("todos");
  const [sourceFilter, setSourceFilter] = useState("todos");
  const [clipboard, setClipboard] = useState<FontSlotState | null>(null);
  const [fontCount, setFontCount] = useState<{ total: number; google: number; fontshare: number; curated: number } | null>(null);
  const [allFontsCatalog, setAllFontsCatalog] = useState<FontInfo[]>(FONTS_MODERNAS);

  // Busca catálogo dinâmico ao montar
  useEffect(() => {
    getAllFonts().then((catalog) => {
      setAllFontsCatalog(catalog);
      countFontsBySource().then(setFontCount);
    });
  }, []);

  useEffect(() => {
    if (states.length !== 5) onChange(DEFAULT_STATES);
  }, [states.length, onChange]);

  // Carrega as fonts iniciais ao montar
  useEffect(() => {
    slotStates.forEach((s) => {
      const info = FONTS_MODERNAS.find((f) => f.family === s.fonte);
      if (info) loadFont(info);
    });
  }, []);

  const updateSlot = (i: number, s: FontSlotState) => {
    const next = [...slotStates];
    next[i] = s;
    onChange(next);
  };

  const toggleExpand = (i: number) => {
    setExpanded((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const expandAll = () => setExpanded([true, true, true, true, true]);
  const collapseAll = () => setExpanded([false, false, false, false, false]);

  // GENERATE ALL FONTS — respeita locks e visibleCount
  const generateAllFonts = useCallback(async () => {
    const next = await Promise.all(
      allSlotStates.slice(0, visibleCount).map(async (s) => {
        if (s.locked) return s;
        const font = await getRandomFontByFilterAsync(filtro, sourceFilter, s.fonte);
        await loadFont(font);
        return { ...s, fonte: font.family, customFontName: undefined };
      })
    );
    // Mantém as slots não visíveis inalteradas
    const fullNext = [...next, ...allSlotStates.slice(visibleCount)];
    onChange(fullNext);
    const lockedCount = allSlotStates.slice(0, visibleCount).filter((s) => s.locked).length;
    toast.success(
      `${visibleCount} fonts geradas!${lockedCount > 0 ? ` (${lockedCount} bloqueadas mantidas)` : ""}`
    );
  }, [allSlotStates, visibleCount, onChange, filtro, sourceFilter]);

  // GENERATE ALL TRANSFORMS — respeita locks e visibleCount
  const generateAllTransforms = useCallback(() => {
    const visible = allSlotStates.slice(0, visibleCount);
    const next = visible.map((s) => {
      if (s.locked) return s;
      return { ...s, transformId: getRandomTransform(s.transformId).id };
    });
    const fullNext = [...next, ...allSlotStates.slice(visibleCount)];
    onChange(fullNext);
    const lockedCount = visible.filter((s) => s.locked).length;
    toast.success(
      `${visibleCount} transforms geradas!${lockedCount > 0 ? ` (${lockedCount} bloqueadas mantidas)` : ""}`
    );
  }, [allSlotStates, visibleCount, onChange]);

  const handleUploadFont = useCallback(async (file: File) => {
    const familyName = file.name
      .replace(/\.(ttf|otf|woff|woff2)$/i, "")
      .replace(/[^a-zA-Z0-9]/g, "-");
    const url = URL.createObjectURL(file);
    try {
      const fontFace = new FontFace(familyName, `url(${url})`);
      await fontFace.load();
      document.fonts.add(fontFace);
      setUploadedFonts((prev) => [...prev, { name: familyName, family: familyName }]);
      toast.success(`Font "${familyName}" carregada!`);
    } catch {
      toast.error(`Falha ao carregar font: ${file.name}`);
    }
  }, []);

  // Copy individual
  const copySlot = (i: number) => {
    setClipboard({ ...slotStates[i] });
    toast.success(`Slot ${i + 1} copiado para clipboard interno`);
  };

  // Paste individual
  const pasteSlot = (i: number) => {
    if (!clipboard) {
      toast.error("Nada colado ainda. Copia um slot primeiro.");
      return;
    }
    updateSlot(i, { ...clipboard });
    toast.success(`Slot ${i + 1} colado`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {/* Header com filtro + Generate All global */}
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            <div>
              <Label className="text-sm font-semibold">Font Playground</Label>
              <p className="text-[10px] text-muted-foreground">
                5 barras · busca de 40+ fonts · 50 transforms
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={expandAll} className="h-7 text-xs">
              <ChevronUp className="h-3 w-3" /> Expandir
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll} className="h-7 text-xs">
              <ChevronDown className="h-3 w-3" /> Fechar
            </Button>
            {/* NOVO: Seletor de quantas fonts mostrar (1, 3, 5) */}
            <div className="flex items-center gap-0.5 rounded-md border border-border bg-card/50 p-0.5">
              {([1, 3, 5] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setVisibleCount(n)}
                  className={cn(
                    "h-6 rounded px-2 text-[10px] font-bold transition-all",
                    visibleCount === n
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title={`Mostrar ${n} font${n > 1 ? "s" : ""}`}
                >
                  {n}
                </button>
              ))}
            </div>
            {/* Generate All FONTS — só muda a font, mantém transforms */}
            <Button
              onClick={generateAllFonts}
              className="h-7 gap-1 rounded-md bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
              title={`Gera ${visibleCount} fonts aleatórias (mantém as transforms atuais)`}
            >
              <Wand2 className="h-3 w-3" /> Generate All Fonts
            </Button>
            {/* Generate All TRANSFORMS — só muda a transform, mantém fonts */}
            <Button
              onClick={generateAllTransforms}
              variant="outline"
              className="h-7 gap-1 rounded-md border-primary/40 px-3 text-xs text-primary hover:bg-primary/10"
              title={`Gera ${visibleCount} transforms aleatórias (mantém as fonts atuais)`}
            >
              <Shuffle className="h-3 w-3" /> Generate All Transforms
            </Button>
          </div>
        </div>

        {/* Filtros por categoria + source + contador */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {FONT_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiltro(f.id)}
                title={f.desc}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-all",
                  filtro === f.id
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Separador visual */}
          <div className="h-4 w-px bg-border" />

          {/* Source filter (seletor de site de fonts) */}
          <SourceFilter value={sourceFilter} onChange={setSourceFilter} fontCount={fontCount} />
        </div>
      </div>

      {/* Texto global partilhado */}
      <Input
        value={textoGlobal}
        onChange={(e) => setTextoGlobal(e.target.value)}
        placeholder="Texto de preview (partilhado por todas as barras)"
        className="h-8 border-border bg-card/50 text-xs"
      />

      {/* 5 BARRAS HORIZONTAIS GRANDES em fila vertical */}
      <div className="space-y-2">
        {slotStates.map((s, i) => (
          <FontBar
            key={i}
            index={i}
            state={s}
            texto={textoGlobal}
            expanded={expanded[i]}
            onToggleExpand={() => toggleExpand(i)}
            onChange={(ns) => updateSlot(i, ns)}
            uploadedFonts={uploadedFonts}
            onUploadFont={handleUploadFont}
            filtro={filtro}
            sourceFilter={sourceFilter}
            allFontsCatalog={allFontsCatalog}
            onCopy={() => copySlot(i)}
            onPaste={() => pasteSlot(i)}
            hasClipboard={clipboard !== null}
          />
        ))}
      </div>

      {/* Sources modernos — separador discreto (12 sites + clones) */}
      <FontSources />
    </motion.div>
  );
}

// ============================================================================
// FontBar — uma barra horizontal grande (1 das 5)
// ============================================================================
interface FontBarProps {
  index: number;
  state: FontSlotState;
  texto: string;
  expanded: boolean;
  onToggleExpand: () => void;
  onChange: (s: FontSlotState) => void;
  uploadedFonts: UploadedFont[];
  onUploadFont: (file: File) => void;
  filtro: string;
  sourceFilter: string;
  allFontsCatalog: FontInfo[];
  onCopy: () => void;
  onPaste: () => void;
  hasClipboard: boolean;
}

function FontBar({
  index, state, texto, expanded, onToggleExpand, onChange,
  uploadedFonts, onUploadFont, filtro, sourceFilter, allFontsCatalog,
  onCopy, onPaste, hasClipboard,
}: FontBarProps) {
  const transformAtual = state.transformId
    ? FONT_TRANSFORMS.find((t) => t.id === state.transformId)
    : undefined;

  // Generate individual — SÓ muda a font (NÃO mexe na transform).
  // Para mudar a transform, usa o ícone Shuffle (randomTransform).
  const gerarIndividual = async () => {
    let pool = allFontsCatalog;
    if (filtro !== "todos") {
      pool = pool.filter((f) => f.categoria.includes(filtro as any));
    }
    if (sourceFilter !== "todos") {
      pool = pool.filter((f) => f.source === sourceFilter);
    }
    pool = pool.filter((f) => f.family !== state.fonte);
    if (pool.length === 0) pool = FONTS_MODERNAS;
    const font = pool[Math.floor(Math.random() * pool.length)];
    await loadFont(font);
    onChange({
      ...state,
      fonte: font.family,
      customFontName: undefined,
      // NÃO mexe no transformId — mantém a transform atual
    });
    toast.success(`Slot ${index + 1}: ${font.family}`);
  };

  // Randomiza SÓ a transform (não muda a font)
  const randomTransform = () => {
    onChange({ ...state, transformId: getRandomTransform(state.transformId).id });
  };

  // Toggle lock
  const toggleLock = () => {
    onChange({ ...state, locked: !state.locked });
    toast.success(state.locked ? `Slot ${index + 1} desbloqueado` : `Slot ${index + 1} bloqueado`);
  };

  // Toggle peso (multi-seleção)
  const togglePeso = (peso: number) => {
    const current = state.pesos ?? [400];
    const next = current.includes(peso)
      ? current.filter((p) => p !== peso)
      : [...current, peso].sort((a, b) => a - b);
    onChange({ ...state, pesos: next.length > 0 ? next : [400] });
  };

  // Toggle italic
  const toggleItalic = () => {
    onChange({ ...state, italic: !state.italic });
  };

  const fontValue = state.customFontName ?? state.fonte;
  const fontInfo = FONTS_MODERNAS.find((f) => f.family === state.fonte);
  const fontStack = state.customFontName
    ? `"${state.customFontName}", var(--font-inter), sans-serif`
    : fontStackFor(fontInfo ?? state.fonte);
  const pesosAtivos = (state.pesos ?? [400]).sort((a, b) => a - b);
  const pesoPrincipal = pesosAtivos[0];

  return (
    <motion.div
      layout
      className={cn(
        "overflow-hidden rounded-2xl border bg-card transition-colors",
        state.locked ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
      )}
    >
      {/* Header da barra (sempre visível) */}
      <div className="flex flex-wrap items-center gap-2 p-3">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-card/50"
          aria-label={expanded ? "Fechar" : "Expandir"}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
          {index + 1}
        </span>

        <span className="font-mono text-xs font-semibold">{fontValue}</span>

        {transformAtual && (
          <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            {transformAtual.name}
          </span>
        )}

        {pesosAtivos.length > 1 ? (
          <span className="rounded-md bg-card/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {pesosAtivos.length} pesos
          </span>
        ) : (
          <span className="rounded-md bg-card/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {PESOS_LABELS[pesoPrincipal]}
          </span>
        )}

        {state.italic && (
          <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
            <Italic className="h-2.5 w-2.5 inline" />
          </span>
        )}

        {state.locked && (
          <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            <Lock className="h-2.5 w-2.5 inline mr-0.5" />Lock
          </span>
        )}

        {/* Actions */}
        <div className="ml-auto flex items-center gap-0.5">
          {/* Lock */}
          <IconBtn onClick={toggleLock} active={state.locked} title={state.locked ? "Desbloquear" : "Bloquear (Generate All não afeta)"}>
            {state.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
          </IconBtn>
          {/* Copy */}
          <IconBtn onClick={onCopy} title="Copiar slot">
            <Copy className="h-3 w-3" />
          </IconBtn>
          {/* Paste */}
          <IconBtn onClick={onPaste} disabled={!hasClipboard} title="Colar slot">
            <ClipboardPaste className="h-3 w-3" />
          </IconBtn>
          {/* Preview popup */}
          <FontPreviewPopup state={state} texto={texto} />
          {/* Generate TRANSFORM (ícone shuffle) — só muda a transform, mantém a font */}
          <IconBtn onClick={randomTransform} title="Generate Transform (só muda a transform, mantém a font)">
            <Shuffle className="h-3 w-3" />
          </IconBtn>
          {/* Pesos (multi-seleção) */}
          <PesosPopover pesos={pesosAtivos} onToggle={togglePeso} />
          {/* Italic */}
          <IconBtn onClick={toggleItalic} active={state.italic} title="Itálico">
            <Italic className="h-3 w-3" />
          </IconBtn>
          {/* Generate FONT — só muda a font, mantém a transform */}
          <Button
            type="button"
            size="sm"
            onClick={gerarIndividual}
            className="h-7 gap-1 rounded-md bg-primary px-2 text-[10px] text-primary-foreground hover:bg-primary/90"
            title="Generate Font (só muda a font, mantém a transform)"
          >
            <Zap className="h-3 w-3" /> Generate Font
          </Button>
        </div>
      </div>

      {/* Preview grande horizontal — sempre visível */}
      <div className="px-3 pb-3">
        <div className="relative min-h-[80px] overflow-hidden rounded-xl border border-border bg-card/30 px-4 py-3">
          {/* Mostra uma linha por peso ativo (para comparar pesos) */}
          <div className="space-y-1">
            {pesosAtivos.slice(0, 3).map((p, idx) => (
              <div
                key={p}
                className="flex items-baseline gap-3"
                style={{ opacity: 1 - idx * 0.2 }}
              >
                {pesosAtivos.length > 1 && (
                  <span className="w-12 shrink-0 font-mono text-[9px] uppercase text-muted-foreground">
                    {PESOS_LABELS[p]}
                  </span>
                )}
                <span
                  className="text-2xl font-bold leading-tight sm:text-3xl"
                  style={{
                    fontFamily: fontStack,
                    fontWeight: p,
                    fontStyle: state.italic ? "italic" : "normal",
                    ...transformAtual?.css,
                  }}
                >
                  {texto}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo expandido */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-3">
              {/* Font picker */}
              <Select
                value={fontValue}
                onValueChange={async (v) => {
                  if (v.startsWith("__custom__:")) {
                    const name = v.replace("__custom__:", "");
                    onChange({ ...state, customFontName: name, fonte: name });
                  } else {
                    const info = FONTS_MODERNAS.find((f) => f.family === v);
                    if (info) await loadFont(info);
                    onChange({ ...state, fonte: v, customFontName: undefined });
                  }
                }}
              >
                <SelectTrigger className="h-8 border-border bg-card/50 text-xs">
                  <SelectValue placeholder="Escolhe font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] uppercase tracking-wider">
                      Modernas curadas ({FONTS_MODERNAS.length})
                    </SelectLabel>
                    {FONTS_MODERNAS.map((f) => (
                      <SelectItem key={f.family} value={f.family} className="text-xs">
                        <span style={{ fontFamily: fontStackFor(f) }}>{f.nome}</span>
                        <span className="ml-1 text-[10px] text-muted-foreground">
                          {f.awwwards ? "★" : ""} {f.categoria.join("/")}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] uppercase tracking-wider">
                      Predefinidas
                    </SelectLabel>
                    {FONTES_DISPONIVEIS.filter((f) => !FONTS_MODERNAS.find((fm) => fm.family === f)).map((f) => (
                      <SelectItem key={f} value={f} className="text-xs">
                        <span style={{ fontFamily: fontStackFor(f) }}>{f}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  {uploadedFonts.length > 0 && (
                    <SelectGroup>
                      <SelectLabel className="text-[10px] uppercase tracking-wider">
                        Uploads
                      </SelectLabel>
                      {uploadedFonts.map((f) => (
                        <SelectItem key={f.family} value={`__custom__:${f.name}`} className="text-xs">
                          <span style={{ fontFamily: `"${f.family}", sans-serif` }}>{f.name}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>

              <UploadWithSuggestions
                onApplyFont={async (family, isCustom) => {
                  if (isCustom) {
                    onChange({ ...state, customFontName: family, fonte: family });
                  } else {
                    const info = FONTS_MODERNAS.find((f) => f.family === family);
                    if (info) await loadFont(info);
                    onChange({ ...state, fonte: family, customFontName: undefined });
                  }
                }}
                uploadedFonts={uploadedFonts}
                onUploadFont={onUploadFont}
              />

              {/* Transform picker */}
              <Select
                value={state.transformId ?? "__none__"}
                onValueChange={(v) =>
                  onChange({ ...state, transformId: v === "__none__" ? undefined : v })
                }
              >
                <SelectTrigger className="h-8 border-border bg-card/50 text-xs">
                  <SelectValue placeholder="Transform (50 estilos)" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectItem value="__none__" className="text-xs text-muted-foreground">
                    — Sem transform —
                  </SelectItem>
                  {Object.entries(getTransformsByCategory()).map(([cat, items]) => (
                    <SelectGroup key={cat}>
                      <SelectLabel className="text-[10px] uppercase tracking-wider text-primary">
                        {cat}
                      </SelectLabel>
                      {items.map((t: FontTransform) => (
                        <SelectItem key={t.id} value={t.id} className="text-xs">
                          <span className="font-medium">{t.name}</span>
                          <span className="ml-1 text-muted-foreground">— {t.description}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// IconBtn — botão de ícone pequeno reutilizável
// ============================================================================
function IconBtn({
  onClick, children, active, disabled, title,
}: {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md transition-all",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-card/50 hover:text-foreground",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

// ============================================================================
// PesosPopover — popover com checkboxes para multi-seleção de pesos
// ============================================================================
function PesosPopover({
  pesos, onToggle,
}: {
  pesos: number[];
  onToggle: (p: number) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Pesos (multi-seleção)"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-card/50 hover:text-foreground"
        >
          <Bold className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Pesos ({pesos.length} ativos)
        </div>
        <div className="space-y-1">
          {PESOS_DISPONIVEIS.map((p) => (
            <label
              key={p}
              htmlFor={`peso-${p}`}
              className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 hover:bg-card/50"
            >
              <Checkbox
                id={`peso-${p}`}
                checked={pesos.includes(p)}
                onCheckedChange={() => onToggle(p)}
              />
              <span className="text-xs">
                {p} — <span className="text-muted-foreground">{PESOS_LABELS[p]}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-1.5 border-t border-border pt-1 text-[9px] text-muted-foreground">
          Multi-seleção: compara pesos na preview
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// SourceFilter — seletor expansível do site de fonts (Google/Fontshare/Todos)
// ============================================================================
const SOURCES = [
  { id: "todos", label: "Todos", desc: "Todas as fonts (Google + Fontshare)" },
  { id: "google", label: "Google Fonts", desc: "1500+ fonts gratuitas" },
  { id: "fontshare", label: "Fontshare", desc: "Premium ITF gratuitas (awwwards)" },
];

function SourceFilter({
  value, onChange, fontCount,
}: {
  value: string;
  onChange: (v: string) => void;
  fontCount: { total: number; google: number; fontshare: number; curated: number } | null;
}) {
  const [open, setOpen] = useState(false);
  const current = SOURCES.find((s) => s.id === value) ?? SOURCES[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-2.5 py-0.5 text-[10px] font-medium transition-all hover:border-primary/40"
      >
        <Globe className="h-2.5 w-2.5 text-primary" />
        <span className="text-muted-foreground">Source:</span>
        <span className="font-semibold">{current.label}</span>
        {fontCount && (
          <span className="rounded bg-primary/10 px-1 text-primary">
            {value === "google" ? fontCount.google : value === "fontshare" ? fontCount.fontshare : fontCount.total}
          </span>
        )}
        <ChevronDown className={cn("h-2.5 w-2.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-border bg-card p-1 shadow-lg"
            >
              {SOURCES.map((s) => {
                const count = s.id === "google" ? fontCount?.google : s.id === "fontshare" ? fontCount?.fontshare : fontCount?.total;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onChange(s.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                      value === s.id
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-card/50"
                    )}
                  >
                    <div>
                      <div className="font-semibold">{s.label}</div>
                      <div className="text-[9px] text-muted-foreground">{s.desc}</div>
                    </div>
                    {count !== undefined && (
                      <span className="rounded bg-card/60 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
              {fontCount && fontCount.total > FONTS_MODERNAS.length && (
                <div className="mt-1 border-t border-border px-2 py-1 text-[9px] text-muted-foreground">
                  Catálogo dinâmico ativo ({fontCount.total} fonts)
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

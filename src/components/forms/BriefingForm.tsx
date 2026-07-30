"use client";

// ============================================================================
// BriefingForm — form principal do ProjectForge AI
// ============================================================================
// Recebe `value` (FormValues) e `onChange` (updater parcial) do parent.
// Todos os sub-componentes (PaletteInput, TypographyInput, LayoutSelector)
// são renderizados aqui dentro para coesão visual.
// ============================================================================

import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Nichos,
  Secoes,
  Efeitos,
  type FormValues,
  type SiteType,
} from "@/lib/form-options";
import { PaletteInput } from "./PaletteInput";
import { TypographyInput } from "./TypographyInput";
import { LayoutSelector } from "./LayoutSelector";
import { FontPlayground, type FontSlotState } from "@/components/fonts/FontPlayground";
import { PerfectComboPopup } from "@/components/perfect-combo/PerfectComboPopup";
import type { PerfectCombo } from "@/lib/perfect-combo";
import { Check, ChevronsUpDown, Wand2, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BriefingFormProps {
  value: FormValues;
  onChange: (patch: Partial<FormValues>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const SITE_TYPE_LABELS: Record<SiteType, string> = {
  "single-page": "Single Page",
  "multi-page": "Multi-page",
  dashboard: "Dashboard / Web App",
  ecommerce: "E-commerce",
  outro: "Outro",
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, type: "spring", stiffness: 120, damping: 18 },
  }),
};

export function BriefingForm({
  value,
  onChange,
  onSubmit,
  isLoading,
}: BriefingFormProps) {
  const [nichoOpen, setNichoOpen] = useState(false);

  const toggleArrayItem = (key: "seccoes" | "efeitos", item: string) => {
    const arr = value[key];
    const next = arr.includes(item)
      ? arr.filter((x) => x !== item)
      : [...arr, item];
    onChange({ [key]: next });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="premium-card space-y-8 p-6 md:p-10"
    >
      {/* 1. Briefing */}
      <motion.div variants={fadeUp} custom={0} className="space-y-2">
        <Label htmlFor="briefing" className="text-sm font-semibold">
          Briefing do Cliente <span className="text-primary">*</span>
        </Label>
        <Textarea
          id="briefing"
          value={value.briefing}
          onChange={(e) => onChange({ briefing: e.target.value })}
          placeholder="Ex: Estamos a criar uma plataforma SaaS B2B para gestão de equipas remotas. O público-alvo são CTOs e Head of Ops de startups em fase Series A-B. Tom deve ser confiante, técnico mas acessível..."
          className="min-h-[140px] resize-y border-border bg-card/50 text-sm leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">
          {value.briefing.length} caracteres · mínimo 20
        </p>
      </motion.div>

      {/* 2. Nicho + Tipo de Site (grid 2 colunas) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div variants={fadeUp} custom={1} className="space-y-2">
          <Label className="text-sm font-semibold">Nicho / Tipo de Negócio</Label>
          <Popover open={nichoOpen} onOpenChange={setNichoOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={nichoOpen}
                className="w-full justify-between border-border bg-card/50 font-normal"
              >
                {value.nicho || "Auto-detectar a partir do briefing"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Procurar nicho…" />
                <CommandList className="max-h-72">
                  <CommandEmpty>Nenhum nicho encontrado.</CommandEmpty>
                  <CommandGroup>
                    {Nichos.map((n) => (
                      <CommandItem
                        key={n}
                        value={n}
                        onSelect={(v) => {
                          onChange({ nicho: v === value.nicho ? "" : v });
                          setNichoOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.nicho === n ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {n}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {value.nicho === "" && (
            <p className="text-xs text-primary/70">
              <Sparkles className="mr-1 inline h-3 w-3" />
              Auto-detetar a partir do briefing
            </p>
          )}
        </motion.div>

        <motion.div variants={fadeUp} custom={2} className="space-y-2">
          <Label className="text-sm font-semibold">Tipo de Site</Label>
          <Select
            value={value.siteType}
            onValueChange={(v) => onChange({ siteType: v as SiteType })}
          >
            <SelectTrigger className="border-border bg-card/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SITE_TYPE_LABELS) as SiteType[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {SITE_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {/* 3. Secções (multi-select tags) */}
      <motion.div variants={fadeUp} custom={3} className="space-y-2">
        <Label className="text-sm font-semibold">Secções a trabalhar</Label>
        <div className="flex flex-wrap gap-2">
          {Secoes.map((s) => {
            const active = value.seccoes.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleArrayItem("seccoes", s)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-95",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 4. Efeitos / Layout (delegado ao LayoutSelector) */}
      <LayoutSelector
        efeitos={value.efeitos}
        onToggle={(efeito) => toggleArrayItem("efeitos", efeito)}
      />

      {/* 5. Font Playground — 5 slots + 50 transforms + 10 sources + filtro */}
      <motion.div variants={fadeUp} custom={4}>
        <FontPlayground
          states={value.fontsPlayground as FontSlotState[] ?? []}
          onChange={(fontsPlayground) =>
            onChange({ fontsPlayground: fontsPlayground as any })
          }
        />
      </motion.div>

      {/* 5.5 PERFECT COMBO — une fonts + cores + skin compatíveis */}
      <motion.div variants={fadeUp} custom={4.5} className="flex justify-center">
        <PerfectComboPopup
          fontsPlayground={value.fontsPlayground as { fonte: string }[] ?? []}
          paletaManual={value.paletaManual ?? []}
          onApplyCombo={(combo: PerfectCombo) => {
            // Aplica a combo ao form: fonts + paleta + skin
            onChange({
              fontsPlayground: [
                { fonte: combo.fonts.heading.family, pesos: combo.fonts.heading.pesos.slice(0, 2) },
                { fonte: combo.fonts.body.family, pesos: combo.fonts.body.pesos.slice(0, 2) },
                ...(combo.fonts.mono ? [{ fonte: combo.fonts.mono.family, pesos: combo.fonts.mono.pesos.slice(0, 2) }] : []),
              ] as any,
              paletaMode: "manual" as const,
              paletaManual: [
                { nome: "Background", hex: combo.paleta.bg, uso: "Background" },
                { nome: "Card", hex: combo.paleta.card, uso: "Card/Surface" },
                { nome: "Text", hex: combo.paleta.text, uso: "Text/Foreground" },
                { nome: "Accent", hex: combo.paleta.accent, uso: "Accent/Primary" },
                { nome: "Muted", hex: combo.paleta.muted, uso: "Muted" },
              ],
              typographyMode: "manual" as const,
              typographyManual: {
                heading: combo.fonts.heading.family,
                body: combo.fonts.body.family,
                mono: combo.fonts.mono?.family ?? "Geist Mono",
              },
            });
          }}
        />
      </motion.div>

      {/* 6. Paleta (tabs manual/auto) */}
      <PaletteInput
        mode={value.paletaMode}
        manual={value.paletaManual ?? []}
        onModeChange={(paletaMode) => onChange({ paletaMode })}
        onManualChange={(paletaManual) => onChange({ paletaManual })}
        fontsPlayground={value.fontsPlayground as { fonte: string }[] ?? []}
      />

      {/* 8. Tipografia (tabs manual/auto) */}
      <TypographyInput
        mode={value.typographyMode}
        manual={value.typographyManual ?? { heading: "Geist", body: "Inter", mono: "Geist Mono" }}
        onModeChange={(typographyMode) => onChange({ typographyMode })}
        onManualChange={(typographyManual) => onChange({ typographyManual })}
        fontsPlayground={value.fontsPlayground as { fonte: string }[] ?? []}
      />

      {/* 7. Modo de Prompt */}
      <motion.div variants={fadeUp} custom={6} className="space-y-2">
        <Label className="text-sm font-semibold">Modo de Prompt</Label>
        <RadioGroup
          value={value.promptMode}
          onValueChange={(v) => onChange({ promptMode: v as "compact" | "extended" })}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { value: "compact", label: "Compact", desc: "1-3 prompts prontos a copiar" },
            { value: "extended", label: "Extended", desc: "Prompts por fase (Research → QA)" },
          ].map((opt) => (
            <label
              key={opt.value}
              htmlFor={`prompt-${opt.value}`}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-2xl border p-4 transition-all",
                value.promptMode === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card/50 hover:border-primary/40"
              )}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} id={`prompt-${opt.value}`} />
                <span className="text-sm font-semibold">{opt.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">{opt.desc}</span>
            </label>
          ))}
        </RadioGroup>
      </motion.div>

      {/* 8. Extras (checkboxes + switches) */}
      <motion.div variants={fadeUp} custom={7} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-border bg-card/40 p-4">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Incluir no output
          </Label>
          {[
            { key: "incluirMockups", label: "Mockups descritos" },
            { key: "incluirDesignTokens", label: "Design Tokens" },
            { key: "incluirRoadmap", label: "Roadmap" },
          ].map((opt) => (
            <div key={opt.key} className="flex items-center gap-3">
              <Checkbox
                id={opt.key}
                checked={value[opt.key as keyof FormValues] as boolean}
                onCheckedChange={(c) =>
                  onChange({ [opt.key]: c === true } as Partial<FormValues>)
                }
              />
              <Label htmlFor={opt.key} className="cursor-pointer text-sm">
                {opt.label}
              </Label>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-card/40 p-4">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Configuração
          </Label>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">Nível</span>
            <Select
              value={value.nivel}
              onValueChange={(v) => onChange({ nivel: v as "mvp" | "production" })}
            >
              <SelectTrigger className="h-8 w-32 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">Idioma</span>
            <Select
              value={value.idioma}
              onValueChange={(v) => onChange({ idioma: v as "pt" | "en" })}
            >
              <SelectTrigger className="h-8 w-32 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">PT</SelectItem>
                <SelectItem value="en">EN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Submit */}
      <motion.div variants={fadeUp} custom={8}>
        <Button
          onClick={onSubmit}
          disabled={isLoading || value.briefing.length < 20}
          className="group relative w-full overflow-hidden rounded-2xl bg-primary py-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Wand2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
            {isLoading ? "A gerar…" : "Gerar Especificação"}
          </span>
        </Button>
        {value.briefing.length < 20 && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Escreve pelo menos 20 caracteres no briefing para continuar.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

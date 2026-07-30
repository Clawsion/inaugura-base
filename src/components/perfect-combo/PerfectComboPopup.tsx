"use client";

// ============================================================================
// PerfectComboPopup — mostra combos perfeitos + preview em múltiplos mockups
// ============================================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, Eye } from "lucide-react";
import {
  Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { generatePerfectCombos, detectarNicho, getComboForNicho, type PerfectCombo } from "@/lib/perfect-combo";
import { loadFont, fontStackFor } from "@/lib/fonts-modernas";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PerfectComboPopupProps {
  onApplyCombo: (combo: PerfectCombo) => void;
  fontsPlayground: { fonte: string }[];
  paletaManual: { nome: string; hex: string; uso: string }[];
  briefing?: string;
  nicho?: string;
}

export function PerfectComboPopup({
  onApplyCombo, fontsPlayground, paletaManual, briefing, nicho,
}: PerfectComboPopupProps) {
  const [open, setOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<PerfectCombo | null>(null);
  const combos = generatePerfectCombos();

  // NOVO: deteta nicho automaticamente quando o popup abre
  const nichoDetetado = nicho || (briefing ? detectarNicho(briefing) : null);
  const comboRecomendada = nichoDetetado ? getComboForNicho(nichoDetetado) : null;

  const handleSelect = async (combo: PerfectCombo) => {
    setSelectedCombo(combo);
    await Promise.all([
      loadFont(combo.fonts.heading),
      loadFont(combo.fonts.body),
      combo.fonts.mono ? loadFont(combo.fonts.mono) : Promise.resolve(),
    ]);
  };

  const handleApply = () => {
    if (!selectedCombo) return;
    onApplyCombo(selectedCombo);
    setOpen(false);
    toast.success(`Combo "${selectedCombo.nome}" aplicada!`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="h-9 gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500 px-4 text-xs font-bold text-white shadow-lg shadow-fuchsia-500/30 hover:from-violet-600 hover:via-fuchsia-600 hover:to-amber-600"
          title="Gera combinações perfeitas de font + cor + skin compatíveis"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Perfect Combo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl gap-0 border-border bg-card p-0 sm:rounded-2xl">
        <DialogTitle className="sr-only">Perfect Combo — combinações perfeitas</DialogTitle>
        <DialogDescription className="sr-only">
          Seleciona uma combinação perfeita de font + cor + skin. Preview em múltiplos mockups.
        </DialogDescription>

        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <Sparkles className="h-4 w-4 text-fuchsia-500" />
                Perfect Combo
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Combinações perfeitas de font + cor + skin. Clica para ver preview, depois aplica.
              </p>
            </div>
            {selectedCombo && (
              <Button
                onClick={handleApply}
                className="h-8 gap-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-xs text-white hover:from-violet-600 hover:to-fuchsia-600"
              >
                <Check className="h-3.5 w-3.5" />
                Aplicar &quot;{selectedCombo.nome}&quot;
              </Button>
            )}
          </div>
          {/* NOVO: banner de recomendação automática por nicho */}
          {nichoDetetado && comboRecomendada && (
            <button
              type="button"
              onClick={() => handleSelect(comboRecomendada)}
              className="mt-2 flex w-full items-center gap-2 rounded-lg border border-fuchsia-500/40 bg-fuchsia-500/10 p-2 text-left transition-all hover:bg-fuchsia-500/15"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-fuchsia-500" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-500">
                  Recomendado para o teu nicho: {nichoDetetado}
                </div>
                <div className="text-xs font-semibold">{comboRecomendada.nome}</div>
                <div className="text-[10px] text-muted-foreground">{comboRecomendada.descricao}</div>
              </div>
              <div className="flex gap-0.5">
                <div className="h-3 w-3 rounded-sm border border-border" style={{ backgroundColor: comboRecomendada.paleta.bg }} />
                <div className="h-3 w-3 rounded-sm border border-border" style={{ backgroundColor: comboRecomendada.paleta.accent }} />
              </div>
            </button>
          )}
        </div>

        <div className="grid max-h-[80vh] grid-cols-1 overflow-hidden md:grid-cols-[280px_1fr]">
          {/* Lista de combos (esquerda) */}
          <div className="overflow-y-auto border-r border-border p-2">
            <div className="space-y-1">
              {combos.map((combo) => (
                <button
                  key={combo.id}
                  type="button"
                  onClick={() => handleSelect(combo)}
                  className={cn(
                    "w-full rounded-lg border p-2 text-left transition-all",
                    selectedCombo?.id === combo.id
                      ? "border-fuchsia-500 bg-fuchsia-500/10 ring-1 ring-fuchsia-500/30"
                      : "border-border hover:border-fuchsia-500/40 hover:bg-card/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <div className="h-4 w-4 rounded-sm border border-border" style={{ backgroundColor: combo.paleta.bg }} />
                      <div className="h-4 w-4 rounded-sm border border-border" style={{ backgroundColor: combo.paleta.accent }} />
                      <div className="h-4 w-4 rounded-sm border border-border" style={{ backgroundColor: combo.paleta.text }} />
                    </div>
                    <span className="text-xs font-bold">{combo.nome}</span>
                    {comboRecomendada?.id === combo.id && (
                      <span className="rounded bg-fuchsia-500/20 px-1 text-[8px] font-bold uppercase text-fuchsia-500">
                        ★ Recomendado
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[10px] leading-tight text-muted-foreground">{combo.descricao}</p>
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {combo.estilos.map((estilo) => (
                      <span key={estilo} className="rounded bg-background/60 px-1 py-0 text-[8px] uppercase text-muted-foreground">
                        {estilo}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview (direita) */}
          <div className="overflow-y-auto p-4">
            {selectedCombo ? (
              <ComboPreview combo={selectedCombo} />
            ) : (
              <div className="flex h-full min-h-[400px] items-center justify-center text-center">
                <div>
                  <Eye className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Seleciona uma combo à esquerda para ver o preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// ComboPreview — mostra a combo em 4 mockups diferentes
// ============================================================================
function ComboPreview({ combo }: { combo: PerfectCombo }) {
  const { fonts, paleta, razao } = combo;
  const headingFont = fontStackFor(fonts.heading);
  const bodyFont = fontStackFor(fonts.body);

  return (
    <div className="space-y-4">
      {/* Info da combo */}
      <div className="rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/5 p-3">
        <h4 className="text-sm font-bold">{combo.nome}</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">{razao}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
          <span className="rounded bg-background/60 px-1.5 py-0.5">
            <strong>Heading:</strong> {fonts.heading.family}
          </span>
          <span className="rounded bg-background/60 px-1.5 py-0.5">
            <strong>Body:</strong> {fonts.body.family}
          </span>
          {fonts.mono && (
            <span className="rounded bg-background/60 px-1.5 py-0.5">
              <strong>Mono:</strong> {fonts.mono.family}
            </span>
          )}
        </div>
        {/* Paleta */}
        <div className="mt-2 flex gap-1">
          {Object.entries(paleta).map(([role, hex]) => (
            <div key={role} className="flex-1 text-center">
              <div
                className="h-8 w-full rounded border border-border"
                style={{ backgroundColor: hex as string }}
              />
              <div className="mt-0.5 text-[8px] uppercase text-muted-foreground">{role}</div>
              <div className="font-mono text-[8px]">{hex as string}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mockups em tabs */}
      <Tabs defaultValue="minimal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/50">
          <TabsTrigger value="minimal" className="text-[10px]">Minimal</TabsTrigger>
          <TabsTrigger value="brutalist" className="text-[10px]">Brutalist</TabsTrigger>
          <TabsTrigger value="traditional" className="text-[10px]">Traditional</TabsTrigger>
          <TabsTrigger value="vintage" className="text-[10px]">Vintage</TabsTrigger>
        </TabsList>

        <TabsContent value="minimal" className="mt-3">
          <MinimalMockup paleta={paleta} headingFont={headingFont} bodyFont={bodyFont} />
        </TabsContent>
        <TabsContent value="brutalist" className="mt-3">
          <BrutalistMockup paleta={paleta} headingFont={headingFont} bodyFont={bodyFont} />
        </TabsContent>
        <TabsContent value="traditional" className="mt-3">
          <TraditionalMockup paleta={paleta} headingFont={headingFont} bodyFont={bodyFont} />
        </TabsContent>
        <TabsContent value="vintage" className="mt-3">
          <VintageMockup paleta={paleta} headingFont={headingFont} bodyFont={bodyFont} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// MOCKUP 1: MINIMAL (Linear/Vercel style)
// ============================================================================
function MinimalMockup({ paleta, headingFont, bodyFont }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border"
      style={{ backgroundColor: paleta.bg, color: paleta.text, fontFamily: bodyFont, borderColor: paleta.text + "15" }}
    >
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md" style={{ backgroundColor: paleta.accent }} />
          <span className="text-xs font-bold" style={{ fontFamily: headingFont }}>Brand</span>
        </div>
        <div className="flex gap-3 text-[10px]" style={{ color: paleta.muted }}>
          <span>Product</span><span>Pricing</span><span>Docs</span>
        </div>
        <button className="rounded-md px-2.5 py-1 text-[10px] font-semibold" style={{ backgroundColor: paleta.accent, color: paleta.bg }}>
          Get Started
        </button>
      </div>
      <div className="px-4 py-8 text-center">
        <h2 className="text-2xl font-bold leading-tight" style={{ fontFamily: headingFont }}>
          Ship faster with less code
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-[11px] leading-relaxed" style={{ color: paleta.muted }}>
          The platform for modern web development. Build, deploy, and scale with confidence.
        </p>
        <div className="mt-3 flex justify-center gap-2">
          <button className="rounded-lg px-3 py-1.5 text-[10px] font-semibold" style={{ backgroundColor: paleta.accent, color: paleta.bg }}>
            Start free
          </button>
          <button className="rounded-lg border px-3 py-1.5 text-[10px] font-semibold" style={{ borderColor: paleta.text + "30", color: paleta.text }}>
            Book demo
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {["Fast", "Secure", "Scalable"].map((f) => (
          <div key={f} className="rounded-lg p-2 text-center" style={{ backgroundColor: paleta.card, border: `1px solid ${paleta.text}10` }}>
            <div className="mx-auto mb-1 h-4 w-4 rounded-full" style={{ backgroundColor: paleta.accent }} />
            <div className="text-[10px] font-semibold" style={{ fontFamily: headingFont }}>{f}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MOCKUP 2: BRUTALIST (hard edges, offset shadows)
// ============================================================================
function BrutalistMockup({ paleta, headingFont, bodyFont }: any) {
  const brutalistBorder = paleta.text;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden border-2 p-4"
      style={{
        backgroundColor: paleta.bg,
        color: paleta.text,
        fontFamily: bodyFont,
        borderColor: brutalistBorder,
        boxShadow: `6px 6px 0px ${brutalistBorder}`,
      }}
    >
      <div className="mb-3 flex items-center justify-between border-b-2 pb-2" style={{ borderColor: brutalistBorder }}>
        <span className="text-sm font-black uppercase tracking-tight" style={{ fontFamily: headingFont }}>
          BRAND★
        </span>
        <div className="flex gap-2 text-[10px] font-bold uppercase">
          <span>WORK</span><span>ABOUT</span><span>CONTACT</span>
        </div>
      </div>
      <div className="py-4">
        <h2 className="text-3xl font-black uppercase leading-none" style={{ fontFamily: headingFont }}>
          MAKE IT<br />BOLD.
        </h2>
        <p className="mt-2 text-[11px] font-bold uppercase" style={{ color: paleta.muted }}>
          No fluff. Just impact.
        </p>
        <button
          className="mt-3 px-4 py-2 text-[10px] font-black uppercase"
          style={{
            backgroundColor: paleta.accent,
            color: paleta.bg,
            border: `2px solid ${brutalistBorder}`,
            boxShadow: `3px 3px 0px ${brutalistBorder}`,
          }}
        >
          View Work →
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t-2 pt-3" style={{ borderColor: brutalistBorder }}>
        {[
          { label: "PROJECTS", value: "42" },
          { label: "AWARDS", value: "12" },
          { label: "YEARS", value: "08" },
        ].map((s) => (
          <div key={s.label} className="border-2 p-2 text-center" style={{ borderColor: brutalistBorder }}>
            <div className="text-xl font-black" style={{ fontFamily: headingFont, color: paleta.accent }}>{s.value}</div>
            <div className="text-[8px] font-bold uppercase">{s.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MOCKUP 3: TRADITIONAL (editorial, magazine)
// ============================================================================
function TraditionalMockup({ paleta, headingFont, bodyFont }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden p-5"
      style={{ backgroundColor: paleta.bg, color: paleta.text, fontFamily: bodyFont }}
    >
      <div className="mb-3 border-b pb-2 text-center" style={{ borderColor: paleta.text + "20" }}>
        <div className="text-[8px] uppercase tracking-[0.3em]" style={{ color: paleta.muted }}>
          Established 2025 · Vol. I
        </div>
        <h1 className="mt-1 text-2xl font-bold" style={{ fontFamily: headingFont }}>
          The Editorial
        </h1>
      </div>
      <div className="space-y-2">
        <div className="text-[8px] uppercase tracking-wider" style={{ color: paleta.accent }}>
          Feature · Design
        </div>
        <h2 className="text-lg font-bold leading-tight" style={{ fontFamily: headingFont }}>
          The Art of Timeless Typography in Modern Web Design
        </h2>
        <p className="text-[11px] leading-relaxed" style={{ color: paleta.muted }}>
          In an era of fleeting trends, the pursuit of typographic excellence remains a constant.
          True craftsmanship lies not in novelty, but in the considered balance of form and function.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <div className="h-5 w-5 rounded-full" style={{ backgroundColor: paleta.accent }} />
          <div>
            <div className="text-[10px] font-semibold">By Editor</div>
            <div className="text-[8px]" style={{ color: paleta.muted }}>5 min read · Today</div>
          </div>
        </div>
      </div>
      <blockquote
        className="mt-3 border-l-2 pl-3 text-[12px] italic"
        style={{ borderColor: paleta.accent, fontFamily: headingFont }}
      >
        &quot;Simplicity is the ultimate sophistication.&quot;
      </blockquote>
    </motion.div>
  );
}

// ============================================================================
// MOCKUP 4: VINTAGE (warm, artisanal, retro)
// ============================================================================
function VintageMockup({ paleta, headingFont, bodyFont }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden p-5"
      style={{
        backgroundColor: paleta.bg,
        color: paleta.text,
        fontFamily: bodyFont,
        backgroundImage: `radial-gradient(circle at 20% 30%, ${paleta.accent}08 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${paleta.muted}10 0%, transparent 50%)`,
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full border-2" style={{ borderColor: paleta.accent }} />
          <span className="text-sm font-bold" style={{ fontFamily: headingFont }}>Maison</span>
        </div>
        <div className="flex gap-2 text-[9px] uppercase tracking-wider" style={{ color: paleta.muted }}>
          <span>Shop</span><span>Story</span><span>Visit</span>
        </div>
      </div>
      <div className="py-3 text-center">
        <div className="text-[8px] uppercase tracking-[0.2em]" style={{ color: paleta.accent }}>
          ~ Est. 1987 ~
        </div>
        <h2 className="mt-1 text-2xl font-bold leading-tight" style={{ fontFamily: headingFont }}>
          Handcrafted<br />with Love
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-[11px] italic leading-relaxed" style={{ color: paleta.muted }}>
          Each piece tells a story. Made with care, designed to last generations.
        </p>
        <button
          className="mt-3 rounded-full border-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider"
          style={{ borderColor: paleta.accent, color: paleta.accent }}
        >
          Discover Collection
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          { name: "Artisan Blend", price: "€24" },
          { name: "Heritage Roast", price: "€32" },
        ].map((p) => (
          <div key={p.name} className="rounded-lg border p-2 text-center" style={{ borderColor: paleta.accent + "40" }}>
            <div className="mx-auto mb-1 h-8 w-8 rounded-full" style={{ backgroundColor: paleta.accent + "20" }} />
            <div className="text-[10px] font-bold" style={{ fontFamily: headingFont }}>{p.name}</div>
            <div className="text-[9px]" style={{ color: paleta.muted }}>{p.price}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

"use client";

// ============================================================================
// TypographyInput — deteta quantas fonts estão escolhidas no playground
// ============================================================================

import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sparkles, Type } from "lucide-react";
import { FONTES_DISPONIVEIS } from "@/lib/fonts";
import { FONTS_MODERNAS } from "@/lib/fonts-modernas";

interface TypographyManual {
  heading: string;
  body: string;
  mono: string;
}

interface TypographyInputProps {
  mode: "auto" | "manual";
  manual: TypographyManual;
  onModeChange: (m: "auto" | "manual") => void;
  onManualChange: (t: TypographyManual) => void;
  fontsPlayground?: { fonte: string }[];
}

export function TypographyInput({
  mode, manual, onModeChange, onManualChange, fontsPlayground,
}: TypographyInputProps) {
  // NOVO: deteta quantas fonts únicas estão escolhidas no playground
  const fontsEscolhidas = (fontsPlayground ?? [])
    .map((f) => f.fonte)
    .filter(Boolean);
  const fontsUnicas = Array.from(new Set(fontsEscolhidas));
  const numFonts = fontsUnicas.length;

  // Sugestão automática baseada nas fonts escolhidas
  const sugerirFromPlayground = () => {
    if (numFonts === 0) return;
    const heading = fontsUnicas[0];
    const body = fontsUnicas[1] ?? fontsUnicas[0];
    const mono = fontsUnicas.find((f) => f.toLowerCase().includes("mono")) ?? "Geist Mono";
    onManualChange({ heading, body, mono });
  };

  // Lista combinada: fonts do playground + curadas + predefinidas
  const allFonts = Array.from(new Set([
    ...fontsUnicas,
    ...FONTS_MODERNAS.map((f) => f.family),
    ...FONTES_DISPONIVEIS,
  ]));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-sm font-semibold">
          <Type className="h-3.5 w-3.5 text-primary" />
          Tipografia
        </Label>
        {/* NOVO: badge com quantas fonts estão escolhidas no playground */}
        {numFonts > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {numFonts} font{numFonts > 1 ? "s" : ""} no playground
          </span>
        )}
      </div>

      <Tabs value={mode} onValueChange={(v) => onModeChange(v as "auto" | "manual")}>
        <TabsList className="grid w-full grid-cols-2 bg-card/50">
          <TabsTrigger value="auto" className="text-xs">
            <Sparkles className="mr-1.5 h-3 w-3" /> Auto
          </TabsTrigger>
          <TabsTrigger value="manual" className="text-xs">Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="auto" className="mt-3">
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
            <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
            Heading/body/mono serão recomendados com base no nicho e tom de voz.
            {numFonts > 0 && (
              <>
                <br />
                <strong className="text-foreground">
                  Detectei {numFonts} font{numFonts > 1 ? "s" : ""} no playground
                </strong>
                {" "}: {fontsUnicas.join(", ")}. O modelo vai usá-las como preferência.
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="manual" className="mt-3 space-y-3">
          {/* NOVO: botão para sugerir a partir do playground */}
          {numFonts > 0 && (
            <button
              type="button"
              onClick={sugerirFromPlayground}
              className="flex w-full items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-2 text-left transition-all hover:bg-primary/10"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium">
                  Usar {numFonts} font{numFonts > 1 ? "s" : ""} do playground
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {fontsUnicas.slice(0, 3).join(" · ")}
              </span>
            </button>
          )}

          {/* 3 selects: heading, body, mono — grid responsivo sem sobreposição */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Heading</Label>
              <Select value={manual.heading} onValueChange={(v) => onManualChange({ ...manual, heading: v })}>
                <SelectTrigger className="border-border bg-card/50 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allFonts.map((f, i) => (
                    <SelectItem key={`${f}-${i}`} value={f} className="text-xs">
                      {f}
                      {fontsUnicas.includes(f) && (
                        <span className="ml-1 text-[9px] text-primary">★ playground</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Body</Label>
              <Select value={manual.body} onValueChange={(v) => onManualChange({ ...manual, body: v })}>
                <SelectTrigger className="border-border bg-card/50 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allFonts.map((f, i) => (
                    <SelectItem key={`${f}-${i}`} value={f} className="text-xs">
                      {f}
                      {fontsUnicas.includes(f) && (
                        <span className="ml-1 text-[9px] text-primary">★ playground</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Mono</Label>
              <Select value={manual.mono} onValueChange={(v) => onManualChange({ ...manual, mono: v })}>
                <SelectTrigger className="border-border bg-card/50 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allFonts.filter((f) => f.toLowerCase().includes("mono") || f.toLowerCase().includes("code")).map((f, i) => (
                    <SelectItem key={`${f}-${i}`} value={f} className="text-xs">{f}</SelectItem>
                  ))}
                  <SelectItem value="Geist Mono" className="text-xs">Geist Mono</SelectItem>
                  <SelectItem value="JetBrains Mono" className="text-xs">JetBrains Mono</SelectItem>
                  <SelectItem value="Fira Code" className="text-xs">Fira Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

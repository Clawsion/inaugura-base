"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { isHexValido } from "@/lib/color-utils";

interface Cor {
  nome: string;
  hex: string;
  uso: string;
}

interface PaletteInputProps {
  mode: "auto" | "manual";
  manual: Cor[];
  onModeChange: (m: "auto" | "manual") => void;
  onManualChange: (c: Cor[]) => void;
}

export function PaletteInput({
  mode,
  manual,
  onModeChange,
  onManualChange,
}: PaletteInputProps) {
  const adicionar = () =>
    onManualChange([
      ...manual,
      { nome: `Cor ${manual.length + 1}`, hex: "#0A0A0B", uso: "" },
    ]);

  const remover = (i: number) => onManualChange(manual.filter((_, idx) => idx !== i));

  const atualizar = (i: number, patch: Partial<Cor>) =>
    onManualChange(manual.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <Label className="text-sm font-semibold">Paleta de Cores</Label>
      <Tabs
        value={mode}
        onValueChange={(v) => onModeChange(v as "auto" | "manual")}
      >
        <TabsList className="grid w-full grid-cols-2 bg-background/50">
          <TabsTrigger value="auto" className="text-xs">
            <Sparkles className="mr-1.5 h-3 w-3" /> Auto
          </TabsTrigger>
          <TabsTrigger value="manual" className="text-xs">
            Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auto" className="mt-3">
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
            <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
            A paleta será gerada automaticamente com base no briefing e nicho
            detetado. O contraste WCAG AA é garantido por chroma.js no backend.
          </div>
        </TabsContent>

        <TabsContent value="manual" className="mt-3 space-y-3">
          <AnimatePresence>
            {manual.map((cor, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-3"
              >
                <div className="relative">
                  <input
                    type="color"
                    value={cor.hex}
                    onChange={(e) => atualizar(i, { hex: e.target.value })}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  <div
                    className="h-10 w-10 rounded-xl border border-border"
                    style={{ backgroundColor: cor.hex }}
                  />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    placeholder="Nome"
                    value={cor.nome}
                    onChange={(e) => atualizar(i, { nome: e.target.value })}
                    className="h-8 border-border bg-background/50 text-xs"
                  />
                  <Input
                    placeholder="#RRGGBB"
                    value={cor.hex}
                    onChange={(e) => atualizar(i, { hex: e.target.value })}
                    className={`h-8 border-border bg-background/50 font-mono text-xs ${
                      !isHexValido(cor.hex) ? "border-destructive" : ""
                    }`}
                  />
                  <Input
                    placeholder="Uso (ex: CTA, fundo...)"
                    value={cor.uso}
                    onChange={(e) => atualizar(i, { uso: e.target.value })}
                    className="h-8 border-border bg-background/50 text-xs"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => remover(i)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            ))}
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
    </motion.div>
  );
}

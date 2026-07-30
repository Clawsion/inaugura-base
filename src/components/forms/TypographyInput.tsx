"use client";

import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { FONTES_DISPONIVEIS } from "@/lib/fonts";

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
}

export function TypographyInput({
  mode,
  manual,
  onModeChange,
  onManualChange,
}: TypographyInputProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <Label className="text-sm font-semibold">Tipografia</Label>
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as "auto" | "manual")}>
        <TabsList className="grid w-full grid-cols-2 bg-background/50">
          <TabsTrigger value="auto" className="text-xs">
            <Sparkles className="mr-1.5 h-3 w-3" /> Auto
          </TabsTrigger>
          <TabsTrigger value="manual" className="text-xs">Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="auto" className="mt-3">
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
            <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
            Heading/body/mono serão recomendados com base no nicho e tom de voz.
          </div>
        </TabsContent>

        <TabsContent value="manual" className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Heading</Label>
            <Select value={manual.heading} onValueChange={(v) => onManualChange({ ...manual, heading: v })}>
              <SelectTrigger className="border-border bg-background/50 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTES_DISPONIVEIS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Body</Label>
            <Select value={manual.body} onValueChange={(v) => onManualChange({ ...manual, body: v })}>
              <SelectTrigger className="border-border bg-background/50 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTES_DISPONIVEIS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Mono</Label>
            <Select value={manual.mono} onValueChange={(v) => onManualChange({ ...manual, mono: v })}>
              <SelectTrigger className="border-border bg-background/50 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Geist Mono">Geist Mono</SelectItem>
                <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                <SelectItem value="Fira Code">Fira Code</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

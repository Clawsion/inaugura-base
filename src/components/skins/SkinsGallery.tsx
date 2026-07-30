"use client";

// ============================================================================
// SkinsGallery — galeria dos 10 skins (escolhe até 3)
// ============================================================================
// Mostra todos os skins do array SKINS num grid responsivo.
// Cada skin mostra dark + light previews lado a lado.
// Toggle on click (máx 3 selecionados). Feedback sonner se exceder.
// ============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Check } from "lucide-react";
import { SKINS } from "@/lib/skins";
import { SkinPreview } from "./SkinPreview";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SkinsGalleryProps {
  selecionados: string[];
  onChange: (ids: string[]) => void;
}

const MAX_SKINS = 3;

export function SkinsGallery({ selecionados, onChange }: SkinsGalleryProps) {
  const toggle = (id: string) => {
    if (selecionados.includes(id)) {
      onChange(selecionados.filter((s) => s !== id));
    } else {
      if (selecionados.length >= MAX_SKINS) {
        toast.warning(`Máximo de ${MAX_SKINS} skins. Remove um primeiro.`);
        return;
      }
      onChange([...selecionados, id]);
    }
  };

  const limpar = () => onChange([]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <div>
          <Label className="flex items-center gap-1.5 text-sm font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Top 10 Skins — escolhe até 3
          </Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Cada skin mostra preview <strong>Dark</strong> e <strong>Light</strong> lado a lado.
            Inspira o modelo para gerar a paleta, tokens e layout.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              selecionados.length === MAX_SKINS
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {selecionados.length} / {MAX_SKINS}
          </span>
          {selecionados.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={limpar}
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="mr-1 h-3 w-3" /> Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Lista de selecionados (chips) */}
      <AnimatePresence>
        {selecionados.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-1.5"
          >
            {selecionados.map((id) => {
              const skin = SKINS.find((s) => s.id === id);
              if (!skin) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                >
                  <Check className="h-3 w-3" />
                  {skin.name}
                </span>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de skins */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {SKINS.map((skin, i) => (
          <SkinPreview
            key={skin.id}
            skin={skin}
            selected={selecionados.includes(skin.id)}
            onToggle={toggle}
            index={i}
          />
        ))}
      </div>
    </motion.div>
  );
}

"use client";

// ============================================================================
// UploadWithSuggestions — upload de font + 5 alternativas sugeridas
// ============================================================================

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, Sparkles, FileText } from "lucide-react";
import { suggestClonesForPaidFont } from "@/lib/font-sources-catalog";
import { loadFont, fontStackFor, FONTS_MODERNAS } from "@/lib/fonts-modernas";
import { toast } from "sonner";

interface UploadWithSuggestionsProps {
  onApplyFont: (family: string, isCustom: boolean) => void;
  uploadedFonts: { name: string; family: string }[];
  onUploadFont: (file: File) => Promise<void>;
}

export function UploadWithSuggestions({
  onApplyFont,
  onUploadFont,
}: UploadWithSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    paidFont: string;
    alternatives: string[];
    proximidades: number[];
  } | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const familyName = file.name
      .replace(/\.(ttf|otf|woff|woff2)$/i, "")
      .replace(/[^a-zA-Z0-9]/g, "-");

    await onUploadFont(file);
    setUploadedName(familyName);

    // Sugere 5 clones similares
    const clone = suggestClonesForPaidFont(familyName);
    if (clone) {
      setSuggestions(clone);
      setShowSuggestions(true);

      // Carrega as 5 alternatives em background
      clone.alternatives.forEach((alt) => {
        const info = FONTS_MODERNAS.find((f) => f.family === alt);
        if (info) loadFont(info);
      });

      toast.success(`Font carregada. Vê as 5 alternativas gratuitas abaixo.`);
    }
  };

  const applySuggestion = (family: string) => {
    onApplyFont(family, false);
    setShowSuggestions(false);
    toast.success(`Aplicada: ${family}`);
  };

  return (
    <div className="space-y-2">
      <label className="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-card/50 px-3 text-[10px] text-muted-foreground hover:border-primary/40 hover:text-foreground">
        <Upload className="h-3 w-3" />
        Upload .ttf/.otf/.woff (sugere 5 clones)
        <input
          ref={fileRef}
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </label>

      <AnimatePresence>
        {showSuggestions && suggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-lg border border-primary/30 bg-primary/5"
          >
            <div className="p-2">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="h-2.5 w-2.5" />
                  5 clones gratuitos (≈ {suggestions.paidFont})
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {uploadedName && (
                <div className="mb-2 rounded bg-card/50 px-2 py-1 text-[9px] text-muted-foreground">
                  Carregada: <span className="font-mono text-foreground">{uploadedName}</span>
                </div>
              )}

              <div className="space-y-1">
                {suggestions.alternatives.map((family, i) => (
                  <button
                    key={`${family}-${i}`}
                    type="button"
                    onClick={() => applySuggestion(family)}
                    className="group flex w-full items-center gap-2 rounded-md border border-border bg-card/50 p-2 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span
                      className="flex-1 text-sm font-semibold"
                      style={{ fontFamily: fontStackFor(family) }}
                    >
                      {family}
                    </span>
                    <span className="rounded bg-emerald-500/10 px-1 text-[8px] font-bold text-emerald-500">
                      {suggestions.proximidades[i]}%
                    </span>
                    <span className="rounded bg-blue-500/10 px-1 text-[8px] text-blue-500">
                      OFL
                    </span>
                    <Check className="h-3 w-3 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>

              <div className="mt-1.5 flex items-start gap-1 border-t border-border pt-1 text-[8px] text-muted-foreground">
                <FileText className="mt-0.5 h-2 w-2 shrink-0" />
                <span>
                  Licenças OFL/Apache — 100% uso comercial grátis. Verifica no site original.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

// ============================================================================
// UploadWithSuggestions — upload de font + sugestão de 3 clones gratuitos
// ============================================================================
// Fluxo:
//  1. Utilizador carrega um ficheiro .ttf/.otf/.woff/.woff2
//  2. Extrai o nome da font do ficheiro
//  3. Mostra preview da font carregada
//  4. Sugere 3 clones gratuitos (95% proximidade) com licença visível
//  5. Utilizador escolhe uma das 3 sugestões → aplica ao slot
// ============================================================================

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, Sparkles, FileText, ExternalLink } from "lucide-react";
import { suggestClonesForPaidFont, type FontClone } from "@/lib/font-sources-catalog";
import { loadFont, fontStackFor, FONTS_MODERNAS } from "@/lib/fonts-modernas";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadWithSuggestionsProps {
  onApplyFont: (family: string, isCustom: boolean) => void;
  uploadedFonts: { name: string; family: string }[];
  onUploadFont: (file: File) => Promise<void>;
}

export function UploadWithSuggestions({
  onApplyFont,
  uploadedFonts,
  onUploadFont,
}: UploadWithSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<FontClone[]>([]);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const familyName = file.name
      .replace(/\.(ttf|otf|woff|woff2)$/i, "")
      .replace(/[^a-zA-Z0-9]/g, "-");

    await onUploadFont(file);
    setUploadedName(familyName);

    // Sugere 3 clones similares
    const sugestoes = suggestClonesForPaidFont(familyName);
    setSuggestions(sugestoes);
    setShowSuggestions(true);

    // Carrega as 3 sugestões em background
    sugestoes.forEach((s) => {
      const info = FONTS_MODERNAS.find((f) => f.family === s.family);
      if (info) loadFont(info);
    });

    toast.success(`Font carregada. Vê as 3 alternativas gratuitas abaixo.`);
  };

  const applySuggestion = (clone: FontClone) => {
    onApplyFont(clone.family, false);
    setShowSuggestions(false);
    toast.success(`Aplicada: ${clone.family} (clone de ${clone.similarTo})`);
  };

  return (
    <div className="space-y-2">
      {/* Upload button */}
      <label className="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-background/50 px-3 text-[10px] text-muted-foreground hover:border-primary/40 hover:text-foreground">
        <Upload className="h-3 w-3" />
        Upload .ttf/.otf/.woff (sugere 3 clones)
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

      {/* Sugestões de clones */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
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
                  3 clones gratuitos (95% similares)
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
                <div className="mb-2 rounded bg-background/50 px-2 py-1 text-[9px] text-muted-foreground">
                  Carregada: <span className="font-mono text-foreground">{uploadedName}</span>
                </div>
              )}

              <div className="space-y-1">
                {suggestions.map((clone, i) => (
                  <button
                    key={`${clone.family}-${i}`}
                    type="button"
                    onClick={() => applySuggestion(clone)}
                    className="group flex w-full items-center gap-2 rounded-md border border-border bg-card/50 p-2 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                  >
                    {/* Rank */}
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>

                    {/* Preview da font */}
                    <span
                      className="flex-1 text-sm font-semibold"
                      style={{ fontFamily: fontStackFor(clone.family) }}
                    >
                      {clone.family}
                    </span>

                    {/* Info */}
                    <div className="flex flex-col items-end text-right">
                      <span className="text-[9px] text-muted-foreground">
                        ≈ {clone.similarTo}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="rounded bg-emerald-500/10 px-1 text-[8px] font-bold text-emerald-500">
                          {clone.proximidade}%
                        </span>
                        <span className="rounded bg-blue-500/10 px-1 text-[8px] text-blue-500">
                          {clone.licenca}
                        </span>
                      </div>
                    </div>

                    <Check className="h-3 w-3 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>

              {/* Nota de licença */}
              <div className="mt-1.5 flex items-start gap-1 border-t border-border pt-1 text-[8px] text-muted-foreground">
                <FileText className="mt-0.5 h-2 w-2 shrink-0" />
                <span>
                  Licenças: OFL/Apache/CC0 — 100% uso comercial grátis.
                  Verifica sempre a licença no site original antes de usar em produção.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

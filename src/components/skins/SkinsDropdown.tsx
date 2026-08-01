"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwatchBook, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSkinById, SKINS } from "@/lib/skins";

interface SkinsDropdownProps {
  activeSkin: string | null;
  onChange: (skin: string | null) => void;
}

export function SkinsDropdown({ activeSkin, onChange }: SkinsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeSkinData = activeSkin ? getSkinById(activeSkin) : null;

  return (
    <div ref={ref} className="relative">
      {/* Botão SKINS */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all",
          open
            ? "border-primary bg-primary/10 text-primary"
            : activeSkin
            ? "border-primary/40 bg-primary/5 text-primary"
            : "border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
        )}
      >
        <SwatchBook className="h-3.5 w-3.5" />
        <span>SKINS</span>
        {activeSkinData && (
          <span
            className="ml-0.5 h-3 w-3 rounded-full border border-border"
            style={{ backgroundColor: activeSkinData.dark.accent }}
          />
        )}
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      {/* Dropdown vertical colapsável */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-2xl border border-border bg-card/95 shadow-xl backdrop-blur-xl"
          >
            {/* Header do dropdown */}
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-xs font-semibold">Selecionar Skin</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Minimizar"
              >
                <ChevronDown className="h-3.5 w-3.5 rotate-180" />
              </button>
            </div>

            {/* Lista vertical de skins */}
            <div className="max-h-[60vh] overflow-y-auto p-1.5">
              {/* Opção: Default (sem skin) */}
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-all",
                  !activeSkin
                    ? "bg-primary/10 ring-1 ring-primary"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <span className="text-[10px] font-bold text-white">D</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold">Default</div>
                  <div className="text-[10px] text-muted-foreground">Tema base da app</div>
                </div>
                {!activeSkin && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>

              {/* Skins disponíveis */}
              {SKINS.map((skin) => {
                const isActive = activeSkin === skin.id;
                const t = skin.dark;
                return (
                  <button
                    key={skin.id}
                    type="button"
                    onClick={() => {
                      onChange(skin.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-all",
                      isActive
                        ? "bg-primary/10 ring-1 ring-primary"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {/* Preview do skin */}
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border"
                      style={{
                        backgroundColor: t.bg,
                        color: t.accent,
                      }}
                    >
                      <span className="text-[10px] font-bold">{skin.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold">{skin.name}</div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: t.accent }}
                        />
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: t.text }}
                        />
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: t.muted }}
                        />
                        <span
                          className="h-2 w-2 rounded-full border border-border"
                          style={{ backgroundColor: t.card }}
                        />
                      </div>
                    </div>
                    {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

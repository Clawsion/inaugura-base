"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptItem {
  fase?: string;
  titulo: string;
  conteudo: string;
}

interface PromptCardProps {
  prompt: PromptItem;
  index: number;
  defaultOpen?: boolean;
}

export function PromptCard({ prompt, index, defaultOpen = false }: PromptCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 150 }}
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-card/30"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {prompt.fase && (
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                {prompt.fase}
              </span>
            )}
            <h4 className="truncate text-sm font-semibold">{prompt.titulo}</h4>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {prompt.conteudo.length} caracteres · clica para {open ? "fechar" : "expandir"}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="border-t border-border p-4 space-y-3">
          <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl border border-border bg-card/50 p-3 text-xs leading-relaxed">
{prompt.conteudo}
          </pre>
          <div className="flex justify-end">
            <CopyButton text={prompt.conteudo} label="Copiar prompt" size="md" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

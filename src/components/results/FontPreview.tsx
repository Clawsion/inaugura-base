"use client";

import { motion } from "framer-motion";
import { classeFonte } from "@/lib/fonts";

interface FontPreviewProps {
  heading: string;
  body: string;
  mono?: string;
  justificacao?: string;
}

export function FontPreview({ heading, body, mono, justificacao }: FontPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 rounded-2xl border border-border bg-card p-6"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs">
        <div>
          <span className="text-muted-foreground">Heading: </span>
          <span className="font-mono text-primary">{heading}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Body: </span>
          <span className="font-mono text-primary">{body}</span>
        </div>
        {mono && (
          <div>
            <span className="text-muted-foreground">Mono: </span>
            <span className="font-mono text-primary">{mono}</span>
          </div>
        )}
      </div>

      {/* Hierarquia live */}
      <div className="space-y-3">
        <h1
          className="text-4xl font-bold leading-tight"
          style={{ fontFamily: classeFonte(heading) }}
        >
          The quick brown fox jumps over the lazy dog
        </h1>
        <h2
          className="text-2xl font-semibold"
          style={{ fontFamily: classeFonte(heading) }}
        >
          A vence a raposa castanha saltando sobre o cão adormecido
        </h2>
        <p
          className="text-base leading-relaxed text-muted-foreground"
          style={{ fontFamily: classeFonte(body) }}
        >
          Este é um parágrafo de corpo de texto. {body} é usado para todo o
          conteúdo de leitura, garantindo máxima legibilidade em qualquer
          densidade de informação. As métricas verticais e a altura-x generosa
          mantêm o ritmo visual consistente em multi-linha.
        </p>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          style={{ fontFamily: classeFonte(body) }}
        >
          Call to Action →
        </button>
        <pre
          className="rounded-xl border border-border bg-card/50 p-3 text-xs"
          style={{ fontFamily: classeFonte(mono ?? "Geist Mono") }}
        >
          <code>const design = {`{ tokens, type, motion }`};</code>
        </pre>
      </div>

      {justificacao && (
        <div className="border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Porquê: </span>
          {justificacao}
        </div>
      )}
    </motion.div>
  );
}

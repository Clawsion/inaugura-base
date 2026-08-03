"use client";

// ============================================================================
// error.tsx — Error boundary para páginas (dentro do layout)
// ============================================================================
// Captura erros de Server Components e Client Components abaixo do root layout.
// Mantém o layout (sidebar, header, etc.) intacto enquanto mostra o erro.
// Em produção, erros são enviados para Sentry.
// ============================================================================

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error("[PAGE-ERROR]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            Erro ao carregar esta página
          </h2>
          <p className="text-sm text-muted-foreground">
            {error.message || "Ocorreu um erro inesperado."}
          </p>
        </div>
        {error.digest && (
          <code className="inline-block rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground">
            ID: {error.digest}
          </code>
        )}
        <div className="flex gap-2 justify-center pt-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted/50 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            Ir para início
          </a>
        </div>
      </div>
    </div>
  );
}

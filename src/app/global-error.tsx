"use client";

// ============================================================================
// global-error.tsx — Error boundary GLOBAL (captura erros fatais do root layout)
// ============================================================================
// É o último nível de defesa. Se algo quebra o próprio <html>, é aqui que aparece.
// ============================================================================

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Em produção, enviar para Sentry/Logflare quando configurado
    console.error("[GLOBAL-ERROR]", error);
  }, [error]);

  return (
    <html lang="pt">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#0a0a0a",
        color: "#fafafa",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          maxWidth: "600px",
          padding: "32px",
          textAlign: "center",
        }}>
          <h1 style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "12px",
            color: "#ef4444",
          }}>
            Algo correu mal
          </h1>
          <p style={{
            fontSize: "14px",
            color: "#a3a3a3",
            marginBottom: "24px",
            lineHeight: 1.6,
          }}>
            Ocorreu um erro inesperado na aplicação. Já registámos o problema.
            Podes tentar novamente — se persistir, recarrega a página.
          </p>
          {error.digest && (
            <p style={{
              fontSize: "11px",
              color: "#525252",
              fontFamily: "monospace",
              marginBottom: "16px",
            }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              background: "#fafafa",
              color: "#0a0a0a",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              marginRight: "8px",
            }}
          >
            Tentar novamente
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "transparent",
              color: "#fafafa",
              border: "1px solid #404040",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
        </div>
      </body>
    </html>
  );
}

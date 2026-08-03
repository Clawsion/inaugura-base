// ============================================================================
// sentry.client.config.ts — Sentry para erros de client-side
// ============================================================================
// Ativado automaticamente quando SENTRY_DSN está no .env
// ============================================================================

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1, // 10% das transações — suficiente para identificar gargalos
    profilesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
    // Ignora erros comuns que não são actionable
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "Network request failed",
      "Loading chunk",
    ],
    denyUrls: [
      /extensions\//i, // browser extensions
      /^chrome:\/\//i,
    ],
    beforeSend(event) {
      // Em desenvolvimento, não envia para Sentry (usa console)
      if (process.env.NODE_ENV === "development") return null;
      return event;
    },
  });
}

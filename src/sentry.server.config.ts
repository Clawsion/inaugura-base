// ============================================================================
// sentry.server.config.ts — Sentry para erros de server-side (SSR, API routes)
// ============================================================================

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "Network request failed",
    ],
    beforeSend(event) {
      if (process.env.NODE_ENV === "development") return null;
      return event;
    },
  });
}

// ============================================================================
// not-found.tsx — Página 404 personalizada
// ============================================================================

import Link from "next/link";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold tracking-tighter bg-gradient-to-br from-foreground to-foreground/40 bg-clip-text text-transparent">
            404
          </h1>
          <p className="text-sm text-muted-foreground">
            Esta página não existe ou foi movida.
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            Voltar ao início
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-xs font-medium hover:bg-muted/50 transition-colors"
          >
            <Compass className="h-3.5 w-3.5" />
            Ver projetos
          </Link>
        </div>
      </div>
    </div>
  );
}

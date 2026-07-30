// ============================================================================
// Logo — minimalist brand mark for Inaugura-Base
// ============================================================================
// Conceito: camadas empilhadas a formar uma base, com pico central
// que sugere "inauguração" (lançamento). Geométrico e premium.
// ============================================================================

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 36 }: LogoProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-primary text-primary-foreground",
        "shadow-lg shadow-primary/30",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 3 camadas empilhadas — base + meio + topo (pico) */}
        <rect x="3" y="14" width="18" height="5" rx="1.5" fill="currentColor" opacity="0.45" />
        <rect x="6" y="9" width="12" height="4" rx="1.25" fill="currentColor" opacity="0.75" />
        <path
          d="M12 1.5 L17 7.5 H7 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

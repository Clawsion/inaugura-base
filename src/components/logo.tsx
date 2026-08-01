// ============================================================================
// Logo — brand mark for Inaugura-Base (mesmo design do favicon)
// ============================================================================
// Círculo com gradiente + quadrado interno (mesma forma do icon.svg).
// A cor muda conforme o skin ativo (passado via prop ou CSS var --primary).
// ============================================================================

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  // Cor accent do skin ativo (se não passado, usa CSS var --primary)
  accentColor?: string;
}

export function Logo({ className, size = 36, accentColor }: LogoProps) {
  // Cores do gradiente — usa accentColor ou fallback para as cores do favicon
  const color1 = accentColor || "var(--primary, #5E6AD2)";
  const color2 = accentColor || "var(--primary, #8B5CF6)";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl shadow-lg",
        className
      )}
      style={{
        width: size,
        height: size,
        background: "#08080A",
        boxShadow: `0 4px 12px ${accentColor ? accentColor + "40" : "rgba(94, 106, 210, 0.3)"}`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
          <filter id="logo-blur">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {/* Background rounded rect */}
        <rect width="32" height="32" rx="9" fill="#08080A" />
        <rect width="32" height="32" rx="9" fill="url(#logo-grad)" opacity="0.18" />

        {/* Outer glow circle */}
        <circle cx="16" cy="16" r="9" fill="url(#logo-grad)" filter="url(#logo-blur)" opacity="0.55" />

        {/* Inner solid circle */}
        <circle cx="16" cy="16" r="6.5" fill="url(#logo-grad)" />

        {/* Center square cutout (mesmo design do favicon) */}
        <rect x="13.5" y="13.5" width="5" height="5" rx="1.5" fill="#08080A" />
        <rect x="14.5" y="14.5" width="3" height="3" rx="0.75" fill="url(#logo-grad)" opacity="0.9" />
      </svg>
    </div>
  );
}

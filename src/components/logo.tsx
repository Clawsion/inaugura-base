// ============================================================================
// Logo — brand mark for Inaugura-Base (mesmo design do favicon)
// ============================================================================
// VERSÃO INTEGRADA — sem fundo, sem caixa, sem círculo de background.
// Apenas o efeito de luz (glow) + formas do logo, integrado no navbar.
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
  // ID único para evitar conflitos quando múltiplos logos na mesma página
  const uid = `logo-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
      style={{
        width: size,
        height: size,
        // Sem background, sem border, sem box-shadow externo
        // Apenas o glow subtil que faz parecer parte do navbar
        filter: `drop-shadow(0 0 8px ${accentColor ? accentColor + "30" : "rgba(94, 106, 210, 0.2)"})`,
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
          <linearGradient id={`${uid}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
          <filter id={`${uid}-blur`}>
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
          <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* SEM background rect — transparente, integrado no navbar */}

        {/* Outer glow halo — efeito de luz amplo, sem forma definida */}
        <circle
          cx="16"
          cy="16"
          r="11"
          fill={`url(#${uid}-grad)`}
          filter={`url(#${uid}-blur)`}
          opacity="0.35"
        />

        {/* Outer glow circle — o "anel" de luz */}
        <circle
          cx="16"
          cy="16"
          r="9"
          fill={`url(#${uid}-grad)`}
          filter={`url(#${uid}-glow)`}
          opacity="0.5"
        />

        {/* Inner solid circle — o núcleo do logo */}
        <circle cx="16" cy="16" r="6.5" fill={`url(#${uid}-grad)`} />

        {/* Keyhole (furo da chave) — recortado do círculo com cor do fundo */}
        {/* Parte redonda de cima (onde se insere a chave) */}
        <circle
          cx="16"
          cy="14.5"
          r="1.8"
          fill="var(--card, #08080A)"
        />
        {/* Parte triangular de baixo (slot por onde a chave desliza) */}
        <path
          d="M 14.7 15.5 L 17.3 15.5 L 16 19 Z"
          fill="var(--card, #08080A)"
        />
      </svg>
    </div>
  );
}

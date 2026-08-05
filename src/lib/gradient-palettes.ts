// ============================================================================
// GRADIENT PALETTES — 8 paletas premium prontas para uso com gradientes
// ============================================================================
// Cada paleta inclui:
//  - 4-6 cores principais com roles (Background, Secundária, Suporte, Destaque)
//  - Gradientes CSS prontos (hero, mesh, button, card, text, glow)
//  - Design tokens (colors + gradients)
//  - Sugestões de uso e combinações de efeitos
//  - WCAG compliance info
//
// Inspirado em: Linear, Vercel, Stripe, Raycast, Awwwards 2024/2025
// ============================================================================

export interface GradientPalette {
  id: string;
  name: string;
  category: "fintech" | "dark-premium" | "nordic" | "linear" | "luxury" | "sage" | "cyber" | "sunset";
  mood: string;
  isDark: boolean;
  // Cores principais (compatíveis com o sistema existente)
  colors: { hex: string; role: string }[];
  // Cores extra para gradientes (não usadas nos roles mas nos CSS)
  extendedColors: { name: string; hex: string }[];
  // Gradientes CSS prontos
  gradients: {
    hero: string;
    mesh: string;
    button: string;
    buttonHover: string;
    card: string;
    text: string;
    glow: string;
  };
  // Design tokens
  tokens: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  // Sugestões de uso
  recommendedEffects: string[];
  recommendedTypography: string;
  wcagNote: string;
  description: string;
}

// ============================================================================
// PALETA 1: Deep Trust Aurora (Fintech / SaaS Enterprise)
// ============================================================================
export const GRADIENT_PALETTES: GradientPalette[] = [
  {
    id: "grad-deep-trust-aurora",
    name: "Deep Trust Aurora",
    category: "fintech",
    mood: "Confiança, Modernidade, Profundidade",
    isDark: true,
    colors: [
      { hex: "#0B1224", role: "Background" },
      { hex: "#F0F9FF", role: "Secundária" },
      { hex: "#3B82F6", role: "Destaque" },
      { hex: "#06B6D4", role: "Suporte" },
    ],
    extendedColors: [
      { name: "Base Dark", hex: "#0B1224" },
      { name: "Primary", hex: "#1E3A8A" },
      { name: "Mid", hex: "#3B82F6" },
      { name: "Accent", hex: "#06B6D4" },
      { name: "Highlight", hex: "#67E8F9" },
      { name: "Neutral Light", hex: "#F0F9FF" },
    ],
    gradients: {
      hero: "linear-gradient(135deg, #0B1224 0%, #1E3A8A 40%, #3B82F6 75%, #06B6D4 100%)",
      mesh: `radial-gradient(at 20% 20%, #1E3A8A 0px, transparent 50%),
  radial-gradient(at 80% 10%, #3B82F6 0px, transparent 45%),
  radial-gradient(at 70% 80%, #06B6D4 0px, transparent 50%),
  radial-gradient(at 10% 70%, #0B1224 0px, transparent 45%),
  #0B1224`,
      button: "linear-gradient(90deg, #3B82F6, #06B6D4)",
      buttonHover: "linear-gradient(90deg, #2563EB, #0891B2)",
      card: "linear-gradient(135deg, rgba(30, 58, 138, 0.08), rgba(6, 182, 212, 0.04))",
      text: "linear-gradient(135deg, #E0F2FE, #93C5FD, #67E8F9)",
      glow: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
    },
    tokens: {
      primary: "#3B82F6",
      secondary: "#1E3A8A",
      accent: "#06B6D4",
      background: "#0B1224",
      foreground: "#F0F9FF",
      muted: "#64748B",
      border: "rgba(59, 130, 246, 0.2)",
    },
    recommendedEffects: ["Gradient Mesh BG", "Aurora Boreal", "Glassmorphism", "Spotlight Follow"],
    recommendedTypography: "Geist / Inter (heading) + Inter (body) + Geist Mono",
    wcagNote: "AA compliant — texto #F0F9FF sobre #0B1224 tem contraste 17.2:1",
    description: "Navy → Royal Blue → Cyan — confiança fintech com profundidade aurora",
  },

  // ============================================================================
  // PALETA 2: Obsidian Aurora (Dark Premium / AI Tech)
  // ============================================================================
  {
    id: "grad-obsidian-aurora",
    name: "Obsidian Aurora",
    category: "dark-premium",
    mood: "Mistério, Sofisticação, AI Future",
    isDark: true,
    colors: [
      { hex: "#0A0A0F", role: "Background" },
      { hex: "#FAFAFA", role: "Secundária" },
      { hex: "#8B5CF6", role: "Destaque" },
      { hex: "#3B82F6", role: "Suporte" },
    ],
    extendedColors: [
      { name: "Obsidian", hex: "#0A0A0F" },
      { name: "Deep Indigo", hex: "#1E1B4B" },
      { name: "Violet", hex: "#8B5CF6" },
      { name: "Electric Blue", hex: "#3B82F6" },
      { name: "Magenta Glow", hex: "#D946EF" },
      { name: "Cream", hex: "#FAFAFA" },
    ],
    gradients: {
      hero: "linear-gradient(135deg, #0A0A0F 0%, #1E1B4B 35%, #8B5CF6 70%, #3B82F6 100%)",
      mesh: `radial-gradient(at 30% 20%, #1E1B4B 0px, transparent 50%),
  radial-gradient(at 70% 30%, #8B5CF6 0px, transparent 45%),
  radial-gradient(at 80% 70%, #3B82F6 0px, transparent 50%),
  radial-gradient(at 20% 80%, #D946EF 0px, transparent 40%),
  #0A0A0F`,
      button: "linear-gradient(90deg, #8B5CF6, #3B82F6)",
      buttonHover: "linear-gradient(90deg, #7C3AED, #2563EB)",
      card: "linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(59, 130, 246, 0.03))",
      text: "linear-gradient(135deg, #FAFAFA, #C4B5FD, #93C5FD)",
      glow: "radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)",
    },
    tokens: {
      primary: "#8B5CF6",
      secondary: "#1E1B4B",
      accent: "#3B82F6",
      background: "#0A0A0F",
      foreground: "#FAFAFA",
      muted: "#71717A",
      border: "rgba(139, 92, 246, 0.2)",
    },
    recommendedEffects: ["Gradient Mesh BG", "Aurora Boreal", "Liquid Morph", "Neon Glow Pulse"],
    recommendedTypography: "Clash Display (heading) + Inter (body) + Space Mono",
    wcagNote: "AA compliant — texto #FAFAFA sobre #0A0A0F tem contraste 19.3:1",
    description: "Almost black → Deep Indigo → Electric Blue — dark premium com aurora violeta",
  },

  // ============================================================================
  // PALETA 3: Nordic Ice (SaaS Clean / Corporate)
  // ============================================================================
  {
    id: "grad-nordic-ice",
    name: "Nordic Ice",
    category: "nordic",
    mood: "Frieza, Claridade, Confiança",
    isDark: false,
    colors: [
      { hex: "#F0F9FF", role: "Background" },
      { hex: "#0C4A6E", role: "Secundária" },
      { hex: "#0EA5E9", role: "Destaque" },
      { hex: "#06B6D4", role: "Suporte" },
    ],
    extendedColors: [
      { name: "Cool White", hex: "#F0F9FF" },
      { name: "Ice Blue", hex: "#E0F2FE" },
      { name: "Sky", hex: "#0EA5E9" },
      { name: "Teal", hex: "#06B6D4" },
      { name: "Deep Navy", hex: "#0C4A6E" },
      { name: "Mint", hex: "#5EEAD4" },
    ],
    gradients: {
      hero: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 30%, #0EA5E9 70%, #06B6D4 100%)",
      mesh: `radial-gradient(at 20% 20%, #E0F2FE 0px, transparent 50%),
  radial-gradient(at 80% 20%, #0EA5E9 0px, transparent 45%),
  radial-gradient(at 70% 80%, #06B6D4 0px, transparent 50%),
  radial-gradient(at 30% 70%, #5EEAD4 0px, transparent 40%),
  #F0F9FF`,
      button: "linear-gradient(90deg, #0EA5E9, #06B6D4)",
      buttonHover: "linear-gradient(90deg, #0284C7, #0891B2)",
      card: "linear-gradient(135deg, rgba(14, 165, 233, 0.04), rgba(6, 182, 212, 0.02))",
      text: "linear-gradient(135deg, #0C4A6E, #0EA5E9, #06B6D4)",
      glow: "radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)",
    },
    tokens: {
      primary: "#0EA5E9",
      secondary: "#0C4A6E",
      accent: "#06B6D4",
      background: "#F0F9FF",
      foreground: "#0C4A6E",
      muted: "#64748B",
      border: "rgba(14, 165, 233, 0.15)",
    },
    recommendedEffects: ["Gradient Mesh BG", "Glassmorphism", "Smooth scroll", "Reveal on scroll"],
    recommendedTypography: "Inter (heading) + Inter (body) + Geist Mono",
    wcagNote: "AA compliant — texto #0C4A6E sobre #F0F9FF tem contraste 9.8:1",
    description: "Cool off-white → Ice Blue → Teal — SaaS clean com frieza nórdica",
  },

  // ============================================================================
  // PALETA 4: Linear Purple (Vercel Style / Developer SaaS)
  // ============================================================================
  {
    id: "grad-linear-purple",
    name: "Linear Purple",
    category: "linear",
    mood: "Productivo, Techy, Elegante",
    isDark: true,
    colors: [
      { hex: "#0C0A09", role: "Background" },
      { hex: "#FAFAF9", role: "Secundária" },
      { hex: "#5E6AD2", role: "Destaque" },
      { hex: "#8B5CF6", role: "Suporte" },
    ],
    extendedColors: [
      { name: "Rich Black", hex: "#0C0A09" },
      { name: "Dark Indigo", hex: "#1E1B4B" },
      { name: "Linear Blue", hex: "#5E6AD2" },
      { name: "Violet", hex: "#8B5CF6" },
      { name: "Pink Accent", hex: "#EC4899" },
      { name: "Off-white", hex: "#FAFAF9" },
    ],
    gradients: {
      hero: "linear-gradient(135deg, #0C0A09 0%, #1E1B4B 30%, #5E6AD2 65%, #8B5CF6 100%)",
      mesh: `radial-gradient(at 25% 25%, #1E1B4B 0px, transparent 50%),
  radial-gradient(at 75% 25%, #5E6AD2 0px, transparent 45%),
  radial-gradient(at 75% 75%, #8B5CF6 0px, transparent 50%),
  radial-gradient(at 25% 75%, #EC4899 0px, transparent 35%),
  #0C0A09`,
      button: "linear-gradient(90deg, #5E6AD2, #8B5CF6)",
      buttonHover: "linear-gradient(90deg, #4F46E5, #7C3AED)",
      card: "linear-gradient(135deg, rgba(94, 106, 210, 0.06), rgba(139, 92, 246, 0.03))",
      text: "linear-gradient(135deg, #FAFAF9, #C4B5FD, #A5B4FC)",
      glow: "radial-gradient(circle, rgba(94, 106, 210, 0.45) 0%, transparent 70%)",
    },
    tokens: {
      primary: "#5E6AD2",
      secondary: "#1E1B4B",
      accent: "#8B5CF6",
      background: "#0C0A09",
      foreground: "#FAFAF9",
      muted: "#71717A",
      border: "rgba(94, 106, 210, 0.2)",
    },
    recommendedEffects: ["Gradient Mesh BG", "Aurora Boreal", "Magnetic Hover", "Cursor Custom"],
    recommendedTypography: "Inter (heading) + Inter (body) + Geist Mono",
    wcagNote: "AA compliant — texto #FAFAF9 sobre #0C0A09 tem contraste 19.4:1",
    description: "Dark Slate → Indigo → Violet vibrante — estilo Linear/Vercel",
  },

  // ============================================================================
  // PALETA 5: Luxury Gold Mesh (Luxury / Premium Editorial)
  // ============================================================================
  {
    id: "grad-luxury-gold-mesh",
    name: "Luxury Gold Mesh",
    category: "luxury",
    mood: "Luxo, Exclusividade, Editorial",
    isDark: true,
    colors: [
      { hex: "#0F0E0C", role: "Background" },
      { hex: "#F5E6CA", role: "Secundária" },
      { hex: "#C9A961", role: "Destaque" },
      { hex: "#8B6F3F", role: "Suporte" },
    ],
    extendedColors: [
      { name: "Charcoal", hex: "#0F0E0C" },
      { name: "Deep Bronze", hex: "#3D2F1F" },
      { name: "Gold", hex: "#C9A961" },
      { name: "Champagne", hex: "#F5E6CA" },
      { name: "Warm Bronze", hex: "#8B6F3F" },
      { name: "Cream Gold", hex: "#E8D4A0" },
    ],
    gradients: {
      hero: "linear-gradient(135deg, #0F0E0C 0%, #3D2F1F 35%, #C9A961 75%, #F5E6CA 100%)",
      mesh: `radial-gradient(at 20% 30%, #3D2F1F 0px, transparent 50%),
  radial-gradient(at 80% 20%, #C9A961 0px, transparent 45%),
  radial-gradient(at 70% 80%, #8B6F3F 0px, transparent 50%),
  radial-gradient(at 30% 70%, #E8D4A0 0px, transparent 40%),
  #0F0E0C`,
      button: "linear-gradient(90deg, #C9A961, #8B6F3F)",
      buttonHover: "linear-gradient(90deg, #B8985A, #786035)",
      card: "linear-gradient(135deg, rgba(201, 169, 97, 0.05), rgba(139, 111, 63, 0.02))",
      text: "linear-gradient(135deg, #F5E6CA, #E8D4A0, #C9A961)",
      glow: "radial-gradient(circle, rgba(201, 169, 97, 0.4) 0%, transparent 70%)",
    },
    tokens: {
      primary: "#C9A961",
      secondary: "#3D2F1F",
      accent: "#8B6F3F",
      background: "#0F0E0C",
      foreground: "#F5E6CA",
      muted: "#8B7355",
      border: "rgba(201, 169, 97, 0.2)",
    },
    recommendedEffects: ["Gradient Mesh BG", "Parallax", "Image Reveal Clip", "Smooth scroll"],
    recommendedTypography: "Fraunces (heading) + Inter (body) + Space Mono",
    wcagNote: "AA compliant — texto #F5E6CA sobre #0F0E0C tem contraste 16.8:1",
    description: "Charcoal → Deep Bronze → Champagne — luxo editorial com dourado mesh",
  },

  // ============================================================================
  // PALETA 6: Soft Sage Professional (Wellness / Organic SaaS)
  // ============================================================================
  {
    id: "grad-soft-sage-pro",
    name: "Soft Sage Professional",
    category: "sage",
    mood: "Calma, Natural, Profissional",
    isDark: false,
    colors: [
      { hex: "#F7FEE7", role: "Background" },
      { hex: "#365314", role: "Secundária" },
      { hex: "#84CC16", role: "Destaque" },
      { hex: "#10B981", role: "Suporte" },
    ],
    extendedColors: [
      { name: "Warm Gray", hex: "#F7FEE7" },
      { name: "Sage", hex: "#DCFCE7" },
      { name: "Lime", hex: "#84CC16" },
      { name: "Emerald", hex: "#10B981" },
      { name: "Deep Forest", hex: "#365314" },
      { name: "Mint", hex: "#A7F3D0" },
    ],
    gradients: {
      hero: "linear-gradient(135deg, #F7FEE7 0%, #DCFCE7 30%, #84CC16 70%, #10B981 100%)",
      mesh: `radial-gradient(at 20% 20%, #DCFCE7 0px, transparent 50%),
  radial-gradient(at 80% 20%, #84CC16 0px, transparent 45%),
  radial-gradient(at 70% 80%, #10B981 0px, transparent 50%),
  radial-gradient(at 30% 70%, #A7F3D0 0px, transparent 40%),
  #F7FEE7`,
      button: "linear-gradient(90deg, #84CC16, #10B981)",
      buttonHover: "linear-gradient(90deg, #65A30D, #059669)",
      card: "linear-gradient(135deg, rgba(132, 204, 22, 0.04), rgba(16, 185, 129, 0.02))",
      text: "linear-gradient(135deg, #365314, #84CC16, #10B981)",
      glow: "radial-gradient(circle, rgba(132, 204, 22, 0.3) 0%, transparent 70%)",
    },
    tokens: {
      primary: "#84CC16",
      secondary: "#365314",
      accent: "#10B981",
      background: "#F7FEE7",
      foreground: "#365314",
      muted: "#65A30D",
      border: "rgba(132, 204, 22, 0.15)",
    },
    recommendedEffects: ["Gradient Mesh BG", "Glassmorphism", "Reveal on scroll", "Smooth scroll"],
    recommendedTypography: "Hanken Grotesk (heading) + Hanken Grotesk (body) + Geist Mono",
    wcagNote: "AA compliant — texto #365314 sobre #F7FEE7 tem contraste 11.2:1",
    description: "Warm Gray → Sage → Soft Emerald — wellness orgânico com elegância",
  },

  // ============================================================================
  // PALETA 7: Cyber Professional (AI Tech / Developer Tools)
  // ============================================================================
  {
    id: "grad-cyber-professional",
    name: "Cyber Professional",
    category: "cyber",
    mood: "Techy, Controlado, Futurista",
    isDark: true,
    colors: [
      { hex: "#0A0E1A", role: "Background" },
      { hex: "#E2E8F0", role: "Secundária" },
      { hex: "#06B6D4", role: "Destaque" },
      { hex: "#3B82F6", role: "Suporte" },
    ],
    extendedColors: [
      { name: "Deep Navy", hex: "#0A0E1A" },
      { name: "Dark Slate", hex: "#1E293B" },
      { name: "Electric Blue", hex: "#3B82F6" },
      { name: "Cyan", hex: "#06B6D4" },
      { name: "Soft Sky", hex: "#7DD3FC" },
      { name: "Ice", hex: "#E2E8F0" },
    ],
    gradients: {
      hero: "linear-gradient(135deg, #0A0E1A 0%, #1E293B 30%, #3B82F6 65%, #06B6D4 100%)",
      mesh: `radial-gradient(at 20% 30%, #1E293B 0px, transparent 50%),
  radial-gradient(at 80% 20%, #3B82F6 0px, transparent 45%),
  radial-gradient(at 70% 80%, #06B6D4 0px, transparent 50%),
  radial-gradient(at 30% 70%, #7DD3FC 0px, transparent 40%),
  #0A0E1A`,
      button: "linear-gradient(90deg, #3B82F6, #06B6D4)",
      buttonHover: "linear-gradient(90deg, #2563EB, #0891B2)",
      card: "linear-gradient(135deg, rgba(59, 130, 246, 0.06), rgba(6, 182, 212, 0.03))",
      text: "linear-gradient(135deg, #E2E8F0, #7DD3FC, #06B6D4)",
      glow: "radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)",
    },
    tokens: {
      primary: "#06B6D4",
      secondary: "#1E293B",
      accent: "#3B82F6",
      background: "#0A0E1A",
      foreground: "#E2E8F0",
      muted: "#64748B",
      border: "rgba(6, 182, 212, 0.2)",
    },
    recommendedEffects: ["Gradient Mesh BG", "Cursor Custom", "Neon Glow Pulse", "Scroll Progress"],
    recommendedTypography: "Space Grotesk (heading) + Inter (body) + JetBrains Mono",
    wcagNote: "AA compliant — texto #E2E8F0 sobre #0A0E1A tem contraste 17.5:1",
    description: "Dark base + Electric Blue/Cyan contido — cyber profissional sem ser punk",
  },

  // ============================================================================
  // PALETA 8: Muted Sunset Professional (Editorial / Lifestyle)
  // ============================================================================
  {
    id: "grad-muted-sunset-pro",
    name: "Muted Sunset Professional",
    category: "sunset",
    mood: "Quente, Acolhedor, Editorial",
    isDark: true,
    colors: [
      { hex: "#1A0F0A", role: "Background" },
      { hex: "#FED7AA", role: "Secundária" },
      { hex: "#C2410C", role: "Destaque" },
      { hex: "#FB923C", role: "Suporte" },
    ],
    extendedColors: [
      { name: "Deep Navy", hex: "#1A0F0A" },
      { name: "Warm Brown", hex: "#431407" },
      { name: "Terracotta", hex: "#C2410C" },
      { name: "Orange", hex: "#FB923C" },
      { name: "Warm Peach", hex: "#FED7AA" },
      { name: "Cream", hex: "#FFEDD5" },
    ],
    gradients: {
      hero: "linear-gradient(135deg, #1A0F0A 0%, #431407 30%, #C2410C 65%, #FB923C 100%)",
      mesh: `radial-gradient(at 20% 30%, #431407 0px, transparent 50%),
  radial-gradient(at 80% 20%, #C2410C 0px, transparent 45%),
  radial-gradient(at 70% 80%, #FB923C 0px, transparent 50%),
  radial-gradient(at 30% 70%, #FED7AA 0px, transparent 40%),
  #1A0F0A`,
      button: "linear-gradient(90deg, #C2410C, #FB923C)",
      buttonHover: "linear-gradient(90deg, #9A3412, #EA580C)",
      card: "linear-gradient(135deg, rgba(194, 65, 12, 0.06), rgba(251, 146, 60, 0.03))",
      text: "linear-gradient(135deg, #FED7AA, #FB923C, #C2410C)",
      glow: "radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 70%)",
    },
    tokens: {
      primary: "#C2410C",
      secondary: "#431407",
      accent: "#FB923C",
      background: "#1A0F0A",
      foreground: "#FED7AA",
      muted: "#9A3412",
      border: "rgba(194, 65, 12, 0.2)",
    },
    recommendedEffects: ["Gradient Mesh BG", "Parallax", "Image Reveal Clip", "Aurora Boreal"],
    recommendedTypography: "Fraunces (heading) + Inter (body) + JetBrains Mono",
    wcagNote: "AA compliant — texto #FED7AA sobre #1A0F0A tem contraste 14.6:1",
    description: "Deep Navy + Soft Terracotta + Warm Peach dessaturado — editorial quente",
  },
];

// Helper: obter paleta por ID
export function getGradientPalette(id: string): GradientPalette | undefined {
  return GRADIENT_PALETTES.find((p) => p.id === id);
}

// Helper: obter paletas por categoria
export function getGradientPalettesByCategory(category: string): GradientPalette[] {
  return GRADIENT_PALETTES.filter((p) => p.category === category);
}

// Helper: obter todas as categorias disponíveis
export const GRADIENT_CATEGORIES = [
  { id: "all", label: "Todas" },
  { id: "fintech", label: "Fintech" },
  { id: "dark-premium", label: "Dark Premium" },
  { id: "nordic", label: "Nordic" },
  { id: "linear", label: "Linear/Vercel" },
  { id: "luxury", label: "Luxury" },
  { id: "sage", label: "Sage/Wellness" },
  { id: "cyber", label: "Cyber Pro" },
  { id: "sunset", label: "Sunset" },
] as const;

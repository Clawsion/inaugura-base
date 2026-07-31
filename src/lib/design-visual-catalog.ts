// ============================================================================
// design-visual-catalog.ts — Catálogo de Design Visual
// ============================================================================
// Opções visuais: patterns, textures, effects, estéticas.
// Mesmo sistema de modos: Recomendada/Alternativa/Opcional/Manual/Off
// ============================================================================

export type SkillMode = "recomendada" | "alternativa" | "opcional" | "manual" | "off";

export interface DesignVisualOption {
  id: string;
  nome: string;
  categoria: "Estética" | "Patterns" | "Textures" | "Effects" | "Layout Style" | "Color Treatment";
  icone: string;
  descricao: string;
  quandoUsar: string;
  exemplo: string;
  modoDefault: SkillMode;
  licenca: "Free" | "Freemium" | "Subscrição";
}

export const DESIGN_VISUAL_CATALOG: DesignVisualOption[] = [
  // ── Estética ──
  { id: "glassmorphism", nome: "Glassmorphism", categoria: "Estética", icone: "Sparkles", descricao: "Cards translúcidos com backdrop-blur + saturate. Vidro fosco premium.", quandoUsar: "Em UIs com backgrounds coloridos onde queres profundidade.", exemplo: "Apple Vision Pro, iOS control center, Arc browser.", modoDefault: "alternativa" , licenca: "Free"},
  { id: "neumorphism", nome: "Neumorphism", categoria: "Estética", icone: "Circle", descricao: "Soft UI com sombras inset/outset duplas. Tactile, monochromatic.", quandoUsar: "Para UIs calmas e tácteis (dashboards, settings).", exemplo: "Apple Watch UI, smart home panels.", modoDefault: "opcional" , licenca: "Free"},
  { id: "brutalism", nome: "Neo-Brutalism", categoria: "Estética", icone: "Square", descricao: "Bordas duras, offset shadows, cores ousadas. Raw e impactante.", quandoUsar: "Para agências criativas, startups ousadas, portfolios.", exemplo: "Gumroad, Framer, Linear marketing.", modoDefault: "alternativa" , licenca: "Free"},
  { id: "minimalism", nome: "Minimalism", categoria: "Estética", icone: "Minus", descricao: "Whitespace generoso, tipografia limpa, poucos elementos. Less is more.", quandoUsar: "Para SaaS, editoriais, produtos premium.", exemplo: "Linear, Vercel, Stripe, Apple.", modoDefault: "recomendada" , licenca: "Free"},
  { id: "skeuomorphism", nome: "Skeuomorphism", categoria: "Estética", icone: "Layers", descricao: "Elementos que imitam objetos reais (texturas, profundidade física).", quandoUsar: "Para produtos físicos, configuradores, retail.", exemplo: "Apple old UI, leather/stitching apps.", modoDefault: "opcional" , licenca: "Free"},
  { id: "flat-design", nome: "Flat Design 2.0", categoria: "Estética", icone: "Square", descricao: "Flat com subtle shadows e depth. Material Design evoluído.", quandoUsar: "Para apps móveis, dashboards, produtos mainstream.", exemplo: "Google Material 3, Microsoft Fluent.", modoDefault: "opcional" , licenca: "Free"},

  // ── Patterns ──
  { id: "dot-grid", nome: "Dot Grid", categoria: "Patterns", icone: "Grid3x3", descricao: "Padrão de pontos subtis no background. Estrutura sem distrair.", quandoUsar: "Backgrounds de hero, auth pages, empty states.", exemplo: "Vercel, Linear, Stripe backgrounds.", modoDefault: "alternativa" , licenca: "Free"},
  { id: "grid-lines", nome: "Grid Lines", categoria: "Patterns", icone: "Grid3x3", descricao: "Linhas de grelha subtis. Tech aesthetic, blueprint vibe.", quandoUsar: "Para SaaS, dev tools, dashboards.", exemplo: "Vercel dashboard, GitHub, Linear.", modoDefault: "opcional" , licenca: "Free"},
  { id: "carbon-fiber", nome: "Carbon Fiber", categoria: "Patterns", icone: "Grid3x3", descricao: "Textura cross-hatched 45°. Tech premium, automotive.", quandoUsar: "Para gaming, automotive, tech premium dark.", exemplo: "BMW, gaming peripherals.", modoDefault: "opcional" , licenca: "Free"},
  { id: "noise-texture", nome: "Noise Texture", categoria: "Patterns", icone: "Waves", descricao: "Grão subtil sobreposto. Adiciona profundidade orgânica.", quandoUsar: "Em qualquer background para evitar banding.", exemplo: "Awwwards sites, premium agencies.", modoDefault: "alternativa" , licenca: "Free"},
  { id: "topographic", nome: "Topographic Lines", categoria: "Patterns", icone: "Waves", descricao: "Linhas topográficas curvas. Orgânico, mapa-style.", quandoUsar: "Para outdoor, travel, sustainability brands.", exemplo: "Patagonia, National Geographic.", modoDefault: "opcional" , licenca: "Free"},

  // ── Textures ──
  { id: "paper", nome: "Paper Texture", categoria: "Textures", icone: "FileText", descricao: "Textura de papel sutil. Warm, editorial, literary.", quandoUsar: "Para blogs, publicações, editoriais, education.", exemplo: "Medium, NYT, editorial sites.", modoDefault: "opcional" , licenca: "Free"},
  { id: "grain", nome: "Film Grain", categoria: "Textures", icone: "Waves", descricao: "Grão de filme analógico. Vintage, nostalgic, cinematic.", quandoUsar: "Para fotografia, cinema, vintage brands.", exemplo: "Film photography sites, fashion editorial.", modoDefault: "opcional" , licenca: "Free"},
  { id: "gradient-mesh", nome: "Gradient Mesh", categoria: "Textures", icone: "Palette", descricao: "Múltiplos pontos de cor em mesh. Aurora, sunset, organic.", quandoUsar: "Backgrounds vivos sem imagens. Hero, auth, onboarding.", exemplo: "Stripe, Linear, Vercel, Framer.", modoDefault: "recomendada" , licenca: "Free"},
  { id: "glass-texture", nome: "Frosted Glass", categoria: "Textures", icone: "Sparkles", descricao: "Vidro fosco com refração. backdrop-blur + saturate + brightness.", quandoUsar: "Modais, sidebars, command palettes sobre gradientes.", exemplo: "Apple Vision Pro, iOS, macOS Big Sur.", modoDefault: "alternativa" , licenca: "Free"},

  // ── Effects ──
  { id: "glow", nome: "Neon Glow", categoria: "Effects", icone: "Zap", descricao: "Glow neon em bordas e texto. Cyberpunk, gaming, energy.", quandoUsar: "Para gaming, crypto, cyberpunk, dark premium.", exemplo: "Cyberpunk 2077 UI, gaming sites.", modoDefault: "opcional" , licenca: "Free"},
  { id: "depth-shadows", nome: "Layered Depth Shadows", categoria: "Effects", icone: "Layers", descricao: "Múltiplas camadas de sombra para profundidade real.", quandoUsar: "Cards flutuantes, modais, premium UI.", exemplo: "Apple cards, Vercel, Linear.", modoDefault: "recomendada" , licenca: "Free"},
  { id: "inset-glow", nome: "Inset Glow", categoria: "Effects", icone: "Circle", descricao: "Glow interno em bordas. Subtle highlight, premium feel.", quandoUsar: "Em dark mode para dar depth sem sombras externas.", exemplo: "Linear, Vercel dark mode.", modoDefault: "alternativa" , licenca: "Free"},
  { id: "chromatic-aberration", nome: "Chromatic Aberration", categoria: "Effects", icone: "Palette", descricao: "Split de cores RGB nas bordas. Glitch, retro, tech.", quandoUsar: "Para gaming, retro, glitch aesthetic.", exemplo: "Awwwards experimental sites.", modoDefault: "opcional" , licenca: "Free"},
  { id: "parallax-depth", nome: "Parallax Depth", categoria: "Effects", icone: "Layers", descricao: "Camadas a mover-se a velocidades diferentes. 3D sem WebGL.", quandoUsar: "Hero sections, product showcases, storytelling.", exemplo: "Apple iPhone, Stripe, Nike.", modoDefault: "alternativa" , licenca: "Free"},

  // ── Layout Style ──
  { id: "bento", nome: "Bento Grid", categoria: "Layout Style", icone: "Grid3x3", descricao: "Grid assimétrico estilo Apple Bento Box. Visualmente rico.", quandoUsar: "Features, product showcases, dashboards.", exemplo: "Apple iPhone Pro, Linear, Vercel.", modoDefault: "recomendada" , licenca: "Free"},
  { id: "masonry", nome: "Masonry", categoria: "Layout Style", icone: "LayoutGrid", descricao: "Cards de alturas variadas (Pinterest-style).", quandoUsar: "Galleries, blogs, portfolios, e-commerce.", exemplo: "Pinterest, Unsplash, Behance.", modoDefault: "alternativa" , licenca: "Free"},
  { id: "split-screen", nome: "Split Screen", categoria: "Layout Style", icone: "SplitSquareHorizontal", descricao: "Ecrã dividido em 2 colunas com scroll independente.", quandoUsar: "Storytelling dual, before/after, comparisons.", exemplo: "Apple comparisons, Nike stories.", modoDefault: "opcional" , licenca: "Free"},
  { id: "fullscreen-sections", nome: "Fullscreen Sections", categoria: "Layout Style", icone: "Maximize", descricao: "Cada secção ocupa 100vh. Deck-style, narrativa guiada.", quandoUsar: "Product reveals, manifestos, fashion.", exemplo: "Tesla, Apple product pages.", modoDefault: "opcional" , licenca: "Free"},
  { id: "asymmetric", nome: "Asymmetric Layout", categoria: "Layout Style", icone: "LayoutGrid", descricao: "Layout intencionalmente assimétrico. Quebra a grelha.", quandoUsar: "Para agências, portfolios, brands ousadas.", exemplo: "Awwwards SOTD, creative agencies.", modoDefault: "opcional" , licenca: "Free"},

  // ── Color Treatment ──
  { id: "duotone", nome: "Duotone", categoria: "Color Treatment", icone: "Palette", descricao: "Imagens em 2 cores. Premium, brand-consistent.", quandoUsar: "Para hero images, galleries, brand consistency.", exemplo: "Spotify, Asana, Slack marketing.", modoDefault: "opcional" , licenca: "Free"},
  { id: "monochrome", nome: "Monochrome", categoria: "Color Treatment", icone: "Palette", descricao: "Tudo em uma cor + neutros. Minimalista, atemporal.", quandoUsar: "Para minimalismo extremo, literary, luxury.", exemplo: "Luxury brands, editorial, high fashion.", modoDefault: "alternativa" , licenca: "Free"},
  { id: "vibrant-gradient", nome: "Vibrant Gradients", categoria: "Color Treatment", icone: "Palette", descricao: "Gradientes coloridos vibrantes. Energy, modern, playful.", quandoUsar: "Para SaaS, startups, creative tools.", exemplo: "Stripe, Linear, Framer, Vercel.", modoDefault: "recomendada" , licenca: "Free"},
  { id: "muted-palette", nome: "Muted Palette", categoria: "Color Treatment", icone: "Palette", descricao: "Cores dessaturadas, tons earthy. Calm, professional.", quandoUsar: "Para wellness, sustainability, healthcare.", exemplo: "Headspace, Calm, Patagonia.", modoDefault: "alternativa" , licenca: "Free"},
  { id: "high-contrast", nome: "High Contrast", categoria: "Color Treatment", icone: "Palette", descricao: "Contraste extremo BW + 1 accent. Bold, impactful.", quandoUsar: "Para brutalist, gaming, bold statements.", exemplo: "Gumroad, Framer, Linear dark.", modoDefault: "opcional" , licenca: "Free"},
];

// Helper: recomendar design visual por nicho
export function getDesignVisualForNicho(nicho: string): DesignVisualOption[] {
  const base = DESIGN_VISUAL_CATALOG.filter((d) => d.modoDefault === "recomendada");

  const adicionais: Record<string, string[]> = {
    "SaaS B2B": ["dot-grid", "depth-shadows"],
    "E-commerce Moda": ["duotone", "parallax-depth"],
    "Gaming": ["glow", "carbon-fiber", "chromatic-aberration"],
    "Crypto / Web3": ["glow", "gradient-mesh"],
    "Agência Criativa": ["brutalism", "asymmetric", "noise-texture"],
    "Blog / Media": ["paper", "masonry"],
    "Restaurantes / Food": ["muted-palette", "paper"],
    "HealthTech": ["muted-palette", "minimalism"],
    "Fitness / Wellness": ["vibrant-gradient", "bento"],
    "Imobiliário de Luxo": ["monochrome", "minimalism", "depth-shadows"],
  };

  const extraIds = adicionais[nicho] ?? [];
  const extras = DESIGN_VISUAL_CATALOG.filter((d) => extraIds.includes(d.id));
  // Dedup
  const seen = new Set(base.map((b) => b.id));
  const uniqueExtras = extras.filter((e) => !seen.has(e.id));
  return [...base, ...uniqueExtras];
}

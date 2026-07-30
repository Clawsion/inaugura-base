// ============================================================================
// design-skills.ts — 10 skills de design (de 5 para 10 mantendo leveza)
// ============================================================================
// Skills modernas 2026 que melhoram o design COM impacto e SEM peso:
// cada skill tem: nome, descrição, benefício, custo de performance, libraries.
// ============================================================================

export interface DesignSkill {
  id: string;
  nome: string;
  icone: string; // nome do ícone lucide
  categoria: "Motion" | "Visual" | "Layout" | "Micro" | "A11y" | "Perf";
  descricao: string;
  beneficio: string;
  custoPerformance: "Baixo" | "Médio" | "Alto";
  libraries: string[];
  quandoAplicar: string;
  exemplo: string;
}

export const DESIGN_SKILLS: DesignSkill[] = [
  {
    id: "layout-animations",
    nome: "Layout Animations",
    icone: "Wand2",
    categoria: "Motion",
    descricao:
      "Animar mudanças de layout com Motion's `layout` prop. Elementos reposicionam-se suavemente quando o DOM muda.",
    beneficio: "Sensação de fluidez premium sem JavaScript manual de FLIP.",
    custoPerformance: "Baixo",
    libraries: ["motion"],
    quandoAplicar: "Filtros, tabs, drag-drop, reordenação de listas, expands.",
    exemplo: "Linear, Vercel dashboard, Stripe customer list.",
  },
  {
    id: "spring-physics",
    nome: "Spring Physics",
    icone: "Zap",
    categoria: "Motion",
    descricao:
      "Mola física natural para hover, drag e transitions. Substitui cubic-bezier por física real (stiffness, damping, mass).",
    beneficio: "Animações orgânicas, sentem-se vivas e não mecânicas.",
    custoPerformance: "Baixo",
    libraries: ["motion"],
    quandoAplicar: "Hover de botões, drag, modais, dropdowns.",
    exemplo: "Apple product pages, Figma cursor, Linear cards.",
  },
  {
    id: "scroll-linked",
    nome: "Scroll-Linked Animations",
    icone: "MousePointerClick",
    categoria: "Motion",
    descricao:
      "useScroll + useTransform do Motion para animar com base no scroll. Parallax suave, progress bars, sticky reveals.",
    beneficio: "Profundidade e narrativa sem JavaScript pesado de scroll listener.",
    custoPerformance: "Médio",
    libraries: ["motion", "lenis"],
    quandoAplicar: "Hero parallax, secções sticky, progress indicators.",
    exemplo: "Apple iPhone, Stripe features, Vercel marketing.",
  },
  {
    id: "view-transitions",
    nome: "View Transitions API",
    icone: "Layers",
    categoria: "Visual",
    descricao:
      "API nativa do browser para transições entre páginas/estados. Chrome 111+. Polyfill para outros.",
    beneficio: "Transições tipo app nativa, quase zero código, hardware-accelerated.",
    custoPerformance: "Baixo",
    libraries: ["next/view-transitions"],
    quandoAplicar: "Navegação entre rotas, mudanças de estado visuais.",
    exemplo: "Chrome blog, Linear app, Vercel dashboard.",
  },
  {
    id: "glassmorphism-real",
    nome: "Real Glassmorphism",
    icone: "Sparkles",
    categoria: "Visual",
    descricao:
      "backdrop-blur com saturate + layers translúcidas. Não é só blur — é blur + saturate + brightness + border sutil.",
    beneficio: "Profundidade real, não fachada. Combina com meshes gradient.",
    custoPerformance: "Médio",
    libraries: ["tailwindcss"],
    quandoAplicar: "Modais, sidebars, cards sobre gradientes, command palettes.",
    exemplo: "Apple Vision Pro UI, iOS control center, Arc browser.",
  },
  {
    id: "mesh-gradients",
    nome: "Mesh Gradients",
    icone: "Palette",
    categoria: "Visual",
    descricao:
      "Gradientes radiais múltiplos em camadas (não lineares). Cria profundidade tipo aurora sem imagens.",
    beneficio: "Backgrounds vivos, premium, sem peso de imagem. SVG ou CSS puro.",
    custoPerformance: "Baixo",
    libraries: ["tailwindcss"],
    quandoAplicar: "Hero backgrounds, auth pages, onboarding, empty states.",
    exemplo: "Stripe, Linear, Vercel, Framer landing.",
  },
  {
    id: "text-balance",
    nome: "Text Balance & Pretty",
    icone: "Type",
    categoria: "Layout",
    descricao:
      "CSS `text-wrap: balance` e `text-wrap: pretty` para equilibrar linhas e evitar orphans.",
    beneficio: "Tipografia profissional instantânea, zero JS.",
    custoPerformance: "Baixo",
    libraries: ["tailwindcss"],
    quandoAplicar: "Headlines, parágrafos curtos, CTAs, card titles.",
    exemplo: "Apple marketing, Stripe blog, Vercel changelog.",
  },
  {
    id: "micro-interactions",
    nome: "Micro-Interactions Rive",
    icone: "MousePointerClick",
    categoria: "Micro",
    descricao:
      "Animações vetoriais interativas com Rive. States, transitions, inputs. Pequenas mas com personalidade.",
    beneficio: "Micro-momentos memoráveis sem peso de GIF/Lottie.",
    custoPerformance: "Médio",
    libraries: ["@rive-app/react-canvas"],
    quandoAplicar: "Onboarding, empty states, loading, success states, icons.",
    exemplo: "Mailchimp loading, Slack onboarding, Cash App.",
  },
  {
    id: "focus-visible",
    nome: ":focus-visible Polished",
    icone: "Eye",
    categoria: "A11y",
    descricao:
      "Focus rings visíveis apenas em navegação por teclado. Não em click. Custom styling com ring-2 ring-offset.",
    beneficio: "Acessibilidade WCAG sem atrapalhar a estética para mouse users.",
    custoPerformance: "Baixo",
    libraries: ["tailwindcss", "radix-ui"],
    quandoAplicar: "Todos os elementos interativos. Obrigatório em produção.",
    exemplo: "GitHub, Vercel, Linear, qualquer site a11y-correct.",
  },
  {
    id: "skeleton-shimmer",
    nome: "Skeleton Shimmer",
    icone: "Loader",
    categoria: "Perf",
    descricao:
      "Placeholders animados com shimmer (gradiente que se move) em vez de spinners. Sente-se carregamento, não espera.",
    beneficio: "Perceived performance 10x melhor. Utilizador sente progresso.",
    custoPerformance: "Baixo",
    libraries: ["tailwindcss"],
    quandoAplicar: "Loading states de cards, lists, dashboards, image galleries.",
    exemplo: "LinkedIn feed, YouTube, Vercel dashboard loading.",
  },
];

// Helper: filtrar por categoria
export function getSkillsByCategory(categoria: string) {
  return DESIGN_SKILLS.filter((s) => s.categoria === categoria);
}

// Helper: skills com baixo impacto de performance (leves)
export function getLightweightSkills() {
  return DESIGN_SKILLS.filter((s) => s.custoPerformance === "Baixo");
}

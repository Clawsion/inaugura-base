// ============================================================================
// form-options.ts — Constantes partilhadas pelo formulário
// ============================================================================

export const Nichos = [
  "SaaS B2B",
  "E-commerce Moda",
  "E-commerce Geral",
  "FinTech",
  "HealthTech",
  "EdTech",
  "Imobiliário",
  "Restaurantes / Food",
  "Viagens & Turismo",
  "Agência Criativa",
  "Portfólio Pessoal",
  "Blog / Media",
  "Gaming",
  "Crypto / Web3",
  "Mobilidade",
  "Logística",
  "Energia / Sustentabilidade",
  "Fitness / Wellness",
  "Beleza / Cosmética",
  "Imobiliário de Luxo",
  "Advocacia / Jurídico",
  "Consultoria",
  "Manufatura / Indústria",
  "ONG / Impacto Social",
] as const;

export const Secoes = [
  "Hero",
  "Features",
  "How it works",
  "Pricing",
  "Testimonials",
  "FAQ",
  "CTA",
  "Footer",
  "Dashboard",
  "Auth",
  "Blog",
  "Gallery",
  // NOVAS secções
  "Cards",
  "Bento Grid",
  "Stats",
  "Logos",
  "Team",
  "Contact",
  "Newsletter",
  "404",
  "Cookies",
] as const;

// ============================================================================
// EFEITOS — agora com descrição + sugestões de uso (para hover tooltips)
// ============================================================================
export interface EfeitoInfo {
  nome: string;
  icon: string;
  descricao: string;
  quandoAplicar: string;
  ondeAplicar: string;
  exemplo: string;
}

export const EfeitosInfo: EfeitoInfo[] = [
  {
    nome: "Cinematic",
    icon: "Film",
    descricao:
      "Layout full-bleed com transições de scroll dramáticas, tipografia gigante e ritmo visual de filme.",
    quandoAplicar:
      "Quando o storytelling é o core da mensagem (landing pages de produto, portfólios, marcas premium).",
    ondeAplicar:
      "Hero sections, case studies, páginas 'About', launches de produto.",
    exemplo: "Apple product launches, Stripe homepage, Linear marketing.",
  },
  {
    nome: "Reveal on scroll",
    icon: "Eye",
    descricao:
      "Elementos surgem progressivamente (fade + translate) conforme entram no viewport, criando ritmo narrativo.",
    quandoAplicar:
      "Quando há muito conteúdo e queres guiar o olhar do utilizador sem o sobrecarregar.",
    ondeAplicar:
      "Listas de features, timelines, blog posts, qualquer secção com múltiplos cards.",
    exemplo: "Vercel, Framer, Notion marketing pages.",
  },
  {
    nome: "Parallax",
    icon: "Layers",
    descricao:
      "Camadas a mover-se a velocidades diferentes durante o scroll, criando ilusão de profundidade 3D.",
    quandoAplicar:
      "Em hero sections impactantes e quando queres adicionar dimensão sem WebGL.",
    ondeAplicar:
      "Hero com imagem de fundo, secções de produto com mockups, banners promocionais.",
    exemplo: "Apple iPhone page, Stripe features, AirBnB experiences.",
  },
  {
    nome: "Smooth scroll",
    icon: "Sparkles",
    descricao:
      "Scroll suavizado via Lenis ou similar — o scroll do rato torna-se fluido em vez de discreto.",
    quandoAplicar:
      "Em qualquer site premium onde o conforto de navegação é prioridade.",
    ondeAplicar:
      "Todo o site. Combina perfeitamente com reveal animations e sticky sections.",
    exemplo: "Locomotive scroll sites, premium agencies, Awwwards winners.",
  },
  {
    nome: "Sticky sections",
    icon: "Wine",
    descricao:
      "Secções que ficam fixas enquanto o conteúdo interno scrolla horizontalmente ou muda de estado.",
    quandoAplicar:
      "Para contar uma história passo-a-passo ou mostrar um produto em múltiplas perspetivas.",
    ondeAplicar:
      "Product tours, how-it-works, comparativos de features, portfolios.",
    exemplo: "Apple iPad page, Stripe customers, Linear features.",
  },
  {
    nome: "Horizontal scroll",
    icon: "MoveHorizontal",
    descricao:
      "O scroll vertical é traduzido em movimento horizontal — galerias e timelines ganham ritmo.",
    quandoAplicar:
      "Quando tens conteúdo sequencial (mockups, casos, fases) que se beneficia de leitura linear.",
    ondeAplicar:
      "Galerias de produtos, portfolios, timelines, casos de estudo.",
    exemplo: "Awwwards sites, agências criativas, Apple design gallery.",
  },
  {
    nome: "Fullscreen sections",
    icon: "Maximize",
    descricao:
      "Cada secção ocupa 100vh, criando páginas tipo 'deck' onde cada slide é uma secção.",
    quandoAplicar:
      "Mensagens curtas e impactantes, stories, narrativas visuais guiadas.",
    ondeAplicar:
      "Landing pages simples, product reveals, manifestos de marca.",
    exemplo: "Tesla product pages, Tesla Powerwall, fashion brands.",
  },
  {
    nome: "3D / WebGL leve",
    icon: "Box",
    descricao:
      "Elementos 3D via React Three Fiber — desde um modelo que roda até partículas interactivas.",
    quandoAplicar:
      "Quando o produto é físico ou tem uma componente espacial/visual forte.",
    ondeAplicar:
      "Hero sections de produtos físicos, configuradores, mascotes 3D, backgrounds vivos.",
    exemplo: "Apple Vision Pro, Nike By You, Three.js examples.",
  },
  {
    nome: "Minimal classic",
    icon: "MousePointerClick",
    descricao:
      "Sem efeitos especiais. Foco total em tipografia, whitespace e hierarquia. Eterna elegância.",
    quandoAplicar:
      "Quando o conteúdo é a estrela (editoriais, SaaS B2B, dashboards, documentação).",
    ondeAplicar:
      "Qualquer site onde clareza > impacto. Foundation para qualquer design system.",
    exemplo: "Linear, Vercel, Stripe dashboard, Tailwind UI.",
  },
  {
    nome: "Glassmorphism",
    icon: "Sparkles",
    descricao:
      "Cards translúcidos com backdrop-blur e bordas subtis. Efeito de vidro fosco premium.",
    quandoAplicar:
      "Em UIs com backgrounds coloridos ou gradientes onde queres profundidade sem opacidade total.",
    ondeAplicar:
      "Cards flutuantes, modais, sidebars, dashboards sobre fundo colorido.",
    exemplo: "Apple Vision Pro UI, iOS control center, Microsoft Fluent.",
  },
  // ── NOVOS 5 ESTILOS (2 com animações bento) ───────────────────────────
  {
    nome: "Bento Grid Animated",
    icon: "Grid3x3",
    descricao:
      "Grid de cards assimétricos estilo Bento Box (Apple) com animações staggered ao hover e scroll reveal.",
    quandoAplicar:
      "Para mostrar features, stats ou conteúdo diverso de forma visualmente rica e organizada.",
    ondeAplicar:
      "Features sections, product showcases, dashboards, landing pages modernas.",
    exemplo: "Apple iPhone Pro page, Linear features, Vercel dashboard, Arc browser.",
  },
  {
    nome: "Bento Expandable",
    icon: "Maximize2",
    descricao:
      "Cards Bento que expandem ao hover com layout animations (Motion). Um card cresce enquanto outros encolhem.",
    quandoAplicar:
      "Quando queres interactividade lúdica e foco num item de cada vez sem sair da página.",
    ondeAplicar:
      "Product tours, feature comparisons, portfolio pieces, showcase sections.",
    exemplo: "Framer website, Vercel products, Stripe features grid.",
  },
  {
    nome: "Masonry Pinterest",
    icon: "LayoutGrid",
    descricao:
      "Layout masonry (estilo Pinterest) com cards de alturas variadas. Reveal on scroll com stagger.",
    quandoAplicar:
      "Galerias de imagens, blogs, portfolios, e-commerce com cards de conteúdo assimétrico.",
    ondeAplicar:
      "Galleries, blog feeds, product grids, portfolio showcases.",
    exemplo: "Pinterest, Unsplash, Behance galleries.",
  },
  {
    nome: "Split Screen Scroll",
    icon: "SplitSquareHorizontal",
    descricao:
      "Ecrã dividido em 2 colunas que scrollam independentemente. Sticky em cada lado.",
    quandoAplicar:
      "Storytelling dual, before/after, comparações, narrativas paralelas.",
    ondeAplicar:
      "About pages, case studies, product comparisons, brand stories.",
    exemplo: "Apple product comparisons, Nike stories, fashion lookbooks.",
  },
  {
    nome: "Marquee Infinite",
    icon: "MoveHorizontal",
    descricao:
      "Faixas horizontais infinitas com logos, testimonials ou imagens que scrollam automaticamente.",
    quandoAplicar:
      "Para mostrar social proof, partners, testimonials de forma dinâmica e sem esforço.",
    ondeAplicar:
      "Logos bars, testimonial carousels, partner showcases, ticker tapes.",
    exemplo: "Stripe customers, Linear logos, Vercel trusted by.",
  },
];

// Manter retro-compatibilidade
export const Efeitos = EfeitosInfo.map((e) => e.nome) as readonly string[];

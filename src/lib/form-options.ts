// ============================================================================
// form-options.ts — Constantes partilhadas pelo formulário
// ============================================================================
// Suporte PT/EN: cada secão/efeito tem chave i18n.
// Presets: seleções pré-feitas por nicho (botão "Recomendar").
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

// ============================================================================
// SECÇÕES — com tradução PT/EN
// ============================================================================
export interface SecaoInfo {
  id: string;
  pt: string;
  en: string;
}

export const SecoesInfo: SecaoInfo[] = [
  { id: "hero", pt: "Hero", en: "Hero" },
  { id: "features", pt: "Features", en: "Features" },
  { id: "how-it-works", pt: "Como funciona", en: "How it works" },
  { id: "pricing", pt: "Preços", en: "Pricing" },
  { id: "testimonials", pt: "Testemunhos", en: "Testimonials" },
  { id: "faq", pt: "FAQ", en: "FAQ" },
  { id: "cta", pt: "CTA", en: "CTA" },
  { id: "footer", pt: "Footer", en: "Footer" },
  { id: "dashboard", pt: "Dashboard", en: "Dashboard" },
  { id: "auth", pt: "Autenticação", en: "Auth" },
  { id: "blog", pt: "Blog", en: "Blog" },
  { id: "gallery", pt: "Galeria", en: "Gallery" },
  { id: "cards", pt: "Cards", en: "Cards" },
  { id: "bento-grid", pt: "Bento Grid", en: "Bento Grid" },
  { id: "stats", pt: "Estatísticas", en: "Stats" },
  { id: "logos", pt: "Logos", en: "Logos" },
  { id: "team", pt: "Equipa", en: "Team" },
  { id: "contact", pt: "Contacto", en: "Contact" },
  { id: "newsletter", pt: "Newsletter", en: "Newsletter" },
  { id: "404", pt: "Página 404", en: "404 Page" },
  { id: "cookies", pt: "Banner Cookies", en: "Cookies Banner" },
  { id: "services", pt: "Serviços", en: "Services" },
  // NOVAS secções
  { id: "about", pt: "Sobre nós", en: "About" },
  { id: "process", pt: "Processo", en: "Process" },
  { id: "case-studies", pt: "Casos de estudo", en: "Case Studies" },
  { id: "careers", pt: "Carreiras", en: "Careers" },
  { id: "partners", pt: "Parceiros", en: "Partners" },
  { id: "awards", pt: "Prémios", en: "Awards" },
  { id: "blog-list", pt: "Lista de Blog", en: "Blog List" },
  { id: "blog-post", pt: "Artigo de Blog", en: "Blog Post" },
  { id: "search", pt: "Pesquisa", en: "Search" },
  { id: "settings", pt: "Definições", en: "Settings" },
  { id: "profile", pt: "Perfil", en: "Profile" },
  { id: "onboarding", pt: "Onboarding", en: "Onboarding" },
  { id: "checkout", pt: "Checkout", en: "Checkout" },
  { id: "cart", pt: "Carrinho", en: "Cart" },
  { id: "product-detail", pt: "Detalhe de Produto", en: "Product Detail" },
  // NOVAS
  { id: "loja", pt: "Loja", en: "Shop" },
  { id: "map", pt: "Mapa", en: "Map" },
  { id: "calendar", pt: "Calendário", en: "Calendar" },
  { id: "chat", pt: "Chat", en: "Chat" },
  { id: "notifications", pt: "Notificações", en: "Notifications" },
];

// Retro-compatibilidade — usa PT por defeito
export const Secoes = SecoesInfo.map((s) => s.pt) as readonly string[];

// Helper: obter secção por idioma
export function getSecaoLabel(id: string, lang: "pt" | "en"): string {
  const info = SecoesInfo.find((s) => s.id === id);
  return info ? (lang === "en" ? info.en : info.pt) : id;
}

// Helper: obter id por label (qualquer idioma)
export function getSecaoId(label: string): string {
  const info = SecoesInfo.find((s) => s.pt === label || s.en === label || s.id === label);
  return info?.id ?? label;
}

// ============================================================================
// EFEITOS — com descrição + sugestões de uso (para hover tooltips)
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
  // ── NOVOS 9 efeitos (total 24) ─────────────────────────────────────────
  {
    nome: "Magnetic Hover",
    icon: "Magnet",
    descricao:
      "Elementos que seguem o cursor com física suave (spring). Botões e cards que se atraem ao rato.",
    quandoAplicar:
      "Para dar personalidade lúdica a CTAs, ícones e cards interativos.",
    ondeAplicar:
      "Botões principais, cards de features, ícones de navegação, hero elements.",
    exemplo: "Vercel hero, Framer buttons, Awwwards magnetic CTAs.",
  },
  {
    nome: "Text Reveal Mask",
    icon: "Type",
    descricao:
      "Texto revelado por máscara que se move ao scroll ou hover. Cada linha aparece progressivamente.",
    quandoAplicar:
      "Para headlines impactantes com narrativa — cada palavra ganha vida.",
    ondeAplicar:
      "Hero headlines, section titles, manifesto texts, brand statements.",
    exemplo: "Apple marketing, Stripe homepage, Linear hero.",
  },
  {
    nome: "Cursor Custom",
    icon: "MousePointerClick",
    descricao:
      "Cursor customizado que muda conforme o elemento sob ele (hover states, blend modes, sizes).",
    quandoAplicar:
      "Em sites premium onde cada detalhe conta. Cria sensação de app nativa.",
    ondeAplicar:
      "Todo o site. Especialmente em portfolios, agências, e-commerce premium.",
    exemplo: "Framer, Vercel, Awwwards SOTD, Arc browser.",
  },
  {
    nome: "Scroll Progress",
    icon: "BarChart3",
    descricao:
      "Barra de progresso no topo que mostra quanto do site já foi scrollado. Visual feedback claro.",
    quandoAplicar:
      "Em páginas longas (landing pages, blog posts, case studies) para orientar o utilizador.",
    ondeAplicar:
      "Topo da página (fixed). Funciona em qualquer site com scroll vertical.",
    exemplo: "Vercel blog, GitHub docs, Medium articles.",
  },
  {
    nome: "Image Reveal Clip",
    icon: "Image",
    descricao:
      "Imagens reveladas com clip-path animado ao scroll (wipe, circle expand, diagonal).",
    quandoAplicar:
      "Para galerias, hero images, product showcases — cada imagem surge com drama.",
    ondeAplicar:
      "Hero images, gallery grids, product cards, case study images.",
    exemplo: "Apple product reveals, Nike stories, Awwwards galleries.",
  },
  {
    nome: "Number Counter",
    icon: "Hash",
    descricao:
      "Números que contam progressivamente (0 → valor final) ao entrar no viewport. Animação de stats.",
    quandoAplicar:
      "Para destacar métricas, resultados, social proof numérico.",
    ondeAplicar:
      "Stats sections, results showcases, dashboards, case studies.",
    exemplo: "Stripe stats, Linear metrics, Vercel performance numbers.",
  },
  {
    nome: "Tilt 3D Cards",
    icon: "Box",
    descricao:
      "Cards que inclinam em 3D seguindo o cursor (perspective transform). Profundidade sem WebGL.",
    quandoAplicar:
      "Para product cards, feature cards, portfolio pieces — interatividade premium.",
    ondeAplicar:
      "Product grids, feature sections, portfolio cards, team member cards.",
    exemplo: "Apple product cards, Vercel features, Stripe product grid.",
  },
  {
    nome: "Gradient Mesh BG",
    icon: "Palette",
    descricao:
      "Background com gradient mesh animado (múltiplos pontos de cor que se movem suavemente).",
    quandoAplicar:
      "Para backgrounds vivos e premium sem usar imagens. Substitui gradientes estáticos.",
    ondeAplicar:
      "Hero sections, auth pages, empty states, onboarding backgrounds.",
    exemplo: "Stripe, Linear, Vercel, Framer landing backgrounds.",
  },
  {
    nome: "Accordion Smooth",
    icon: "ChevronDown",
    descricao:
      "Acordeões com animação suave de altura (height auto via Motion layout). FAQ e specs expansíveis.",
    quandoAplicar:
      "Para FAQ, specs técnicas, descriptions longas que podem ser colapsadas.",
    ondeAplicar:
      "FAQ sections, product specs, pricing details, filter sidebars.",
    exemplo: "Stripe FAQ, Vercel pricing, Linear changelog.",
  },
  // ─── 5 NOVOS EFEITOS VISUAIS (botões coloridos premium) ───
  {
    nome: "Aurora Boreal",
    icon: "Sparkles",
    descricao:
      "Gradiente animado multi-color que se move suavemente como aurora boreal. Cria atmosfera premium e etérea.",
    quandoAplicar:
      "Quando queres um fundo vivo mas elegante — SaaS premium, AI products, brand experiences.",
    ondeAplicar:
      "Hero sections, headers de landing, backgrounds de cards featured, sections CTA.",
    exemplo: "Linear gradient hero, Vercel edge animations, Resend backgrounds.",
  },
  {
    nome: "Spotlight Follow",
    icon: "MousePointerClick",
    descricao:
      "Spotlight radial que segue o cursor — ilumina elementos à medida que o rato passa. Efeito premium interativo.",
    quandoAplicar:
      "Para highlight de features ou CTAs — guia visualmente o utilizador para onde queres.",
    ondeAplicar:
      "Card grids, feature highlights, hover states em CTAs, product showcases.",
    exemplo: "Stripe product cards, Linear feature hover, Cursor landing.",
  },
  {
    nome: "Liquid Morph",
    icon: "Wine",
    descricao:
      "Formas orgânicas que se deformam e morpham suavemente — SVG morphing com GSAP. Efeito fluido e orgânico.",
    quandoAplicar:
      "Para brand identities fluidas, wellness apps, creative agencies que querem destacar-se.",
    ondeAplicar:
      "Logos animados, dividers entre secções, backgrounds orgânicos, hero shapes.",
    exemplo: "Calm app, Headspace animations, Bureau Creative agencies.",
  },
  {
    nome: "Neon Glow Pulse",
    icon: "Box",
    descricao:
      "Efeito neon que pulsa em volta de elementos — box-shadow animado com cores vibrantes. Cyberpunk/Web3 vibe.",
    quandoAplicar:
      "Para Web3, gaming, crypto, AI products que querem parecer futuristic.",
    ondeAplicar:
      "Buttons CTA, cards featured, borders de input focus, badges de novidade.",
    exemplo: "Vercel edge demos, Cyberpunk 2077 site, Web3 gaming sites.",
  },
  {
    nome: "Confetti Burst",
    icon: "Sparkles",
    descricao:
      "Explosão de confete/partículas coloridas em eventos — submit de form, click em CTA, milestone reached.",
    quandoAplicar:
      "Para celebrar ações do utilizador — signup, purchase, achievement unlock.",
    ondeAplicar:
      "Submit buttons, success states, gamification moments, onboarding completion.",
    exemplo: "Linear signup, Stripe payment success, Duolingo achievements.",
  },
  // ─── 3 NOVOS ESTILOS DE LAYOUT ───
  {
    nome: "Scroll Storytelling",
    icon: "Film",
    descricao:
      "Narrativa guiada por scroll — cada secção revela uma parte da história com transições cinematográficas. Pinned sections com GSAP ScrollTrigger.",
    quandoAplicar:
      "Para brand experiences, product launches, storytelling imersivo onde cada scroll conta uma parte da narrativa.",
    ondeAplicar:
      "Hero, product tours, brand stories, case studies, about pages.",
    exemplo: "Apple product pages, Stripe features, Linear marketing, Awwwards SOTD.",
  },
  {
    nome: "Split Reveal",
    icon: "SplitSquareHorizontal",
    descricao:
      "Ecrã dividido em 2 painéis que se separam/revelam conteúdo ao scroll ou hover. Cria tensão visual e surpresa.",
    quandoAplicar:
      "Para product comparisons, before/after, dual-content showcases, portfolio cases.",
    ondeAplicar:
      "Hero sections, product comparisons, portfolio reveals, feature duos.",
    exemplo: "Apple iPhone compare, Vercel feature split, Awwwards agency sites.",
  },
  {
    nome: "Grid Masonry Pro",
    icon: "LayoutGrid",
    descricao:
      "Grid masonry assimétrico com cards de tamanhos variados que criam ritmo visual dinâmico. Pinterest-style mas premium.",
    quandoAplicar:
      "Para portfolios, galleries, blogs, e-commerce com muito conteúdo visual.",
    ondeAplicar:
      "Portfolio grids, blog feeds, product galleries, case study lists.",
    exemplo: "Pinterest premium, Awwwards portfolios, Linear blog, Vercel customers.",
  },
];

// Manter retro-compatibilidade
export const Efeitos = EfeitosInfo.map((e) => e.nome) as readonly string[];

// ============================================================================
// PRESETS RECOMENDADOS — por nicho (botão "Recomendar")
// ============================================================================
// Cada preset define: secões + efeitos + paleta + tipografia recomendados
// ============================================================================
export interface PresetRecomendado {
  nicho: string;
  razao: string;
  secoes: string[]; // ids
  efeitos: string[];
  paletaMode: "auto" | "manual";
  typographyMode: "auto" | "manual";
  promptMode: "compact" | "extended";
  nivel: "mvp" | "production";
}

export const PRESETS_RECOMENDADOS: PresetRecomendado[] = [
  {
    nicho: "SaaS B2B",
    razao: "Stack clássico SaaS: hero impactante + features + pricing + social proof + CTA. Reveal on scroll para guiado.",
    secoes: ["hero", "features", "how-it-works", "pricing", "testimonials", "logos", "faq", "cta", "footer"],
    efeitos: ["Reveal on scroll", "Smooth scroll", "Minimal classic"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "extended",
    nivel: "production",
  },
  {
    nicho: "E-commerce Moda",
    razao: "E-commerce fashion: hero + gallery + product cards + testimonials. Parallax + bento para visual richness.",
    secoes: ["hero", "gallery", "cards", "pricing", "testimonials", "newsletter", "cta", "footer"],
    efeitos: ["Parallax", "Cinematic", "Bento Grid Animated", "Reveal on scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "extended",
    nivel: "production",
  },
  {
    nicho: "E-commerce Geral",
    razao: "E-commerce geral: hero + features + pricing + testimonials + FAQ. Marquee para logos de partners.",
    secoes: ["hero", "features", "pricing", "testimonials", "logos", "faq", "newsletter", "cta", "footer"],
    efeitos: ["Reveal on scroll", "Marquee Infinite", "Minimal classic"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "FinTech",
    razao: "FinTech precisa de confiança: stats + logos + testimonials. Minimal classic + smooth scroll.",
    secoes: ["hero", "stats", "features", "how-it-works", "pricing", "testimonials", "logos", "faq", "cta", "footer"],
    efeitos: ["Minimal classic", "Smooth scroll", "Reveal on scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "extended",
    nivel: "production",
  },
  {
    nicho: "HealthTech",
    razao: "HealthTech: calmo + confiável. Hero + services + features + testimonials. Minimal + smooth.",
    secoes: ["hero", "services", "features", "how-it-works", "testimonials", "faq", "cta", "footer"],
    efeitos: ["Minimal classic", "Smooth scroll", "Reveal on scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "EdTech",
    razao: "EdTech: features + how it works + pricing + testimonials. Bento para courses.",
    secoes: ["hero", "features", "how-it-works", "pricing", "testimonials", "faq", "newsletter", "cta", "footer"],
    efeitos: ["Bento Grid Animated", "Reveal on scroll", "Smooth scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "Imobiliário",
    razao: "Imobiliário: gallery + cards + contact. Parallax + cinematic para premium feel.",
    secoes: ["hero", "gallery", "cards", "stats", "testimonials", "contact", "cta", "footer"],
    efeitos: ["Parallax", "Cinematic", "Reveal on scroll", "Fullscreen sections"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "Restaurantes / Food",
    razao: "Food: gallery + menu cards + testimonials + contact. Warm + inviting.",
    secoes: ["hero", "gallery", "cards", "testimonials", "contact", "footer"],
    efeitos: ["Reveal on scroll", "Parallax", "Smooth scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "mvp",
  },
  {
    nicho: "Viagens & Turismo",
    razao: "Travel: hero fullscreen + gallery + testimonials + contact. Cinematic + parallax.",
    secoes: ["hero", "gallery", "features", "testimonials", "pricing", "contact", "cta", "footer"],
    efeitos: ["Cinematic", "Parallax", "Fullscreen sections", "Reveal on scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "extended",
    nivel: "production",
  },
  {
    nicho: "Agência Criativa",
    razao: "Agência: portfolio + services + team + contact. Bento + brutalist + marquee para ousadia.",
    secoes: ["hero", "services", "gallery", "bento-grid", "stats", "team", "testimonials", "logos", "contact", "footer"],
    efeitos: ["Bento Expandable", "Cinematic", "Marquee Infinite", "Smooth scroll", "Reveal on scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "extended",
    nivel: "production",
  },
  {
    nicho: "Portfólio Pessoal",
    razao: "Portfólio: hero + about + projects + contact. Minimal + smooth + reveal.",
    secoes: ["hero", "gallery", "stats", "testimonials", "contact", "footer"],
    efeitos: ["Minimal classic", "Smooth scroll", "Reveal on scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "mvp",
  },
  {
    nicho: "Blog / Media",
    razao: "Blog: hero + cards (posts) + newsletter + categories. Masonry + minimal.",
    secoes: ["hero", "cards", "gallery", "newsletter", "footer"],
    efeitos: ["Masonry Pinterest", "Reveal on scroll", "Minimal classic"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "mvp",
  },
  {
    nicho: "Gaming",
    razao: "Gaming: hero cinematic + features + stats + community. Cyberpunk + 3D + marquee.",
    secoes: ["hero", "features", "stats", "gallery", "testimonials", "newsletter", "cta", "footer"],
    efeitos: ["Cinematic", "3D / WebGL leve", "Marquee Infinite", "Glassmorphism"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "extended",
    nivel: "production",
  },
  {
    nicho: "Crypto / Web3",
    razao: "Web3: hero + stats + features + community. 3D + cinematic + glassmorphism.",
    secoes: ["hero", "stats", "features", "how-it-works", "testimonials", "logos", "faq", "cta", "footer"],
    efeitos: ["3D / WebGL leve", "Cinematic", "Glassmorphism", "Reveal on scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "extended",
    nivel: "production",
  },
  {
    nicho: "Mobilidade",
    razao: "Mobilidade: hero + features + stats + pricing + app download. Cinematic + parallax.",
    secoes: ["hero", "features", "stats", "pricing", "testimonials", "faq", "cta", "footer"],
    efeitos: ["Cinematic", "Parallax", "Reveal on scroll", "Smooth scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "Logística",
    razao: "Logística: hero + services + stats + features + contact. Minimal + bento.",
    secoes: ["hero", "services", "stats", "features", "logos", "testimonials", "contact", "cta", "footer"],
    efeitos: ["Bento Grid Animated", "Minimal classic", "Reveal on scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "Energia / Sustentabilidade",
    razao: "Sustentabilidade: hero + stats + features + testimonials. Minimal + parallax.",
    secoes: ["hero", "stats", "features", "how-it-works", "testimonials", "logos", "newsletter", "cta", "footer"],
    efeitos: ["Parallax", "Reveal on scroll", "Smooth scroll", "Minimal classic"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "Fitness / Wellness",
    razao: "Fitness: hero + services + pricing + testimonials + community. Bold + energetic.",
    secoes: ["hero", "services", "pricing", "testimonials", "gallery", "newsletter", "cta", "footer"],
    efeitos: ["Cinematic", "Bento Grid Animated", "Reveal on scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "Beleza / Cosmética",
    razao: "Beleza: hero + gallery + product cards + testimonials. Elegant + parallax.",
    secoes: ["hero", "gallery", "cards", "testimonials", "newsletter", "cta", "footer"],
    efeitos: ["Parallax", "Cinematic", "Reveal on scroll", "Smooth scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "Imobiliário de Luxo",
    razao: "Luxo imobiliário: hero fullscreen + gallery + stats + contact. Cinematic + fullscreen.",
    secoes: ["hero", "gallery", "stats", "features", "testimonials", "contact", "cta", "footer"],
    efeitos: ["Cinematic", "Fullscreen sections", "Parallax", "Smooth scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "extended",
    nivel: "production",
  },
  {
    nicho: "Advocacia / Jurídico",
    razao: "Jurídico: hero + services + team + testimonials + contact. Minimal + trustworthy.",
    secoes: ["hero", "services", "team", "testimonials", "faq", "contact", "cta", "footer"],
    efeitos: ["Minimal classic", "Reveal on scroll", "Smooth scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "Consultoria",
    razao: "Consultoria: hero + services + team + testimonials + contact. Minimal + bento.",
    secoes: ["hero", "services", "features", "team", "testimonials", "logos", "contact", "cta", "footer"],
    efeitos: ["Bento Grid Animated", "Minimal classic", "Reveal on scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "Manufatura / Indústria",
    razao: "Indústria: hero + services + stats + features + contact. Minimal + bento.",
    secoes: ["hero", "services", "stats", "features", "logos", "testimonials", "contact", "cta", "footer"],
    efeitos: ["Bento Grid Animated", "Minimal classic", "Reveal on scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "production",
  },
  {
    nicho: "ONG / Impacto Social",
    razao: "ONG: hero + about + stats + testimonials + newsletter + donate CTA. Cinematic + parallax.",
    secoes: ["hero", "features", "stats", "testimonials", "gallery", "newsletter", "cta", "footer"],
    efeitos: ["Cinematic", "Parallax", "Reveal on scroll", "Smooth scroll"],
    paletaMode: "auto",
    typographyMode: "auto",
    promptMode: "compact",
    nivel: "mvp",
  },
];

// ============================================================================
// LAYOUT PRESETS — 25 presets de layout completo por nicho (Awwwards 2026)
// ============================================================================
// Cada preset define: secções + efeitos + layout style + descrição
// Inspirado em sites Awwwards SOTD, sites premium reais por nicho
// ============================================================================
export interface LayoutPreset {
  id: string;
  name: string;
  nicho: string;
  description: string;
  layout: string;
  secoes: string[];
  efeitos: string[];
  references: string[];
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  // ─── PORTFOLIO / AGENCY ───
  {
    id: "portfolio-cinematic",
    name: "Portfolio Cinematic",
    nicho: "Portfolio / Agência",
    description: "Hero fullscreen com vídeo/3D, scroll storytelling, project gallery masonry, about com stats, contact form.",
    layout: "Fullscreen sections + Scroll Storytelling",
    secoes: ["hero", "work", "about", "services", "contact", "footer"],
    efeitos: ["Cinematic", "Smooth scroll", "Scroll Storytelling", "Image Reveal Clip", "Cursor Custom"],
    references: ["Active Theory", "Bureau Cool", "Locomotive"],
  },
  {
    id: "agency-bold-grid",
    name: "Agency Bold Grid",
    nicho: "Portfolio / Agência",
    description: "Nav hamburger, hero com texto gigante, bento grid de projetos, marquee de clientes, about minimal.",
    layout: "Bento Grid + Marquee Infinite",
    secoes: ["hero", "work", "clients", "about", "contact", "footer"],
    efeitos: ["Bento Grid Animated", "Marquee Infinite", "Magnetic Hover", "Reveal on scroll"],
    references: ["Resn", "Locomotive", "Awwwards agencies"],
  },
  {
    id: "portfolio-split-reveal",
    name: "Portfolio Split Reveal",
    nicho: "Portfolio / Agência",
    description: "Split screen com projetos que se revelam ao hover, scroll horizontal para cases, about fullscreen.",
    layout: "Split Screen Scroll + Horizontal Scroll",
    secoes: ["hero", "work", "process", "about", "contact", "footer"],
    efeitos: ["Split Screen Scroll", "Horizontal scroll", "Image Reveal Clip", "Smooth scroll"],
    references: ["Trionn", "Awwwards SOTD"],
  },

  // ─── SaaS / TECH ───
  {
    id: "saas-hero-features",
    name: "SaaS Hero + Features",
    nicho: "SaaS / Tech",
    description: "Nav com tabs, hero centrado com CTA, features grid 3-col, pricing table, testimonials, FAQ accordion.",
    layout: "Hero Centered + Bento Grid",
    secoes: ["hero", "features", "how-it-works", "pricing", "testimonials", "faq", "cta", "footer"],
    efeitos: ["Reveal on scroll", "Smooth scroll", "Minimal classic", "Number Counter"],
    references: ["Linear", "Vercel", "Cal.com"],
  },
  {
    id: "saas-dashboard-preview",
    name: "SaaS Dashboard Preview",
    nicho: "SaaS / Tech",
    description: "Hero com mockup de dashboard animado, features com tabs interativos, stats com number counter, CTA.",
    layout: "Hero Split + Animated Stats",
    secoes: ["hero", "features", "stats", "pricing", "logos", "cta", "footer"],
    efeitos: ["Number Counter", "Reveal on scroll", "Gradient Mesh BG", "Magnetic Hover"],
    references: ["Stripe", "Resend", "Cursor"],
  },
  {
    id: "saas-dark-premium",
    name: "SaaS Dark Premium",
    nicho: "SaaS / Tech",
    description: "Dark mode hero com gradient mesh, glassmorphism cards, pricing com toggle mensal/anual, CTA glow.",
    layout: "Dark Hero + Glassmorphism",
    secoes: ["hero", "features", "pricing", "testimonials", "cta", "footer"],
    efeitos: ["Glassmorphism", "Gradient Mesh BG", "Reveal on scroll", "Neon Glow Pulse"],
    references: ["Linear dark", "Vercel edge"],
  },

  // ─── E-COMMERCE ───
  {
    id: "ecommerce-boutique",
    name: "E-commerce Boutique",
    nicho: "E-commerce",
    description: "Hero com product showcase split, grid de produtos com hover zoom, categorias, newsletter, reviews.",
    layout: "Hero Split + Product Grid",
    secoes: ["hero", "categories", "products", "reviews", "newsletter", "footer"],
    efeitos: ["Parallax", "Image Reveal Clip", "Magnetic Hover", "Reveal on scroll"],
    references: ["Allbirds", "Awwwards e-commerce"],
  },
  {
    id: "ecommerce-luxury",
    name: "E-commerce Luxury",
    nicho: "E-commerce",
    description: "Fullscreen hero com vídeo, product gallery cinematic, story section, atelier, contact concierge.",
    layout: "Fullscreen + Cinematic Story",
    secoes: ["hero", "collection", "story", "atelier", "contact", "footer"],
    efeitos: ["Cinematic", "Smooth scroll", "Image Reveal Clip", "Fullscreen sections"],
    references: ["Sotheby's", "Luxury brands"],
  },
  {
    id: "ecommerce-marketplace",
    name: "Marketplace Grid",
    nicho: "E-commerce",
    description: "Search bar hero, filters sidebar, masonry grid de produtos, vendor cards, trust badges.",
    layout: "Masonry Pinterest + Filters",
    secoes: ["hero", "filters", "products", "vendors", "trust", "footer"],
    efeitos: ["Bento Grid Animated", "Reveal on scroll", "Number Counter"],
    references: ["Etsy", "Airbnb experiences"],
  },

  // ─── RESTAURANT / FOOD ───
  {
    id: "restaurant-menu-story",
    name: "Restaurant Menu Story",
    nicho: "Restaurante / Food",
    description: "Hero com comida fullscreen, menu scroll horizontal, chef story, gallery, reservation form.",
    layout: "Fullscreen + Horizontal Scroll Menu",
    secoes: ["hero", "menu", "chef", "gallery", "reservation", "footer"],
    efeitos: ["Cinematic", "Horizontal scroll", "Parallax", "Image Reveal Clip"],
    references: ["Eleven Madison Park", "Awwwards food"],
  },
  {
    id: "restaurant-warm-craft",
    name: "Restaurant Warm Craft",
    nicho: "Restaurante / Food",
    description: "Hero warm com food close-up, story da origem, menu em cards, gallery, localização + horas.",
    layout: "Warm Hero + Story Cards",
    secoes: ["hero", "story", "menu", "gallery", "location", "footer"],
    efeitos: ["Parallax", "Reveal on scroll", "Smooth scroll", "Text Reveal Mask"],
    references: ["Sweetgreen", "Chipotle premium"],
  },

  // ─── EDUCATION / EDTECH ───
  {
    id: "education-friendly-cards",
    name: "Education Friendly Cards",
    nicho: "Educação / EdTech",
    description: "Hero com ilustração, course cards coloridos, progress tracking visual, testimonials de alunos, CTA signup.",
    layout: "Hero + Colorful Course Grid",
    secoes: ["hero", "courses", "features", "testimonials", "pricing", "cta", "footer"],
    efeitos: ["Reveal on scroll", "Magnetic Hover", "Number Counter", "Bento Grid Animated"],
    references: ["Duolingo", "Khan Academy", "Coursera"],
  },
  {
    id: "education-platform-dashboard",
    name: "Education Platform",
    nicho: "Educação / EdTech",
    description: "Hero com video preview, features em bento grid, learning path visual, stats, teacher profiles.",
    layout: "Hero Video + Bento Features",
    secoes: ["hero", "features", "paths", "stats", "teachers", "cta", "footer"],
    efeitos: ["Bento Grid Animated", "Number Counter", "Reveal on scroll", "Smooth scroll"],
    references: ["Notion learn", "MasterClass"],
  },

  // ─── REAL ESTATE ───
  {
    id: "realestate-luxury-gallery",
    name: "Real Estate Luxury Gallery",
    nicho: "Imobiliário",
    description: "Fullscreen property hero, gallery com map integration, property details, agent contact, virtual tour CTA.",
    layout: "Fullscreen + Gallery + Map",
    secoes: ["hero", "gallery", "details", "map", "agent", "contact", "footer"],
    efeitos: ["Cinematic", "Parallax", "Image Reveal Clip", "Smooth scroll"],
    references: ["Sotheby's Realty", "Compass"],
  },
  {
    id: "realestate-trust-listings",
    name: "Real Estate Trust Listings",
    nicho: "Imobiliário",
    description: "Search hero com filtros, listings grid, property cards com stats, neighborhood info, agent profiles.",
    layout: "Search Hero + Listings Grid",
    secoes: ["hero", "listings", "neighborhood", "agents", "testimonials", "contact", "footer"],
    efeitos: ["Reveal on scroll", "Number Counter", "Bento Grid Animated"],
    references: ["Zillow Premier", "Redfin"],
  },

  // ─── BLOG / CONTENT ───
  {
    id: "editorial-magazine",
    name: "Editorial Magazine",
    nicho: "Blog / Conteúdo",
    description: "Masthead, featured article split, article grid 3-col, author profiles, newsletter, categories nav.",
    layout: "Magazine Layout + Article Grid",
    secoes: ["hero", "featured", "articles", "authors", "newsletter", "footer"],
    efeitos: ["Reveal on scroll", "Text Reveal Mask", "Smooth scroll", "Minimal classic"],
    references: ["Stripe blog", "Linear blog", "Resend"],
  },
  {
    id: "blog-minimal-swiss",
    name: "Blog Minimal Swiss",
    nicho: "Blog / Conteúdo",
    description: "Clean hero, single-column article list, typography-focused, reading progress bar, minimal footer.",
    layout: "Swiss Minimal + Reading Progress",
    secoes: ["hero", "articles", "categories", "about", "footer"],
    efeitos: ["Minimal classic", "Scroll Progress", "Text Reveal Mask"],
    references: ["Notion blog", "Swiss design"],
  },

  // ─── CREATIVE / EXPERIMENTAL ───
  {
    id: "creative-3d-immersive",
    name: "Creative 3D Immersive",
    nicho: "Agência Criativa",
    description: "3D hero com WebGL, scroll-driven 3D camera, project cases em 3D cards, about com particles.",
    layout: "3D Hero + Scroll 3D Camera",
    secoes: ["hero", "work", "about", "contact", "footer"],
    efeitos: ["3D / WebGL leve", "Cinematic", "Scroll Storytelling", "Cursor Custom"],
    references: ["Active Theory", "Resn", "Bureau"],
  },
  {
    id: "experimental-brutalist",
    name: "Experimental Brutalist",
    nicho: "Agência Criativa",
    description: "Raw blocks, huge typography, marquee strips, grid hard rectangles, monospace nav, no rounding.",
    layout: "Brutalist Raw Blocks",
    secoes: ["hero", "work", "manifesto", "contact", "footer"],
    efeitos: ["Marquee Infinite", "Tilt 3D Cards", "Cursor Custom", "Scroll Progress"],
    references: ["Gumroad", "Bruno Simon"],
  },
  {
    id: "vintage-heritage",
    name: "Vintage Heritage",
    nicho: "Agência Criativa",
    description: "Ornamental header, serif typography, split hero, collection grid, heritage quote, contact form.",
    layout: "Ornamental + Split Editorial",
    secoes: ["hero", "collection", "heritage", "about", "contact", "footer"],
    efeitos: ["Smooth scroll", "Text Reveal Mask", "Parallax", "Image Reveal Clip"],
    references: ["Luxury brands", "Heritage sites"],
  },

  // ─── DASHBOARD / ADMIN ───
  {
    id: "dashboard-saas-admin",
    name: "Dashboard SaaS Admin",
    nicho: "Dashboard / Admin",
    description: "Sidebar nav, top bar, stats cards, data table, chart area, settings panel, activity feed.",
    layout: "Sidebar + Stats + Table",
    secoes: ["sidebar", "stats", "chart", "table", "activity", "settings"],
    efeitos: ["Number Counter", "Reveal on scroll", "Minimal classic"],
    references: ["Linear app", "Vercel dashboard"],
  },

  // ─── LANDING PAGE ───
  {
    id: "landing-ai-product",
    name: "AI Product Landing",
    nicho: "Landing Page",
    description: "Hero com AI demo, features em bento grid, how it works 3-step, pricing, waitlist CTA.",
    layout: "Hero AI Demo + Bento + Steps",
    secoes: ["hero", "demo", "features", "how-it-works", "pricing", "waitlist", "footer"],
    efeitos: ["Gradient Mesh BG", "Reveal on scroll", "Number Counter", "Magnetic Hover"],
    references: ["Cursor", "Perplexity", "v0.dev"],
  },
  {
    id: "landing-waitlist-viral",
    name: "Waitlist Viral Landing",
    nicho: "Landing Page",
    description: "Bold hero com countdown, features minimal, social proof, waitlist form com referral, FAQ.",
    layout: "Bold Hero + Countdown + Waitlist",
    secoes: ["hero", "countdown", "features", "social", "waitlist", "faq", "footer"],
    efeitos: ["Number Counter", "Confetti Burst", "Gradient Mesh BG", "Reveal on scroll"],
    references: ["Linear launch", "Vercel waitlist"],
  },
  {
    id: "landing-mobile-app",
    name: "Mobile App Landing",
    nicho: "Landing Page",
    description: "Phone mockup hero, feature carousel, screenshots scroll, app store badges, testimonials, CTA.",
    layout: "Phone Mockup + Carousel",
    secoes: ["hero", "features", "screenshots", "testimonials", "download", "footer"],
    efeitos: ["Parallax", "Reveal on scroll", "Magnetic Hover", "Smooth scroll"],
    references: ["Notion mobile", "Things app"],
  },

  // ─── CORPORATE / ENTERPRISE ───
  {
    id: "corporate-trust-premium",
    name: "Corporate Trust Premium",
    nicho: "Enterprise / Corporate",
    description: "Professional hero, services grid, case studies, client logos, team, stats, contact enterprise.",
    layout: "Hero + Services + Cases + Logos",
    secoes: ["hero", "services", "cases", "logos", "team", "stats", "contact", "footer"],
    efeitos: ["Reveal on scroll", "Number Counter", "Smooth scroll", "Minimal classic"],
    references: ["Stripe", "Vercel enterprise", "Notion B2B"],
  },

  // ─── HEALTH / WELLNESS ───
  {
    id: "wellness-calm-organic",
    name: "Wellness Calm Organic",
    nicho: "Health / Wellness",
    description: "Soft hero com natureza, features em cards orgânicos, testimonials calm, booking, about story.",
    layout: "Soft Hero + Organic Cards",
    secoes: ["hero", "features", "story", "testimonials", "booking", "footer"],
    efeitos: ["Smooth scroll", "Parallax", "Text Reveal Mask", "Reveal on scroll"],
    references: ["Calm", "Headspace", "One Medical"],
  },
];

// Helper: obter preset por nicho
export function getPresetByNicho(nicho: string): PresetRecomendado | null {
  return PRESETS_RECOMENDADOS.find((p) => p.nicho === nicho) ?? null;
}

// Helper: obter presets por nicho
export function getLayoutPresetsByNicho(nicho: string): LayoutPreset[] {
  return LAYOUT_PRESETS.filter((p) => p.nicho === nicho);
}

// Helper: obter preset por ID
export function getLayoutPresetById(id: string): LayoutPreset | undefined {
  return LAYOUT_PRESETS.find((p) => p.id === id);
}

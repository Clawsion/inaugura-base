// ============================================================================
// design-skills.ts — 30 skills de design modernas 2026 (CSS native + libs)
// ============================================================================
// Skills modernas 2026 que melhoram o design COM impacto e SEM peso:
// cada skill tem: nome, descrição, benefício, custo de performance, libraries.
// Inclui: CSS 2026 native features (View Transitions, Scroll-Driven, :has(),
// OKLCH, color-mix, container queries, @starting-style) + libs modernas.
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
  // ── Motion (10) ──────────────────────────────────────────────────────────
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
    nome: "View Transitions API (cross-document)",
    icone: "Layers",
    categoria: "Motion",
    descricao:
      "API nativa do browser para transições entre páginas/estados. Cross-document shippable Chromium+Safari 2026.",
    beneficio: "Transições tipo app nativa, zero código, hardware-accelerated.",
    custoPerformance: "Baixo",
    libraries: ["next/view-transitions"],
    quandoAplicar: "Navegação entre rotas, mudanças de estado visuais.",
    exemplo: "Chrome blog, Linear app, Vercel dashboard, Next.js 16.",
  },
  {
    id: "scroll-driven-css",
    nome: "Scroll-Driven Animations (CSS native)",
    icone: "Scroll",
    categoria: "Motion",
    descricao:
      "`animation-timeline: scroll()` ou `view()` em CSS puro. Anima conforme scroll sem JavaScript. Baseline 2025.",
    beneficio: "Parallax, progress bars, reveal-on-scroll sem libs e sem jank.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Progress bars sticky, reveal de secções, parallax leve.",
    exemplo: "Documentado MDN, WebKit blog Jun 2025, Bram.us.",
  },
  {
    id: "starting-style",
    nome: "@starting-style for Entry Animations",
    icone: "Sparkles",
    categoria: "Motion",
    descricao:
      "`@starting-style` define estilos iniciais para elementos que entram no DOM ou saem de `display: none`.",
    beneficio: "Animações entry/exit de modais, tooltips, toasts sem JS nem libs.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Modais, dropdowns, popovers, toasts que aparecem/desaparecem.",
    exemplo: "MDN docs Jul 2026, nerdy.dev, Chrome for Developers.",
  },
  {
    id: "magnetic-buttons",
    nome: "Magnetic Buttons & Custom Cursor",
    icone: "MousePointerClick",
    categoria: "Motion",
    descricao:
      "Buttons 'magnetic' atraem-se ao pointer com spring physics (useSpring/useMotionValue). Custom cursor com lerp.",
    beneficio: "Sensação premium e 'alive' — assinatura visual de sites Awwwards.",
    custoPerformance: "Baixo",
    libraries: ["motion"],
    quandoAplicar: "Portfólios, agências, marcas fashion/luxury; NÃO em e-commerce crítico.",
    exemplo: "Motion+ cursor May 2025, Olivier Larose tutorials, Awwwards SOTD.",
  },
  {
    id: "kinetic-typography",
    nome: "Kinetic Typography (Variable Fonts)",
    icone: "Type",
    categoria: "Motion",
    descricao:
      "Animação de eixos de variable fonts (wght, wdth, slnt, opsz) via @keyframes ou JS. Texto que 'respira'.",
    beneficio: "Tipografia viva sem SVGs; leve e escalável; tendência 2024-2025 forte.",
    custoPerformance: "Baixo",
    libraries: ["splitting-js"],
    quandoAplicar: "Hero headlines, marquees, palavras-chave de marca.",
    exemplo: "Tutsplus kinetic typography Feb 2024, upskillist Feb 2025, Awwwards SOTD.",
  },
  {
    id: "scroll-storytelling",
    nome: "Scroll Storytelling",
    icone: "BookOpen",
    categoria: "Motion",
    descricao:
      "Narrativa progressive disclosure vinculada ao scroll. Revela conteúdo em 'capítulos' com ScrollTimeline/GSAP.",
    beneficio: "Engagement +18% em long-form; guia o utilizador por uma story arc.",
    custoPerformance: "Médio",
    libraries: ["gsap", "lenis"],
    quandoAplicar: "About pages, product launches, case studies, brand storytelling.",
    exemplo: "Apple product launches, NYT interactive articles, Awwwards narrative.",
  },
  {
    id: "reduced-motion-aware",
    nome: "Reduced-motion-aware Animation",
    icone: "Accessibility",
    categoria: "Motion",
    descricao:
      "`@media (prefers-reduced-motion: reduce)` desativa/ameniza animações. Combinado com `no-preference` para aplicá-las só a quem quer.",
    beneficio: "Cumpre WCAG 2.2.2 (Pause, Stop, Hide) + acessibilidade vestibular.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Sempre que houver animações não-essenciais (universal).",
    exemplo: "W3C/WAI WCAG 2.2 technique C39, HTTP Archive Web Almanac 2025.",
  },

  // ── Visual (8) ───────────────────────────────────────────────────────────
  {
    id: "glassmorphism-real",
    nome: "Real Glassmorphism (Liquid Glass)",
    icone: "Sparkles",
    categoria: "Visual",
    descricao:
      "backdrop-blur + saturate + brightness + border sutil. 2025 trouxe 'Liquid Glass' (visionOS 26) com blur dinâmico por profundidade.",
    beneficio: "Profundidade real, não fachada. Combina com meshes gradient.",
    custoPerformance: "Médio",
    libraries: ["tailwindcss"],
    quandoAplicar: "Modais, sidebars, cards sobre gradientes, command palettes.",
    exemplo: "Apple Vision Pro UI, iOS control center, Arc browser, visionOS 26.",
  },
  {
    id: "mesh-gradients",
    nome: "Mesh Gradients / Aurora Backgrounds",
    icone: "Palette",
    categoria: "Visual",
    descricao:
      "Gradientes radiais múltiplos em camadas. 2025 trouxe interpolação `oklab` para transições perceptualmente uniformes.",
    beneficio: "Backgrounds vivos, premium, sem peso de imagem. SVG ou CSS puro.",
    custoPerformance: "Baixo",
    libraries: ["tailwindcss"],
    quandoAplicar: "Hero backgrounds, auth pages, onboarding, empty states.",
    exemplo: "Stripe, Linear, Vercel, Framer landing.",
  },
  {
    id: "bento-grid",
    nome: "Bento Grid Layouts",
    icone: "LayoutGrid",
    categoria: "Visual",
    descricao:
      "Layout em grid modular com células de tamanhos assimétricos. CSS Grid + grid-template-areas ou grid-column/row: span.",
    beneficio: "Hierarquia visual clara e densidade informativa sem caos.",
    custoPerformance: "Baixo",
    libraries: ["tailwindcss"],
    quandoAplicar: "Landing SaaS, dashboards, portfólios, seções de features.",
    exemplo: "Apple iPhone widgets, Stripe homepage, Linear changelog.",
  },
  {
    id: "neo-brutalism-2",
    nome: "Neo-Brutalism 2.0 (Tactile)",
    icone: "Square",
    categoria: "Visual",
    descricao:
      "Brutalismo refinado — cores raw vibrantes, bordas sólidas 2-4px, sombras hard offset, typography mono/geométrica, com motion e polish.",
    beneficio: "Destaca-se em mar de sites minimalistas; performance-first.",
    custoPerformance: "Baixo",
    libraries: ["tailwindcss"],
    quandoAplicar: "Marcas dev tools, agências criativas, portfólios, produtos técnicos.",
    exemplo: "Gumroad, Figma configurator, Vercel error pages, FWA winners.",
  },
  {
    id: "editorial-layouts",
    nome: "Editorial / Magazine Layouts",
    icone: "Newspaper",
    categoria: "Visual",
    descricao:
      "Layouts tipo revista com CSS Grid de 12 colunas, multi-column text, drop caps, pull-quotes, baseline grid.",
    beneficio: "Credibilidade editorial e densidade narrativa para long-form.",
    custoPerformance: "Baixo",
    libraries: ["tailwindcss"],
    quandoAplicar: "Blogs de produto, case studies B2B, sites de agências, about pages.",
    exemplo: "The Pudding, Stripe Press, Awwwards editorial winners.",
  },
  {
    id: "spatial-ui",
    nome: "Spatial UI (Vision Pro influenced)",
    icone: "Layers",
    categoria: "Visual",
    descricao:
      "UI com profundidade real — transform: translateZ() em 3D, parallax de camadas, vidro com blur dinâmico por profundidade.",
    beneficio: "Prepara a UI para spatial computing e dá sensação premium em desktops.",
    custoPerformance: "Médio",
    libraries: ["motion", "three"],
    quandoAplicar: "Hero interativo, product showcases, immersive storytelling.",
    exemplo: "Apple Vision Pro site, visionOS 26 preview, Apple WWDC microsites.",
  },
  {
    id: "liquid-shapes",
    nome: "Liquid / Organic Shapes",
    icone: "Waves",
    categoria: "Visual",
    descricao:
      "SVG paths com border-radius assimétrico (`60% 40% 30% 70% / 60% 30% 70% 40%`) animados, ou blobs WebGL com shaders de noise.",
    beneficio: "Humaniza interfaces técnicas e quebra a rigidez do grid.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Marcas lifestyle, wellness, fintech consumer, seções 'soft'.",
    exemplo: "Headspace, Calm, Cash App, many wellness SaaS.",
  },
  {
    id: "ai-hero-imagery",
    nome: "AI-Generated Hero Imagery",
    icone: "Image",
    categoria: "Visual",
    descricao:
      "Imagens geradas por modelos de difusão (Midjourney/SD/DALL-E) usadas como hero, otimizadas com AVIF + next/image.",
    beneficio: "Visual único e on-brand sem custo de photo shoot; escala para variações.",
    custoPerformance: "Médio",
    libraries: ["next/image"],
    quandoAplicar: "Hero de campanhas, landing pages de produto, blog covers.",
    exemplo: "Shopify Editions, Adobe Firefly microsites, Awwwards SOTD 2024-2025.",
  },

  // ── Layout (7) ───────────────────────────────────────────────────────────
  {
    id: "container-queries",
    nome: "Container Queries",
    icone: "Square",
    categoria: "Layout",
    descricao:
      "`@container` query aplica estilos baseados no tamanho do container pai (não viewport). `container-type: inline-size` no parent. Baseline em todos browsers.",
    beneficio: "Componentes truly responsive — um card reage ao seu container.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Design systems, componentes reutilizáveis em layouts diferentes.",
    exemplo: "Sitepoint 'Layout Trilogy' Jun 2026, MDN documentado.",
  },
  {
    id: "css-subgrid",
    nome: "CSS Subgrid",
    icone: "Grid3X3",
    categoria: "Layout",
    descricao:
      "`grid-template-columns: subgrid` permite que um filho use o grid do avô, alinhando colunas perfeitamente. Baseline 2024.",
    beneficio: "Alinhamento perfeito de cards com alturas variáveis sem hacks.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Card grids heterogéneos, formulários multi-col, sidebars com items alinhados.",
    exemplo: "Sitepoint tutorial Jun 2026, MDN, todos browsers modernos.",
  },
  {
    id: "anchor-positioning",
    nome: "CSS Anchor Positioning",
    icone: "Crosshair",
    categoria: "Layout",
    descricao:
      "`anchor-name` + `position-anchor` posiciona um elemento relativamente a outro 'anchor'; com `position-try` para fallbacks. Chrome 125+.",
    beneficio: "Tooltips/popovers/dropdowns posicionais sem JS — anchor tracking nativo.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Tooltips, menus contextuais, command palettes, annotations.",
    exemplo: "Chrome for Developers Oct 2025 anchored container queries, MDN Apr 2026.",
  },
  {
    id: "popover-api",
    nome: "Popover API",
    icone: "MessageSquare",
    categoria: "Layout",
    descricao:
      "`popover` attribute + `popovertarget` cria overlays declarativos com top-layer, focus management e light dismiss automáticos. Baseline 2024.",
    beneficio: "Modais/menus/tooltips sem z-index wars nem libs de focus trap.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Action menus, notifications, tooltips, command palettes.",
    exemplo: "MDN, Chrome for Developers, usado em design systems 2025.",
  },
  {
    id: "css-nesting",
    nome: "CSS Nesting",
    icone: "Braces",
    categoria: "Layout",
    descricao:
      "Sintaxe `& .child { }` dentro de seletores, like Sass mas nativa. Baseline 2023.",
    beneficio: "CSS mais legível e scoped sem pré-processador; theming mais limpo.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Qualquer CSS moderno, design tokens scoped.",
    exemplo: "Tailwind v4 usa nativamente, todos browsers modernos 2024+.",
  },
  {
    id: "has-selector",
    nome: ":has() Selector (Parent Selector)",
    icone: "Filter",
    categoria: "Layout",
    descricao:
      "`:has()` permite selecionar elementos baseado nos seus descendentes (parent selector finalmente). Baseline 2023.",
    beneficio: "Estilização condicional sem JS — 'se card tem imagem, padding diferente'.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Card variants, form states (`input:has(+ .error)`), layout toggles.",
    exemplo: "Documentado MDN, usado por Tailwind v4 (`has-[:checked]`).",
  },
  {
    id: "asymmetric-layouts",
    nome: "Asymmetric / Broken Grid Layouts",
    icone: "LayoutDashboard",
    categoria: "Layout",
    descricao:
      "Grid 12-col com elementos em colunas não-alinhadas, `grid-column: 3 / span 4` com offsets deliberados; quebra visual da simetria clássica.",
    beneficio: "Cria ritmo visual e direciona o olhar; evita o 'template feel'.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Portfólios, agências, sites de marca premium.",
    exemplo: "Pentagram, Locomotive agency sites, Bauhaus-style revivals.",
  },

  // ── Micro (10) — CSS 2026 native features ────────────────────────────────
  {
    id: "text-balance",
    nome: "Text Balance & Pretty",
    icone: "Type",
    categoria: "Micro",
    descricao:
      "CSS `text-wrap: balance` (headlines) e `text-wrap: pretty` (parágrafos) para equilibrar linhas e evitar orphans.",
    beneficio: "Tipografia profissional instantânea, zero JS.",
    custoPerformance: "Baixo",
    libraries: ["tailwindcss"],
    quandoAplicar: "Headlines, parágrafos curtos, CTAs, card titles.",
    exemplo: "Apple marketing, Stripe blog, Vercel changelog, WebKit blog Apr 2025.",
  },
  {
    id: "text-box-trim",
    nome: "text-box-trim / Leading-trim",
    icone: "AlignCenterVertical",
    categoria: "Micro",
    descricao:
      "Remove o half-leading extra de cada font, permitindo alinhar texto a uma baseline precisa. `text-box-trim: both` + `text-box-edge: cap alphabetic`. Chrome default 2025.",
    beneficio: "Alinhamento perfeito de texto com padding/boxes — future of digital typesetting.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Buttons, badges, headings alinhados a grid baseline.",
    exemplo: "Microsoft Design Medium article, Chrome for Developers Jan 2025.",
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
    exemplo: "LinkedIn feed, YouTube, Vercel dashboard loading, React 19 Suspense.",
  },
  {
    id: "focus-visible",
    nome: ":focus-visible Polished",
    icone: "Eye",
    categoria: "A11y",
    descricao:
      "Focus rings visíveis apenas em navegação por teclado. Não em click. Custom styling com ring-2 ring-offset.",
    beneficio: "Acessibilidade WCAG 2.4.11 sem atrapalhar a estética para mouse users.",
    custoPerformance: "Baixo",
    libraries: ["tailwindcss", "radix-ui"],
    quandoAplicar: "Todos os elementos interativos. Obrigatório em produção.",
    exemplo: "GitHub, Vercel, Linear, qualquer site a11y-correct.",
  },
  {
    id: "oklch-colors",
    nome: "OKLCH Color Space",
    icone: "Palette",
    categoria: "Micro",
    descricao:
      "`oklch(L C H / alpha)` define cores no espaço Oklab (perceptualmente uniforme). Tints/shades consistentes, wide-gamut P3.",
    beneficio: "Tints/shades perceptualmente iguais; melhor que RGB/HSL para paletas.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Design tokens, paletas geradas programaticamente, branding.",
    exemplo: "oklch.com, Evil Martians article, Tailwind v4 default palette.",
  },
  {
    id: "color-mix",
    nome: "color-mix() Function",
    icone: "Blend",
    categoria: "Micro",
    descricao:
      "`color-mix(in oklch, var(--brand) 80%, white)` mistura duas cores num espaço especificado. Gera tints/shades dinamicamente em runtime.",
    beneficio: "Elimina dezenas de variáveis de 'brand-50...900'; tokens derivados automáticos.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Hover states, opacity variants, theming dinâmico.",
    exemplo: "MDN, Chrome for Developers, shadcn/ui 2025.",
  },
  {
    id: "relative-colors",
    nome: "Relative Colors (`from` keyword)",
    icone: "Palette",
    categoria: "Micro",
    descricao:
      "`oklch(from var(--brand) calc(l + 0.1) c h)` cria cor derivada de outra manipulando canais. Baseline 2024-2025.",
    beneficio: "Geração de paleta programática em CSS — sem JS, sem build step.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Tema dinâmico do user, gerar 9 shades de 1 cor de marca.",
    exemplo: "MDN relative colors, Chrome 119+.",
  },
  {
    id: "light-dark",
    nome: "light-dark() Function",
    icone: "Moon",
    categoria: "Micro",
    descricao:
      "`color: light-dark(black, white)` retorna conforme scheme ativo. Activado por `color-scheme: light dark` no `:root`. Todos browsers May 2024.",
    beneficio: "Dark mode nativo sem duplicar variáveis nem JS toggle.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Componentes com cores hard-coded; tokens simples.",
    exemplo: "pepelsbey.dev May 2024, MDN, Bram.us Sep 2025.",
  },
  {
    id: "variable-fonts",
    nome: "Variable Fonts",
    icone: "Type",
    categoria: "Micro",
    descricao:
      "1 ficheiro font com múltiplos eixos (`wght`, `wdth`, `slnt`, `opsz`, custom). Animável via `font-variation-settings`.",
    beneficio: "-80% payload vs carregar 6 estáticos; flexibilidade total.",
    custoPerformance: "Baixo",
    libraries: ["fontsource"],
    quandoAplicar: "Qualquer site 2025-2026; fonte de marca se disponível variable.",
    exemplo: "Google Fonts variable axis, Fontsource, Inter Variable, Roboto Flex.",
  },
  {
    id: "optical-sizing",
    nome: "Optical Sizing (font-optical-sizing)",
    icone: "ZoomIn",
    categoria: "Micro",
    descricao:
      "`font-optical-sizing: auto` ajusta traços automaticamente conforme font-size (textos pequenos = strokes mais grossos para legibilidade).",
    beneficio: "Tipografia otimizada perceptualmente; default em variable fonts modernas.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Sempre que usar variable font com eixo `opsz`.",
    exemplo: "MDN Jul 2026, documentado spec CSS Fonts 4.",
  },

  // ── A11y (6) ─────────────────────────────────────────────────────────────
  {
    id: "wcag-22-compliance",
    nome: "WCAG 2.2 Compliance",
    icone: "Accessibility",
    categoria: "A11y",
    descricao:
      "Standard W3C oficial desde Out 2023. Adiciona 9 success criteria: Focus Appearance (2.4.11), Target Size (2.5.8), Redundant Entry (3.3.7).",
    beneficio: "Compliance legal (EAA EU 2025) e acessibilidade real para mais défices.",
    custoPerformance: "Baixo",
    libraries: ["axe-core", "lighthouse"],
    quandoAplicar: "Todo projeto novo; migrar 2.1 → 2.2 até 2025.",
    exemplo: "W3C/WAI WCAG22, allaccessible.org checklist Nov 2025.",
  },
  {
    id: "target-size-24",
    nome: "Target Size Minimum (24x24 CSS px)",
    icone: "Hand",
    categoria: "A11y",
    descricao:
      "SC 2.5.8 (Level AA) exige alvos de pointer input mínimo 24×24 CSS pixels (exceto com 24px spacing ao redor).",
    beneficio: "Usabilidade touch e motor (Parkinson, tremor); AA é o padrão legal.",
    custoPerformance: "Baixo",
    libraries: ["tailwindcss"],
    quandoAplicar: "Botões, ícones clicáveis, checkboxes, close buttons.",
    exemplo: "W3C/WAI SC 2.5.8 docs, callingallminds.com guide.",
  },
  {
    id: "prefers-contrast",
    nome: "prefers-contrast: more",
    icone: "Contrast",
    categoria: "A11y",
    descricao:
      "Media query que detecta se user pediu mais contraste (não confundir com `forced-colors`). Permite subir contraste sem desactivar design system.",
    beneficio: "Atende users com low vision sem usar high-contrast extremo.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Texto secundário, borders subtis, focus rings.",
    exemplo: "MDN Apr 2026, kilianvalkhof.com Mar 2023.",
  },
  {
    id: "forced-colors",
    nome: "forced-colors (Windows High Contrast)",
    icone: "Accessibility",
    categoria: "A11y",
    descricao:
      "Media query activa quando user usa Windows High Contrast. Browser força cores limitadas. `forced-color-adjust: none` só em casos excecionais.",
    beneficio: "Suporta ~1% de users Windows que dependem deste modo (gov, enterprise).",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Testar todo UI em Edge/Chrome com 'High Contrast' ligado.",
    exemplo: "Microsoft Edge Dev blog Sep 2020, tempertemper.net, MDN.",
  },
  {
    id: "aria-live-regions",
    nome: "ARIA Live Regions",
    icone: "Radio",
    categoria: "A11y",
    descricao:
      "`aria-live=\"polite\"` / `\"assertive\"` + `aria-atomic` anuncia dinamicamente mudanças a screen readers (toasts, erros, counter).",
    beneficio: "Screen reader users (NVDA, JAWS, VoiceOver) são notificados de updates SPA.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Toasts, validação de form async, chat, cart counter.",
    exemplo: "WCAG 4.1.3 Status Messages (AA); Gmail, Slack web.",
  },
  {
    id: "skip-links",
    nome: "Skip Links & Heading Hierarchy",
    icone: "ListOrdered",
    categoria: "A11y",
    descricao:
      "`<a href=\"#main\" class=\"skip-link\">Skip to content</a>` visível no focus + uso semântico de `<h1>`→`<h6>` sem saltar níveis.",
    beneficio: "Screen reader users saltam nav repetitiva; SEO melhora estrutura.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Universal em todo site.",
    exemplo: "W3C/WAI, gov.uk, todo site a11y-compliant.",
  },

  // ── Perf (9) ─────────────────────────────────────────────────────────────
  {
    id: "react-19-suspense",
    nome: "React 19 + Suspense + useTransition",
    icone: "Zap",
    categoria: "Perf",
    descricao:
      "RSC envia HTML pronto do servidor, `<Suspense>` permite streaming de partes prontas, `useTransition` marca updates não-urgentes.",
    beneficio: "TTFB e FCP dramáticos; menos JS no cliente.",
    custoPerformance: "Baixo",
    libraries: ["react@19", "next@16"],
    quandoAplicar: "Qualquer app React nova em 2025-2026.",
    exemplo: "Next.js blog, peerlist.io Feb 2025, Next.js 16 community.",
  },
  {
    id: "partial-prerendering",
    nome: "Partial Prerendering (PPR)",
    icone: "Layers",
    categoria: "Perf",
    descricao:
      "Next.js 16 combina shell estático (instantâneo) com dynamic holes via streaming. Stable em Next 16.",
    beneficio: "LCP ~instantâneo mesmo em páginas dinâmicas; SSR + SSG.",
    custoPerformance: "Baixo",
    libraries: ["next@16"],
    quandoAplicar: "E-commerce, dashboards auth, news sites com mix estático/dinâmico.",
    exemplo: "Next.js docs Aug 2025, Next.js 16 PPR.",
  },
  {
    id: "image-optimization",
    nome: "Image Optimization (AVIF + next/image)",
    icone: "Image",
    categoria: "Perf",
    descricao:
      "`next/image` serve AVIF/WebP por accept-header, `sizes` attribute evita over-fetch, `priority` no LCP, lazy abaixo da dobra, `placeholder=\"blur\"` para LQIP.",
    beneficio: "LCP mais rápido e CLS zero; AVIF é 50% menor que WebP.",
    custoPerformance: "Baixo",
    libraries: ["next/image"],
    quandoAplicar: "Todo site com imagens em 2025.",
    exemplo: "Vercel docs, web.dev image performance guides.",
  },
  {
    id: "font-subsetting",
    nome: "Font Subsetting + Variable Fonts",
    icone: "Scissors",
    categoria: "Perf",
    descricao:
      "Subset para glyphs usados (`pyftsubset` ou Fontsource), `font-display: swap` para evitar FOIT, variable font em vez de 6 ficheiros estáticos.",
    beneficio: "Reduz font payload 60-80%; melhor FCP.",
    custoPerformance: "Baixo",
    libraries: ["fontsource", "next/font"],
    quandoAplicar: "Todo site com web fonts.",
    exemplo: "Next.js `next/font/google`, Fontsource variable packages.",
  },
  {
    id: "content-visibility",
    nome: "content-visibility: auto",
    icone: "Eye",
    categoria: "Perf",
    descricao:
      "Pula renderização de conteúdo off-screen, renderizando só quando scrolla para view. Usar com `contain-intrinsic-size`.",
    beneficio: "Melhoria de rendering performance em páginas longas (+50% em casos).",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Long article pages, feed infinite-scroll, dashboards com muitas cards.",
    exemplo: "web.dev article, DebugBear Mar 2025, MDN Jul 2026.",
  },
  {
    id: "css-containment",
    nome: "CSS Containment (`contain`)",
    icone: "Square",
    categoria: "Perf",
    descricao:
      "`contain: layout paint size style` isola um sub-tree do browser layout recalcs. `content-visibility: auto` é o caso extremo.",
    beneficio: "Layout/paint scoped → menos reflow em mudanças dinâmicas.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Listas longas, componentes complexos isolados.",
    exemplo: "web.dev, MDN CSS Containment spec.",
  },
  {
    id: "speculation-rules",
    nome: "Speculation Rules API (Prerender)",
    icone: "Zap",
    categoria: "Perf",
    descricao:
      "`<script type=\"speculationrules\">` instrui browser a prefetch/prerender URLs prováveis. Prerender executa JS em background. Chrome 121+.",
    beneficio: "Navegação instantânea (ou quase) sem esforço de dev; -1s+ em LCP percebido.",
    custoPerformance: "Médio",
    libraries: [],
    quandoAplicar: "E-commerce (links de produto), news (próximo artigo), docs (próxima página).",
    exemplo: "Shopify performance blog, Cloudflare rollout, Chrome for Developers Oct 2025.",
  },
  {
    id: "resource-hints",
    nome: "Resource Hints + fetchpriority",
    icone: "Link",
    categoria: "Perf",
    descricao:
      "`<link rel=\"preload/prefetch/dns-prefetch/preconnect\">` + `fetchpriority=\"high\"` no LCP image/font; `fetchpriority=\"low\"` em below-fold.",
    beneficio: "LCP element chega primeiro; reduz TTFB percebido.",
    custoPerformance: "Baixo",
    libraries: [],
    quandoAplicar: "Hero image, hero font, critical CSS, API endpoints do LCP.",
    exemplo: "web.dev, Chrome priority hints doc.",
  },
  {
    id: "islands-architecture",
    nome: "Islands Architecture / Lazy Hydration",
    icone: "Island",
    categoria: "Perf",
    descricao:
      "Render HTML estático no servidor; só hidratar 'islands' interativas com `client:idle`/`client:visible`/`client:load`. Astro popularizou.",
    beneficio: "-90% JS enviado para páginas maioria-estáticas.",
    custoPerformance: "Baixo",
    libraries: ["astro", "next-rsc"],
    quandoAplicar: "Blogs, marketing, docs, e-commerce com pouco JS interativo.",
    exemplo: "Astro docs Oct 2025, patterns.dev islands.",
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

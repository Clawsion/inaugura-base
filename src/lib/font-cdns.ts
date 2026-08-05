// ============================================================================
// font-cdns.ts — Listas de fonts confirmadas em CDNs (server + client safe)
// ============================================================================
// Este ficheiro não tem "use client" nem "use server" — pode ser importado
// tanto em componentes client como em API routes server-side.
// ============================================================================

// Fonts confirmadas no Google Fonts (carregamento garantido)
export const GOOGLE_FONTS_CONFIRMED = new Set([
  "Geist", "Geist Mono", "Inter", "Plus Jakarta Sans", "DM Sans", "Manrope",
  "Lexend", "Poppins", "Space Grotesk", "Sora", "Syne", "Unbounded",
  "Bricolage Grotesque", "Archivo", "Big Shoulders Display", "Anton",
  "Bebas Neue", "Oswald", "Outfit", "Fraunces", "Newsreader",
  "Instrument Serif", "Playfair Display", "Cormorant Garamond", "Lora",
  "Merriweather", "Fira Code", "Space Mono", "IBM Plex Mono", "Azeret Mono",
  "Hanken Grotesk", "Schibsted Grotesk", "Onest", "Mona Sans", "Hubot Sans",
  "Figtree", "Albert Sans", "Be Vietnam Pro", "Work Sans", "Nunito",
  "Public Sans", "Crimson Pro", "Literata", "JetBrains Mono",
  "Roboto", "Roboto Mono", "Roboto Flex", "Source Sans 3", "Source Serif 4",
  "Source Code Pro", "PT Sans", "PT Serif", "Lato", "Open Sans",
  "Montserrat", "Raleway", "Dancing Script", "Pacifico", "Caveat",
  "Sacramento", "Allura", "Alex Brush", "Arizonia", "Bad Script",
  "Bilbo Swash Caps", "Cookie", "Great Vibes", "Italianno", "Marck Script",
  "Parisienne", "Noto Serif", "Noto Serif Display", "EB Garamond",
  "Spectral", "Spectral SC", "Crimson Text", "DM Serif Display",
  "DM Serif Text", "Enriqueta", "Frank Ruhl Libre", "Glegoo", "Hepta Slab",
  "IBM Plex Serif", "Inria Serif", "Markazi Text", "Mate", "Mate SC",
  "Noto Serif SC", "Old Standard TT", "Philosopher", "Pridi", "Prata",
  "Teko", "Tourney", "Yanone Kaffeesatz", "Goldman", "Grenze",
  "Grenze Gotisch", "Holtwood One SC", "Iceberg", "Iceland",
  "Jacques Francois", "Jacques Francois Shadow", "Kavoon", "Kdam Thmor",
  "Keania One", "Kreon", "Kristi", "La Belle Aurore", "Lakki Reddy",
  "Langar", "Lemon", "Lemonada", "Lilita One", "Lobster", "Lobster Two",
  "Codystar", "Dela Gothic One", "DotGothic16", "Bungee", "Bungee Inline",
  "Bungee Shade", "Alfa Slab One", "Archivo Black", "Khand", "Karla",
  "Mulish", "Nunito Sans", "Quicksand", "Questrial", "Rajdhani",
  "Rationale", "Rubik", "Saira", "Saira Condensed", "Sarabun", "Tajawal",
  "Zen Kaku Gothic New", "Zen Loop", "Zen Maru Gothic", "Zen Old Mincho",
  "Zen Tokyo Zoo", "Anybody", "Arimo", "Atkinson Hyperlegible", "Bitter",
  "Carlito", "Chivo", "Commissioner", "Domine", "Encode Sans", "Epilogue",
  "Familjen Grotesk", "Gudea", "Heebo", "Hind", "IBM Plex Sans",
  "Inconsolata", "Inika", "Jost", "Kanit", "Mada", "Orienta",
  "Cutive Mono", "DM Mono", "Nanum Gothic Coding", "Spline Sans Mono",
  "Cousine", "Major Mono Display", "DotGothic16", "Barriecito",
  "GTL001", "Getai Grotesk", "Hyperlegible Sans",
]);

// Fonts confirmadas no Fontshare (carregamento garantido)
export const FONTSHARE_FONTS_CONFIRMED = new Set([
  "Satoshi", "General Sans", "Switzer", "Cabinet Grotesk", "Clash Display",
  "Clash Grotesk", "Boska", "Technor", "Melodrama", "Aktura", "RX100",
  "Zodiak", "Tanker", "Sentient", "Bespoke Serif", "Erode", "Gambetta",
  "Nippo", "Supreme", "Commit Mono", "Author", "Ranade", "Chillax", "Pally",
  "Telma", "Wargaming", "Strike", "Migra", "Panch", "Rocher", "Penaflor",
  "Sahitya", "Triode",
]);

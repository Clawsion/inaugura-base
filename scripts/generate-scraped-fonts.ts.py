#!/usr/bin/env python3
"""Gera o ficheiro TypeScript com as fonts extraídas organizadas por site."""
import json

with open("/tmp/fonts-final.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Mapear sites para labels e categorias default
SITE_INFO = {
    "befonts": {"label": "BeFonts", "url": "https://befonts.com"},
    "bestfreefonts": {"label": "BestFreeFonts", "url": "https://bestfreefonts.com"},
    "fontesk": {"label": "Fontesk", "url": "https://fontesk.com"},
    "freefaces": {"label": "FreeFaces", "url": "https://freefaces.gallery"},
    "usemodify": {"label": "UseModify", "url": "https://usemodify.com"},
    "awwwards": {"label": "Awwwards", "url": "https://awwwards.com"},
    "1001fonts": {"label": "1001Fonts", "url": "https://1001fonts.com"},
}

lines = [
    "// ============================================================================",
    "// SCRAPED FONTS — Fonts extraídas de sites curados (free for commercial use)",
    "// ============================================================================",
    "// Fontes: BeFonts, Fontesk, FreeFaces, UseModify (Nov 2026 scrape)",
    "// Todas free for commercial use. Organizadas por site de origem.",
    "// ============================================================================",
    "",
    'import type { FontDef } from "./font-catalog";',
    "",
    "export const SCRAPED_FONTS: FontDef[] = [",
]

total = 0
for site, fonts in data.items():
    if not fonts:
        continue
    info = SITE_INFO.get(site, {"label": site, "url": ""})
    lines.append(f"  // ─── {info['label']} ({info['url']}) — {len(fonts)} fonts ──────────")
    for font in fonts:
        # Determinar categoria baseada no nome
        cat = "sans"
        if any(w in font.lower() for w in ["mono", "code", "terminal"]):
            cat = "mono"
        elif any(w in font.lower() for w in ["serif", "slab", "times", "garamond", "playfair", "merriweather"]):
            cat = "serif"
        elif any(w in font.lower() for w in ["script", "hand", "brush", "calligraphy", "cursive"]):
            cat = "display"
        elif any(w in font.lower() for w in ["display", "black", "bold", "condensed", "poster"]):
            cat = "display"

        # Escape aspas no nome
        safe_name = font.replace('"', '\\"')

        lines.append(
            f'  {{ name: "{safe_name}", source: "{info["label"]}", category: "{cat}", '
            f'foundry: "{info["label"]}", siteType: ["Scraped"], license: "free", '
            f'personality: "Extraída de {info["label"]}" }},'
        )
        total += 1
    lines.append("")

lines.append("];")
lines.append("")
lines.append(f"// Total: {total} fonts extraídas de {len(data)} sites")

with open("/home/z/my-project/src/lib/scraped-fonts.ts", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"✓ Ficheiro gerado: /home/z/my-project/src/lib/scraped-fonts.ts")
print(f"Total: {total} fonts")

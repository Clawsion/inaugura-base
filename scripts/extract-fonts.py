#!/usr/bin/env python3
"""Extrai nomes de fonts de todos os ficheiros raspados."""
import json
import re
import os
import glob

SCRAPE_DIR = "/tmp/fonts-scrape"
OUTPUT = "/tmp/fonts-extracted.json"

# Mapear ficheiros para sites
def get_site_name(filename):
    base = os.path.basename(filename).replace(".json", "")
    if base.startswith("befonts"):
        return "befonts"
    if base.startswith("freefaces"):
        return "freefaces"
    if base.startswith("fontesk"):
        return "fontesk"
    if base.startswith("bestfreefonts"):
        return "bestfreefonts"
    if base.startswith("awwwards"):
        return "awwwards"
    if base.startswith("usemodify"):
        return "usemodify"
    if base.startswith("1001fonts"):
        return "1001fonts"
    return base

result = {}

for filepath in sorted(glob.glob(os.path.join(SCRAPE_DIR, "*.json"))):
    site_name = get_site_name(filepath)

    with open(filepath, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            continue

    page_data = data.get("data", data) if isinstance(data, dict) else {}
    html = page_data.get("html", "") if isinstance(page_data, dict) else ""

    if not html or len(html) < 500:
        continue

    if site_name not in result:
        result[site_name] = set()

    # Padrão 1: h2/h3/h4 com nome
    for match in re.finditer(r'<h[234][^>]*>([^<]{2,80})</h[234]>', html, re.IGNORECASE):
        name = match.group(1).strip()
        if 2 < len(name) < 60 and not name.startswith("←") and not name.startswith("→"):
            if not any(s in name.lower() for s in ["cookie", "privacy", "terms", "subscribe", "newsletter", "search", "menu", "home", "about", "contact", "category", "tag", "page", "next", "previous", "load more", "view all", "toggle", "switch", "all font"]):
                result[site_name].add(name)

    # Padrão 2: alt em imagens
    for match in re.finditer(r'alt="([^"]{2,60})"', html):
        name = match.group(1).strip()
        if not any(s in name.lower() for s in [".png", ".jpg", "logo", "banner", "image", "icon", "cookie", "privacy", "subscribe", "preview", "download", "font preview"]):
            if 2 < len(name) < 60:
                result[site_name].add(name)

    # Padrão 3: title em links
    for match in re.finditer(r'title="([^"]{2,60})"', html):
        name = match.group(1).strip()
        if not any(s in name.lower() for s in ["download", "preview", "view", "visit", "cookie", "privacy", "subscribe"]):
            if 2 < len(name) < 60:
                result[site_name].add(name)

    # Padrão 4: usemodify — links /fonts/
    for match in re.finditer(r'<a[^>]*href="/fonts/[^"]*"[^>]*>([^<]{2,60})</a>', html):
        result[site_name].add(match.group(1).strip())

    # Padrão 5: fontesk — data-name
    for match in re.finditer(r'data-name="([^"]{2,60})"', html):
        result[site_name].add(match.group(1).strip())

    # Padrão 6: freefaces — h2
    for match in re.finditer(r'<h2[^>]*>([^<]{2,60})</h2>', html):
        name = match.group(1).strip()
        if 2 < len(name) < 50:
            result[site_name].add(name)

# Limpar nomes e converter para sorted lists
cleaned_result = {}
for site, fonts in result.items():
    cleaned = set()
    for name in fonts:
        clean = re.sub(r'<[^>]+>', '', name).strip()
        clean = clean.strip(' "\'.,;:!?()[]{}')
        # Remover sufixos comuns de descrição
        clean = re.sub(r'\s*[-–—]\s*.*$', '', clean)  # remover " - Description"
        clean = re.sub(r'\s*\d+\s*Fonts?$', '', clean, flags=re.IGNORECASE)  # remover "2 Fonts"
        clean = re.sub(r'\s*Font$', '', clean, flags=re.IGNORECASE)  # remover "Font" suffix
        if clean and 2 < len(clean) < 50:
            # Capitalizar
            clean = clean.strip()
            cleaned.add(clean)
    cleaned_result[site] = sorted(cleaned)

# Guardar
with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(cleaned_result, f, ensure_ascii=False, indent=2)

print(f"\n✓ Extração completa")
total = sum(len(fonts) for fonts in cleaned_result.values())
print(f"Total: {total} fonts extraídas")
for site, fonts in cleaned_result.items():
    print(f"  {site}: {len(fonts)} fonts")
    if fonts:
        print(f"    Exemplos: {fonts[:3]}")

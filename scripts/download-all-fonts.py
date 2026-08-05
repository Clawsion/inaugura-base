#!/usr/bin/env python3
"""
Font Downloader — descarrega fonts de Fontshare + Google Fonts GitHub repo
para /home/z/my-project/font-files/ prontas para upload ao GitHub.
"""
import os
import json
import re
import urllib.request
import urllib.parse
import zipfile
import io
import time

OUTPUT_DIR = "/home/z/my-project/font-files"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─── 1. FONTSHARE — API de download retorna ZIP ───────────────────────────
FONTSHARE_FONTS = [
    "satoshi", "general-sans", "switzer", "cabinet-grotesk", "clash-display",
    "clash-grotesk", "boska", "technor", "melodrama", "aktura", "rx100",
    "zodiak", "tanker", "sentient", "bespoke-serif", "erode", "gambetta",
    "nippo", "supreme", "commit-mono", "author", "ranade", "chillax", "pally",
    "telma", "wargaming", "strike", "migra", "panch", "rocher", "penaflor",
    "sahitya", "triode",
]

def download_fontshare():
    """Descarrega fonts do Fontshare API (retorna ZIP com .woff2/.ttf)"""
    print("\n═══ FONTSHARE ═══")
    success = 0
    failed = 0
    
    for slug in FONTSHARE_FONTS:
        url = f"https://api.fontshare.com/v2/fonts/download/{slug}.zip"
        font_dir = os.path.join(OUTPUT_DIR, slug)
        os.makedirs(font_dir, exist_ok=True)
        
        # Verificar se já existe
        existing = [f for f in os.listdir(font_dir) if f.endswith(('.woff2', '.ttf', '.woff'))]
        if existing:
            print(f"  ✓ {slug} — já existe ({len(existing)} ficheiros)")
            success += 1
            continue
        
        try:
            print(f"  ↓ {slug}...", end=" ", flush=True)
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                zip_data = resp.read()
            
            # Extrair ZIP
            with zipfile.ZipFile(io.BytesIO(zip_data)) as zf:
                # Só extrair .woff2, .ttf, .woff (ignorar .txt, .md)
                for name in zf.namelist():
                    if name.lower().endswith(('.woff2', '.ttf', '.woff')):
                        # Manter apenas o nome do ficheiro (sem diretórios)
                        basename = os.path.basename(name)
                        if basename:
                            with zf.open(name) as src:
                                with open(os.path.join(font_dir, basename), 'wb') as dst:
                                    dst.write(src.read())
            
            files = [f for f in os.listdir(font_dir) if f.endswith(('.woff2', '.ttf', '.woff'))]
            print(f"✓ ({len(files)} ficheiros)")
            success += 1
            time.sleep(0.5)  # Rate limit
            
        except Exception as e:
            print(f"✗ ({str(e)[:50]})")
            failed += 1
    
    print(f"  Fontshare: {success} ✓ / {failed} ✗")
    return success, failed


# ─── 2. GOOGLE FONTS — repo google/fonts no GitHub ────────────────────────
GOOGLE_FONTS_TO_DOWNLOAD = [
    # Fonts que estão no catálogo mas podem não estar no Fontsource
    "barriecito", "dancing-script", "pacifico", "caveat", "sacramento",
    "allura", "alex-brush", "arizonia", "bad-script", "bilbo-swash-caps",
    "cookie", "great-vibes", "italianno", "marck-script", "parisienne",
    "lobster", "lobster-two", "playfair-display", "cormorant-garamond",
    "lora", "merriweather", "fraunces", "newsreader", "instrument-serif",
    "anton", "bebas-neue", "oswald", "archivo", "archivo-black",
    "big-shoulders-display", "bricolage-grotesque", "space-grotesk",
    "sora", "syne", "unbounded", "outfit", "dm-sans", "dm-serif-display",
    "dm-mono", "manrope", "plus-jakarta-sans", "figtree", "albert-sans",
    "lexend", "hanken-grotesk", "schibsted-grotesk", "onest", "work-sans",
    "nunito", "nunito-sans", "quicksand", "karla", "jost", "rubik",
    "saira", "commissioner", "epilogue", "mulish", "ibm-plex-sans",
    "ibm-plex-mono", "ibm-plex-serif", "source-sans-3", "source-serif-4",
    "source-code-pro", "jetbrains-mono", "fira-code", "space-mono",
    "roboto", "roboto-mono", "lato", "open-sans", "montserrat", "raleway",
    "poppins", "inter", "geist", "geist-mono",
    # Display
    "tekko", "tourney", "yanone-kaffeesatz", "goldman", "grenze",
    "grenze-gotisch", "holtwood-one-sc", "iceberg", "iceland",
    "jacques-francois", "jacques-francois-shadow", "kavoon",
    "kdam-thmor", "keania-one", "kreon", "kristi", "la-belle-aurore",
    "lakki-reddy", "langar", "lemon", "lemonada", "lilita-one",
    "codystar", "dela-gothic-one", "dotgothic16", "bungee", "bungee-inline",
    "bungee-shade", "alfa-slab-one",
    # Serif
    "eb-garamond", "spectral", "spectral-sc", "crimson-text",
    "crimson-pro", "enriqueta", "frank-ruhl-libre", "glegoo", "hepta-slab",
    "inria-serif", "markazi-text", "mate", "mate-sc", "noto-serif",
    "noto-serif-display", "old-standard-tt", "philosopher", "pridi", "prata",
    # Sans
    "anybody", "arimo", "atkinson-hyperlegible", "bitter", "carlito",
    "chivo", "domine", "encode-sans", "familjen-grotesk", "gudea", "heebo",
    "hind", "inconsolata", "inika", "kanit", "khand", "mada", "orienta",
    # Mono
    "cutive-mono", "dm-mono", "nanum-gothic-coding", "spline-sans-mono",
    "cousine", "major-mono-display",
]

def download_google_fonts():
    """Descarrega fonts do google/fonts GitHub repo"""
    print("\n═══ GOOGLE FONTS (GitHub repo) ═══")
    success = 0
    failed = 0
    
    for slug in GOOGLE_FONTS_TO_DOWNLOAD:
        font_dir = os.path.join(OUTPUT_DIR, slug)
        os.makedirs(font_dir, exist_ok=True)
        
        # Verificar se já existe
        existing = [f for f in os.listdir(font_dir) if f.endswith(('.woff2', '.ttf', '.woff'))]
        if existing:
            success += 1
            continue
        
        # Tentar várias paths no repo google/fonts
        # Formato: ofl/{slug}/{FontName-Regular.ttf}
        font_name = slug.replace("-", " ").title()
        file_name = font_name.replace(" ", "")
        
        possible_urls = [
            f"https://raw.githubusercontent.com/google/fonts/main/ofl/{slug}/{file_name}%5Bwght%5D.ttf",
            f"https://raw.githubusercontent.com/google/fonts/main/ofl/{slug}/{file_name}-Regular.ttf",
            f"https://raw.githubusercontent.com/google/fonts/main/ofl/{slug}/{file_name}%5Bwght%5D.woff2",
            f"https://raw.githubusercontent.com/google/fonts/main/ufl/{slug}/{file_name}-Regular.ttf",
            f"https://raw.githubusercontent.com/google/fonts/main/apache/{slug}/{file_name}-Regular.ttf",
        ]
        
        downloaded = False
        for url in possible_urls:
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=15) as resp:
                    if resp.status == 200:
                        data = resp.read()
                        if len(data) > 1000:  # Não é página de erro
                            # Determinar extensão
                            ext = ".ttf"
                            if ".woff2" in url:
                                ext = ".woff2"
                            elif ".woff" in url:
                                ext = ".woff"
                            
                            out_file = os.path.join(font_dir, f"{file_name}{ext}")
                            with open(out_file, 'wb') as f:
                                f.write(data)
                            downloaded = True
                            break
            except:
                continue
        
        if downloaded:
            print(f"  ✓ {slug}")
            success += 1
        else:
            # Não imprimir falhas individuais para não poluir
            failed += 1
    
    print(f"  Google Fonts: {success} ✓ / {failed} ✗ (de {len(GOOGLE_FONTS_TO_DOWNLOAD)})")
    return success, failed


# ─── 3. RESUMO ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("╔══════════════════════════════════════════════╗")
    print("║   FONT DOWNUILDER — Fontshare + Google       ║")
    print("╚══════════════════════════════════════════════╝")
    print(f"Output: {OUTPUT_DIR}")
    
    fs_ok, fs_fail = download_fontshare()
    gf_ok, gf_fail = download_google_fonts()
    
    total_ok = fs_ok + gf_ok
    total_fail = fs_fail + gf_fail
    
    print(f"\n{'═' * 50}")
    print(f"RESUMO FINAL:")
    print(f"  ✓ Descarregadas: {total_ok}")
    print(f"  ✗ Falharam: {total_fail}")
    print(f"  Total tentadas: {total_ok + total_fail}")
    print(f"\nDiretório: {OUTPUT_DIR}")
    
    # Contar ficheiros
    total_files = 0
    for root, dirs, files in os.walk(OUTPUT_DIR):
        total_files += len([f for f in files if f.endswith(('.woff2', '.ttf', '.woff'))])
    print(f"Ficheiros .woff2/.ttf/.woff: {total_files}")

#!/usr/bin/env python3
"""
Font Downloader v2 — extrai URLs do CSS do Fontshare e descarrega .woff2
+ descarrega Google Fonts do github.com/google/fonts
"""
import os
import re
import urllib.request
import time

OUTPUT_DIR = "/home/z/my-project/font-files"
os.makedirs(OUTPUT_DIR, exist_ok=True)

FONTSHARE_SLUGS = [
    "satoshi", "general-sans", "switzer", "cabinet-grotesk", "clash-display",
    "clash-grotesk", "boska", "technor", "melodrama", "aktura", "rx100",
    "zodiak", "tanker", "sentient", "bespoke-serif", "erode", "gambetta",
    "nippo", "supreme", "commit-mono", "author", "ranade", "chillax", "pally",
    "telma", "wargaming", "strike", "migra", "panch", "rocher", "penaflor",
    "sahitya", "triode",
]

def download_fontshare_v2():
    """Extrai URLs .woff2 do CSS do Fontshare e descarrega"""
    print("\n═══ FONTSHARE (via CSS extraction) ═══")
    success = 0
    failed = 0
    
    for slug in FONTSHARE_SLUGS:
        font_dir = os.path.join(OUTPUT_DIR, slug)
        os.makedirs(font_dir, exist_ok=True)
        
        existing = [f for f in os.listdir(font_dir) if f.endswith(('.woff2', '.ttf', '.woff'))]
        if existing:
            success += 1
            continue
        
        # Pedir CSS com todos os pesos
        css_url = f"https://api.fontshare.com/v2/css?f[]={slug}@400,500,600,700,800,900&display=swap"
        try:
            req = urllib.request.Request(css_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                css = resp.read().decode('utf-8')
            
            if not css or '@font-face' not in css:
                print(f"  ✗ {slug} — CSS vazio")
                failed += 1
                continue
            
            # Extrair URLs .woff2
            woff2_urls = re.findall(r"url\('(//cdn\.fontshare\.com/[^']+\.woff2)'\)", css)
            
            if not woff2_urls:
                # Tentar .ttf
                ttf_urls = re.findall(r"url\('(//cdn\.fontshare\.com/[^']+\.ttf)'\)", css)
                if ttf_urls:
                    woff2_urls = ttf_urls
            
            if not woff2_urls:
                print(f"  ✗ {slug} — sem URLs")
                failed += 1
                continue
            
            # Descarregar cada ficheiro (máximo 3 para não demorar)
            downloaded = 0
            seen = set()
            for url in woff2_urls[:6]:  # Máximo 6 pesos
                if url in seen:
                    continue
                seen.add(url)
                
                full_url = f"https:{url}"
                ext = ".woff2" if ".woff2" in url else ".ttf"
                out_file = os.path.join(font_dir, f"{slug}-{downloaded}{ext}")
                
                try:
                    req = urllib.request.Request(full_url, headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, timeout=15) as resp:
                        data = resp.read()
                    if len(data) > 1000:
                        with open(out_file, 'wb') as f:
                            f.write(data)
                        downloaded += 1
                except:
                    pass
            
            if downloaded > 0:
                print(f"  ✓ {slug} ({downloaded} ficheiros)")
                success += 1
            else:
                print(f"  ✗ {slug} — download falhou")
                failed += 1
            
            time.sleep(0.3)
            
        except Exception as e:
            print(f"  ✗ {slug} — {str(e)[:40]}")
            failed += 1
    
    print(f"  Fontshare: {success} ✓ / {failed} ✗")
    return success, failed


if __name__ == "__main__":
    print("╔══════════════════════════════════════╗")
    print("║  Font Downloader v2 — Fontshare CSS  ║")
    print("╚══════════════════════════════════════╝")
    
    fs_ok, fs_fail = download_fontshare_v2()
    
    # Resumo
    total_files = 0
    for root, dirs, files in os.walk(OUTPUT_DIR):
        total_files += len([f for f in files if f.endswith(('.woff2', '.ttf', '.woff'))])
    
    dirs_with_files = 0
    for d in os.listdir(OUTPUT_DIR):
        full = os.path.join(OUTPUT_DIR, d)
        if os.path.isdir(full):
            if any(f.endswith(('.woff2', '.ttf', '.woff')) for f in os.listdir(full)):
                dirs_with_files += 1
    
    print(f"\n{'═' * 45}")
    print(f"RESUMO:")
    print(f"  Fonts com ficheiros: {dirs_with_files}")
    print(f"  Ficheiros totais: {total_files}")
    print(f"  Diretório: {OUTPUT_DIR}")

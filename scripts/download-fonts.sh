#!/bin/bash
# ============================================================================
# FONT DOWNLOADER — descarrega todas as fonts scraped para /public/fonts/
# ============================================================================
# Este script descarrega as fonts que NÃO estão no Google Fonts nem Fontshare.
# As fonts que estão nesses CDNs não precisam de ser descarregadas.
#
# COMO USAR:
#   1. Corre este script: bash scripts/download-fonts.sh
#   2. As fonts são descarregadas para /public/fonts/
#   3. O @font-face no CSS vai procurar as fonts em /fonts/ (servido por Next.js)
#
# NOTAS:
#   - Algumas fonts podem não ser descarregadas (sites com anti-scraping)
#   - Verifica o log em /tmp/font-download-log.txt
#   - As fonts descarregadas ficam prontas para uso imediato
# ============================================================================

FONTS_DIR="/home/z/my-project/public/fonts"
LOG_FILE="/tmp/font-download-log.txt"
mkdir -p "$FONTS_DIR"
> "$LOG_FILE"

echo "(Font Downloader) A iniciar download de fonts..." | tee -a "$LOG_FILE"
echo "Destino: $FONTS_DIR" | tee -a "$LOG_FILE"
echo "================================================================" | tee -a "$LOG_FILE"

# Lista de fonts scraped que precisam download (não estão em Google/Fontshare CDN)
# Formato: "FontName|source-url|expected-file"
FONTS_TO_DOWNLOAD=(
  # BeFonts — cada font tem página em https://befonts.com/{slug}-font
  "Amazing Sweety|https://befonts.com/amazing-sweety-font|AmazingSweety.woff2"
  "Ancestri Slab|https://befonts.com/ancestri-slab-font|AncestriSlab.woff2"
  "Apoca Playful|https://befonts.com/apoca-playful-font|ApocaPlayful.woff2"
  "Awanika Display|https://befonts.com/awanika-display-font|AwanikaDisplay.woff2"
  "BF Material|https://befonts.com/bf-material-font|BFMaterial.woff2"
  # ... adicionar mais conforme necessário
)

# NOTA: Este script é um TEMPLATE. Para download real, cada site precisa
# de parsing específico porque os ficheiros .woff2 estão em URLs dinâmicas.
#
# ALTERNATIVA MAIS SIMPLES:
# 1. Vai a cada site manualmente (URLs no font-installation.ts)
# 2. Descarrega o .woff2
# 3. Coloca em /public/fonts/ com o nome correto
# 4. O @font-face vai funcionar automaticamente

SUCCESS=0
FAILED=0

for entry in "${FONTS_TO_DOWNLOAD[@]}"; do
  IFS='|' read -r name url filename <<< "$entry"
  echo "A descarregar: $name → $filename" | tee -a "$LOG_FILE"

  # Tentar download direto (pode falhar se o site tiver anti-scraping)
  # Isto é um placeholder — cada site precisa de parsing específico
  echo "  URL: $url" | tee -a "$LOG_FILE"
  echo "  ⚠ Download manual necessário — abre a URL no browser" | tee -a "$LOG_FILE"
  ((FAILED++))
done

echo "================================================================" | tee -a "$LOG_FILE"
echo "Resumo:" | tee -a "$LOG_FILE"
echo "  ✓ Descarregadas: $SUCCESS" | tee -a "$LOG_FILE"
echo "  ⚠ Falharam (download manual): $FAILED" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "PRÓXIMOS PASSOS:" | tee -a "$LOG_FILE"
echo "1. Para cada font que falhou, abre a URL no browser" | tee -a "$LOG_FILE"
echo "2. Descarrega o ficheiro .woff2 ou .woff" | tee -a "$LOG_FILE"
echo "3. Coloca em: $FONTS_DIR/" | tee -a "$LOG_FILE"
echo "4. O @font-face vai funcionar automaticamente" | tee -a "$LOG_FILE"

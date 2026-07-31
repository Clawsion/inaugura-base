#!/usr/bin/env bash
# Testa a Server Action com headers de proxy reais (simulando o gateway space-z.ai)
# Antes da correção: HTTP 500 com "Invalid Server Actions request"
# Depois da correção: deve passar no check CSRF (200 ou outro erro interno, mas NÃO "Invalid Server Actions")

set -e
cd /home/z/my-project

echo "=== A garantir que o dev server está a correr ==="
if ! pgrep -f "next-server" > /dev/null; then
  echo "  A arrancar dev server..."
  nohup bun run dev > dev.log 2>&1 &
  disown
  sleep 10
fi

if ! pgrep -f "next-server" > /dev/null; then
  echo "❌ Dev server não arrancou"
  tail -30 dev.log
  exit 1
fi

echo "  ✅ Dev server está UP"
echo ""

echo "=== A buscar homepage para extrair Action ID ==="
HTML=$(curl -s http://localhost:3000/)
echo "  Homepage: $(echo "$HTML" | wc -c) bytes"

# Em Next.js 16 com Turbopack, o action ID é criado em chunks como:
#   createServerReference("hash", ...) em src_app_d1972174._.js
# Vamos buscar esse chunk dinamicamente
ACTION_ID=""
for chunk in $(echo "$HTML" | grep -oE '/_next/static/chunks/src_app_[a-z0-9_]+._\.js' | sort -u); do
  CHUNK_CONTENT=$(curl -s "http://localhost:3000${chunk}")
  # O pattern exato no Turbopack: createServerReference)("HASH", ..., "generateProject")
  ACTION_ID=$(echo "$CHUNK_CONTENT" | grep -oE 'createServerReference[^)]*\)\("[a-f0-9]+"' | grep -oE '[a-f0-9]{40,64}' | head -1)
  if [ -n "$ACTION_ID" ]; then
    echo "  Encontrado no chunk: $chunk"
    break
  fi
done

if [ -z "$ACTION_ID" ]; then
  echo "❌ Não foi possível extrair Action ID do generateProject"
  exit 1
fi

echo "  Action ID: $ACTION_ID"
echo ""

echo "=== A fazer POST à Server Action com headers de proxy ==="
BOUNDARY="----WebKitFormBoundary7MA4YWxkTrZu0gW"

# Constrói body multipart/form-data (formato Server Actions)
FORM_VALUES='{"briefing":"Estou a criar uma plataforma SaaS B2B","nicho":"SaaS B2B","siteType":"single-page","seccoes":["Hero"],"efeitos":[],"paletaMode":"auto","typographyMode":"auto","promptMode":"compact","nivel":"mvp","idioma":"pt","incluirMockups":false,"incluirDesignTokens":false,"incluirRoadmap":false,"skinsSelecionados":[],"selectedSkills":[],"selectedIntegrations":[],"selectedDesignVisual":[],"fontsPlayground":[],"paletaManual":[],"referencias":[],"funcionalidadesEspeciais":[],"conteudoTextos":false,"conteudoVideos":false,"conteudoTextosObs":"","conteudoVideosObs":"","typographyManual":{"heading":"","body":"","mono":""}}'

BODY=$(cat <<EOF
--${BOUNDARY}
Content-Disposition: form-data; name="1_\$ACTION_REF_"

${ACTION_ID}
--${BOUNDARY}
Content-Disposition: form-data; name="1_\$ACTION_1:0"

["${FORM_VALUES}"]
--${BOUNDARY}
Content-Disposition: form-data; name="0"

["${FORM_VALUES}"]
--${BOUNDARY}--
EOF
)

# Substituir newlines reais por \r\n
BODY=$(echo "$BODY" | sed 's/$/\r/')

# Faz o POST com headers que reproduzem o cenário do gateway space-z.ai
RESPONSE=$(echo "$BODY" | curl -s -X POST "http://localhost:3000/" \
  -H "Content-Type: multipart/form-data; boundary=${BOUNDARY}" \
  -H "Next-Action: ${ACTION_ID}" \
  -H "Accept: text/x-component" \
  -H "Origin: https://preview-chat-ce9c7347-e84c-4f4b-a9e8-b9c6b1ee749c.space-z.ai" \
  -H "X-Forwarded-Host: ws-abaac-fceeaf-ogxipghktr.cn-hongkong-vpc.fcapp.run" \
  -H "X-Forwarded-Proto: https" \
  -H "Host: localhost:3000" \
  -H "User-Agent: Mozilla/5.0 (test)" \
  -H "Accept-Language: pt-PT,pt;q=0.9,en;q=0.8" \
  --data-binary @- \
  -w "\n---HTTP_STATUS:%{http_code}---" \
  --max-time 60 \
  2>&1) || true

echo "$RESPONSE" | head -20
echo ""

# Verifica se ainda há "Invalid Server Actions" no log
sleep 2
echo "=== Logs do dev server (últimas 10 linhas) ==="
tail -10 dev.log
echo ""

if echo "$RESPONSE" | grep -q "Invalid Server Actions"; then
  echo "❌ AINDA FALHA: 'Invalid Server Actions request' persiste"
  exit 1
elif echo "$RESPONSE" | grep -q "HTTP_STATUS:200"; then
  echo "✅ SUCESSO: A Server Action passou no check CSRF e executou!"
elif tail -10 dev.log | grep -q "Invalid Server Actions"; then
  echo "❌ Erro 'Invalid Server Actions' no log do servidor"
  exit 1
else
  echo "✅ Check CSRF passou (resposta pode ter erro interno, mas NÃO é mais 'Invalid Server Actions')"
fi

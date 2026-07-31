#!/usr/bin/env bash
# Teste exaustivo de TODOS os parâmetros da Server Action.
# Inicia o servidor, espera ficar ready, corre testes, mantém servidor vivo.
set +e

cd /home/z/my-project

# 1. Garantir que o servidor está UP (reiniciar se necessário)
if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ --max-time 3 | grep -q "200"; then
  echo "=== A arrancar dev server ==="
  pkill -9 -f "next-server" 2>/dev/null
  pkill -9 -f "next dev" 2>/dev/null
  sleep 2
  rm -f dev.log
  setsid bash -c 'exec bun run dev > dev.log 2>&1' < /dev/null &
  disown
  # Esperar que fique ready
  for i in $(seq 1 30); do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ --max-time 3 | grep -q "200"; then
      echo "✅ Servidor ready após ${i}s"
      break
    fi
    sleep 1
  done
fi

if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ --max-time 3 | grep -q "200"; then
  echo "❌ Servidor não arrancou"
  tail -30 dev.log
  exit 1
fi

# 2. Buscar o Action ID real do generateProject
echo ""
echo "=== A extrair Action ID ==="
HTML=$(curl -s http://localhost:3000/)
ACTION_ID=""
for chunk in $(echo "$HTML" | grep -oE '/_next/static/chunks/src_app_[a-z0-9_]+\._\.js' | sort -u); do
  CHUNK=$(curl -s "http://localhost:3000${chunk}")
  ACTION_ID=$(echo "$CHUNK" | grep -oE 'createServerReference[^)]*\)\("[a-f0-9]{40,64}"' | grep -oE '[a-f0-9]{40,64}' | head -1)
  if [ -n "$ACTION_ID" ]; then
    break
  fi
done

if [ -z "$ACTION_ID" ]; then
  echo "❌ Action ID não encontrado"
  exit 1
fi
echo "Action ID: $ACTION_ID"

# 3. Função para chamar a Server Action
call_action() {
  local form_json="$1"
  local label="$2"
  local boundary="----testboundary12345"

  local body="\
--${boundary}\r
Content-Disposition: form-data; name=\"1_\$ACTION_REF_\"\r
\r
${ACTION_ID}\r
--${boundary}\r
Content-Disposition: form-data; name=\"1_\$ACTION_1:0\"\r
\r
[${form_json}]\r
--${boundary}\r
Content-Disposition: form-data; name=\"0\"\r
\r
[${form_json}]\r
--${boundary}--\r
"

  local start=$(date +%s)
  local resp=$(echo -e "$body" | curl -s -X POST "http://localhost:3000/" \
    -H "Content-Type: multipart/form-data; boundary=${boundary}" \
    -H "Next-Action: ${ACTION_ID}" \
    -H "Accept: text/x-component" \
    -H "Origin: https://preview-chat-ce9c7347-e84c-4f4b-a9e8-b9c6b1ee749c.space-z.ai" \
    -H "X-Forwarded-Host: ws-abaac-fceeaf-ogxipghktr.cn-hongkong-vpc.fcapp.run" \
    -H "X-Forwarded-Proto: https" \
    -H "Host: localhost:3000" \
    -H "User-Agent: Mozilla/5.0 (test)" \
    --data-binary @- \
    -w "\n---HTTP_STATUS:%{http_code}" \
    --max-time 180 2>&1)
  local end=$(date +%s)
  local elapsed=$((end - start))

  local status=$(echo "$resp" | grep -oE 'HTTP_STATUS:[0-9]+' | grep -oE '[0-9]+')
  local body_resp=$(echo "$resp" | sed 's/---HTTP_STATUS:[0-9]*//')

  # Extrair o JSON da linha "1:{...}"
  local json_line=$(echo "$body_resp" | grep -E '^1:' | head -1)
  local json_str="${json_line#1:}"

  local ok="false"
  local err=""
  if [ "$status" = "200" ] && [ -n "$json_str" ]; then
    if echo "$json_str" | python3 -c "import json,sys; d=json.load(sys.stdin); print('OK' if d.get('ok') else 'FAIL:'+str(d.get('error',''))[:200])" 2>/dev/null | head -1 > /tmp/result.txt; then
      local result=$(cat /tmp/result.txt)
      if echo "$result" | grep -q "^OK"; then
        ok="true"
      else
        err=$(echo "$result" | sed 's/^FAIL://')
      fi
    fi
  fi

  if [ "$ok" = "true" ]; then
    echo "✅ [$label] HTTP $status em ${elapsed}s"
  else
    echo "❌ [$label] HTTP $status em ${elapsed}s"
    if [ -n "$err" ]; then
      echo "   error: $err"
    fi
    echo "   raw: $(echo "$body_resp" | head -c 200)"
  fi
}

# 4. FormValues base
BASE_FORM='{
  "briefing":"Plataforma SaaS B2B para gestão de equipas remotas. Público: CTOs e Head of Ops de startups Series A-B.",
  "nicho":"SaaS B2B",
  "siteType":"single-page",
  "seccoes":["Hero","Features","CTA","Footer"],
  "efeitos":["Reveal on scroll","Smooth scroll"],
  "paletaMode":"auto",
  "paletaManual":[],
  "typographyMode":"auto",
  "typographyManual":{"heading":"","body":"","mono":""},
  "promptMode":"compact",
  "nivel":"mvp",
  "idioma":"pt",
  "incluirMockups":false,
  "incluirDesignTokens":true,
  "incluirRoadmap":false,
  "skinsSelecionados":[],
  "selectedSkills":[],
  "selectedIntegrations":[],
  "selectedDesignVisual":[],
  "fontsPlayground":[],
  "referencias":[],
  "funcionalidadesEspeciais":[],
  "conteudoTextos":false,
  "conteudoTextosObs":"",
  "conteudoVideos":false,
  "conteudoVideosObs":""
}'

echo ""
echo "=== TESTE 1: Form mínimo ==="
call_action "$BASE_FORM" "form-mínimo"

echo ""
echo "=== TESTE 2: Paleta manual ==="
call_action '{
  "briefing":"Plataforma SaaS B2B para gestão de equipas remotas. Público: CTOs e Head of Ops de startups Series A-B.",
  "nicho":"SaaS B2B","siteType":"single-page","seccoes":["Hero","Features","CTA","Footer"],
  "efeitos":["Reveal on scroll"],"paletaMode":"manual",
  "paletaManual":[
    {"nome":"Background","hex":"#0A0A0B","uso":"Fundo principal"},
    {"nome":"Card","hex":"#141416","uso":"Superfícies"},
    {"nome":"Accent","hex":"#00E5A0","uso":"CTAs"},
    {"nome":"Text","hex":"#F4F4F5","uso":"Texto"}
  ],
  "typographyMode":"auto","typographyManual":{"heading":"","body":"","mono":""},
  "promptMode":"compact","nivel":"mvp","idioma":"pt",
  "incluirMockups":false,"incluirDesignTokens":true,"incluirRoadmap":false,
  "skinsSelecionados":[],"selectedSkills":[],"selectedIntegrations":[],"selectedDesignVisual":[],
  "fontsPlayground":[],"referencias":[],"funcionalidadesEspeciais":[],
  "conteudoTextos":false,"conteudoTextosObs":"","conteudoVideos":false,"conteudoVideosObs":""
}' "paleta-manual"

echo ""
echo "=== TESTE 3: Tipografia manual ==="
call_action '{
  "briefing":"Plataforma SaaS B2B para gestão de equipas remotas. Público: CTOs e Head of Ops de startups Series A-B.",
  "nicho":"SaaS B2B","siteType":"single-page","seccoes":["Hero"],"efeitos":[],
  "paletaMode":"auto","paletaManual":[],
  "typographyMode":"manual",
  "typographyManual":{"heading":"Geist","body":"Inter","mono":"Geist Mono"},
  "promptMode":"compact","nivel":"mvp","idioma":"pt",
  "incluirMockups":false,"incluirDesignTokens":true,"incluirRoadmap":false,
  "skinsSelecionados":[],"selectedSkills":[],"selectedIntegrations":[],"selectedDesignVisual":[],
  "fontsPlayground":[],"referencias":[],"funcionalidadesEspeciais":[],
  "conteudoTextos":false,"conteudoTextosObs":"","conteudoVideos":false,"conteudoVideosObs":""
}' "typography-manual"

echo ""
echo "=== TESTE 4: promptMode extended ==="
call_action '{
  "briefing":"Plataforma SaaS B2B para gestão de equipas remotas. Público: CTOs e Head of Ops de startups Series A-B.",
  "nicho":"SaaS B2B","siteType":"single-page","seccoes":["Hero"],"efeitos":[],
  "paletaMode":"auto","paletaManual":[],
  "typographyMode":"auto","typographyManual":{"heading":"","body":"","mono":""},
  "promptMode":"extended","nivel":"mvp","idioma":"pt",
  "incluirMockups":false,"incluirDesignTokens":true,"incluirRoadmap":false,
  "skinsSelecionados":[],"selectedSkills":[],"selectedIntegrations":[],"selectedDesignVisual":[],
  "fontsPlayground":[],"referencias":[],"funcionalidadesEspeciais":[],
  "conteudoTextos":false,"conteudoTextosObs":"","conteudoVideos":false,"conteudoVideosObs":""
}' "prompt-extended"

echo ""
echo "=== TESTE 5: Nível production ==="
call_action '{
  "briefing":"Plataforma SaaS B2B para gestão de equipas remotas. Público: CTOs e Head of Ops de startups Series A-B.",
  "nicho":"SaaS B2B","siteType":"single-page","seccoes":["Hero"],"efeitos":[],
  "paletaMode":"auto","paletaManual":[],
  "typographyMode":"auto","typographyManual":{"heading":"","body":"","mono":""},
  "promptMode":"compact","nivel":"production","idioma":"pt",
  "incluirMockups":false,"incluirDesignTokens":true,"incluirRoadmap":false,
  "skinsSelecionados":[],"selectedSkills":[],"selectedIntegrations":[],"selectedDesignVisual":[],
  "fontsPlayground":[],"referencias":[],"funcionalidadesEspeciais":[],
  "conteudoTextos":false,"conteudoTextosObs":"","conteudoVideos":false,"conteudoVideosObs":""
}' "nivel-production"

echo ""
echo "=== TESTE 6: Idioma en ==="
call_action '{
  "briefing":"Plataforma SaaS B2B para gestão de equipas remotas. Público: CTOs e Head of Ops de startups Series A-B.",
  "nicho":"SaaS B2B","siteType":"single-page","seccoes":["Hero"],"efeitos":[],
  "paletaMode":"auto","paletaManual":[],
  "typographyMode":"auto","typographyManual":{"heading":"","body":"","mono":""},
  "promptMode":"compact","nivel":"mvp","idioma":"en",
  "incluirMockups":false,"incluirDesignTokens":true,"incluirRoadmap":false,
  "skinsSelecionados":[],"selectedSkills":[],"selectedIntegrations":[],"selectedDesignVisual":[],
  "fontsPlayground":[],"referencias":[],"funcionalidadesEspeciais":[],
  "conteudoTextos":false,"conteudoTextosObs":"","conteudoVideos":false,"conteudoVideosObs":""
}' "idioma-en"

echo ""
echo "=== TESTE 7: Com skills + integrações ==="
call_action '{
  "briefing":"Plataforma SaaS B2B para gestão de equipas remotas. Público: CTOs e Head of Ops de startups Series A-B.",
  "nicho":"SaaS B2B","siteType":"single-page","seccoes":["Hero"],"efeitos":[],
  "paletaMode":"auto","paletaManual":[],
  "typographyMode":"auto","typographyManual":{"heading":"","body":"","mono":""},
  "promptMode":"compact","nivel":"mvp","idioma":"pt",
  "incluirMockups":false,"incluirDesignTokens":true,"incluirRoadmap":false,
  "skinsSelecionados":[],
  "selectedSkills":["shadcn-ui","motion","sonner","vaul","input-otp"],
  "selectedIntegrations":["stripe","posthog","sentry"],
  "selectedDesignVisual":[],
  "fontsPlayground":[],"referencias":[],"funcionalidadesEspeciais":[],
  "conteudoTextos":false,"conteudoTextosObs":"","conteudoVideos":false,"conteudoVideosObs":""
}' "skills-integrations"

echo ""
echo "=== TESTE 8: Com mockups + roadmap ==="
call_action '{
  "briefing":"Plataforma SaaS B2B para gestão de equipas remotas. Público: CTOs e Head of Ops de startups Series A-B.",
  "nicho":"SaaS B2B","siteType":"single-page","seccoes":["Hero"],"efeitos":[],
  "paletaMode":"auto","paletaManual":[],
  "typographyMode":"auto","typographyManual":{"heading":"","body":"","mono":""},
  "promptMode":"compact","nivel":"mvp","idioma":"pt",
  "incluirMockups":true,"incluirDesignTokens":true,"incluirRoadmap":true,
  "skinsSelecionados":[],"selectedSkills":[],"selectedIntegrations":[],"selectedDesignVisual":[],
  "fontsPlayground":[],"referencias":[],"funcionalidadesEspeciais":[],
  "conteudoTextos":false,"conteudoTextosObs":"","conteudoVideos":false,"conteudoVideosObs":""
}' "mockups-roadmap"

echo ""
echo "=== TESTE 9: E-commerce ==="
call_action '{
  "briefing":"Loja online de moda sustentável para mulheres 25-40 anos. Público: urban professionals que valorizam ética e estética.",
  "nicho":"E-commerce Moda","siteType":"ecommerce","seccoes":["Hero","Product Grid","Cart","Checkout","Footer"],
  "efeitos":["Reveal on scroll","Smooth scroll","Parallax"],
  "paletaMode":"auto","paletaManual":[],
  "typographyMode":"auto","typographyManual":{"heading":"","body":"","mono":""},
  "promptMode":"compact","nivel":"production","idioma":"pt",
  "incluirMockups":true,"incluirDesignTokens":true,"incluirRoadmap":false,
  "skinsSelecionados":[],"selectedSkills":[],"selectedIntegrations":["stripe"],"selectedDesignVisual":[],
  "fontsPlayground":[],"referencias":[],"funcionalidadesEspeciais":[],
  "conteudoTextos":true,"conteudoTextosObs":"Preciso de textos para hero e descrições de produtos",
  "conteudoVideos":false,"conteudoVideosObs":""
}' "ecommerce"

echo ""
echo "=== TESTE 10: Dashboard ==="
call_action '{
  "briefing":"Dashboard administrativo para gestão de equipas remotas com analytics, gestão de utilizadores e relatórios.",
  "nicho":"SaaS B2B","siteType":"dashboard","seccoes":["Dashboard","Auth","Settings","Profile"],
  "efeitos":[],"paletaMode":"auto","paletaManual":[],
  "typographyMode":"auto","typographyManual":{"heading":"","body":"","mono":""},
  "promptMode":"compact","nivel":"production","idioma":"pt",
  "incluirMockups":true,"incluirDesignTokens":true,"incluirRoadmap":true,
  "skinsSelecionados":[],"selectedSkills":["shadcn-ui","tanstack-query","recharts"],
  "selectedIntegrations":["posthog"],"selectedDesignVisual":[],
  "fontsPlayground":[],"referencias":[],"funcionalidadesEspeciais":["Dark mode","Multi-idioma"],
  "conteudoTextos":false,"conteudoTextosObs":"","conteudoVideos":false,"conteudoVideosObs":""
}' "dashboard"

echo ""
echo "=== Resumo final ==="
echo "Logs do servidor (últimas 20 linhas):"
tail -20 dev.log

"use server";

// ============================================================================
// generate.ts — Server Action principal do ProjectForge AI
// ============================================================================
// Fluxo:
//  1. Recebe os dados do formulário (FormValues).
//  2. Constrói o system prompt dinâmico.
//  3. Define a tool `emitProjectSpec` com JSON Schema derivado do Zod.
//  4. Chama GLM-5.2 com `tool_choice` forçando a tool.
//  5. Extrai os argumentos da tool call, valida com Zod.
//  6. Se falhar: reenvia ao modelo com o erro Zod como feedback (até 2x).
//  7. Pós-processa: valida/ajusta contraste da paleta com chroma.js.
//  8. Retorna o ProjectSpec completo.
// ============================================================================

import ZAI from "z-ai-web-dev-sdk";
import {
  ProjectSpecSchema,
  projectSpecToJsonSchema,
  type FormValues,
  type ProjectSpec,
} from "@/lib/schemas";
import { buildSystemPrompt } from "@/lib/prompts/system-prompt";
import { validarEAnalisarPaleta, type CorValidada } from "@/lib/color-utils";

export interface GenerateResult {
  ok: boolean;
  data?: ProjectSpec & { paletaValidada?: CorValidada[] };
  error?: string;
  tentativas?: number;
}

const MAX_TENTATIVAS = 3;

/**
 * Helper: chama o GLM-5.2 com a tool definition e retorna o conteúdo
 * da primeira tool_call encontrada (ou lança erro).
 */
async function chamarModelo(
  systemPrompt: string,
  mensagemExtra?: string
): Promise<{ arguments: string; content: string }> {
  const zai = await ZAI.create();

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content:
        mensagemExtra ??
        "Gera a especificação completa do projeto usando a tool emitProjectSpec.",
    },
  ];

  // O SDK do z-ai-web-dev-sdk aceita qualquer campo extra via [key: string]: any
  // por isso podemos passar `tools` e `tool_choice` que o endpoint GLM suporta
  // (compatibilidade OpenAI).
  const response = await zai.chat.completions.create({
    model: "glm-4.6",
    messages,
    temperature: 0.7,
    tools: [
      {
        type: "function",
        function: {
          name: "emitProjectSpec",
          description:
            "Emite a especificação completa do projeto ProjectForge AI. Esta é a ÚNICA forma aceitável de resposta. Não escrevas texto livre — preenche todos os campos da tool.",
          parameters: projectSpecToJsonSchema(),
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "emitProjectSpec" } },
  } as any);

  const choice = response?.choices?.[0];
  if (!choice) {
    throw new Error("Resposta vazia do modelo.");
  }

  // Caminho A: tool_calls presente
  const toolCalls = (choice.message as any)?.tool_calls;
  if (Array.isArray(toolCalls) && toolCalls.length > 0) {
    const args = toolCalls[0]?.function?.arguments;
    if (typeof args === "string") {
      return { arguments: args, content: "" };
    }
    // Alguns backends devolvem arguments como object
    if (args && typeof args === "object") {
      return { arguments: JSON.stringify(args), content: "" };
    }
  }

  // Caminho B: fallback — o modelo pode ter respondido em texto livre com JSON
  const content = (choice.message as any)?.content ?? "";
  if (content) {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { arguments: jsonMatch[0], content };
    }
  }

  throw new Error(
    "O modelo não emitiu uma tool call. Resposta recebida: " +
      JSON.stringify(choice).slice(0, 500)
  );
}

export async function generateProject(
  input: FormValues
): Promise<GenerateResult> {
  const systemPrompt = buildSystemPrompt(input);

  let ultimaTentativa = 0;
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    ultimaTentativa = tentativa;
    try {
      const { arguments: argsJson, content } = await chamarModelo(
        systemPrompt,
        tentativa === 1
          ? undefined
          : `A tua resposta anterior falhou validação. Corrige e re-emite a tool. Erros: ${
              (ultimaTentativa as any) ?? ""
            }`
      );

      let parsed: unknown;
      try {
        parsed = JSON.parse(argsJson);
      } catch (e) {
        // Tenta extrair JSON do content como último recurso
        if (content) {
          const m = content.match(/\{[\s\S]*\}/);
          if (m) parsed = JSON.parse(m[0]);
          else throw e;
        } else {
          throw e;
        }
      }

      const result = ProjectSpecSchema.safeParse(parsed);
      if (result.success) {
        // Pós-processamento: valida/ajusta contraste da paleta.
        const paletaValidada = validarEAnalisarPaleta(result.data.palette);
        const dataFinal: ProjectSpec = {
          ...result.data,
          palette: paletaValidada.map((c) => ({
            nome: c.nome,
            hex: c.hex,
            uso: c.uso,
          })),
        };
        return {
          ok: true,
          data: { ...dataFinal, paletaValidada },
          tentativas: tentativa,
        };
      }

      // Zod falhou → prepara feedback para a próxima tentativa
      const erros = result.error.issues
        .map(
          (i) =>
            `- ${i.path.join(".")}: ${i.message} (recebido: ${JSON.stringify(
              (i as any).received ?? "n/a"
            ).slice(0, 100)})`
        )
        .join("\n");

      if (tentativa === MAX_TENTATIVAS) {
        return {
          ok: false,
          error: `Falha na validação após ${MAX_TENTATIVAS} tentativas:\n${erros}`,
          tentativas,
        };
      }

      // Próxima iteração: o loop recomeça com a mensagem de erro.
      // Guardamos os erros numa variável acessível ao próximo chamarModelo.
      (ultimaTentativa as any) = erros;
      // Reescrevemos a chamada para incluir o erro — ver abaixo.
      const { arguments: args2 } = await chamarModelo(
        systemPrompt +
          "\n\n# FEEDBACK DE CORREÇÃO\nA tua última resposta falhou validação Zod. Erros:\n" +
          erros +
          "\nRe-emite a tool corrigindo exatamente estes campos.",
        "Corrige e re-emite a tool emitProjectSpec com os campos inválidos ajustados."
      );

      let parsed2: unknown;
      try {
        parsed2 = JSON.parse(args2);
      } catch {
        continue;
      }
      const result2 = ProjectSpecSchema.safeParse(parsed2);
      if (result2.success) {
        const paletaValidada = validarEAnalisarPaleta(result2.data.palette);
        const dataFinal: ProjectSpec = {
          ...result2.data,
          palette: paletaValidada.map((c) => ({
            nome: c.nome,
            hex: c.hex,
            uso: c.uso,
          })),
        };
        return {
          ok: true,
          data: { ...dataFinal, paletaValidada },
          tentativas: tentativa + 1,
        };
      }
    } catch (err: any) {
      if (tentativa === MAX_TENTATIVAS) {
        return {
          ok: false,
          error: `Erro na geração: ${err?.message ?? String(err)}`,
          tentativas,
        };
      }
      // tenta de novo
    }
  }

  return {
    ok: false,
    error: "Falha desconhecida na geração.",
    tentativas: ultimaTentativa,
  };
}

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Instrução base — produz prompts estruturados no idioma do áudio original.
// Preservar o idioma do input é obrigatório: não traduzir, não resumir.
const SYSTEM_PROMPT = `Você é um especialista em transformar transcrições brutas de mensagens de voz em prompts estruturados e ricos em contexto para LLMs.

Dada uma transcrição bruta de uma mensagem de voz (provavelmente em português), produza uma saída estruturada que:
1. Remove vícios de linguagem e preenchimentos verbais (né, tipo, então, hm, uh, éh, tá)
2. Corrige problemas gramaticais típicos da linguagem falada
3. Identifica e destaca o problema ou tarefa central
4. Preserva TODOS os detalhes e contexto relevantes — omitir informação é pior do que ser verboso
5. Estrutura o conteúdo com cabeçalhos Markdown claros (##, ###)
6. Termina com uma linha "**Use este contexto para:**" sugerindo como usar o prompt

Responda sempre no mesmo idioma da transcrição recebida.`;

export interface OptimizerOutput {
  optimizedPrompt: string;
  tokensUsed: number;
  processingMs: number;
}

export async function optimizePrompt(
  rawTranscription: string,
): Promise<OptimizerOutput> {
  const startedAt = Date.now();

  const completion = await openai.chat.completions.create({
    model: 'gpt-5.4-mini',
    max_tokens: 1500,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: rawTranscription },
    ],
  });

  const processingMs = Date.now() - startedAt;
  const optimizedPrompt =
    completion.choices[0]?.message?.content ?? rawTranscription;
  const tokensUsed = completion.usage?.total_tokens ?? 0;

  // Log de uso de tokens — apenas servidor, nunca no response
  console.info(
    `[optimizer] tokens=${tokensUsed} processingMs=${processingMs}`,
  );

  return { optimizedPrompt, tokensUsed, processingMs };
}

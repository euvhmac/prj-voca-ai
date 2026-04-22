/**
 * Testes Sprint 03 — optimizePrompt()
 *
 * Testa o wrapper do OpenAI optimizer de forma isolada.
 * Mock do SDK OpenAI — sem chamadas de rede reais.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted garante que mockCreate existe antes do vi.mock ser executado
// (vi.mock é hoisted pelo Vitest para o topo do arquivo)
const mockCreate = vi.hoisted(() => vi.fn());

vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = { completions: { create: mockCreate } };
  },
}));

import { optimizePrompt } from '@/lib/ai/optimizer';

function makeCompletionResponse(content: string | null, tokensUsed = 150) {
  return {
    choices: content !== null ? [{ message: { content } }] : [],
    usage: { total_tokens: tokensUsed },
  };
}

describe('optimizePrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna o conteúdo gerado pelo modelo', async () => {
    const optimized = '## Tarefa\nPreciso de ajuda com o relatório.';
    mockCreate.mockResolvedValue(makeCompletionResponse(optimized));

    const result = await optimizePrompt('Preciso de ajuda com o relatório né.');

    expect(result.optimizedPrompt).toBe(optimized);
  });

  it('retorna tokensUsed do usage da resposta', async () => {
    mockCreate.mockResolvedValue(makeCompletionResponse('Prompt otimizado.', 200));

    const result = await optimizePrompt('texto bruto');

    expect(result.tokensUsed).toBe(200);
  });

  it('retorna processingMs como número não negativo', async () => {
    mockCreate.mockResolvedValue(makeCompletionResponse('Resultado.', 100));

    const result = await optimizePrompt('texto');

    expect(result.processingMs).toBeGreaterThanOrEqual(0);
    expect(typeof result.processingMs).toBe('number');
  });

  it('usa rawTranscription como fallback quando choices está vazio', async () => {
    const rawText = 'Texto original quando choices vazio.';
    mockCreate.mockResolvedValue({ choices: [], usage: { total_tokens: 0 } });

    const result = await optimizePrompt(rawText);

    expect(result.optimizedPrompt).toBe(rawText);
  });

  it('usa rawTranscription como fallback quando content é null', async () => {
    const rawText = 'Texto original.';
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: null } }],
      usage: { total_tokens: 0 },
    });

    const result = await optimizePrompt(rawText);

    expect(result.optimizedPrompt).toBe(rawText);
  });

  it('propaga erro quando a API OpenAI lança exceção', async () => {
    mockCreate.mockRejectedValue(new Error('Rate limit exceeded'));

    await expect(optimizePrompt('texto')).rejects.toThrow('Rate limit exceeded');
  });

  it('chama completions.create com o modelo correto', async () => {
    mockCreate.mockResolvedValue(makeCompletionResponse('ok', 50));

    await optimizePrompt('texto de teste');

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gpt-5.4-mini' }),
    );
  });

  it('inclui rawTranscription na mensagem do usuário', async () => {
    const rawText = 'Meu texto específico.';
    mockCreate.mockResolvedValue(makeCompletionResponse('ok', 50));

    await optimizePrompt(rawText);

    const callArg = mockCreate.mock.calls[0]![0];
    const userMessage = (callArg.messages as Array<{ role: string; content: string }>).find(
      (m) => m.role === 'user',
    );
    expect(userMessage?.content).toBe(rawText);
  });
});

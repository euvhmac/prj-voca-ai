/**
 * Testes Sprint 02 + 03 — transcriptionService.process()
 *
 * Isola o serviço usando vi.mock para:
 * - lib/ai/transcription  (OpenAI Whisper)
 * - lib/ai/optimizer      (OpenAI GPT optimizer)
 * - lib/db/transcriptions (Prisma repository)
 *
 * Valida: pipeline feliz, countWords, fallback do optimizer,
 * propagação de erros da transcrição e persistência correta.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

// --- Mocks declarados antes do import do módulo testado ---

vi.mock('@/lib/ai/transcription', () => ({
  transcribeAudio: vi.fn(),
}));

vi.mock('@/lib/ai/optimizer', () => ({
  optimizePrompt: vi.fn(),
}));

vi.mock('@/lib/db/transcriptions', () => ({
  transcriptionRepository: {
    create: vi.fn(),
  },
}));

import { transcriptionService, countWords } from '@/lib/services/transcription';
import { transcribeAudio } from '@/lib/ai/transcription';
import { optimizePrompt } from '@/lib/ai/optimizer';
import { transcriptionRepository } from '@/lib/db/transcriptions';

// Builders de objetos de retorno reutilizáveis
function makeTranscribeOutput(overrides = {}) {
  return { text: 'Olá, preciso de ajuda com o relatório.', durationSeconds: 12.5, ...overrides };
}

function makeOptimizerOutput(overrides = {}) {
  return {
    optimizedPrompt: '## Pedido de Ajuda\nPreciso de ajuda com o relatório.',
    tokensUsed: 120,
    processingMs: 800,
    ...overrides,
  };
}

function makeDbRecord(overrides = {}) {
  return {
    id: 'rec-001',
    userId: 'user-1',
    filename: 'audio.ogg',
    durationSeconds: 12.5,
    wordCount: 7,
    rawTranscription: 'Olá, preciso de ajuda com o relatório.',
    optimizedPrompt: '## Pedido de Ajuda\nPreciso de ajuda com o relatório.',
    metadata: {},
    createdAt: new Date('2026-04-22T10:00:00Z'),
    updatedAt: new Date('2026-04-22T10:00:00Z'),
    ...overrides,
  };
}

function makeFile(name = 'audio.ogg', type = 'audio/ogg'): File {
  return new File([new Uint8Array(1024)], name, { type });
}

// ---

describe('countWords', () => {
  it('conta palavras normais', () => {
    expect(countWords('um dois três')).toBe(3);
  });

  it('ignora espaços extras nas extremidades', () => {
    expect(countWords('  hello world  ')).toBe(2);
  });

  it('ignora múltiplos espaços entre palavras', () => {
    expect(countWords('a  b   c')).toBe(3);
  });

  it('retorna 0 para string vazia', () => {
    expect(countWords('')).toBe(0);
  });

  it('retorna 0 para string com apenas espaços', () => {
    expect(countWords('   ')).toBe(0);
  });

  it('conta uma única palavra', () => {
    expect(countWords('palavra')).toBe(1);
  });
});

// ---

describe('transcriptionService.process', () => {
  const userId = 'user-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('pipeline completo: transcreve → otimiza → salva → retorna TranscriptionResult', async () => {
    (transcribeAudio as Mock).mockResolvedValue(makeTranscribeOutput());
    (optimizePrompt as Mock).mockResolvedValue(makeOptimizerOutput());
    (transcriptionRepository.create as Mock).mockResolvedValue(makeDbRecord());

    const result = await transcriptionService.process({
      userId,
      file: makeFile(),
    });

    // Verifica shape de retorno
    expect(result).toMatchObject({
      id: 'rec-001',
      filename: 'audio.ogg',
      durationSeconds: 12.5,
      wordCount: 7,
      rawTranscription: 'Olá, preciso de ajuda com o relatório.',
      optimizedPrompt: '## Pedido de Ajuda\nPreciso de ajuda com o relatório.',
    });
    expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('chama transcribeAudio com o arquivo correto', async () => {
    (transcribeAudio as Mock).mockResolvedValue(makeTranscribeOutput());
    (optimizePrompt as Mock).mockResolvedValue(makeOptimizerOutput());
    (transcriptionRepository.create as Mock).mockResolvedValue(makeDbRecord());

    const file = makeFile('voz.mp3', 'audio/mpeg');
    await transcriptionService.process({ userId, file });

    expect(transcribeAudio).toHaveBeenCalledWith(file);
  });

  it('chama optimizePrompt com o texto transcrito', async () => {
    const text = 'Texto da transcrição.';
    (transcribeAudio as Mock).mockResolvedValue({ text, durationSeconds: 5 });
    (optimizePrompt as Mock).mockResolvedValue(makeOptimizerOutput({ optimizedPrompt: 'Otimizado.' }));
    (transcriptionRepository.create as Mock).mockResolvedValue(
      makeDbRecord({ rawTranscription: text, optimizedPrompt: 'Otimizado.' }),
    );

    await transcriptionService.process({ userId, file: makeFile() });

    expect(optimizePrompt).toHaveBeenCalledWith(text);
  });

  it('persiste rawTranscription sem modificação', async () => {
    const rawText = 'Texto bruto com né tipo assim.';
    (transcribeAudio as Mock).mockResolvedValue({ text: rawText, durationSeconds: 8 });
    (optimizePrompt as Mock).mockResolvedValue(makeOptimizerOutput());
    (transcriptionRepository.create as Mock).mockResolvedValue(makeDbRecord({ rawTranscription: rawText }));

    await transcriptionService.process({ userId, file: makeFile() });

    const createCall = (transcriptionRepository.create as Mock).mock.calls[0]![0];
    expect(createCall.rawTranscription).toBe(rawText);
  });

  it('metadata inclui optimizedAt quando optimizer tem sucesso', async () => {
    (transcribeAudio as Mock).mockResolvedValue(makeTranscribeOutput());
    (optimizePrompt as Mock).mockResolvedValue(makeOptimizerOutput());
    (transcriptionRepository.create as Mock).mockResolvedValue(makeDbRecord());

    await transcriptionService.process({ userId, file: makeFile() });

    const createCall = (transcriptionRepository.create as Mock).mock.calls[0]![0];
    expect(createCall.metadata).toMatchObject({
      source: 'upload',
      model: 'gpt-4o-mini-transcribe',
      optimizedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    });
  });

  describe('graceful degradation — optimizer falha', () => {
    it('usa rawTranscription como optimizedPrompt quando optimizer lança erro', async () => {
      const rawText = 'Texto bruto.';
      (transcribeAudio as Mock).mockResolvedValue({ text: rawText, durationSeconds: 5 });
      (optimizePrompt as Mock).mockRejectedValue(new Error('OpenAI timeout'));
      (transcriptionRepository.create as Mock).mockResolvedValue(
        makeDbRecord({ rawTranscription: rawText, optimizedPrompt: rawText }),
      );

      const result = await transcriptionService.process({ userId, file: makeFile() });

      // Endpoint não deve falhar — deve retornar mesmo com optimizer quebrado
      expect(result.rawTranscription).toBe(rawText);

      // O create deve ter sido chamado com optimizedPrompt = rawText (fallback)
      const createCall = (transcriptionRepository.create as Mock).mock.calls[0]![0];
      expect(createCall.optimizedPrompt).toBe(rawText);
    });

    it('metadata NÃO inclui optimizedAt quando optimizer falha', async () => {
      (transcribeAudio as Mock).mockResolvedValue(makeTranscribeOutput());
      (optimizePrompt as Mock).mockRejectedValue(new Error('timeout'));
      (transcriptionRepository.create as Mock).mockResolvedValue(makeDbRecord());

      await transcriptionService.process({ userId, file: makeFile() });

      const createCall = (transcriptionRepository.create as Mock).mock.calls[0]![0];
      expect(createCall.metadata.optimizedAt).toBeUndefined();
    });

    it('ainda salva no banco mesmo quando optimizer falha', async () => {
      (transcribeAudio as Mock).mockResolvedValue(makeTranscribeOutput());
      (optimizePrompt as Mock).mockRejectedValue(new Error('OpenAI down'));
      (transcriptionRepository.create as Mock).mockResolvedValue(makeDbRecord());

      await transcriptionService.process({ userId, file: makeFile() });

      expect(transcriptionRepository.create).toHaveBeenCalledOnce();
    });
  });

  describe('propagação de erros críticos', () => {
    it('propaga erro quando transcribeAudio falha', async () => {
      (transcribeAudio as Mock).mockRejectedValue(new Error('Whisper API error'));

      await expect(
        transcriptionService.process({ userId, file: makeFile() }),
      ).rejects.toThrow('Whisper API error');
    });

    it('propaga erro quando repository.create falha', async () => {
      (transcribeAudio as Mock).mockResolvedValue(makeTranscribeOutput());
      (optimizePrompt as Mock).mockResolvedValue(makeOptimizerOutput());
      (transcriptionRepository.create as Mock).mockRejectedValue(new Error('DB constraint'));

      await expect(
        transcriptionService.process({ userId, file: makeFile() }),
      ).rejects.toThrow('DB constraint');
    });
  });
});

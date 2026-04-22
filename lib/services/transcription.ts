import { transcribeAudio } from '@/lib/ai/transcription';
import { optimizePrompt } from '@/lib/ai/optimizer';
import { transcriptionRepository } from '@/lib/db/transcriptions';
import type { TranscriptionResult, TranscriptionMetadata } from '@/lib/types';

export interface ProcessTranscriptionInput {
  userId: string;
  file: File;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const transcriptionService = {
  async process(input: ProcessTranscriptionInput): Promise<TranscriptionResult> {
    const { userId, file } = input;

    // 1. Transcreve via OpenAI Whisper
    const { text, durationSeconds } = await transcribeAudio(file);
    const wordCount = countWords(text);

    // 2. Otimiza o prompt — graceful degradation: falha não bloqueia o pipeline
    let optimizedPrompt = text;
    let optimizerMeta: Pick<TranscriptionMetadata, 'optimizedAt'> = {};

    try {
      const result = await optimizePrompt(text);
      optimizedPrompt = result.optimizedPrompt;
      optimizerMeta = { optimizedAt: new Date().toISOString() };
    } catch (err) {
      // Fallback: rawTranscription é usado como optimizedPrompt
      // Log completo apenas no servidor — nunca expõe ao cliente
      console.error('[transcriptionService] optimizer falhou, usando fallback:', err);
    }

    // 3. Persiste no banco
    const metadata: TranscriptionMetadata = {
      source: 'upload',
      model: 'gpt-4o-mini-transcribe',
      ...optimizerMeta,
    };

    const record = await transcriptionRepository.create({
      userId,
      filename: file.name,
      durationSeconds,
      wordCount,
      rawTranscription: text,
      optimizedPrompt,
      metadata,
    });

    return {
      id: record.id,
      filename: record.filename,
      durationSeconds: record.durationSeconds ?? null,
      wordCount: record.wordCount ?? wordCount,
      rawTranscription: record.rawTranscription,
      optimizedPrompt: record.optimizedPrompt,
      createdAt: record.createdAt.toISOString(),
    };
  },
};

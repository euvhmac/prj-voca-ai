import { transcribeAudio } from '@/lib/ai/transcription';
import { transcriptionRepository } from '@/lib/db/transcriptions';
import type { TranscriptionResult } from '@/lib/types';
import type { TranscriptionMetadata } from '@/lib/types';

export interface ProcessTranscriptionInput {
  userId: string;
  file: File;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const transcriptionService = {
  async process(input: ProcessTranscriptionInput): Promise<TranscriptionResult> {
    const { userId, file } = input;

    // 1. Transcreve via OpenAI
    const { text, durationSeconds } = await transcribeAudio(file);

    // Sprint 02: optimizedPrompt = rawTranscription (placeholder até Sprint 03)
    const optimizedPrompt = text;
    const wordCount = countWords(text);

    // 2. Persiste no banco
    const metadata: TranscriptionMetadata = {
      source: 'upload',
      model: 'gpt-4o-mini-transcribe',
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

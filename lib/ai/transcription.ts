import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TranscriptionOutput {
  text: string;
  durationSeconds: number | undefined;
}

export async function transcribeAudio(
  file: File,
): Promise<TranscriptionOutput> {
  // verbose_json inclui `duration` no corpo da resposta
  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'gpt-4o-mini-transcribe',
    language: 'pt',
    response_format: 'verbose_json',
  });

  return {
    text: transcription.text,
    // O campo duration é opcional na tipagem do SDK — pode ser undefined
    durationSeconds:
      'duration' in transcription && typeof transcription.duration === 'number'
        ? transcription.duration
        : undefined,
  };
}

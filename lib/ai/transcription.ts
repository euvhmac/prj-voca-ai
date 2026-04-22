import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TranscriptionOutput {
  text: string;
  durationSeconds: number | undefined;
}

export async function transcribeAudio(
  file: File,
): Promise<TranscriptionOutput> {
  // gpt-4o-mini-transcribe só aceita 'json' ou 'text' (não verbose_json)
  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'gpt-4o-mini-transcribe',
    language: 'pt',
    response_format: 'json',
  });

  return {
    text: transcription.text,
    durationSeconds: undefined,
  };
}

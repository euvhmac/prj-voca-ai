import { z } from 'zod';

// Formatos aceitos — inclui application/octet-stream porque alguns exportadores
// de WhatsApp enviam .ogg com esse MIME type genérico.
const ACCEPTED_MIME_TYPES = [
  'audio/ogg',
  'audio/mpeg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/wav',
  'audio/wave',
  'audio/opus',
  'audio/webm',
  'application/octet-stream',
] as const;

const ACCEPTED_EXTENSIONS = /\.(ogg|mp3|m4a|wav|opus|webm)$/i;

// 25MB — limite da API OpenAI Whisper
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

export const transcribeAudioSchema = z.object({
  audio: z
    .instanceof(File, { message: 'Campo "audio" deve ser um arquivo.' })
    .refine(
      (f) => f.size > 0,
      'O arquivo está vazio.',
    )
    .refine(
      (f) => f.size <= MAX_FILE_SIZE_BYTES,
      `O arquivo excede o limite de 25 MB.`,
    )
    .refine(
      (f) =>
        (ACCEPTED_MIME_TYPES as readonly string[]).includes(f.type) ||
        ACCEPTED_EXTENSIONS.test(f.name),
      'Formato não suportado. Use .ogg, .mp3, .m4a, .wav, .opus ou .webm.',
    ),
});

export type TranscribeAudioInput = z.infer<typeof transcribeAudioSchema>;

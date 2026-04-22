import type { TranscriptionResult } from '@/lib/types';

const ACCEPTED_FORMATS = ['.ogg', '.mp3', '.m4a', '.wav', '.opus', '.webm'];
const MAX_SIZE_MB = 25;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function validateAudioFile(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ACCEPTED_FORMATS.includes(ext)) {
    return `Formato não suportado. Use: ${ACCEPTED_FORMATS.join(', ')}`;
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `Arquivo muito grande. Máximo: ${MAX_SIZE_MB}MB`;
  }
  return null;
}

export async function transcribeAudio(file: File): Promise<TranscriptionResult> {
  const formData = new FormData();
  formData.append('audio', file);

  const res = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error((err as { error?: string }).error ?? 'Falha na transcrição');
  }

  return res.json() as Promise<TranscriptionResult>;
}

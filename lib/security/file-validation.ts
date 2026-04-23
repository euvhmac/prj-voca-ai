import { fileTypeFromBuffer } from 'file-type';

/**
 * Magic-byte MIME validation para uploads de áudio.
 *
 * Não confia em `File.type` (controlado pelo cliente) nem na extensão.
 * Lê os primeiros bytes do arquivo e valida contra assinaturas conhecidas
 * de containers de áudio aceitos pelo Voca.
 *
 * Cobre A08 (Software and Data Integrity Failures) do OWASP Top 10.
 */

// MIMEs reais (detectados pela assinatura) que aceitamos.
// Nota: WhatsApp .ogg vem como 'audio/ogg' (container OGG com Opus dentro).
// .m4a vem como 'audio/x-m4a' ou 'audio/mp4' dependendo do encoder.
const ACCEPTED_DETECTED_MIMES = new Set<string>([
  'audio/ogg',
  'audio/mpeg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/wav',
  'audio/x-wav',
  'audio/opus',
  'audio/webm',
  'video/webm', // webm pode ser detectado como video container mesmo só com áudio
  'video/mp4',  // m4a às vezes é detectado como mp4 container
]);

export interface MagicByteValidationResult {
  ok: boolean;
  detectedMime?: string;
  detectedExtension?: string;
  reason?: string;
}

/**
 * Valida que o conteúdo real do arquivo corresponde a um container de áudio
 * aceito. Lê apenas os primeiros 4100 bytes (suficiente para `file-type`).
 */
export async function validateAudioMagicBytes(
  file: File,
): Promise<MagicByteValidationResult> {
  // Lê só o suficiente para detecção — economiza memória em arquivos grandes
  const head = file.slice(0, 4100);
  const buffer = Buffer.from(await head.arrayBuffer());
  const detected = await fileTypeFromBuffer(buffer);

  if (!detected) {
    return {
      ok: false,
      reason: 'Não foi possível identificar o conteúdo do arquivo.',
    };
  }

  // file-type pode incluir parâmetros (ex.: "audio/ogg; codecs=opus");
  // comparamos apenas o tipo base.
  const baseMime = detected.mime.split(';')[0]!.trim().toLowerCase();

  if (!ACCEPTED_DETECTED_MIMES.has(baseMime)) {
    return {
      ok: false,
      detectedMime: baseMime,
      detectedExtension: detected.ext,
      reason: 'Conteúdo do arquivo não é um áudio suportado.',
    };
  }

  return {
    ok: true,
    detectedMime: baseMime,
    detectedExtension: detected.ext,
  };
}

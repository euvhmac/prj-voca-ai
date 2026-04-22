/**
 * Testes Sprint 02 — Validação Zod (transcribeAudioSchema)
 *
 * Testa limites de tamanho, tipos MIME aceitos/rejeitados, extensões,
 * e o caso especial do WhatsApp (.ogg com MIME application/octet-stream).
 * Não exige rede nem banco — pura lógica de validação.
 */
import { describe, it, expect } from 'vitest';
import { transcribeAudioSchema } from '@/lib/validations/transcribe';

const MB = 1024 * 1024;

// Helper: cria um File com tamanho e tipo controlados
function makeFile(name: string, mime: string, sizeBytes: number): File {
  // Blob com conteúdo nulo — só o tamanho importa para validação
  const content = new Uint8Array(sizeBytes);
  return new File([content], name, { type: mime });
}

function parse(file: File) {
  return transcribeAudioSchema.safeParse({ audio: file });
}

describe('transcribeAudioSchema', () => {
  describe('casos válidos', () => {
    it('aceita .ogg com mime correto', () => {
      const result = parse(makeFile('audio.ogg', 'audio/ogg', 1 * MB));
      expect(result.success).toBe(true);
    });

    it('aceita .mp3 com audio/mpeg', () => {
      const result = parse(makeFile('audio.mp3', 'audio/mpeg', 1 * MB));
      expect(result.success).toBe(true);
    });

    it('aceita .m4a com audio/mp4', () => {
      const result = parse(makeFile('audio.m4a', 'audio/mp4', 1 * MB));
      expect(result.success).toBe(true);
    });

    it('aceita .wav com audio/wav', () => {
      const result = parse(makeFile('audio.wav', 'audio/wav', 1 * MB));
      expect(result.success).toBe(true);
    });

    it('aceita .opus com audio/opus', () => {
      const result = parse(makeFile('audio.opus', 'audio/opus', 1 * MB));
      expect(result.success).toBe(true);
    });

    it('aceita .webm com audio/webm', () => {
      const result = parse(makeFile('audio.webm', 'audio/webm', 1 * MB));
      expect(result.success).toBe(true);
    });

    // Caso especial WhatsApp: .ogg exportado com MIME genérico
    it('aceita .ogg com application/octet-stream (caso WhatsApp)', () => {
      const result = parse(makeFile('PTT-2026.ogg', 'application/octet-stream', 500 * 1024));
      expect(result.success).toBe(true);
    });

    // Extensão .ogg com MIME desconhecido — fallback por extensão
    it('aceita .ogg com MIME desconhecido via extensão', () => {
      const result = parse(makeFile('audio.ogg', '', 1 * MB));
      expect(result.success).toBe(true);
    });

    it('aceita arquivo no limite exato de 25 MB', () => {
      const result = parse(makeFile('audio.mp3', 'audio/mpeg', 25 * MB));
      expect(result.success).toBe(true);
    });
  });

  describe('casos inválidos', () => {
    it('rejeita arquivo vazio (0 bytes)', () => {
      const result = parse(makeFile('audio.ogg', 'audio/ogg', 0));
      expect(result.success).toBe(false);
      const errors = result.error!.flatten().fieldErrors['audio'];
      expect(errors).toContain('O arquivo está vazio.');
    });

    it('rejeita arquivo acima de 25 MB', () => {
      const result = parse(makeFile('audio.ogg', 'audio/ogg', 25 * MB + 1));
      expect(result.success).toBe(false);
      const errors = result.error!.flatten().fieldErrors['audio'];
      expect(errors).toContain('O arquivo excede o limite de 25 MB.');
    });

    it('rejeita formato não suportado (.pdf)', () => {
      const result = parse(makeFile('documento.pdf', 'application/pdf', 1 * MB));
      expect(result.success).toBe(false);
      const errors = result.error!.flatten().fieldErrors['audio'];
      expect(errors).toContain('Formato não suportado. Use .ogg, .mp3, .m4a, .wav, .opus ou .webm.');
    });

    it('rejeita arquivo sem extensão de áudio e MIME inválido', () => {
      const result = parse(makeFile('foto.jpg', 'image/jpeg', 1 * MB));
      expect(result.success).toBe(false);
    });

    it('rejeita quando campo audio é null', () => {
      const result = transcribeAudioSchema.safeParse({ audio: null });
      expect(result.success).toBe(false);
    });

    it('rejeita quando campo audio está ausente', () => {
      const result = transcribeAudioSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});

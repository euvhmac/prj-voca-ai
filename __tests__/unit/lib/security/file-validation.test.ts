import { describe, it, expect } from 'vitest';
import { validateAudioMagicBytes } from '@/lib/security/file-validation';

// Helper: cria um File com bytes específicos
function fileWithBytes(name: string, bytes: number[], type = 'application/octet-stream'): File {
  const buf = new Uint8Array(bytes);
  return new File([buf], name, { type });
}

describe('validateAudioMagicBytes', () => {
  it('rejects files with no detectable type', async () => {
    // Bytes aleatórios que não correspondem a nenhum container conhecido
    const file = fileWithBytes('foo.ogg', [0x00, 0x01, 0x02, 0x03, 0x04, 0x05]);
    const result = await validateAudioMagicBytes(file);
    expect(result.ok).toBe(false);
  });

  it('rejects executables disguised with audio extension', async () => {
    // PE header: MZ (Windows .exe)
    const peHeader = [0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00];
    // Pad to ensure file-type has enough bytes
    const padded = [...peHeader, ...Array(100).fill(0)];
    const file = fileWithBytes('malware.mp3', padded, 'audio/mpeg');
    const result = await validateAudioMagicBytes(file);
    expect(result.ok).toBe(false);
    expect(result.detectedMime).not.toMatch(/^audio|video/);
  });

  it('rejects HTML disguised as audio', async () => {
    const html = new TextEncoder().encode('<!DOCTYPE html><html><body>x</body></html>');
    const file = new File([html], 'evil.ogg', { type: 'audio/ogg' });
    const result = await validateAudioMagicBytes(file);
    expect(result.ok).toBe(false);
  });

  it('accepts a real OGG Opus container header', async () => {
    // OggS page + OpusHead identification packet
    // (header tipico de mensagem de voz do WhatsApp)
    const oggsOpusHead = [
      // Ogg page header
      0x4f, 0x67, 0x67, 0x53, // "OggS"
      0x00, // version
      0x02, // header type (BOS)
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // granule
      0x01, 0x00, 0x00, 0x00, // serial
      0x00, 0x00, 0x00, 0x00, // page seq
      0x00, 0x00, 0x00, 0x00, // checksum (não validado por file-type)
      0x01, // segments
      0x13, // segment size = 19
      // OpusHead packet (19 bytes)
      0x4f, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64, // "OpusHead"
      0x01, // version
      0x01, // channels
      0x00, 0x00, // pre-skip
      0x80, 0xbb, 0x00, 0x00, // input sample rate (48000)
      0x00, 0x00, // gain
      0x00, // mapping family
    ];
    const file = fileWithBytes('voice.ogg', oggsOpusHead);
    const result = await validateAudioMagicBytes(file);
    expect(result.ok).toBe(true);
    expect(result.detectedMime).toMatch(/^(audio\/(ogg|opus))$/);
  });
});

/**
 * Testes Sprint 04 — GET /api/transcriptions/:id e DELETE /api/transcriptions/:id
 *
 * Isola os route handlers mockando:
 * - lib/auth            (sessão)
 * - lib/db/transcriptions (repositório)
 *
 * Valida: auth guard, 200/404 para GET, 204/404 para DELETE, isolamento por userId.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({ auth: vi.fn() }));
vi.mock('@/lib/db/transcriptions', () => ({
  transcriptionRepository: {
    findById: vi.fn(),
    delete: vi.fn(),
  },
}));

import { GET, DELETE } from '@/app/api/transcriptions/[id]/route';
import { auth } from '@/lib/auth';
import { transcriptionRepository } from '@/lib/db/transcriptions';

function makeSession(id = 'user-1') {
  return { user: { id, name: 'Test User', email: 'test@test.com' } };
}

function makeDbRecord(overrides = {}) {
  return {
    id: 'rec-001',
    userId: 'user-1',
    filename: 'audio.ogg',
    durationSeconds: 12.5,
    wordCount: 7,
    rawTranscription: 'texto bruto',
    optimizedPrompt: 'prompt otimizado',
    metadata: null,
    createdAt: new Date('2026-04-22T10:00:00Z'),
    updatedAt: new Date('2026-04-22T10:00:00Z'),
    ...overrides,
  };
}

function makeRequest(id = 'rec-001') {
  return new NextRequest(`http://localhost:3000/api/transcriptions/${id}`);
}

function makeContext(id = 'rec-001') {
  return { params: Promise.resolve({ id }) };
}

// ─── GET /:id ─────────────────────────────────────────────────────────────────

describe('GET /api/transcriptions/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna 401 sem sessão', async () => {
    (auth as Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), makeContext());

    expect(res.status).toBe(401);
  });

  it('retorna 200 com TranscriptionResult para o dono', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    (transcriptionRepository.findById as Mock).mockResolvedValue(makeDbRecord());

    const res = await GET(makeRequest(), makeContext());

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe('rec-001');
    expect(body.rawTranscription).toBe('texto bruto');
    expect(body.createdAt).toBe('2026-04-22T10:00:00.000Z');
  });

  it('retorna 404 quando item não existe', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    (transcriptionRepository.findById as Mock).mockResolvedValue(null);

    const res = await GET(makeRequest('nao-existe'), makeContext('nao-existe'));

    expect(res.status).toBe(404);
  });

  it('retorna 404 (não 403) quando item pertence a outro usuário', async () => {
    // findById com userId do user-2 retorna null — repositório escopa pelo userId
    (auth as Mock).mockResolvedValue(makeSession('user-2'));
    (transcriptionRepository.findById as Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), makeContext());

    expect(res.status).toBe(404);
  });

  it('passa userId correto para o repositório', async () => {
    (auth as Mock).mockResolvedValue(makeSession('user-42'));
    (transcriptionRepository.findById as Mock).mockResolvedValue(makeDbRecord({ userId: 'user-42' }));

    await GET(makeRequest(), makeContext());

    expect(transcriptionRepository.findById).toHaveBeenCalledWith('rec-001', 'user-42');
  });

  it('retorna 500 quando repositório lança erro', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    (transcriptionRepository.findById as Mock).mockRejectedValue(new Error('DB down'));

    const res = await GET(makeRequest(), makeContext());

    expect(res.status).toBe(500);
  });
});

// ─── DELETE /:id ──────────────────────────────────────────────────────────────

describe('DELETE /api/transcriptions/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna 401 sem sessão', async () => {
    (auth as Mock).mockResolvedValue(null);

    const res = await DELETE(makeRequest(), makeContext());

    expect(res.status).toBe(401);
  });

  it('retorna 204 para o dono', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    (transcriptionRepository.findById as Mock).mockResolvedValue(makeDbRecord());
    (transcriptionRepository.delete as Mock).mockResolvedValue(undefined);

    const res = await DELETE(makeRequest(), makeContext());

    expect(res.status).toBe(204);
  });

  it('retorna 404 quando item não existe', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    (transcriptionRepository.findById as Mock).mockResolvedValue(null);

    const res = await DELETE(makeRequest('nao-existe'), makeContext('nao-existe'));

    expect(res.status).toBe(404);
  });

  it('retorna 404 (não 403) para item de outro usuário', async () => {
    (auth as Mock).mockResolvedValue(makeSession('user-2'));
    (transcriptionRepository.findById as Mock).mockResolvedValue(null);

    const res = await DELETE(makeRequest(), makeContext());

    expect(res.status).toBe(404);
  });

  it('chama repository.delete com id e userId corretos', async () => {
    (auth as Mock).mockResolvedValue(makeSession('user-99'));
    (transcriptionRepository.findById as Mock).mockResolvedValue(makeDbRecord({ userId: 'user-99' }));
    (transcriptionRepository.delete as Mock).mockResolvedValue(undefined);

    await DELETE(makeRequest('rec-abc'), makeContext('rec-abc'));

    expect(transcriptionRepository.delete).toHaveBeenCalledWith('rec-abc', 'user-99');
  });

  it('não chama delete quando findById retorna null', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    (transcriptionRepository.findById as Mock).mockResolvedValue(null);

    await DELETE(makeRequest(), makeContext());

    expect(transcriptionRepository.delete).not.toHaveBeenCalled();
  });

  it('retorna 500 quando repositório lança erro', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    (transcriptionRepository.findById as Mock).mockRejectedValue(new Error('DB down'));

    const res = await DELETE(makeRequest(), makeContext());

    expect(res.status).toBe(500);
  });
});

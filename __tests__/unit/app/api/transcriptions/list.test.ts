/**
 * Testes Sprint 04 — GET /api/transcriptions (lista paginada)
 *
 * Isola o route handler mockando:
 * - lib/auth            (sessão)
 * - lib/db/transcriptions (repositório)
 *
 * Valida: auth guard, resposta paginada, query params inválidos, hasMore.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({ auth: vi.fn() }));
vi.mock('@/lib/db/transcriptions', () => ({
  transcriptionRepository: {
    findByUser: vi.fn(),
  },
}));

import { GET } from '@/app/api/transcriptions/route';
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

function makeRequest(url = 'http://localhost:3000/api/transcriptions') {
  return new NextRequest(url);
}

describe('GET /api/transcriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna 401 sem sessão', async () => {
    (auth as Mock).mockResolvedValue(null);

    const res = await GET(makeRequest());

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('retorna 200 com lista paginada para usuário autenticado', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    const record = makeDbRecord();
    (transcriptionRepository.findByUser as Mock).mockResolvedValue({
      items: [record],
      total: 1,
    });

    const res = await GET(makeRequest());

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toHaveLength(1);
    expect(body.total).toBe(1);
    expect(body.page).toBe(1);
    expect(body.limit).toBe(20);
    expect(body.hasMore).toBe(false);
  });

  it('passa page e limit corretos para o repositório', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    (transcriptionRepository.findByUser as Mock).mockResolvedValue({ items: [], total: 0 });

    await GET(makeRequest('http://localhost:3000/api/transcriptions?page=2&limit=5'));

    expect(transcriptionRepository.findByUser).toHaveBeenCalledWith('user-1', 2, 5);
  });

  it('retorna hasMore=true quando há mais itens', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    (transcriptionRepository.findByUser as Mock).mockResolvedValue({
      items: [makeDbRecord()],
      total: 30,
    });

    const res = await GET(makeRequest('http://localhost:3000/api/transcriptions?page=1&limit=20'));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.hasMore).toBe(true);
  });

  it('retorna 400 quando limit excede 50', async () => {
    (auth as Mock).mockResolvedValue(makeSession());

    const res = await GET(makeRequest('http://localhost:3000/api/transcriptions?limit=51'));

    expect(res.status).toBe(400);
  });

  it('retorna 400 quando page é zero', async () => {
    (auth as Mock).mockResolvedValue(makeSession());

    const res = await GET(makeRequest('http://localhost:3000/api/transcriptions?page=0'));

    expect(res.status).toBe(400);
  });

  it('os itens retornados têm createdAt como ISO string', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    (transcriptionRepository.findByUser as Mock).mockResolvedValue({
      items: [makeDbRecord()],
      total: 1,
    });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(body.items[0].createdAt).toBe('2026-04-22T10:00:00.000Z');
  });

  it('retorna 500 quando repositório lança erro', async () => {
    (auth as Mock).mockResolvedValue(makeSession());
    (transcriptionRepository.findByUser as Mock).mockRejectedValue(new Error('DB down'));

    const res = await GET(makeRequest());

    expect(res.status).toBe(500);
  });
});

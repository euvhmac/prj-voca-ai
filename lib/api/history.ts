import type { TranscriptionResult, TranscriptionListItem, PaginatedResponse } from '@/lib/types';

export interface FetchHistoryParams {
  page?: number;
  limit?: number;
}

export async function fetchHistory(
  params: FetchHistoryParams = {},
): Promise<PaginatedResponse<TranscriptionListItem>> {
  const { page = 1, limit = 20 } = params;
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });

  const res = await fetch(`/api/transcriptions?${qs}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? 'Erro ao carregar histórico');
  }

  return res.json() as Promise<PaginatedResponse<TranscriptionListItem>>;
}

export async function fetchTranscriptionById(id: string): Promise<TranscriptionResult> {
  const res = await fetch(`/api/transcriptions/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? 'Transcrição não encontrada');
  }

  return res.json() as Promise<TranscriptionResult>;
}

export async function deleteTranscription(id: string): Promise<void> {
  const res = await fetch(`/api/transcriptions/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? 'Erro ao deletar transcrição');
  }
}

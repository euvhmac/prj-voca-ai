import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { transcriptionRepository } from '@/lib/db/transcriptions';
import { listQuerySchema } from '@/lib/validations/history';
import type { ApiError, PaginatedResponse, TranscriptionListItem } from '@/lib/types';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json<ApiError>({ error: 'Unauthorized' }, { status: 401 });
  }

  // Valida query params
  const { searchParams } = new URL(req.url);
  const parsed = listQuerySchema.safeParse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json<ApiError>(
      { error: 'Invalid query params', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { page, limit } = parsed.data;

  try {
    const { items, total } = await transcriptionRepository.findByUser(
      session.user.id,
      page,
      limit,
    );

    const listItems: TranscriptionListItem[] = items.map((t) => ({
      id: t.id,
      filename: t.filename,
      durationSeconds: t.durationSeconds,
      wordCount: t.wordCount ?? 0,
      createdAt: t.createdAt.toISOString(),
    }));

    const response: PaginatedResponse<TranscriptionListItem> = {
      items: listItems,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error('[GET /api/transcriptions] erro:', err);
    return NextResponse.json<ApiError>({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { transcriptionRepository } from '@/lib/db/transcriptions';
import type { ApiError, TranscriptionResult } from '@/lib/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _req: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json<ApiError>({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const transcription = await transcriptionRepository.findById(id, session.user.id);

    if (!transcription) {
      // Retorna 404 mesmo quando o item existe mas pertence a outro usuário — nunca vaza existência
      return NextResponse.json<ApiError>({ error: 'Not found' }, { status: 404 });
    }

    const result: TranscriptionResult = {
      id: transcription.id,
      filename: transcription.filename,
      durationSeconds: transcription.durationSeconds,
      wordCount: transcription.wordCount ?? 0,
      rawTranscription: transcription.rawTranscription,
      optimizedPrompt: transcription.optimizedPrompt,
      createdAt: transcription.createdAt.toISOString(),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('[GET /api/transcriptions/:id] erro:', err);
    return NextResponse.json<ApiError>({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json<ApiError>({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Verifica se o item existe e pertence ao usuário antes de deletar
    const transcription = await transcriptionRepository.findById(id, session.user.id);

    if (!transcription) {
      return NextResponse.json<ApiError>({ error: 'Not found' }, { status: 404 });
    }

    await transcriptionRepository.delete(id, session.user.id);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[DELETE /api/transcriptions/:id] erro:', err);
    return NextResponse.json<ApiError>({ error: 'Internal server error' }, { status: 500 });
  }
}

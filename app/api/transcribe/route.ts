import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { transcribeAudioSchema } from '@/lib/validations/transcribe';
import { transcriptionService } from '@/lib/services/transcription';
import type { ApiError } from '@/lib/types';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Auth guard — sempre primeiro
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json<ApiError>(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  // 2. Parse e validação do input
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json<ApiError>(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  const parsed = transcribeAudioSchema.safeParse({
    audio: formData.get('audio'),
  });

  if (!parsed.success) {
    return NextResponse.json<ApiError>(
      {
        error: 'Invalid input',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  // 3. Delega para o serviço
  try {
    const result = await transcriptionService.process({
      userId: session.user.id,
      file: parsed.data.audio,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    // Erros detalhados ficam apenas no log do servidor — nunca no response
    console.error('[POST /api/transcribe]', err);
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

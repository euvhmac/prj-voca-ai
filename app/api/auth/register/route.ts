import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { rateLimit, clientIp } from '@/lib/security/rate-limit';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(72, 'Senha muito longa'),
});

export async function POST(request: Request): Promise<NextResponse> {
  // Rate limit por IP: 5 registros / 15min
  // Protege contra account-spam e enumeração de email
  const ip = clientIp(request);
  const limit = rateLimit({
    key: `register:${ip}`,
    max: 5,
    windowMs: 15 * 60_000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente mais tarde.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      // Mensagem genérica para não vazar existência de email
      // (defesa contra enumeração cf. A07)
      return NextResponse.json(
        { error: 'Não foi possível concluir o cadastro.' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, email, passwordHash },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Erro interno. Tente novamente.' },
      { status: 500 },
    );
  }
}

---
applyTo: "app/api/**/*.ts,lib/**/*.ts,prisma/**/*"
---

# Backend Senior Agent — Voca

You are a **Senior Backend Engineer** specialized in Next.js API Routes, Prisma ORM, and AI API integrations. You design clean, secure, and well-documented service layers. After every sprint, you **must** update `.github/instructions/backend/api-docs.md` with the complete, accurate state of all API endpoints, types, and database schema — the Frontend agent depends on this document.

## Core Responsibilities

1. Implement all API route handlers under `app/api/`
2. Maintain the Prisma schema and manage migrations
3. Wrap all external API calls (OpenAI) in typed service modules
4. Enforce authentication and input validation on every endpoint
5. Keep `api-docs.md` 100% up to date after every change

---

## Architecture Principles

### Layered Architecture

```
Route Handler (app/api/*/route.ts)
  └── validates input (Zod)
  └── checks auth (Auth.js session)
  └── calls Service layer (lib/services/)
        └── calls Repository layer (lib/db/)  ← Prisma queries
        └── calls External APIs (lib/ai/)     ← OpenAI wrappers
```

Never put business logic directly in route handlers. Never call Prisma directly from route handlers.

### Route Handler Pattern

```ts
// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { transcribeAudioSchema } from '@/lib/validations/transcribe';
import { transcriptionService } from '@/lib/services/transcription';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Auth guard — always first
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse and validate input
  const formData = await req.formData();
  const parsed = transcribeAudioSchema.safeParse({
    audio: formData.get('audio'),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // 3. Delegate to service
  try {
    const result = await transcriptionService.process({
      userId: session.user.id,
      file: parsed.data.audio,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('[POST /api/transcribe]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## Stack Deep Dive

### Prisma v6 + Neon

```ts
// lib/db/client.ts — singleton pattern for Next.js
import { PrismaClient } from '@prisma/client';
import { neonAdapter } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = neonAdapter(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Migration rules:**
- Always use `prisma migrate dev --name <descriptive-name>` in development
- Never use `prisma db push` in production — only `prisma migrate deploy`
- Add `DATABASE_URL_UNPOOLED` for migrations (Neon requires direct connection for DDL)

### Database Schema

```prisma
// prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  transcriptions Transcription[]
  accounts      Account[]
  sessions      Session[]
}

model Transcription {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  filename         String
  durationSeconds  Float?
  wordCount        Int?
  rawTranscription String   @db.Text
  optimizedPrompt  String   @db.Text
  metadata         Json?    // { source: 'whatsapp' | 'upload', model: string }
  createdAt        DateTime @default(now())

  @@index([userId, createdAt(sort: Desc)])
}

// Auth.js required models (Account, Session, VerificationToken)
// Use the official Auth.js Prisma adapter schema
```

### Repository Pattern

```ts
// lib/db/transcriptions.ts
import { prisma } from './client';
import type { Transcription } from '@prisma/client';

export const transcriptionRepository = {
  async create(data: {
    userId: string;
    filename: string;
    durationSeconds?: number;
    wordCount?: number;
    rawTranscription: string;
    optimizedPrompt: string;
    metadata?: Record<string, unknown>;
  }): Promise<Transcription> {
    return prisma.transcription.create({ data });
  },

  async findByUser(userId: string, limit = 20): Promise<Transcription[]> {
    return prisma.transcription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async findById(id: string, userId: string): Promise<Transcription | null> {
    return prisma.transcription.findFirst({
      where: { id, userId }, // always scope to userId — never trust bare id
    });
  },

  async delete(id: string, userId: string): Promise<void> {
    await prisma.transcription.deleteMany({
      where: { id, userId },
    });
  },
};
```

---

## OpenAI Integration

### Transcription Service

```ts
// lib/ai/transcription.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribeAudio(file: File): Promise<{
  text: string;
  durationSeconds?: number;
}> {
  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'gpt-4o-mini-transcribe',
    language: 'pt', // Portuguese — change if multi-language needed
    response_format: 'verbose_json', // includes duration
  });

  return {
    text: transcription.text,
    durationSeconds: transcription.duration,
  };
}
```

### Prompt Optimization Service

```ts
// lib/ai/optimizer.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert at transforming raw speech transcriptions into structured, context-rich prompts for LLMs.

Given a raw transcription of a voice message (likely in Portuguese), produce a structured output that:
1. Removes verbal fillers (né, tipo, então, hm, uh)
2. Fixes grammatical issues from spoken language
3. Identifies and surfaces the core problem or task
4. Preserves ALL relevant context and details
5. Structures the content with clear Markdown headings
6. Ends with a "Use este contexto para:" line suggesting how to use the prompt

Output in the same language as the input. Be thorough — missing context is worse than being verbose.`;

export async function optimizePrompt(rawTranscription: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-5.4-mini',
    max_tokens: 1000,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: rawTranscription },
    ],
  });

  return completion.choices[0]?.message?.content ?? rawTranscription;
}
```

---

## Validation (Zod)

```ts
// lib/validations/transcribe.ts
import { z } from 'zod';

const ACCEPTED_AUDIO_TYPES = [
  'audio/ogg', 'audio/mpeg', 'audio/mp4',
  'audio/wav', 'audio/opus', 'audio/webm',
  'application/octet-stream', // fallback for some .ogg files
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB — OpenAI limit

export const transcribeAudioSchema = z.object({
  audio: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_FILE_SIZE, 'File exceeds 25MB limit')
    .refine(
      (f) => ACCEPTED_AUDIO_TYPES.includes(f.type) || f.name.match(/\.(ogg|mp3|m4a|wav|opus|webm)$/i) !== null,
      'Unsupported audio format'
    ),
});
```

---

## Security Checklist

- [ ] Every API route checks `session?.user?.id` before any operation
- [ ] All database queries scope to `userId` — never expose other users' data
- [ ] Zod validation on all inputs before processing
- [ ] File type validated on both MIME type AND file extension
- [ ] No sensitive data in response bodies (no passwords, no tokens, no full user objects)
- [ ] Rate limiting consideration: OpenAI calls should be guarded (simple in-memory or Upstash for MVP)
- [ ] Error messages to client are generic — detailed errors only in server logs

---

## API Documentation Maintenance

**This is mandatory.** After implementing or modifying any API endpoint, update `.github/instructions/backend/api-docs.md` with:

1. The endpoint method + path
2. Request schema (with types)
3. Response schema (with types)
4. Possible error responses
5. Auth requirement
6. Any side effects (e.g., "saves to DB")

The Frontend agent reads this document before building any data-fetching logic. Outdated docs cause integration failures. Treat this document as a contract.

Format to follow:

```markdown
## POST /api/transcribe

**Auth required:** Yes (session)  
**Description:** Accepts an audio file, transcribes it, optimizes the prompt, and saves to DB.

### Request
- Content-Type: `multipart/form-data`
- Body: `audio` (File) — max 25MB, accepted formats: .ogg .mp3 .m4a .wav .opus .webm

### Response `201`
\`\`\`ts
interface TranscriptionResult {
  id: string;
  filename: string;
  durationSeconds: number | null;
  wordCount: number;
  rawTranscription: string;
  optimizedPrompt: string;
  createdAt: string; // ISO 8601
}
\`\`\`

### Errors
| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_INPUT | File missing, wrong format, or exceeds 25MB |
| 401 | UNAUTHORIZED | No valid session |
| 500 | INTERNAL_ERROR | Transcription or DB failure |
```

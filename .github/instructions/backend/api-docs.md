# Voca — Backend API Documentation

> **Maintained by:** Backend Agent  
> **Last updated:** Sprint 02 — Transcription API implementada  
> **Status:** 🟢 Auth routes live | 🟢 POST /api/transcribe | 🔴 History routes pending

This document is the **single source of truth** for all backend API contracts. The Frontend agent reads this document before building any data-fetching logic. The Backend agent updates this document at the end of every sprint.

---

## Base URL

```
Development:  http://localhost:3000/api
Production:   https://your-vercel-domain.vercel.app/api
```

## Authentication

All protected routes require a valid Auth.js session (JWT cookie, set automatically on OAuth sign-in). Sessions are managed via HTTP-only cookies. The frontend uses `useSession()` (client) or `auth()` (server) from Auth.js v5.

**Strategy:** JWT (cookie-based, no DB query on session read)  
**Sign-in page:** `/login`

**Unauthorized response:**
```json
{ "error": "Unauthorized" }
```
HTTP Status: `401`

---

## Types Reference

```ts
// Shared types — exported from @/lib/types/index.ts

interface TranscriptionResult {
  id: string;
  filename: string;
  durationSeconds: number | null;
  wordCount: number;
  rawTranscription: string;
  optimizedPrompt: string;
  createdAt: string; // ISO 8601
}

interface TranscriptionListItem {
  id: string;
  filename: string;
  durationSeconds: number | null;
  wordCount: number;
  createdAt: string; // ISO 8601
}

interface ApiError {
  error: string;
  details?: unknown; // Zod error details on validation failures
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

type TranscriptionMetadata = {
  source: 'whatsapp' | 'upload';
  model: string;
  optimizedAt?: string; // ISO 8601
};
```

---

## Endpoints

### Auth (managed by Auth.js — not custom routes)

> Status: 🟢 Implemented (Sprint 01)

| Route | Method | Description |
|---|---|---|
| `/api/auth/signin` | GET/POST | Auth.js sign-in page/handler |
| `/api/auth/signout` | POST | Sign out |
| `/api/auth/session` | GET | Get current session (`null` if unauthenticated) |
| `/api/auth/callback/google` | GET | Google OAuth callback |
| `/api/auth/callback/linkedin` | GET | LinkedIn OAuth callback |

These are handled automatically by Auth.js via `app/api/auth/[...nextauth]/route.ts`. Do not implement custom handlers.

**Session shape returned by `GET /api/auth/session`:**
```ts
// Authenticated
{
  "user": {
    "id": "cuid",
    "name": "Nome Sobrenome",
    "email": "user@example.com",
    "image": "https://..."
  },
  "expires": "2026-05-22T00:00:00.000Z"
}

// Unauthenticated
null
```

---

### Transcriptions

#### `POST /api/transcribe`

> Status: 🟢 Implementado (Sprint 02)

**Auth required:** Yes (session)  
**Description:** Aceita arquivo de áudio, transcreve via OpenAI `gpt-4o-mini-transcribe`, salva no DB e retorna o resultado. `optimizedPrompt` = `rawTranscription` neste sprint (placeholder até Sprint 03).

**Request**
- Content-Type: `multipart/form-data`
- Body field: `audio` (File)
  - Tamanho máximo: 25 MB
  - Formatos aceitos: `.ogg`, `.mp3`, `.m4a`, `.wav`, `.opus`, `.webm`
  - MIME fallback: `application/octet-stream` aceito (comum em .ogg exportados do WhatsApp)

**Response `201`**
```ts
TranscriptionResult
```

**Errors**
| Status | Code | Description |
|---|---|---|
| 400 | INVALID_INPUT | Arquivo ausente, formato inválido ou excede 25 MB |
| 401 | UNAUTHORIZED | Sem sessão válida |
| 500 | INTERNAL_ERROR | Falha na API OpenAI ou no banco de dados |

---

#### `GET /api/transcriptions`
**Auth required:** Yes  
**Description:** Returns paginated list of user's transcription history.

**Query params**
| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 50) |

**Response `200`**
```ts
PaginatedResponse<TranscriptionResult>
```

---

#### `GET /api/transcriptions/:id`
**Auth required:** Yes  
**Description:** Returns a single transcription by ID (must belong to authenticated user).

**Response `200`**
```ts
TranscriptionResult
```

**Errors**
| Status | Description |
|---|---|
| 404 | Not found or belongs to different user |
| 401 | No session |

---

#### `DELETE /api/transcriptions/:id`
**Auth required:** Yes  
**Description:** Deletes a transcription (scoped to authenticated user).

**Response `204`** — No content

---

## Database Schema (current — Sprint 01)

```prisma
model User {
  id             String          @id @default(cuid())
  email          String          @unique
  name           String?
  image          String?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  transcriptions Transcription[]
  accounts       Account[]
  sessions       Session[]
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
  // JSON: { source: 'whatsapp' | 'upload', model: string, optimizedAt: string }
  metadata         Json?
  createdAt        DateTime @default(now())

  @@index([userId, createdAt(sort: Desc)])
}

// Auth.js required models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
}
```

> **Note:** `Session` table exists for Auth.js adapter compatibility but is not populated — the app uses JWT strategy.

---

## Changelog

| Sprint | Change |
|---|---|
| Sprint 00 | Initial document — schema defined, no endpoints live |
| Sprint 01 | Auth routes live (Google + LinkedIn OAuth). Prisma client singleton. JWT session strategy. Route protection middleware. Schema: User, Transcription, Account, Session, VerificationToken. |
| Sprint 02 | `POST /api/transcribe` implementado. Validação Zod (MIME + extensão + tamanho). Repositório de transcrições. Serviço de orquestração. `optimizedPrompt` = `rawTranscription` (placeholder). |

---

> **Backend agent:** update the changelog and endpoint status after each sprint. Mark endpoints 🟢 when implemented and tested.

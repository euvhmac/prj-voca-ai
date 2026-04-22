# Voca — Backend API Documentation

> **Maintained by:** Backend Agent  
> **Last updated:** Sprint 00 (initial scaffold — no endpoints implemented yet)  
> **Status:** 🟡 Pre-implementation — schema defined, no live routes

This document is the **single source of truth** for all backend API contracts. The Frontend agent reads this document before building any data-fetching logic. The Backend agent updates this document at the end of every sprint.

---

## Base URL

```
Development:  http://localhost:3000/api
Production:   https://your-vercel-domain.vercel.app/api
```

## Authentication

All protected routes require a valid Auth.js session. Sessions are managed via cookies (HTTP-only). The frontend uses `useSession()` (client) or `auth()` (server) from Auth.js v5.

**Unauthorized response:**
```json
{ "error": "Unauthorized" }
```
HTTP Status: `401`

---

## Types Reference

```ts
// Shared types — also exported from @/lib/types/index.ts

interface TranscriptionResult {
  id: string;
  filename: string;
  durationSeconds: number | null;
  wordCount: number;
  rawTranscription: string;
  optimizedPrompt: string;
  createdAt: string; // ISO 8601
}

interface ApiError {
  error: string;
  details?: unknown; // Zod error details on validation failures
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

---

## Endpoints

> ⚠️ All endpoints below are **planned**. This section will be filled in by the Backend agent as sprints complete.

---

### Auth (managed by Auth.js — not custom routes)

| Route | Method | Description |
|---|---|---|
| `/api/auth/signin` | GET/POST | Auth.js sign-in page/handler |
| `/api/auth/signout` | POST | Sign out |
| `/api/auth/session` | GET | Get current session |
| `/api/auth/callback/google` | GET | Google OAuth callback |
| `/api/auth/callback/linkedin` | GET | LinkedIn OAuth callback |

These are handled automatically by Auth.js. Do not implement custom handlers.

---

### Transcriptions

> Status: 🔴 Not implemented (Sprint 02)

#### `POST /api/transcribe`
**Auth required:** Yes  
**Description:** Accepts an audio file, transcribes via OpenAI, optimizes the prompt, and saves to DB.

**Request**
- Content-Type: `multipart/form-data`
- Body field: `audio` (File) — max 25MB

**Response `201`**
```ts
TranscriptionResult
```

**Errors**
| Status | Description |
|---|---|
| 400 | Missing file, invalid format, or exceeds 25MB |
| 401 | No session |
| 500 | OpenAI API failure or DB error |

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

## Database Schema (current)

```prisma
model User {
  id             String          @id @default(cuid())
  email          String          @unique
  name           String?
  image          String?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  transcriptions Transcription[]
}

model Transcription {
  id               String   @id @default(cuid())
  userId           String
  filename         String
  durationSeconds  Float?
  wordCount        Int?
  rawTranscription String   @db.Text
  optimizedPrompt  String   @db.Text
  metadata         Json?
  createdAt        DateTime @default(now())

  @@index([userId, createdAt(sort: Desc)])
}
```

---

## Changelog

| Sprint | Change |
|---|---|
| Sprint 00 | Initial document — schema defined, no endpoints live |

---

> **Backend agent:** update the changelog and endpoint status after each sprint. Mark endpoints 🟢 when implemented and tested.

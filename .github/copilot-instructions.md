# Voca — Global Project Instructions

## Project Overview

**Voca** is an AI-powered audio-to-context tool. Users upload WhatsApp voice messages (or any audio file) and receive an optimized, structured prompt ready to paste into any LLM (ChatGPT, Claude, Gemini, etc.). The system transcribes the audio, removes verbal filler, identifies the core task/problem, and restructures it as a rich LLM prompt. Results are saved to the user's history and exportable as `.md` or `.json`.

**Tagline:** Turn voice into context.

## Repository Structure

```
voca/
├── .github/
│   ├── copilot-instructions.md        ← this file (global)
│   ├── instructions/
│   │   ├── design-system.instructions.md
│   │   ├── frontend.instructions.md
│   │   ├── backend.instructions.md
│   │   ├── gitflow.instructions.md
│   │   └── backend/
│   │       └── api-docs.md            ← always up-to-date API reference
│   └── sprints.md
├── app/                               ← Next.js App Router
│   ├── (auth)/
│   │   └── login/
│   ├── (app)/
│   │   ├── page.tsx                   ← main upload page
│   │   └── history/
│   └── api/
│       ├── auth/
│       ├── transcribe/
│       └── prompt/
├── components/
│   ├── ui/                            ← base design system components
│   └── features/                      ← feature-specific components
├── lib/
│   ├── db/                            ← Prisma client + queries
│   ├── ai/                            ← OpenAI service wrappers
│   └── auth/                          ← Auth.js config
├── prisma/
│   └── schema.prisma
└── public/
```

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router, TypeScript strict mode)
- **Styling:** Tailwind CSS v4 + CSS custom properties (no external UI library)
- **Fonts:** Syne (display/headings) + DM Sans (body/UI) + JetBrains Mono (code/output)
- **Auth UI:** Auth.js v5 with Google + LinkedIn OAuth
- **State:** React useState/useReducer — no external state library for MVP

### Backend
- **Runtime:** Next.js API Route Handlers (Node.js edge-compatible)
- **ORM:** Prisma v6 with Neon serverless PostgreSQL adapter
- **Database:** Neon (serverless Postgres, free tier)
- **Auth:** Auth.js v5 (NextAuth) — session-based
- **Transcription:** OpenAI `gpt-4o-mini-transcribe` API
- **LLM optimization:** OpenAI `gpt-5.4-mini` API
- **Validation:** Zod for all API inputs/outputs

### Infrastructure
- **Hosting:** Vercel (frontend + API routes in same deployment)
- **Database:** Neon (serverless Postgres)
- **File handling:** multipart form upload → in-memory buffer → OpenAI API (no S3 for MVP)
- **CI/CD:** GitHub Actions → Vercel automatic deploy on merge to `main`

## Coding Standards (apply to all agents)

- TypeScript strict mode — no `any`, no implicit types
- All functions must have explicit return types
- Prefer `async/await` over `.then()` chains
- Error handling: always use try/catch in API routes, return typed error responses
- Environment variables: never hardcode keys, always use `process.env.VAR_NAME`
- Comments: write comments that explain **why**, not what — the code explains what
- File naming: `kebab-case` for files, `PascalCase` for components, `camelCase` for functions
- Imports: absolute imports using `@/` alias — never use relative `../../`
- No `console.log` in production code — use proper logging patterns

## Environment Variables Reference

```bash
# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# Database
DATABASE_URL=          # Neon connection string (pooled)
DATABASE_URL_UNPOOLED= # Neon direct connection (for migrations)

# OpenAI
OPENAI_API_KEY=
```

## Agent Configuration

Custom agents are defined in `.github/agents/` and can be selected in the VS Code Chat view:

| Agent | File | Scope |
|-------|------|-------|
| **Backend** | `.github/agents/backend.agent.md` | API routes, Prisma, OpenAI services |
| **Frontend** | `.github/agents/frontend.agent.md` | Next.js components, Tailwind, Auth UI |

- **Model:** `Claude Sonnet 4.5 (copilot)` — configured in each `.agent.md` file
- **Instruction scope:** Each agent references its `.github/instructions/*.instructions.md` file; path-specific instructions also auto-apply via `applyTo` globs.

> Always confirm you are running on **Claude Sonnet 4.5** when starting a session.

## Key Constraints

- Audio file max size: **25MB** (OpenAI Whisper API limit)
- Supported formats: `.ogg`, `.mp3`, `.m4a`, `.wav`, `.opus`, `.webm`
- All API routes must validate session before processing — never trust unauthenticated requests
- The app is open-source — never commit secrets, always use `.env.local`
- Prefer simplicity over premature optimization — this is an MVP with real users

# Voca — Sprint Planning

> **Role:** Tech Lead + QA Senior  
> **Methodology:** Feature-based sprints with defined acceptance criteria  
> **Order:** Backend sprints first (Sprints 01–04), Frontend sprints second (Sprints 05–08)  
> **Convention:** Each sprint maps to one `feature/sprint-XX-*` branch

---

## Sprint Index

| # | Agent | Branch | Focus |
|---|---|---|---|
| 01 | Backend | `feature/sprint-01-backend-foundation` | Project scaffold, DB, Auth |
| 02 | Backend | `feature/sprint-02-transcription-api` | Transcription endpoint + OpenAI |
| 03 | Backend | `feature/sprint-03-prompt-optimizer` | Prompt optimization service |
| 04 | Backend | `feature/sprint-04-history-api` | History CRUD + export |
| 05 | Frontend | `feature/sprint-05-frontend-auth` | Auth page + OAuth flow |
| 06 | Frontend | `feature/sprint-06-frontend-upload` | Upload page + processing flow |
| 07 | Frontend | `feature/sprint-07-frontend-history` | History page + transcription detail |
| 08 | Frontend | `feature/sprint-08-export-polish` | Export features + UI polish |
| 09 | Frontend | `feature/sprint-09-landing-ux` | Public landing UX + upload visual upgrade |
| 10 | Frontend | `feature/sprint-10-legal-pages` | Legal pages, FAQ, footer, cookie banner |
| 11 | Backend  | `feature/sprint-11-security-audit` | OWASP audit + hardening |
| 12 | Full-Stack | `feature/sprint-12-github-docs` | Showcase docs + AI image prompts |
| 13 | Full-Stack | `feature/sprint-13-vercel-deploy` | Production deploy on Vercel |

---

---

# BACKEND SPRINTS

---

## Sprint 01 — Backend Foundation

**Agent:** Backend Senior  
**Branch:** `feature/sprint-01-backend-foundation`  
**Depends on:** nothing  
**Deliverable:** Running Next.js project with DB connection, migrations, and working OAuth

### Objectives

Set up the complete backend foundation: Next.js 15 project scaffold, TypeScript strict config, Prisma + Neon database connection, Auth.js with Google and LinkedIn OAuth, and the layered architecture structure.

### Tasks

1. Initialize Next.js 15 project with TypeScript strict mode, Tailwind v4, App Router
2. Configure absolute imports (`@/`) in `tsconfig.json`
3. Install and configure Prisma v6 with Neon serverless adapter
4. Write and run initial migration with `User`, `Transcription`, Auth.js models (Account, Session, VerificationToken)
5. Configure Auth.js v5 with Google and LinkedIn providers
6. Implement Prisma client singleton (`lib/db/client.ts`)
7. Create `.env.example` with all required variables documented
8. Set up ESLint + Prettier with consistent config
9. Create `lib/types/index.ts` with shared TypeScript interfaces
10. Update `api-docs.md` with schema section

### Acceptance Criteria

- [ ] `npm run dev` starts without errors
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npx prisma migrate dev` runs successfully against Neon
- [ ] `prisma studio` shows User and Transcription tables
- [ ] `GET /api/auth/session` returns `null` for unauthenticated requests
- [ ] Google OAuth flow completes: user is created in DB, session cookie is set
- [ ] LinkedIn OAuth flow completes: user is created in DB, session cookie is set
- [ ] `.env.example` has all 8 required variables documented
- [ ] `api-docs.md` reflects current schema
- [ ] No `any` types in any file
- [ ] ESLint reports zero warnings

### Definition of Done

Code merged to `dev` via PR. All acceptance criteria checked. `api-docs.md` updated.

---

## Sprint 02 — Transcription API

**Agent:** Backend Senior  
**Branch:** `feature/sprint-02-transcription-api`  
**Depends on:** Sprint 01 (User model, Prisma client, Auth.js session)  
**Deliverable:** Working `POST /api/transcribe` endpoint that accepts audio and returns raw transcription

### Objectives

Implement the core transcription pipeline: file validation, OpenAI `gpt-4o-mini-transcribe` integration, Prisma persistence, and typed API response. The prompt optimization is out of scope for this sprint (will be placeholder text).

### Tasks

1. Install `openai` SDK
2. Create `lib/ai/transcription.ts` — OpenAI transcription service wrapper
3. Create `lib/validations/transcribe.ts` — Zod schema for file validation (size + MIME + extension)
4. Create `lib/db/transcriptions.ts` — transcription repository with `create()` method
5. Create `lib/services/transcription.ts` — orchestration service that calls AI + DB
6. Implement `app/api/transcribe/route.ts` — POST handler following the established pattern
7. Handle edge cases: `.ogg` files reporting `application/octet-stream` MIME type (common in WhatsApp exports)
8. Return `TranscriptionResult` shape defined in `lib/types/`
9. Update `api-docs.md` — mark `POST /api/transcribe` as 🟢 implemented

### Acceptance Criteria

- [ ] `POST /api/transcribe` with valid `.ogg` file returns `201` with `TranscriptionResult`
- [ ] `POST /api/transcribe` with valid `.mp3` file returns `201`
- [ ] `POST /api/transcribe` with file > 25MB returns `400` with descriptive error
- [ ] `POST /api/transcribe` with non-audio file returns `400`
- [ ] `POST /api/transcribe` without auth session returns `401`
- [ ] Transcription is saved to DB with correct `userId`, `filename`, `rawTranscription`
- [ ] `optimizedPrompt` field is stored as the raw transcription text (placeholder until Sprint 03)
- [ ] `durationSeconds` is populated from OpenAI `verbose_json` response
- [ ] `wordCount` is calculated from raw text and stored
- [ ] OpenAI API errors return `500` with generic message (detailed error in server log only)
- [ ] No API keys in response body or logs
- [ ] `api-docs.md` updated with endpoint marked 🟢

### Definition of Done

Code merged to `dev` via PR. Manual test with a real WhatsApp `.ogg` audio passes. `api-docs.md` updated.

---

## Sprint 03 — Prompt Optimization Service

**Agent:** Backend Senior  
**Branch:** `feature/sprint-03-prompt-optimizer`  
**Depends on:** Sprint 02 (transcription service exists and saves to DB)  
**Deliverable:** Full pipeline: audio → transcription → optimized prompt → saved to DB

### Objectives

Integrate the LLM prompt optimization step into the transcription pipeline. The `optimizedPrompt` field in the DB should now contain a structured, LLM-ready prompt. Refine the system prompt for Portuguese-language audio. Update the existing `POST /api/transcribe` to run the full pipeline.

### Tasks

1. Create `lib/ai/optimizer.ts` — OpenAI `gpt-5.4-mini` optimization service
2. Write and tune the system prompt (see backend.instructions.md for the base prompt)
3. Test system prompt against 5 sample Portuguese voice message transcriptions:
   - Simple task delegation
   - Bug report / technical problem
   - Client request / project brief
   - Meeting action items
   - Question/decision needed
4. Update `lib/services/transcription.ts` to call optimizer after transcription
5. Update DB write to use `optimizedPrompt` from optimizer output
6. Add processing time metadata to the `metadata` JSON field
7. Add basic token usage logging (server-side only, not in response)
8. Write the `optimizedPrompt` in the same language as the input (system prompt instruction)

### Acceptance Criteria

- [ ] `POST /api/transcribe` response `optimizedPrompt` field contains structured Markdown
- [ ] Optimized prompt includes a heading, identifies the core task/problem, and preserves all details
- [ ] Verbal fillers (né, tipo, então, uh, hm) are removed from the optimized output
- [ ] Raw transcription is preserved unchanged in `rawTranscription`
- [ ] A 3-minute Portuguese audio produces an optimized prompt in under 30 seconds total
- [ ] If optimizer fails, endpoint still returns with `rawTranscription` as fallback for `optimizedPrompt` (graceful degradation)
- [ ] `metadata` field includes `{ model: 'gpt-5.4-mini', optimizedAt: ISO8601 }`
- [ ] TypeScript types updated — `TranscriptionResult` in `lib/types/` reflects any changes
- [ ] `api-docs.md` updated with optimizer behavior note and updated `TranscriptionResult` type

### Definition of Done

End-to-end test: upload real WhatsApp audio → verify `optimizedPrompt` is structured, clean, and in correct language. PR merged to `dev`.

---

## Sprint 04 — History API

**Agent:** Backend Senior  
**Branch:** `feature/sprint-04-history-api`  
**Depends on:** Sprint 03 (full transcription pipeline)  
**Deliverable:** Complete CRUD for transcription history + export endpoints

### Objectives

Implement the three history endpoints: paginated list, single item detail, and delete. These will feed the Frontend history page in Sprint 07.

### Tasks

1. Expand `lib/db/transcriptions.ts` with `findByUser()`, `findById()`, `delete()` methods
2. Implement `GET /api/transcriptions` — paginated list, scoped to authenticated user
3. Implement `GET /api/transcriptions/:id` — single item (must belong to current user)
4. Implement `DELETE /api/transcriptions/:id` — delete (must belong to current user)
5. Add cursor-based pagination as an alternative to offset (future-proof for large histories)
6. Validate query params with Zod (`page`, `limit`)
7. Ensure all queries include `userId` in `WHERE` clause — never expose other users' data
8. Update `api-docs.md` — mark all history endpoints as 🟢

### Acceptance Criteria

- [ ] `GET /api/transcriptions` returns `200` with paginated list for authenticated user
- [ ] `GET /api/transcriptions` with `?page=2&limit=5` returns correct slice
- [ ] `GET /api/transcriptions` without auth returns `401`
- [ ] `GET /api/transcriptions` never returns items from other users
- [ ] `GET /api/transcriptions/:id` returns `200` with single item for owner
- [ ] `GET /api/transcriptions/:id` returns `404` when item belongs to different user (not 403 — don't leak existence)
- [ ] `DELETE /api/transcriptions/:id` returns `204` for owner
- [ ] `DELETE /api/transcriptions/:id` returns `404` for non-owner
- [ ] `limit` query param cannot exceed 50 (validated by Zod, returns `400` if exceeded)
- [ ] `api-docs.md` updated with all 4 endpoints marked 🟢 and correct types
- [ ] Integration test: create transcription → list → get by id → delete → verify 404

### Definition of Done

All endpoints tested manually with Postman or curl. `api-docs.md` fully updated. All acceptance criteria checked. PR merged to `dev`.

---

---

# FRONTEND SPRINTS

---

## Sprint 05 — Frontend Auth

**Agent:** Frontend Senior  
**Branch:** `feature/sprint-05-frontend-auth`  
**Depends on:** Sprint 01 (Auth.js configured, OAuth working)  
**Deliverable:** Production-quality auth page matching the Voca design system

### Objectives

Implement the authentication page (`/login`) following the established design exactly — split-screen layout, tab toggle (Entrar/Criar conta), Google + LinkedIn OAuth buttons, and proper Auth.js integration. Reference `.github/instructions/design-system.instructions.md` and the `voca-auth.jsx` reference implementation.

### Tasks

1. Create `app/(auth)/login/page.tsx` — server component that redirects authenticated users to `/`
2. Create `components/features/auth/auth-card.tsx` — client component with tab state
3. Create `components/features/auth/social-login-buttons.tsx` — Google + LinkedIn buttons
4. Implement the split-screen layout in `app/(auth)/layout.tsx`
5. Configure `next/font` for Syne + DM Sans in `app/layout.tsx`
6. Implement loading states on social login buttons (spinner animation)
7. Handle Auth.js error params (`?error=OAuthAccountNotLinked`, etc.) with user-friendly messages
8. Redirect authenticated users away from `/login` to `/`
9. Ensure layout is responsive: left panel hides on mobile

### Reference Files

- `.github/instructions/design-system.instructions.md`
- Design reference: `voca-auth.jsx` (in `.github/instructions/`)

### Acceptance Criteria

- [ ] `/login` renders split-screen layout: Deep Forest left panel + Soft Canvas right panel
- [ ] Left panel shows Voca logo (WaveformIcon + "Voca" in Syne 800), headline, 4 feature bullets
- [ ] Right panel shows tab toggle "Entrar / Criar conta" with correct active state styling
- [ ] Tab toggle switches between login (email + password) and register (name + email + password + confirm) forms
- [ ] Google button triggers `signIn('google')` with loading spinner during redirect
- [ ] LinkedIn button triggers `signIn('linkedin')` with loading spinner during redirect
- [ ] Successful authentication redirects to `/` (main upload page)
- [ ] Unauthenticated access to `/` redirects to `/login`
- [ ] Auth.js error `OAuthAccountNotLinked` shows message "Este email já está associado a outra conta"
- [ ] Left panel is hidden on screens narrower than 768px
- [ ] All fonts load correctly: Syne for headings, DM Sans for body
- [ ] Entrance animation (`fadeUp`) on the auth card
- [ ] No TypeScript errors
- [ ] Tab order and keyboard navigation work correctly

### Definition of Done

Auth flow tested end-to-end with real Google OAuth. Design matches the reference implementation. PR merged to `dev`.

---

## Sprint 06 — Frontend Upload Page

**Agent:** Frontend Senior  
**Branch:** `feature/sprint-06-frontend-upload`  
**Depends on:** Sprint 03 (POST /api/transcribe working), Sprint 05 (auth + layout shell)  
**Deliverable:** Complete upload → processing → result flow matching the Voca design

### Objectives

Implement the main application page (`/`) with the three-state upload flow: idle drop zone → processing steps → result card with tabs, copy, and download actions. Reference `voca-home.jsx` for the established implementation.

### Tasks

1. Create `app/(app)/layout.tsx` — app shell with the 64px sidebar
2. Create `components/ui/sidebar/sidebar.tsx` — sidebar with nav icons, tooltips, avatar
3. Create `components/features/upload/upload-zone.tsx` — drag-and-drop zone
4. Create `components/features/upload/processing-steps.tsx` — animated step tracker
5. Create `components/features/upload/result-card.tsx` — tabs + copy + download
6. Create `lib/api/transcriptions.ts` — typed fetch wrapper for `POST /api/transcribe`
7. Implement state machine with `useReducer`: `idle → processing → done | error`
8. Implement file drag-and-drop with `onDragOver`, `onDragLeave`, `onDrop`
9. Implement Copy to Clipboard with `navigator.clipboard.writeText`
10. Implement `.md` download via Blob URL
11. Implement `.json` download with all result fields + `generated_at`
12. Implement "Processar novo áudio" reset button
13. Handle API errors gracefully: show error state with retry button

### Reference Files

- `.github/instructions/design-system.instructions.md`
- `.github/instructions/backend/api-docs.md` — `POST /api/transcribe` contract
- Design reference: `voca-home.jsx` (in `.github/instructions/`)

### Acceptance Criteria

- [ ] App shell renders: 64px Deep Forest sidebar + main content area
- [ ] Sidebar shows WaveformIcon logo, Home/History/Settings icons with tooltips
- [ ] History icon shows mint notification dot
- [ ] Avatar shows user initials from session
- [ ] Drop zone accepts audio files via drag-and-drop
- [ ] Drop zone accepts files via click → file picker
- [ ] Dropping a file transitions to processing state immediately
- [ ] Processing state shows filename, waveform animation, and 4-step tracker
- [ ] Steps animate correctly: done (✓) → active (pulsing dot) → pending (muted)
- [ ] On API success, result card appears with correct data
- [ ] "Prompt otimizado" tab shows rendered Markdown
- [ ] "Transcrição bruta" tab shows raw text
- [ ] Copy button copies active tab content and shows "Copiado!" for 2 seconds
- [ ] "Copiar para LLM →" copies the optimized prompt
- [ ] ".md" button triggers file download of `voca-prompt.md`
- [ ] ".json" button triggers file download of `voca-prompt.json` with all fields
- [ ] "Processar novo áudio" button resets to idle state
- [ ] API error (500) shows error state with "Tentar novamente" button
- [ ] File > 25MB shows validation error before upload
- [ ] Unsupported format shows validation error before upload
- [ ] All entrance animations work: `fadeUp` on header and card
- [ ] Responsive: sidebar hides on mobile, content fills screen
- [ ] No TypeScript errors

### Definition of Done

Full flow tested end-to-end with a real WhatsApp audio. Result renders correctly. Downloads produce valid files. PR merged to `dev`.

---

## Sprint 07 — Frontend History Page

**Agent:** Frontend Senior  
**Branch:** `feature/sprint-07-frontend-history`  
**Depends on:** Sprint 04 (history API), Sprint 06 (app shell exists)  
**Deliverable:** History page showing all past transcriptions with detail view

### Objectives

Build the history page at `/history` that lists all past transcriptions for the authenticated user. Each item opens a detail drawer/panel showing the full result (same result card from Sprint 06, reused as a component). Include delete functionality.

### Tasks

1. Create `app/(app)/history/page.tsx` — Server Component that fetches history
2. Create `lib/api/history.ts` — typed fetch wrapper for history endpoints
3. Create `components/features/history/history-list.tsx` — list of transcription items
4. Create `components/features/history/history-item.tsx` — single item row/card
5. Create `components/features/history/history-detail.tsx` — detail panel/drawer
6. Reuse `result-card.tsx` from Sprint 06 inside `history-detail.tsx`
7. Implement delete with optimistic UI update
8. Implement empty state: "Nenhuma transcrição ainda. Suba seu primeiro áudio."
9. Implement loading skeleton while data fetches
10. Pagination (load more button — not infinite scroll for MVP)

### Reference Files

- `.github/instructions/backend/api-docs.md` — `GET /api/transcriptions` and `DELETE` contracts

### Acceptance Criteria

- [ ] `/history` accessible from sidebar History icon
- [ ] Page shows list of user's transcriptions ordered by most recent
- [ ] Each item shows: filename, duration, word count, date (relative: "há 2 horas")
- [ ] Clicking an item opens the detail panel with full optimized prompt and raw transcription tabs
- [ ] Detail panel has the same Copy/Download actions as the upload result card
- [ ] Delete button on each item shows confirmation before deleting
- [ ] Deletion updates the list immediately (optimistic update)
- [ ] Empty state renders correctly when no transcriptions exist
- [ ] Loading skeleton renders while data is being fetched
- [ ] "Carregar mais" button loads next page of results
- [ ] Unauthenticated access redirects to `/login`
- [ ] No TypeScript errors

### Definition of Done

History page tested with 10+ transcriptions in DB. Pagination works. Delete flow works. PR merged to `dev`.

---

## Sprint 08 — Export, Polish & Open-Source Readiness

**Agent:** Frontend Senior  
**Branch:** `feature/sprint-08-export-polish`  
**Depends on:** Sprints 05–07 (full app functional)  
**Deliverable:** Polished, production-ready UI + open-source repo structure

### Objectives

Final sprint: UI polish, micro-interactions, empty states, error boundaries, accessibility audit, and open-source repo preparation (README with demo, badges, contribution guide).

### Tasks

1. Audit all pages for consistent use of design system tokens
2. Add `error.tsx` at app level with friendly error page
3. Add `not-found.tsx` for 404 page in brand
4. Implement global toast notification system for success/error feedback
5. Improve accessibility: audit all interactive elements for keyboard nav and ARIA
6. Add meta tags and Open Graph tags for the public-facing pages
7. Write `README.md` with: project overview, demo GIF/screenshot, tech stack badges, setup instructions, contributing guide, license
8. Add `LICENSE` file (MIT)
9. Add `CONTRIBUTING.md` with contribution guidelines
10. Verify Vercel deployment works end-to-end in preview environment
11. Performance audit: check for unnecessary client components, missing `loading.tsx` files

### Acceptance Criteria

- [ ] All pages use consistent design system tokens — no stray colors or fonts
- [ ] `error.tsx` renders a branded error page with "Voltar para o início" link
- [ ] `not-found.tsx` renders a branded 404 page
- [ ] Toast notifications appear for: transcription success, copy success, delete success, API errors
- [ ] All buttons have visible focus rings (`focus-visible`)
- [ ] All icon-only buttons have `aria-label`
- [ ] `aria-live="polite"` on processing status region
- [ ] `README.md` includes: project name, tagline, description, demo screenshot, tech stack table, setup steps, env vars, contributing section, MIT license badge
- [ ] `LICENSE` file present (MIT)
- [ ] `CONTRIBUTING.md` present with clear steps
- [ ] Vercel preview deployment is fully functional
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] Lighthouse score: Performance ≥ 80, Accessibility ≥ 90

### Definition of Done

App is publicly deployable. README is ready for GitHub showcase. PR merged to `dev`, then `dev → main` with tag `v1.0.0`. 🚀

---

## Summary

| Sprint | Agent | Est. Complexity | Key Deliverable |
|---|---|---|---|
| 01 | Backend | Medium | Scaffold + DB + OAuth |
| 02 | Backend | High | Transcription endpoint |
| 03 | Backend | Medium | Prompt optimizer |
| 04 | Backend | Medium | History CRUD |
| 05 | Frontend | Medium | Auth page |
| 06 | Frontend | High | Upload + result flow |
| 07 | Frontend | Medium | History page |
| 08 | Frontend | Low-Medium | Polish + open-source |
| 09 | Frontend | Medium | Public landing + upload visual upgrade |
| 10 | Frontend | Low | Legal pages + FAQ + cookie banner |
| 11 | Backend  | Medium-High | Security audit + hardening |
| 12 | Full-Stack | Medium | GitHub docs + AI image prompts |
| 13 | Full-Stack | Low-Medium | Production deploy on Vercel |

**Backend complete:** after Sprint 04 → merge `dev → main` with tag `v0.1.0-backend`  
**Full app v1.0:** after Sprint 08 → merge `dev → main` with tag `v1.0.0`  
**Public landing v1.1:** after Sprint 09 → tag `v1.1.0`  
**Compliance v1.2:** after Sprint 10 → tag `v1.2.0`  
**Hardened v1.3:** after Sprint 11 → tag `v1.3.0`  
**Showcase v1.4:** after Sprint 12 → tag `v1.4.0`  
**Live in production v1.5:** after Sprint 13 → tag `v1.5.0` 🚀

---

---

# POST-LAUNCH SPRINTS

---

## Sprint 09 — Landing UX & Upload Visual

**Agent:** Frontend Senior  
**Branch:** `feature/sprint-09-landing-ux`  
**Depends on:** Sprint 08 (full app functional)  
**Deliverable:** Public-facing landing page with intent-first auth flow and elevated upload experience

### Objectives

Shift the app from a walled-garden flow (login required to see anything) to an intent-first product: visitors land directly on the upload page, experience the value proposition immediately, and are only asked to authenticate when they actually try to process audio. Elevate the upload page visually so it carries the weight of being the public face of the product — without breaking the minimalist tone.

### Tasks — Public flow

1. Remove `/` from `middleware.ts` matcher — the root route becomes public
2. Refactor `app/(app)/layout.tsx` — remove the unconditional auth redirect; sidebar renders only when `session` exists
3. In `upload-zone.tsx`, intercept the file submission: if no session, call `signIn(undefined, { callbackUrl: '/' })` instead of starting the upload
4. Ensure `callbackUrl` propagates correctly through OAuth and Credentials flows back to `/`
5. Update `app/(auth)/login/page.tsx` to forward `callbackUrl` to all `signIn()` calls

### Tasks — Visual upgrade

6. **Animated hero headline** — letter-by-letter or word-by-word fade-in for *“Turn voice into context.”*
7. **Decorative waveform background** — subtle, `aria-hidden`, behind the upload zone, low opacity, respects `prefers-reduced-motion`
8. **Upload zone presence** — increase footprint on desktop, animated mint gradient sweep on the dashed border, more pronounced hover state
9. **Drag-over micro-interaction** — `transform: scale(1.02)`, expanded shadow, saturated background tint
10. **“Como funciona” section** — 3 horizontal steps below the upload zone, visible only to unauthenticated visitors (1. Suba o áudio · 2. A IA transcreve e otimiza · 3. Cole no LLM)
11. **Supported-formats pills** — discreet badges: `.ogg .mp3 .m4a .wav .opus .webm · até 25 MB`
12. **State transition** — when the file drops, hero collapses with a faster `fadeUp` and the processing card enters with extra energy

### Acceptance Criteria

- [ ] Unauthenticated visitor sees the full landing page (no automatic redirect)
- [ ] Attempting upload without session redirects to `/login?callbackUrl=/`
- [ ] After authentication, user lands back on `/` and can upload immediately
- [ ] Sidebar renders only for authenticated users
- [ ] “Como funciona” section is hidden for authenticated users
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No layout shift between authenticated and unauthenticated states (skeleton during session check)
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes

### Definition of Done

Flow tested end-to-end as anonymous visitor: land → drop file → redirect to login → log in → return to `/` → upload completes successfully. PR merged to `dev` with tag `v1.1.0`.

---

## Sprint 10 — Legal Pages, FAQ & Cookie Banner

**Agent:** Frontend Senior  
**Branch:** `feature/sprint-10-legal-pages`  
**Depends on:** Sprint 09 (public landing exists)  
**Deliverable:** LGPD-compliant institutional pages, persistent footer, FAQ, and cookie consent

### Objectives

Make the app legally and ethically presentable to the Brazilian public. Cover LGPD basics (privacy policy, terms, cookie awareness, data subject rights) without corporate inflation — tone is honest, direct, and signals “personal portfolio project that takes data seriously.”

### Tasks

1. Create `app/(legal)/layout.tsx` — minimalist layout: header with logo + name, footer with legal links
2. Create `app/(legal)/privacy/page.tsx` — what data is collected, why, third parties (OpenAI, Google, LinkedIn, Neon, Vercel), retention, LGPD subject rights, contact channel
3. Create `app/(legal)/terms/page.tsx` — service offered as-is (portfolio project), no SLA, audio is processed by third-party AI, user content rules, liability limitation
4. Create `app/(legal)/faq/page.tsx` — 8 questions: O que é o Voca? · Como a IA transcreve e entrega contexto? · Meus dados estão seguros? · Meu áudio vai para a OpenAI? · Quais formatos são suportados? · O serviço é gratuito? · Como deleto meus dados? · O código é aberto?
5. Create `components/ui/footer/footer.tsx` — Server Component, links to all legal pages + contact email + GitHub repo link
6. Inject Footer into `app/(app)/layout.tsx` and `app/(auth)/layout.tsx`
7. Create `components/ui/cookie-banner/cookie-banner.tsx` — Client Component using `localStorage` flag, dismissible banner with link to `/privacy`
8. Inject CookieBanner into `app/layout.tsx`

### Acceptance Criteria

- [ ] `/privacy`, `/terms`, `/faq` accessible without authentication, no sidebar
- [ ] Footer with all institutional links visible across the app
- [ ] Cookie banner appears on first visit only, persists dismissal in `localStorage`
- [ ] Each legal page mentions the relevant third parties (OpenAI, Google, LinkedIn, Neon, Vercel)
- [ ] FAQ answers are honest, brief, and link to other legal pages where relevant
- [ ] Tone is informal but responsible — no corporate boilerplate
- [ ] All pages keep the design system tokens consistent
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes

### Definition of Done

All three legal pages live, footer present everywhere, cookie banner working. PR merged to `dev` with tag `v1.2.0`.

---

## Sprint 11 — Security Audit & Hardening

**Agent:** Backend Senior  
**Branch:** `feature/sprint-11-security-audit`  
**Depends on:** Sprint 10  
**Deliverable:** OWASP Top 10 audit completed with all critical findings fixed and rate limiting in place

### Objectives

Walk through OWASP Top 10 against the Voca codebase, document each finding (OK / FIXED / DEFERRED), and apply concrete hardening on the highest-impact vectors: file upload, database access, authentication, and data exposure. The goal is a project that looks (and is) trustworthy enough for real users.

### Tasks

1. **A01 — Broken Access Control:** verify every `GET`/`DELETE /api/transcriptions/:id` includes `userId` in the `WHERE` clause; review `middleware.ts` matcher
2. **A02 — Cryptographic Failures:** confirm bcrypt cost ≥ 12; confirm `NEXTAUTH_SECRET` entropy; confirm cookies have `HttpOnly`, `Secure`, `SameSite=Lax`
3. **A03 — Injection:** confirm Prisma uses parameterized queries everywhere; audit any raw SQL or JSON metadata interpolation
4. **A04 — Insecure Design:** add rate limiting to `POST /api/transcribe` and `POST /api/auth/register` (in-memory bucket or Upstash Redis if budget allows)
5. **A05 — Security Misconfiguration:** add `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` via `next.config.ts` `headers()`; confirm `.env.local` is gitignored
6. **A06 — Vulnerable Components:** `npm audit` — fix high/critical findings; check outdated dependencies
7. **A07 — Authentication Failures:** brute-force test on `/api/auth/register` and Credentials login; ensure failed login attempts are rate-limited; verify session expiry
8. **A08 — Data Integrity:** validate audio file size **server-side** (don’t trust client); validate MIME via magic bytes (e.g. `file-type` lib), not just extension
9. **A09 — Logging Failures:** audit logs for any leakage of `OPENAI_API_KEY`, `DATABASE_URL`, or stack traces returned to clients
10. **A10 — SSRF:** confirm no user input constructs outbound URLs
11. Document findings in `.github/security-audit.md` (one line per OWASP item: OK · FIXED · DEFERRED with reason)

### Acceptance Criteria

- [ ] `npm audit` reports zero high/critical vulnerabilities
- [ ] `curl -I https://localhost:3000/` shows all expected security headers
- [ ] Rate limiting active and verifiable on `/api/transcribe` and `/api/auth/register`
- [ ] 100% of data endpoints scoped by `userId`
- [ ] Audio uploads validated by magic bytes server-side
- [ ] No stack traces in production error responses
- [ ] `.github/security-audit.md` exists and covers all 10 OWASP items
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes

### Definition of Done

Security audit document published, all FIXED items merged. PR merged to `dev` with tag `v1.3.0`.

---

## Sprint 12 — GitHub Docs & Showcase Identity

**Agent:** Full-Stack  
**Branch:** `feature/sprint-12-github-docs`  
**Depends on:** Sprints 10 + 11  
**Deliverable:** Repository ready to attract GitHub stars — community health files complete, README rewritten as showcase, AI image-generation prompts ready for visual assets

### Objectives

Transform the repository into a portfolio-grade open-source project. Two angles: (1) GitHub Community Health files that signal seriousness to recruiters and contributors, and (2) a structured set of AI image-generation prompts that the user can run on Nano Banana / DALL-E / Midjourney to produce branded visual assets aligned with the Voca identity.

### Tasks — README & Community Health

1. Rewrite `README.md` as a true showcase: hero banner image, badge row (stack, CI, license, deploy), animated GIF of the upload flow, “How it works” diagram, “Tech decisions” section explaining why each choice was made, structured architecture map, roadmap, contributing CTA
2. Create `.github/ISSUE_TEMPLATE/bug_report.yml` — structured bug template
3. Create `.github/ISSUE_TEMPLATE/feature_request.yml` — structured feature request template
4. Create `.github/PULL_REQUEST_TEMPLATE.md` — PR checklist
5. Create `CODE_OF_CONDUCT.md` — Contributor Covenant 2.1
6. Create `SECURITY.md` — responsible vulnerability disclosure channel
7. Update `.github/workflows/ci.yml` — run `tsc`, `lint`, `vitest` on PRs to `dev` and `main`
8. Add `.github/workflows/codeql.yml` — GitHub CodeQL automatic security scanning
9. (Optional) `.github/FUNDING.yml` — GitHub Sponsors / Buy me a coffee
10. Add GitHub repo topics: `nextjs`, `openai`, `whisper`, `typescript`, `prisma`, `tailwindcss`, `ai`, `voice`, `portuguese`, `lgpd`

### Tasks — AI Image Prompts (visual identity)

11. Create `.github/assets/image-prompts.json` — structured prompts for every visual asset, optimized for Nano Banana / DALL-E 3 / SDXL / Midjourney v6. Include for each asset: `name`, `purpose`, `dimensions`, `style_tokens`, `color_palette`, `prompt`, `negative_prompt`, `model_hints`
12. Cover at minimum:
    - `social-preview` (1280×640) — GitHub Open Graph card
    - `readme-hero` (1280×400) — top banner of README
    - `demo-screenshot-upload` (1200×800) — composition showing the upload state
    - `demo-screenshot-result` (1200×800) — composition showing the result card
    - `logo-mark` (512×512) — repository icon / favicon source
    - `og-share` (1200×630) — Open Graph for the deployed app pages
13. Tone of all prompts: minimalist tech, editorial, Linear/Vercel/Railway aesthetic — Deep Forest `#0d2218` + Soft Canvas `#f8f9f7` + Electric Mint `#4ade80`. Avoid: gradients clichês, mascote, ilustração corporativa genérica, “3D blobby objects”, “Silicon Valley startup feel”
14. Document under `.github/assets/README.md` how to use the prompts and where to drop the generated images

### Acceptance Criteria

- [ ] README renders correctly on GitHub with all badges working
- [ ] Hero image and demo GIF embedded in README (after generation)
- [ ] Issue templates appear automatically when opening a new issue on GitHub
- [ ] PR template auto-fills the description on every PR
- [ ] CodeQL runs on every PR without blocking merges
- [ ] `CODE_OF_CONDUCT.md` and `SECURITY.md` present
- [ ] GitHub Community Health profile shows all six recommended files ✅
- [ ] `image-prompts.json` validates as JSON, contains at least 6 asset definitions, each with full metadata and tone aligned to the brand
- [ ] Repository topics set on GitHub
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes

### Definition of Done

Repo passes the GitHub “Community Profile” check at 100%. Image prompts ready to be executed by the user. PR merged to `dev` with tag `v1.4.0`.

---

## Sprint 13 — Production Deploy on Vercel

**Agent:** Full-Stack  
**Branch:** `feature/sprint-13-vercel-deploy`  
**Depends on:** Sprint 12  
**Deliverable:** Voca live on Vercel with production database, configured OAuth, working end-to-end

### Objectives

Ship Voca to production. Configure Neon production branch, set up OAuth callback URLs for the live domain, configure all environment variables in Vercel, and run a full health check across the deployed app.

### Tasks

1. **Neon — production branch**
   - Confirm `main` branch on Neon has all migrations applied (`npx prisma migrate deploy`)
   - Verify `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) for migrations
   - Confirm SSL is enforced in the connection string
2. **OAuth — production redirect URIs**
   - Google Cloud Console: add `https://<prod-domain>/api/auth/callback/google`
   - LinkedIn Developer Portal: add `https://<prod-domain>/api/auth/callback/linkedin`
   - Update `NEXTAUTH_URL` to the production domain
   - Generate fresh `NEXTAUTH_SECRET` for production (different from dev)
3. **Vercel — project setup**
   - Connect the GitHub repository to a Vercel project
   - Configure all env vars in `Settings → Environment Variables` (Production scope)
   - Set `main` as the production branch, `dev` as the preview branch
4. **Pre-deploy checklist**
   - `npm run build` passes locally (mirrors Vercel build)
   - `npx prisma migrate deploy` against production DB
   - No `console.log` leaking sensitive data in any deployed file
5. **Post-deploy health check**
   - Production URL loads the public landing
   - Google OAuth completes in production
   - LinkedIn OAuth completes in production
   - Email/password registration + login works
   - Real audio upload completes the full pipeline (transcription + optimization + persistence)
   - History page persists across sessions
   - `.md` and `.json` downloads work
   - `/privacy`, `/terms`, `/faq` accessible without login
   - `curl -I` confirms security headers present in production
6. **Final tagging & README update**
   - Tag `v1.5.0` on `main`
   - Update README with “Deploy on Vercel” badge linking to live URL
   - Add live demo link prominently in the README hero section

### Acceptance Criteria

- [ ] Production URL publicly accessible
- [ ] Full user flow works in production: visit → drop file → login → process → result → history
- [ ] Vercel deployment log shows zero errors
- [ ] Lighthouse score in production: Performance ≥ 80, Accessibility ≥ 90, SEO ≥ 90
- [ ] README shows live demo badge and link
- [ ] Tag `v1.5.0` pushed to GitHub

### Definition of Done

Voca is publicly live, fully functional, and the README points to it. Project portfolio-ready for sharing. 🚀

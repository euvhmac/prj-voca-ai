---
applyTo: "**/*"
---

# GitFlow & DevOps — Voca (Global Skill)

This document governs all Git operations in the Voca repository. Both the Frontend and Backend agents must follow these conventions from day one. Consistency here ensures a clean history, a readable repo, and professional-grade version control — which matters for open-source visibility and portfolio credibility.

---

## Branch Strategy

```
main          ← production-ready code only. Protected. Never commit directly.
dev           ← integration branch. All feature branches merge here first.
feature/*     ← one branch per sprint (or per major feature within a sprint)
fix/*         ← bug fixes (can branch from dev or main depending on severity)
hotfix/*      ← critical production fixes (branches from main, merges to both main and dev)
```

### Branch naming convention

```bash
# Sprint branches — one per sprint
feature/sprint-01-backend-foundation
feature/sprint-02-transcription-api
feature/sprint-03-prompt-optimizer
feature/sprint-04-history-api
feature/sprint-05-frontend-auth
feature/sprint-06-frontend-upload
feature/sprint-07-frontend-history
feature/sprint-08-export-polish

# Bug fixes
fix/audio-validation-ogg-mime
fix/session-expiry-redirect

# Hotfixes (from main)
hotfix/openai-key-exposure
```

---

## Sprint Lifecycle

### Starting a sprint

```bash
# 1. Always start from dev (up to date)
git checkout dev
git pull origin dev

# 2. Create the sprint branch
git checkout -b feature/sprint-XX-short-description

# 3. Push and set upstream immediately
git push -u origin feature/sprint-XX-short-description
```

### During a sprint

- Commit frequently — small, atomic commits
- Never work directly on `dev` or `main`
- If the sprint branch gets behind `dev`, rebase (don't merge):

```bash
git fetch origin
git rebase origin/dev
```

### Finishing a sprint

```bash
# 1. Ensure all tests pass locally
# 2. Update api-docs.md if backend sprint (Backend agent responsibility)
# 3. Final commit on the sprint branch
git add .
git commit -m "feat(sprint-XX): finalize sprint, update docs"

# 4. Push to remote
git push origin feature/sprint-XX-short-description

# 5. Open a Pull Request: feature/sprint-XX → dev
# PR title format: "Sprint XX: Short Description"
# PR body: list of completed items from sprints.md acceptance criteria

# 6. After PR approval and merge, delete the sprint branch
git push origin --delete feature/sprint-XX-short-description
git branch -d feature/sprint-XX-short-description
```

---

## Commit Convention (Conventional Commits)

Format: `<type>(<scope>): <description>`

### Types

| Type | Use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests |
| `docs` | Documentation only (including api-docs.md updates) |
| `chore` | Build config, deps, tooling |
| `style` | Formatting, no logic change |
| `perf` | Performance improvement |

### Scopes (Voca-specific)

| Scope | Area |
|---|---|
| `auth` | Authentication, session, OAuth |
| `transcribe` | Transcription API + OpenAI integration |
| `optimizer` | Prompt optimization service |
| `history` | History CRUD endpoints |
| `db` | Prisma schema, migrations, repositories |
| `upload` | File handling, validation |
| `ui/auth` | Auth page components |
| `ui/upload` | Upload page components |
| `ui/history` | History page components |
| `ui/shell` | Layout, sidebar, navigation |
| `export` | JSON/MD export functionality |
| `config` | Next.js, TypeScript, env config |

### Examples — good commits

```bash
git commit -m "feat(transcribe): implement POST /api/transcribe with Zod validation"
git commit -m "feat(optimizer): add GPT-5.4-mini prompt optimization service"
git commit -m "fix(upload): validate .ogg files that report application/octet-stream MIME"
git commit -m "docs(db): update api-docs.md with transcription endpoint contract"
git commit -m "refactor(db): extract transcription queries into repository pattern"
git commit -m "feat(ui/upload): implement drag-and-drop zone with waveform animation"
git commit -m "chore(config): add Neon serverless adapter to Prisma client"
git commit -m "test(transcribe): add integration test for file size validation"
```

### Examples — bad commits (never do these)

```bash
git commit -m "fix stuff"
git commit -m "wip"
git commit -m "update"
git commit -m "changes"
git commit -m "done"
```

---

## Pull Request Standards

### PR Title
Format: `Sprint XX: Descriptive Title` or `[type(scope)] Short description`

### PR Body Template

```markdown
## What this PR does
Brief description of the work completed in this sprint/fix.

## Acceptance criteria completed
- [x] Criterion 1 (from sprints.md)
- [x] Criterion 2
- [ ] Criterion 3 — deferred to Sprint XX+1 (explain why)

## API changes
- New endpoint: `POST /api/transcribe` (see updated api-docs.md)
- Modified: none

## How to test
1. `npm run dev`
2. Upload a .ogg file via the UI
3. Verify the result card shows both raw and optimized tabs

## Notes
Any caveats, known issues, or things to watch.
```

---

## Merge Strategy

- **feature → dev**: Squash and merge if the branch has noisy WIP commits, or regular merge if commits are clean
- **dev → main**: Always a regular merge commit (preserves history), tagged with version
- Never fast-forward `dev → main` without a merge commit

---

## Versioning & Tags

Use semantic versioning on `main`:

```bash
# After merging a set of backend sprints to main
git tag v0.1.0 -m "Backend foundation: auth, transcription, history API"
git push origin v0.1.0

# After frontend sprints complete
git tag v0.2.0 -m "Frontend complete: upload, history, export"
git push origin v0.2.0

# After bug fixes
git tag v0.2.1 -m "Fix: audio MIME validation, session redirect"
```

---

## Environment & CI

### `.env.local` rules
- Never commit `.env.local` — it's in `.gitignore`
- Maintain `.env.example` at root with all variable names and descriptions (no values)
- When adding a new env variable, update `.env.example` immediately in the same commit

### `.env.example` (keep updated)

```bash
# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# OAuth — Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth — LinkedIn
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# Database — Neon
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...

# OpenAI
OPENAI_API_KEY=sk-...
```

### GitHub Actions (basic CI)

The repo should have a `.github/workflows/ci.yml` that runs on every PR to `dev`:

```yaml
name: CI
on:
  pull_request:
    branches: [dev, main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
```

---

## Checklist — Start of Sprint

- [ ] `git checkout dev && git pull origin dev`
- [ ] `git checkout -b feature/sprint-XX-description`
- [ ] `git push -u origin feature/sprint-XX-description`
- [ ] Read the sprint definition in `sprints.md`
- [ ] Read the relevant instruction files for your role

## Checklist — End of Sprint

- [ ] All acceptance criteria from `sprints.md` are met or documented as deferred
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] **Backend agent:** `api-docs.md` is updated with all new/changed endpoints
- [ ] `.env.example` updated if new env vars were added
- [ ] All commits follow Conventional Commits format
- [ ] PR opened: `feature/sprint-XX → dev` with proper description

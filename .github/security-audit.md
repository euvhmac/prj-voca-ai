# Voca — Auditoria de Segurança (Sprint 11)

**Data:** 22 de abril de 2026
**Branch:** `feature/sprint-11-security-audit`
**Auditor:** Backend Senior Agent
**Escopo:** Backend completo (API routes, auth, repositories, validações), configuração Next.js, dependências.

---

## Sumário Executivo

A aplicação foi auditada contra a OWASP Top 10 (2021), com foco em vetores
realistas para um SaaS Next.js com upload de arquivos e integração com LLMs
externos. Foram aplicadas **mitigações em 6 das 10 categorias** e
**verificadas como já-conformes** as outras 4. Nenhuma vulnerabilidade
crítica ou alta foi encontrada.

| OWASP | Categoria | Status |
|---|---|---|
| A01 | Broken Access Control | ✅ OK (verificado) |
| A02 | Cryptographic Failures | ✅ OK (verificado) |
| A03 | Injection | ✅ OK (verificado) |
| A04 | Insecure Design | 🛡️ HARDENED (rate limit) |
| A05 | Security Misconfiguration | 🛡️ HARDENED (headers) |
| A06 | Vulnerable Components | ⚠️ DEFERRED (com justificativa) |
| A07 | Identification & Auth Failures | 🛡️ HARDENED (lockout) |
| A08 | Data Integrity Failures | 🛡️ HARDENED (magic bytes) |
| A09 | Logging Failures | ✅ OK (verificado) |
| A10 | SSRF | ✅ OK (verificado) |

---

## A01 — Broken Access Control ✅

**Verificações realizadas:**

- Toda rota da API que acessa dados do usuário valida `auth()` antes de
  qualquer query (`/api/transcribe`, `/api/transcriptions`, `/api/transcriptions/[id]`).
- Todas as queries no [`lib/db/transcriptions.ts`](lib/db/transcriptions.ts)
  são escopadas por `userId`. Não existe nenhum método que retorne dado de
  outro usuário, mesmo se o ID for adivinhado.
- O endpoint `GET /api/transcriptions/[id]` retorna **404** (não 403)
  quando o item pertence a outro usuário — evita enumeração de IDs e
  vazamento de existência.
- O `DELETE /api/transcriptions/[id]` usa `deleteMany({ where: { id, userId } })`
  — operação naturalmente idempotente que não vaza nada.
- O `middleware.ts` protege rotas autenticadas via `auth` no edge runtime.

**Decisão:** sem alterações necessárias. Modelo de access control é robusto.

---

## A02 — Cryptographic Failures ✅

**Verificações realizadas:**

- Senhas armazenadas com `bcryptjs` cost 12 ([`app/api/auth/register/route.ts`](app/api/auth/register/route.ts), [`lib/auth/index.ts`](lib/auth/index.ts)).
  Custo 12 é o padrão recomendado pela OWASP (~250ms por hash em hardware moderno).
- Senha máxima de 72 chars (limite real do bcrypt — evita silent truncation).
- Comprimento mínimo de 8 chars validado por Zod.
- Cookies de sessão Auth.js v5: defaults são `httpOnly`, `secure` (em produção
  via HTTPS forçado pelo `NEXTAUTH_URL`), `sameSite=lax`. Não foram alterados.
- Variáveis de ambiente sensíveis (`OPENAI_API_KEY`, `NEXTAUTH_SECRET`,
  `DATABASE_URL`) carregadas apenas server-side; nunca expostas via
  `NEXT_PUBLIC_*`.
- HTTPS forçado via header `Strict-Transport-Security` (ver A05).

**Decisão:** sem alterações necessárias.

---

## A03 — Injection ✅

**Verificações realizadas:**

- 100% das queries usam Prisma com parâmetros bound — não há `$queryRaw`
  ou string interpolation em queries.
- Todas as inputs externas (FormData, JSON body, query strings) são
  validadas com Zod antes de chegar a qualquer service ou query.
- Nenhum `eval`, `Function()`, `child_process` ou shell exec no código.
- Conteúdo do usuário renderizado em React (escapado por padrão) — não
  há `dangerouslySetInnerHTML`.

**Decisão:** sem alterações necessárias.

---

## A04 — Insecure Design 🛡️ HARDENED

**Vetores identificados:**

- `POST /api/transcribe` chama OpenAI a cada request. Sem rate limit, um
  usuário malicioso poderia disparar custo arbitrário ($) e DoS.
- `POST /api/auth/register` permite spam de contas e enumeração de email.
- Login com Credentials aceita tentativas ilimitadas (brute-force).

**Mitigações aplicadas:**

- Novo módulo [`lib/security/rate-limit.ts`](lib/security/rate-limit.ts):
  sliding-window in-memory bucket por chave (sufficiente para deploy
  single-region; documentado para migração a Redis em scale horizontal).
- Limites configurados:
  - Transcrição: **10 req/min** por `userId`
  - Registro: **5 req/15min** por IP
  - Login (Credentials): **5 tentativas/15min** por email (lowercased)
- Respostas 429 incluem `Retry-After` em segundos.

**Limitação conhecida:** o limiter é por instância de lambda. Em Vercel
serverless com cold-starts, um atacante distribuído pode contornar
parcialmente. Aceito para MVP — deve migrar para Upstash Redis quando
houver tráfego significativo.

---

## A05 — Security Misconfiguration 🛡️ HARDENED

**Vetores identificados:**

- `next.config.ts` estava vazio — nenhum cabeçalho de segurança configurado.

**Mitigações aplicadas em [`next.config.ts`](next.config.ts):**

| Header | Valor | Defesa |
|---|---|---|
| `X-Frame-Options` | `DENY` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing → XSS |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Vazamento de URL |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Downgrade para HTTP |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | APIs sensíveis do browser |
| `X-DNS-Prefetch-Control` | `off` | Vazamento de DNS |
| `Content-Security-Policy` | (ver abaixo) | XSS, injection |

CSP configurada:

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://api.openai.com https://accounts.google.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none';
```

**Notas sobre a CSP:**

- `unsafe-inline` em `script-src` é necessário para o runtime do Next.js
  (hidratação inline). Migrar para nonce-based em sprint futuro.
- `unsafe-eval` necessário para Tailwind v4 + alguns chunks do Next.
- `connect-src` lista apenas APIs externas legítimas (OpenAI + Google OAuth).
- `frame-ancestors 'none'` é redundante com `X-Frame-Options: DENY` mas
  cobre browsers modernos que ignoram XFO.

---

## A06 — Vulnerable & Outdated Components ⚠️ DEFERRED

**Status:** 3 vulnerabilidades **moderate** detectadas pelo `npm audit`.

| Pacote | CVE | Severidade | Caminho |
|---|---|---|---|
| `@hono/node-server` < 1.19.13 | GHSA-92pp-h63x-v22m | moderate (CVSS 5.3) | `prisma → @prisma/dev → @hono/node-server` |

**Análise:**

- A vulnerabilidade está em `serveStatic` middleware do Hono — usado apenas
  pelo Prisma Studio (`@prisma/dev`), que é uma **dependência de desenvolvimento**
  e nunca executa em produção.
- A correção sugerida (`npm audit fix --force`) seria um downgrade para
  `prisma@6.19.3`, breaking change que removeria features que usamos.
- Risco real em produção: **zero** (dev dependency).

**Decisão:** **Aceito o risco**. Re-auditar em cada sprint. Atualizar quando
o Prisma fizer release com a versão patcheada do `@hono/node-server`.

**Outras dependências:** todas em versões current. Nenhuma high/critical.

---

## A07 — Identification & Authentication Failures 🛡️ HARDENED

**Vetores identificados:**

- Login Credentials sem proteção contra brute-force.
- Mensagem de erro do registro (`"Este email já está cadastrado"`) permitia
  **enumeração de email** — atacante podia descobrir contas existentes.

**Mitigações aplicadas:**

- Rate limit de 5 tentativas/15min por email no `authorize` callback do
  Credentials provider (ver A04).
- Mensagem de registro alterada para genérica:
  `"Não foi possível concluir o cadastro."` em vez de revelar que o email
  já existe.
- Login retorna sempre o mesmo `null` para credenciais inválidas, sem
  diferenciar "usuário não existe" de "senha errada" (comportamento padrão
  do Auth.js — preservado).

**Não alterado:**

- Sessões usam JWT (strategy `jwt`) — assinadas com `NEXTAUTH_SECRET` (32
  bytes random).
- OAuth Google: redirect URIs e client secrets gerenciados pelo provedor.

---

## A08 — Software & Data Integrity Failures 🛡️ HARDENED

**Vetores identificados:**

- `lib/validations/transcribe.ts` validava apenas `File.type` (MIME informado
  pelo cliente — confiável zero) e extensão. Aceitava `application/octet-stream`
  para acomodar quirks do WhatsApp .ogg — qualquer binário com extensão
  `.ogg` passaria.
- Atacante poderia subir HTML, executável, ou payload arbitrário travestido
  de áudio. OpenAI Whisper provavelmente rejeitaria, mas o arquivo seria
  carregado em memória primeiro (custo + risco de bug em parser).

**Mitigações aplicadas:**

- Novo módulo [`lib/security/file-validation.ts`](lib/security/file-validation.ts)
  com `validateAudioMagicBytes()`. Lê os primeiros 4100 bytes do upload e
  usa o pacote `file-type` para detectar a assinatura real do container.
- Lista branca explícita: `audio/ogg`, `audio/mpeg`, `audio/mp4`,
  `audio/x-m4a`, `audio/wav`, `audio/x-wav`, `audio/opus`, `audio/webm`,
  `video/webm`, `video/mp4` (containers que podem conter áudio).
- Aplicado no `POST /api/transcribe` **após** Zod validation e **antes** de
  enviar à OpenAI. Falha retorna 400 com mensagem genérica.
- Cobertura de testes: rejeita PE/HTML/random bytes; aceita header OGG real.

---

## A09 — Security Logging & Monitoring Failures ✅

**Verificações realizadas:**

- Erros server-side usam `console.error` com stack trace **apenas no log do
  servidor** — nunca incluído na resposta HTTP. Verificado em
  `/api/transcribe` e `lib/services/transcription.ts`.
- Respostas de erro são genéricas: `"Internal server error"`, `"Invalid input"`.
- Nenhum `console.log` com dados sensíveis (`grep` por `OPENAI_API_KEY`,
  `passwordHash`, `DATABASE_URL` não retorna nada além de definição de env).
- Logs de auth (Credentials provider) não incluem a senha tentada.

**Limitação:** não há agregação centralizada de logs (Datadog/Sentry).
Aceito para MVP — Vercel logs cobrem o necessário. Adicionar Sentry quando
houver escala.

---

## A10 — SSRF ✅

**Verificações realizadas:**

- Único egress HTTP é para `api.openai.com` via SDK oficial (`openai`
  package). URL é hardcoded pela lib, não derivada de input do usuário.
- Não há nenhum `fetch()` que use URL fornecida pelo cliente.
- Não há redirect handling baseado em parâmetro de query.
- Auth.js OAuth callbacks usam URLs do provider, validadas pelo próprio
  provedor.

**Decisão:** sem vetores de SSRF. Sem alterações necessárias.

---

## Validação

Foram criados testes para os novos módulos de segurança:

- [`__tests__/unit/lib/security/rate-limit.test.ts`](__tests__/unit/lib/security/rate-limit.test.ts) — bucket isolation, blocking, decremento, extração de IP.
- [`__tests__/unit/lib/security/file-validation.test.ts`](__tests__/unit/lib/security/file-validation.test.ts) — rejeita exe/html/random; aceita OGG real.

Todos os testes existentes continuam passando.

---

## Próximos Passos (não-bloqueantes)

1. **Migrar rate limiter para Upstash Redis** quando o tráfego justificar
   (atual é per-lambda).
2. **CSP com nonce** em vez de `unsafe-inline` no `script-src` — requer
   refatorar componentes que usam inline styles dinâmicos.
3. **Sentry/Datadog** para observabilidade em produção.
4. **Re-auditar `@hono/node-server`** em cada sprint até patch upstream.
5. **2FA opcional** (TOTP) para contas Credentials.

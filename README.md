# Voca — Turn voice into context

> Transforme mensagens de voz em prompts estruturados, prontos para colar em qualquer LLM.

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

---

## O que é o Voca?

Voca é uma ferramenta web que aceita arquivos de áudio (mensagens de voz do WhatsApp, gravações .mp3, .ogg, etc.) e devolve:

1. **Transcrição bruta** — via OpenAI Whisper (`gpt-4o-mini-transcribe`)
2. **Prompt otimizado** — via GPT (`gpt-5.4-mini`), sem vícios de linguagem, estruturado para LLMs
3. **Histórico pessoal** — todas as transcrições ficam salvas, filtrável e exportável

**Tagline:** *Turn voice into context.*

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript strict) |
| Estilo | Tailwind CSS v4 + CSS custom properties |
| Auth | Auth.js v5 — Google, LinkedIn, email/senha |
| ORM | Prisma v7 + Neon (serverless Postgres) |
| IA — Transcrição | OpenAI `gpt-4o-mini-transcribe` |
| IA — Otimização | OpenAI `gpt-5.4-mini` |
| Deploy | Vercel |

---

## Funcionalidades

- Upload por clique ou drag-and-drop (.ogg, .mp3, .m4a, .wav, .opus, .webm — até 25 MB)
- Transcrição + prompt otimizado com indicador de progresso em tempo real
- Login com Google, LinkedIn ou email/senha
- Histórico paginado com busca e deleção
- Export do resultado como `.md` ou `.json`
- Design system próprio (Deep Forest · Soft Canvas · Electric Mint)
- Toasts de feedback, páginas 404/error branded, acessibilidade (WCAG AA focus rings, aria-live)

---

## Configuração local

### 1. Clone e instale dependências

```bash
git clone https://github.com/SEU_USUARIO/voca.git
cd voca
npm install
```

### 2. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha os valores:

```bash
cp .env.example .env.local
```

Veja a seção abaixo para obter cada chave.

### 3. Banco de dados

```bash
# Criar e aplicar migrations
npx prisma migrate dev

# (opcional) Visualizar o banco
npx prisma studio
```

### 4. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Variáveis de ambiente

| Variável | Onde obter |
|---|---|
| `NEXTAUTH_SECRET` | Gere com `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` em dev |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | [console.cloud.google.com](https://console.cloud.google.com) |
| `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` | [linkedin.com/developers](https://www.linkedin.com/developers/) |
| `DATABASE_URL` | Neon → Connection string (pooled) |
| `DATABASE_URL_UNPOOLED` | Neon → Connection string (direct) |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) |

---

## Scripts

```bash
npm run dev          # Servidor dev com Turbopack
npm run build        # Build de produção
npm run lint         # ESLint
npm run test         # Testes unitários (Vitest)
npm run test:watch   # Vitest em modo watch
npx tsc --noEmit     # Checagem de tipos
npx prisma migrate dev  # Criar/aplicar migrations
npx prisma generate  # Regenerar Prisma Client
```

---

## Estrutura do projeto

```
app/
  (app)/          ← Rotas protegidas (upload, histórico)
  (auth)/         ← Login
  api/            ← Route handlers (auth, transcribe, transcriptions)
  globals.css     ← Design system (tokens, keyframes)
components/
  features/       ← Componentes específicos (upload, history, auth)
  ui/             ← Componentes base (sidebar, toast, icons)
lib/
  ai/             ← Wrappers OpenAI (transcrição, otimizador)
  auth/           ← Config Auth.js
  db/             ← Prisma client + repositories
  services/       ← Serviço de transcrição
  validations/    ← Schemas Zod
prisma/
  schema.prisma
```

---

## Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Licença

[MIT](LICENSE)


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Contribuindo com o Voca

Obrigado pelo interesse! Este documento explica o processo completo para contribuir.

---

## Antes de abrir um PR

- Para bugs: abra uma [Issue](https://github.com/euvhmac/prj-voca-ai/issues) antes de codar, para alinhar a solução
- Para features: discuta na issue primeiro — assim evitamos trabalho duplicado
- Para typos/docs: pode abrir o PR direto

---

## Fluxo de desenvolvimento

```bash
# 1. Fork o repositório e clone
git clone https://github.com/SEU_USUARIO/prj-voca-ai.git
cd prj-voca-ai

# 2. Instale dependências
npm install

# 3. Crie uma branch a partir de dev
git checkout dev && git pull origin dev
git checkout -b feature/descricao-curta
# ou: fix/descricao-do-bug

# 4. Configure .env.local (veja .env.example)

# 5. Faça suas alterações com commits atômicos
git commit -m "feat(scope): descrição clara"

# 6. Valide antes de abrir o PR
npx tsc --noEmit
npm run lint
npm test

# 7. Abra o PR: sua branch → dev
```

PRs para `main` direto não são aceitos. Todo código entra via `dev`.

---

## Padrões de código

- **TypeScript strict** — sem `any`, sem `@ts-ignore`
- **Imports absolutos** com `@/` alias
- **Nomes:** `kebab-case` para arquivos, `PascalCase` para componentes, `camelCase` para funções
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — `feat|fix|refactor|test|docs|chore|style|perf`
- **Sem `console.log`** em código de produção
- **Sem segredos** no código — use `.env.local`

---

## Design system

Tokens definidos em `app/globals.css`:

| Token | Valor | Uso |
|---|---|---|
| Deep Forest | `#0d2218` | Fundo principal |
| Soft Canvas | `#f8f9f7` | Fundo claro |
| Electric Mint | `#4ade80` | Ações, destaques |

Fontes: **Syne** (headings) · **DM Sans** (body) · **JetBrains Mono** (código)

---

## Testes

- Testes unitários em `__tests__/unit/` com Vitest
- Mock de Prisma e OpenAI já configurados em `vitest.config.ts`
- Cobertura mínima: novos módulos críticos precisam de testes
- Rode `npm test` antes de qualquer commit

---

## Dúvidas?

Abra uma [Discussion](https://github.com/euvhmac/prj-voca-ai/discussions) ou uma [Issue](https://github.com/euvhmac/prj-voca-ai/issues).

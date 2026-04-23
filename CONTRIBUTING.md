# Contribuindo com o Voca

Obrigado pelo interesse em contribuir! Este documento descreve o processo para reportar issues e abrir pull requests.

---

## Reportando bugs

1. Verifique se o bug já foi reportado nas [Issues](../../issues)
2. Se não, abra uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs. observado
   - Ambiente (OS, Node.js version, browser)

---

## Sugerindo funcionalidades

Abra uma issue com o prefixo `[feat]` e descreva:
- O problema que a funcionalidade resolveria
- A solução proposta
- Alternativas consideradas

---

## Fluxo de desenvolvimento

```bash
# 1. Fork o repositório
# 2. Clone seu fork
git clone https://github.com/SEU_USUARIO/voca.git

# 3. Crie uma branch a partir de dev
git checkout dev
git pull origin dev
git checkout -b feature/minha-feature

# 4. Faça suas alterações com commits atômicos
git commit -m "feat(scope): descrição clara"

# 5. Garanta que tudo passa
npx tsc --noEmit
npm run lint
npm run test

# 6. Abra um PR: sua branch → dev
```

---

## Padrões de código

- TypeScript strict — sem `any`
- Imports absolutos com `@/` alias
- Nomes de arquivo em `kebab-case`, componentes em `PascalCase`
- Commits no formato [Conventional Commits](https://www.conventionalcommits.org/)
- Sem `console.log` em código de produção

---

## Design System

Siga os tokens definidos em `app/globals.css`:

- **Deep Forest** `#0d2218` — fundo principal
- **Soft Canvas** `#f8f9f7` — fundo claro
- **Electric Mint** `#4ade80` — cor de destaque/ação

Fontes: Syne (headings), DM Sans (body), JetBrains Mono (código).

---

## Dúvidas?

Abra uma issue ou inicie uma Discussion no GitHub.

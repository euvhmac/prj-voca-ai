# Assets Visuais — Voca

Este diretório contém os prompts para geração de imagens de identidade visual do Voca.

## Como usar

### 1. Leia `image-prompts.json`

Cada entrada contém:

| Campo | Descrição |
|---|---|
| `name` | Identificador do asset |
| `purpose` | Onde é usado |
| `dimensions` | Tamanho em pixels |
| `destination` | Caminho onde salvar no repo |
| `prompt` | Prompt otimizado para geração |
| `negative_prompt` | O que evitar (SDXL / Midjourney) |
| `model_hints` | Parâmetros específicos por modelo |

### 2. Escolha o gerador

| Gerador | Qualidade | Custo | Melhor para |
|---|---|---|---|
| **DALL-E 3** | ★★★★☆ | Pago (créditos OpenAI) | Composições descritivas, textos |
| **Midjourney v6** | ★★★★★ | Assinatura | Estética editorial refinada |
| **Stable Diffusion XL** | ★★★☆☆ | Gratuito (local) | Iteração rápida e testes |
| **Adobe Firefly** | ★★★☆☆ | Créditos | Boa tipografia |

Para os assets do Voca, **Midjourney v6** produz o resultado mais próximo da estética desejada (Linear/Vercel/Railway).

### 3. Execute os prompts

Exemplo para DALL-E 3 via API:

```bash
curl https://api.openai.com/v1/images/generations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "dall-e-3",
    "prompt": "<conteúdo do campo prompt>",
    "size": "1792x1024",
    "quality": "hd"
  }'
```

Para o `logo-mark` (1:1), use `size: "1024x1024"`.

### 4. Revise e salve

- Gere 3-5 variações e escolha a melhor
- Salve no caminho indicado em `destination`
- Commits com `chore(assets): add <name> visual asset`

### 5. Use no projeto

Após gerar, adicione ao `README.md`:

```md
<p align="center">
  <img src=".github/assets/readme-hero.png" alt="Voca" width="100%" />
</p>
```

E configure o Open Graph em `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  openGraph: {
    images: ['/og-image.png'],
  },
};
```

## Checklist de assets

- [ ] `social-preview.png` — GitHub repository social card
- [ ] `readme-hero.png` — README top banner
- [ ] `demo-upload.png` — screenshot do estado de upload
- [ ] `demo-result.png` — screenshot do estado de resultado
- [ ] `logo-mark.png` — ícone do repositório
- [ ] `public/og-image.png` — Open Graph para o app deployado

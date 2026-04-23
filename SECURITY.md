# Política de Segurança

## Versões suportadas

| Versão | Suportada |
|--------|-----------|
| 1.x (main) | ✅ |
| Branches de dev/feature | ⚠️ Em desenvolvimento |

## Reportando uma vulnerabilidade

**Não abra uma issue pública** para reportar vulnerabilidades de segurança.

Envie um email descrevendo a vulnerabilidade. Inclua:

1. Descrição do problema e impacto potencial
2. Passos para reproduzir (prova de conceito, se possível)
3. Versão/commit afetado
4. Sua sugestão de correção (opcional)

Você receberá uma resposta em até **72 horas** confirmando o recebimento.

## Processo

1. **Triagem** — confirmamos se é válida e qual a severidade
2. **Correção** — desenvolvemos e testamos o patch em branch privada
3. **Disclosure** — publicamos o fix e creditamos o reporter (se desejar)
4. **Advisory** — criamos um GitHub Security Advisory após o patch publicado

## Escopo

Estão no escopo:

- Vulnerabilidades nas API routes (`app/api/`)
- Bypass de autenticação/autorização
- Injeção de dados (SQL, prompt, header)
- Exposição de dados de outros usuários
- Upload de arquivos maliciosos contornando a validação
- Vazamento de variáveis de ambiente/secrets em respostas

Fora do escopo:

- Vulnerabilidades em dependências de desenvolvimento
- Ataques que requerem acesso físico ao servidor
- Engenharia social

## Reconhecimento

Agradecemos reporters responsáveis. Se desejar, seu nome/handle será adicionado à seção de agradecimentos do release.

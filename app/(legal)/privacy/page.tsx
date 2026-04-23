import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade · Voca',
  description:
    'Como o Voca coleta, processa e protege seus dados. Conformidade com a LGPD.',
};

export default function PrivacyPage() {
  return (
    <>
      <header className="mb-10">
        <p
          className="text-[12px] font-semibold tracking-[2px] uppercase mb-2"
          style={{ fontFamily: 'var(--font-jetbrains-mono)', color: '#16a34a' }}
        >
          Legal · LGPD
        </p>
        <h1
          className="text-[32px] md:text-[38px] font-extrabold tracking-[-0.8px]"
          style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
        >
          Política de Privacidade
        </h1>
        <p className="mt-3 text-[14px] text-[#6b7280]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Última atualização: 23 de abril de 2026
        </p>
      </header>

      <Section title="Resumo honesto">
        <p>
          O Voca é um projeto pessoal open-source. Coletamos o mínimo de dados necessário
          para você usar o serviço: sua identidade (login) e o histórico das transcrições
          que você cria. Áudio é processado por inteligência artificial de terceiros e
          <strong> não é armazenado</strong> em nossos servidores após a transcrição.
        </p>
      </Section>

      <Section title="1. Quem somos">
        <p>
          O Voca é mantido por uma pessoa física desenvolvedora, como projeto de portfólio
          open-source. Para qualquer questão sobre dados pessoais, escreva para{' '}
          <a href="mailto:voca@vhmac.dev">voca@vhmac.dev</a>.
        </p>
      </Section>

      <Section title="2. Quais dados coletamos">
        <ul>
          <li>
            <strong>Dados de cadastro:</strong> nome, e-mail e (se você usar OAuth) o
            identificador do provedor (Google ou LinkedIn).
          </li>
          <li>
            <strong>Senha (apenas no cadastro com e-mail):</strong> armazenada como
            hash bcrypt — nunca em texto puro.
          </li>
          <li>
            <strong>Conteúdo das transcrições:</strong> o texto bruto e o prompt
            otimizado gerado a partir do seu áudio, junto com metadados (nome do
            arquivo, duração, contagem de palavras, data).
          </li>
          <li>
            <strong>Cookies de sessão:</strong> usados pelo Auth.js para manter você
            logado. Não usamos cookies de rastreamento ou publicidade.
          </li>
        </ul>
        <p>
          <strong>O que NÃO coletamos:</strong> o arquivo de áudio em si — ele é
          enviado diretamente para a OpenAI processar e nunca é gravado em disco aqui.
        </p>
      </Section>

      <Section title="3. Para que usamos seus dados">
        <ul>
          <li>Autenticar você (login e proteção da sua conta).</li>
          <li>Gerar a transcrição e o prompt otimizado a partir do áudio enviado.</li>
          <li>Manter o histórico para que você consulte e baixe transcrições antigas.</li>
        </ul>
        <p>
          Não vendemos, alugamos ou compartilhamos seus dados com terceiros para
          marketing. Não treinamos modelos de IA com seu conteúdo.
        </p>
      </Section>

      <Section title="4. Terceiros que processam seus dados">
        <p>Para o Voca funcionar, alguns serviços de terceiros processam dados:</p>
        <ul>
          <li>
            <strong>OpenAI</strong> (Estados Unidos) — recebe o áudio para transcrever
            (<em>gpt-4o-mini-transcribe</em>) e o texto bruto para otimizar como prompt
            (<em>gpt-5.4-mini</em>). Consulte a{' '}
            <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">
              Política de Privacidade da OpenAI
            </a>.
          </li>
          <li>
            <strong>Google</strong> e <strong>LinkedIn</strong> — provedores OAuth
            opcionais para autenticação. Você só compartilha dados com eles se escolher
            entrar com esses provedores.
          </li>
          <li>
            <strong>Neon</strong> — banco de dados PostgreSQL serverless onde seu
            cadastro e histórico ficam armazenados.
          </li>
          <li>
            <strong>Vercel</strong> — hospedagem da aplicação web. Logs de acesso podem
            ser coletados pelo provedor.
          </li>
        </ul>
      </Section>

      <Section title="5. Por quanto tempo armazenamos">
        <ul>
          <li>
            <strong>Áudio enviado:</strong> não armazenamos. É descartado assim que
            a OpenAI retorna a transcrição.
          </li>
          <li>
            <strong>Transcrições e histórico:</strong> mantidos enquanto sua conta
            existir. Você pode excluir cada item a qualquer momento.
          </li>
          <li>
            <strong>Conta:</strong> mantida enquanto você quiser. Se solicitar
            exclusão por e-mail, removemos em até 30 dias.
          </li>
        </ul>
      </Section>

      <Section title="6. Seus direitos como titular (LGPD)">
        <p>
          De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você
          pode, a qualquer momento:
        </p>
        <ul>
          <li>Confirmar a existência de tratamento dos seus dados.</li>
          <li>Acessar os dados que mantemos sobre você.</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
          <li>Pedir a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
          <li>Solicitar a portabilidade dos dados para outro fornecedor.</li>
          <li>Pedir a eliminação dos dados tratados com seu consentimento.</li>
          <li>Revogar o consentimento a qualquer momento.</li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, escreva para{' '}
          <a href="mailto:voca@vhmac.dev">voca@vhmac.dev</a>.
        </p>
      </Section>

      <Section title="7. Segurança">
        <p>
          Conexões são criptografadas com HTTPS. Senhas são salvas como hash bcrypt
          com custo 12. O código do projeto é{' '}
          <a href="https://github.com/euvhmac/prj-voca-ai" target="_blank" rel="noopener noreferrer">
            público no GitHub
          </a>{' '}
          — qualquer pessoa pode auditar como tratamos os dados.
        </p>
      </Section>

      <Section title="8. Mudanças nesta política">
        <p>
          Se mudarmos algo material aqui, atualizamos a data no topo e, quando fizer
          sentido, avisamos pela interface. Continuar usando o Voca após a mudança
          significa concordar com a nova versão.
        </p>
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="text-[20px] font-bold tracking-[-0.3px] mb-3"
        style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-[14.5px] leading-[1.65] text-[#374151]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
        {children}
      </div>
    </section>
  );
}

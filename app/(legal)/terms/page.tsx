import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso · Voca',
  description: 'Termos e condições para uso do Voca — projeto pessoal open-source.',
};

export default function TermsPage() {
  return (
    <>
      <header className="mb-10">
        <p
          className="text-[12px] font-semibold tracking-[2px] uppercase mb-2"
          style={{ fontFamily: 'var(--font-jetbrains-mono)', color: '#16a34a' }}
        >
          Legal
        </p>
        <h1
          className="text-[32px] md:text-[38px] font-extrabold tracking-[-0.8px]"
          style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
        >
          Termos de Uso
        </h1>
        <p className="mt-3 text-[14px] text-[#6b7280]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Última atualização: 23 de abril de 2026
        </p>
      </header>

      <Section title="Resumo honesto">
        <p>
          O Voca é um projeto pessoal de portfólio, open-source e gratuito.
          Funciona &quot;como está&quot;, sem garantias de disponibilidade ou
          continuidade. Use com bom senso: o conteúdo que você envia é seu, mas
          é processado por IA de terceiros (OpenAI).
        </p>
      </Section>

      <Section title="1. Aceitação">
        <p>
          Ao criar uma conta ou usar o Voca, você concorda com estes Termos e
          com a nossa{' '}
          <a href="/privacy">Política de Privacidade</a>. Se não concordar com
          algum ponto, por favor, não use o serviço.
        </p>
      </Section>

      <Section title="2. Sobre o serviço">
        <ul>
          <li>
            O Voca recebe um arquivo de áudio (até 25 MB), envia para a OpenAI
            transcrever e otimizar, e devolve um prompt estruturado pronto para
            colar em um LLM.
          </li>
          <li>
            O serviço é gratuito enquanto durar a versão de portfólio. Pode ser
            descontinuado, alterado ou pausado a qualquer momento, com ou sem
            aviso prévio.
          </li>
          <li>
            Não há SLA, suporte garantido ou compromisso de uptime.
          </li>
        </ul>
      </Section>

      <Section title="3. Sua conta">
        <ul>
          <li>
            Você é responsável pela segurança das suas credenciais e por toda
            atividade que ocorrer na sua conta.
          </li>
          <li>
            Use apenas dados verdadeiros no cadastro. Contas falsas ou usadas
            para abuso podem ser excluídas sem aviso.
          </li>
          <li>
            Você pode pedir a exclusão da sua conta a qualquer momento por
            e-mail (<a href="mailto:victor@vhmac.com">victor@vhmac.com</a>).
          </li>
        </ul>
      </Section>

      <Section title="4. Conteúdo enviado">
        <ul>
          <li>
            <strong>Você é o único responsável</strong> pelo conteúdo dos áudios
            que envia. Não envie áudios que violem leis, direitos autorais,
            privacidade de terceiros ou que contenham material ilegal.
          </li>
          <li>
            <strong>Os direitos sobre o conteúdo são seus.</strong> O Voca apenas
            processa e devolve o resultado — não usamos seu conteúdo para
            treinar modelos próprios nem o vendemos.
          </li>
          <li>
            O áudio é enviado para a OpenAI. Consulte a política deles sobre uso
            de dados:{' '}
            <a href="https://openai.com/policies" target="_blank" rel="noopener noreferrer">
              openai.com/policies
            </a>.
          </li>
        </ul>
      </Section>

      <Section title="5. Uso aceitável">
        <p>É proibido:</p>
        <ul>
          <li>Tentar obter acesso não autorizado ao sistema, banco de dados ou contas de outras pessoas.</li>
          <li>Sobrecarregar a infraestrutura propositalmente (ataques, scraping abusivo, automações).</li>
          <li>
            Enviar conteúdo que constitua crime, assédio, discurso de ódio ou
            violação de privacidade de terceiros.
          </li>
          <li>Fazer engenharia reversa para fins maliciosos.</li>
        </ul>
        <p>
          Violações podem resultar em bloqueio imediato da conta.
        </p>
      </Section>

      <Section title="6. Limitação de responsabilidade">
        <p>
          O Voca é fornecido &quot;como está&quot; (<em>as is</em>), sem
          garantias de qualquer tipo. Na máxima extensão permitida pela lei
          aplicável, o mantenedor não se responsabiliza por:
        </p>
        <ul>
          <li>Indisponibilidade, lentidão ou perda temporária de dados.</li>
          <li>Decisões tomadas com base no resultado das transcrições.</li>
          <li>Imprecisões na transcrição ou otimização — IA pode errar.</li>
          <li>Conduta de terceiros (OpenAI, Google, LinkedIn, Vercel, Neon).</li>
        </ul>
      </Section>

      <Section title="7. Código aberto">
        <p>
          O código do Voca é distribuído sob licença{' '}
          <a href="https://github.com/euvhmac/prj-voca-ai/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
            MIT
          </a>
          . Você pode estudar, modificar, redistribuir e até hospedar sua
          própria versão. A licença MIT cobre apenas o código — não os dados
          dos usuários do serviço hospedado.
        </p>
      </Section>

      <Section title="8. Mudanças nestes Termos">
        <p>
          Podemos atualizar estes Termos de tempos em tempos. Mudanças
          materiais são sinalizadas pela data no topo. Continuar usando o
          serviço após a mudança implica concordância.
        </p>
      </Section>

      <Section title="9. Lei aplicável">
        <p>
          Estes Termos são regidos pelas leis da República Federativa do
          Brasil. Eventuais disputas serão resolvidas no foro do domicílio do
          mantenedor.
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

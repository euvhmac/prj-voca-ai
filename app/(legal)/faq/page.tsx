import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Perguntas Frequentes · Voca',
  description: 'O que é o Voca, como funciona e como seus dados são tratados.',
};

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: 'O que é o Voca?',
    a: (
      <p>
        O Voca é uma ferramenta que transforma áudios — mensagens do WhatsApp,
        gravações, reuniões — em prompts estruturados, prontos para colar em
        qualquer LLM (ChatGPT, Claude, Gemini etc). Em vez de reescrever
        manualmente o que você falou, o Voca transcreve, limpa os vícios de
        fala e organiza em texto pronto para usar.
      </p>
    ),
  },
  {
    q: 'Como a IA transcreve e entrega contexto?',
    a: (
      <p>
        Em duas etapas: o áudio é transcrito pelo modelo{' '}
        <code>gpt-4o-mini-transcribe</code> da OpenAI; depois, o texto bruto é
        reescrito pelo <code>gpt-5.4-mini</code> com instruções específicas
        para identificar a tarefa central, remover ruído e estruturar como um
        prompt útil. Você recebe os dois — bruto e otimizado — e escolhe qual
        copiar.
      </p>
    ),
  },
  {
    q: 'Meus dados estão seguros?',
    a: (
      <p>
        Senhas são salvas com hash bcrypt (custo 12), conexões usam HTTPS, e o
        banco de dados (Neon) tem acesso restrito. O código é{' '}
        <a href="https://github.com/euvhmac/prj-voca-ai" target="_blank" rel="noopener noreferrer">
          público no GitHub
        </a>{' '}
        — qualquer pessoa pode auditar. Para o detalhamento completo, veja a{' '}
        <Link href="/privacy">Política de Privacidade</Link>.
      </p>
    ),
  },
  {
    q: 'Meu áudio vai para a OpenAI?',
    a: (
      <p>
        Sim — a OpenAI é quem transcreve e otimiza. O áudio é enviado em
        memória e <strong>não é gravado</strong> no servidor do Voca. Apenas o
        texto resultante (bruto + prompt otimizado) é salvo no seu histórico,
        e só você tem acesso a ele.
      </p>
    ),
  },
  {
    q: 'Quais formatos são suportados?',
    a: (
      <p>
        <code>.ogg</code>, <code>.mp3</code>, <code>.m4a</code>,{' '}
        <code>.wav</code>, <code>.opus</code> e <code>.webm</code>, com
        tamanho máximo de 25 MB. O formato padrão de mensagens de voz do
        WhatsApp (<code>.opus</code> dentro de <code>.ogg</code>) funciona
        sem ajuste.
      </p>
    ),
  },
  {
    q: 'O serviço é gratuito?',
    a: (
      <p>
        Sim, totalmente gratuito enquanto durar a versão de portfólio. Não há
        plano pago, e seu uso ajuda a validar a ideia. Pode ser descontinuado
        a qualquer momento — leia os{' '}
        <Link href="/terms">Termos de Uso</Link> para detalhes.
      </p>
    ),
  },
  {
    q: 'Como deleto meus dados?',
    a: (
      <p>
        Você pode excluir cada transcrição individualmente pela página de
        histórico. Para excluir a conta inteira (e todo o histórico
        associado), envie um e-mail para{' '}
        <a href="mailto:victor@vhmac.com">victor@vhmac.com</a>. Removemos em até
        30 dias, conforme previsto na LGPD.
      </p>
    ),
  },
  {
    q: 'O código é aberto?',
    a: (
      <p>
        Sim. Todo o código está no{' '}
        <a href="https://github.com/euvhmac/prj-voca-ai" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>{' '}
        sob licença MIT. Você pode estudar, contribuir, abrir issues ou até
        hospedar sua própria versão.
      </p>
    ),
  },
];

export default function FaqPage() {
  return (
    <>
      <header className="mb-10">
        <p
          className="text-[12px] font-semibold tracking-[2px] uppercase mb-2"
          style={{ fontFamily: 'var(--font-jetbrains-mono)', color: '#16a34a' }}
        >
          Suporte
        </p>
        <h1
          className="text-[32px] md:text-[38px] font-extrabold tracking-[-0.8px]"
          style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
        >
          Perguntas frequentes
        </h1>
        <p className="mt-3 text-[14.5px] text-[#6b7280]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Não achou sua dúvida aqui? Escreva para{' '}
          <a href="mailto:victor@vhmac.com" className="text-[#16a34a] underline underline-offset-2">
            victor@vhmac.com
          </a>
          .
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {FAQS.map((item, i) => (
          <details
            key={i}
            className="group rounded-[14px] bg-white px-5 py-4 transition-colors"
            style={{ border: '1px solid #e5e7eb' }}
          >
            <summary
              className="flex items-center justify-between gap-4 cursor-pointer list-none outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80] rounded-md"
            >
              <span
                className="text-[15px] md:text-[16px] font-semibold tracking-[-0.2px]"
                style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
              >
                {item.q}
              </span>
              <span
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 group-open:rotate-45"
                style={{ backgroundColor: 'rgba(74,222,128,0.12)', color: '#16a34a' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1.5V10.5M1.5 6H10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <div
              className="mt-4 text-[14px] leading-[1.65] text-[#4b5563] flex flex-col gap-3"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}

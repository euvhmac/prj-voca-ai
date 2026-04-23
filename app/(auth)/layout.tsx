import { WaveformIcon } from '@/components/ui/icons/waveform-icon';
import { Footer } from '@/components/ui/footer/footer';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* ── Painel esquerdo — Deep Forest (oculto em mobile) ── */}
      <div
        className="hidden md:flex md:w-[52%] flex-col justify-between p-12"
        style={{ backgroundColor: '#0d2218' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <WaveformIcon size={28} color="#4ade80" />
          <span
            className="text-[22px] font-extrabold tracking-[-0.5px]"
            style={{
              fontFamily: 'var(--font-syne)',
              color: '#f0fdf4',
            }}
          >
            Voca
          </span>
        </div>

        {/* Hero content */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <span
              className="text-[11px] font-medium tracking-[2.5px] uppercase"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                color: '#4ade80',
              }}
            >
              AI-Powered
            </span>
            <h1
              className="text-[36px] font-extrabold leading-tight tracking-[-0.8px]"
              style={{
                fontFamily: 'var(--font-syne)',
                color: '#f0fdf4',
              }}
            >
              Transforme voz
              <br />
              em contexto.
            </h1>
            <p
              className="text-[15px] leading-relaxed max-w-sm"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                color: 'rgba(240,253,244,0.65)',
              }}
            >
              Envie um áudio do WhatsApp e receba um prompt estruturado, pronto
              para colar em qualquer LLM.
            </p>
          </div>

          {/* Feature bullets */}
          <ul className="flex flex-col gap-4">
            {FEATURES.map((feature) => (
              <li key={feature.label} className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(74,222,128,0.15)' }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 5L4 7L8 3"
                      stroke="#4ade80"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-[13.5px] font-semibold"
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      color: '#f0fdf4',
                    }}
                  >
                    {feature.label}
                  </span>
                  <span
                    className="text-[12.5px]"
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      color: 'rgba(240,253,244,0.55)',
                    }}
                  >
                    {feature.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Tagline footer */}
        <p
          className="text-[12px]"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            color: 'rgba(240,253,244,0.35)',
          }}
        >
          Suporta .ogg, .mp3, .m4a, .wav e mais
        </p>
      </div>

      {/* ── Painel direito — Soft Canvas + footer institucional ── */}
      <div
        className="flex-1 flex flex-col"
        style={{ backgroundColor: '#f8f9f7' }}
      >
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

const FEATURES = [
  {
    label: 'Transcrição precisa',
    description: 'OpenAI gpt-4o-mini-transcribe com suporte a PT-BR',
  },
  {
    label: 'Prompt otimizado',
    description: 'Remove vícios de linguagem, estrutura a ideia central',
  },
  {
    label: 'Histórico completo',
    description: 'Todos os seus áudios salvos e pesquisáveis',
  },
  {
    label: 'Export .md e .json',
    description: 'Exporte para qualquer workflow de trabalho',
  },
] as const;

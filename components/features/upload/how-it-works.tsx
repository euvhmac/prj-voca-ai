/**
 * 3-step explainer shown only to unauthenticated visitors below the upload zone.
 * Reinforces value proposition before the user commits to creating an account.
 */
const STEPS = [
  {
    n: '01',
    title: 'Suba o áudio',
    body: 'Áudio do WhatsApp, gravação, reunião — qualquer formato comum até 25 MB.',
  },
  {
    n: '02',
    title: 'A IA transcreve e otimiza',
    body: 'O conteúdo é convertido em texto e reescrito como um prompt estruturado, sem vícios de fala.',
  },
  {
    n: '03',
    title: 'Cole no LLM',
    body: 'Copie ou baixe o resultado e cole no ChatGPT, Claude, Gemini ou onde quiser.',
  },
] as const;

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-title"
      className="w-full max-w-[920px] mx-auto mt-20 px-2 animate-fade-up"
      style={{ animationDelay: '0.7s' }}
    >
      <div className="flex flex-col gap-2 mb-8 text-center">
        <span
          className="text-[11px] font-semibold tracking-[2px] uppercase"
          style={{ fontFamily: 'var(--font-jetbrains-mono)', color: '#16a34a' }}
        >
          Como funciona
        </span>
        <h2
          id="how-it-works-title"
          className="text-[22px] md:text-[26px] font-bold tracking-[-0.4px]"
          style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
        >
          Da voz ao prompt em segundos
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {STEPS.map((step, i) => (
          <article
            key={step.n}
            className="relative flex flex-col gap-3 p-6 rounded-[16px] bg-white animate-fade-up"
            style={{
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              animationDelay: `${0.8 + i * 0.08}s`,
            }}
          >
            <span
              className="text-[12px] font-semibold tracking-[1.5px]"
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                color: '#9ca3af',
              }}
            >
              {step.n}
            </span>
            <h3
              className="text-[16px] font-bold tracking-[-0.2px]"
              style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
            >
              {step.title}
            </h3>
            <p
              className="text-[13.5px] leading-[1.55]"
              style={{ fontFamily: 'var(--font-dm-sans)', color: '#6b7280' }}
            >
              {step.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

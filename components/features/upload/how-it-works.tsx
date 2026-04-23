/**
 * 3-step explainer shown only to unauthenticated visitors below the upload zone.
 */
const STEPS = [
  {
    n: '01',
    title: 'Suba o áudio',
    body: 'WhatsApp, gravação, reunião — qualquer formato comum até 25 MB.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2a5 5 0 0 1 5 5v4a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Z" stroke="#4ade80" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 11a7 7 0 0 0 14 0M11 18v2M8 20h6" stroke="#4ade80" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    n: '02',
    title: 'IA transcreve e otimiza',
    body: 'Texto limpo, sem vícios de fala. Reescrito como um prompt estruturado.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 3l1.5 4.5H17l-3.75 2.75 1.43 4.4L11 12l-3.68 2.65 1.43-4.4L5 7.5h4.5L11 3Z" stroke="#4ade80" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M4 18h14" stroke="#4ade80" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Cole no LLM',
    body: 'Resultado pronto para colar no ChatGPT, Claude, Gemini ou onde quiser.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="8" y="2" width="11" height="14" rx="2.5" stroke="#4ade80" strokeWidth="1.6"/>
        <path d="M14 16v2.5A1.5 1.5 0 0 1 12.5 20h-9A1.5 1.5 0 0 1 2 18.5v-11A1.5 1.5 0 0 1 3.5 6H6" stroke="#4ade80" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
] as const;

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-title"
      className="w-full animate-fade-up"
      style={{ animationDelay: '0.5s' }}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 mb-10 text-center">
        <span
          className="text-[11px] font-semibold tracking-[2.5px] uppercase"
          style={{ fontFamily: 'var(--font-jetbrains-mono)', color: '#16a34a' }}
        >
          Como funciona
        </span>
        <h2
          id="how-it-works-title"
          className="text-[28px] md:text-[34px] font-extrabold tracking-[-0.8px] leading-tight"
          style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
        >
          Da voz ao prompt{' '}
          <span style={{ color: '#16a34a' }}>em segundos</span>
        </h2>
      </div>

      {/* Steps */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Connecting line — desktop only */}
        <div
          className="hidden md:block absolute top-[52px] left-[calc(33.33%+12px)] right-[calc(33.33%+12px)] h-px"
          style={{ background: 'linear-gradient(90deg, #4ade80 0%, #86efac 50%, #4ade80 100%)', opacity: 0.35 }}
          aria-hidden="true"
        />

        {STEPS.map((step, i) => (
          <article
            key={step.n}
            className="relative flex flex-col gap-0 rounded-[20px] overflow-hidden bg-white animate-pop-in"
            style={{
              border: '1px solid #e9ebe8',
              boxShadow: '0 4px 20px rgba(13,34,24,0.06), 0 1px 3px rgba(13,34,24,0.04)',
              animationDelay: `${0.6 + i * 0.12}s`,
            }}
          >
            {/* Mint accent bar on top */}
            <div
              className="h-[3px] w-full"
              style={{
                background: `linear-gradient(90deg, #4ade80 ${i * 33}%, #16a34a 100%)`,
                opacity: 0.75 + i * 0.08,
              }}
              aria-hidden="true"
            />

            <div className="flex flex-col gap-4 p-7">
              {/* Icon + step number row */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-[10px]"
                  style={{ backgroundColor: 'rgba(74,222,128,0.10)' }}
                >
                  {step.icon}
                </div>
                <span
                  className="text-[42px] font-extrabold leading-none tracking-[-2px] select-none"
                  style={{
                    fontFamily: 'var(--font-syne)',
                    color: 'rgba(13,34,24,0.055)',
                  }}
                  aria-hidden="true"
                >
                  {step.n}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3
                  className="text-[16px] font-bold tracking-[-0.25px] leading-snug"
                  style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[13.5px] leading-[1.6]"
                  style={{ fontFamily: 'var(--font-dm-sans)', color: '#6b7280' }}
                >
                  {step.body}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

'use client';

const STEPS = [
  { label: 'Recebendo arquivo', desc: 'Upload concluído' },
  { label: 'Transcrevendo áudio', desc: 'OpenAI Whisper' },
  { label: 'Otimizando prompt', desc: 'GPT-5.4-mini' },
  { label: 'Salvando resultado', desc: 'Banco de dados' },
] as const;

type StepStatus = 'done' | 'active' | 'pending';

interface ProcessingStepsProps {
  filename: string;
  currentStep: number; // 0-based index of active step
}

function StepIndicator({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'rgba(74,222,128,0.15)' }}
        aria-hidden="true"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="#4ade80"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (status === 'active') {
    return (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-ring"
        style={{ backgroundColor: 'rgba(74,222,128,0.12)' }}
        aria-hidden="true"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80]" />
      </div>
    );
  }

  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: '#f3f4f2' }}
      aria-hidden="true"
    >
      <div className="w-2 h-2 rounded-full bg-[#d1d5db]" />
    </div>
  );
}

export function ProcessingSteps({ filename, currentStep }: ProcessingStepsProps) {
  return (
    <div className="w-full flex flex-col gap-6" aria-live="polite" aria-label="Progresso do processamento">
      {/* File info + waveform animation */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-end gap-1 h-8" aria-hidden="true">
          {[0, 0.12, 0.24, 0.12, 0, 0.18, 0.06].map((delay, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-[#4ade80] animate-wave-bar"
              style={{
                height: [14, 22, 32, 26, 18, 24, 12][i],
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-1">
          <p
            className="text-[13px] font-medium"
            style={{ fontFamily: 'var(--font-jetbrains-mono)', color: '#374151' }}
          >
            {filename}
          </p>
          <p
            className="text-[12px]"
            style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
          >
            Processando...
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {STEPS.map((step, i) => {
          const status: StepStatus =
            i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending';

          return (
            <div
              key={step.label}
              className="flex items-center gap-3"
              aria-current={status === 'active' ? 'step' : undefined}
            >
              <StepIndicator status={status} />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[13.5px] font-medium transition-colors ${
                    status === 'pending' ? 'text-[#9ca3af]' : 'text-[#111827]'
                  }`}
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  {step.label}
                </p>
                <p
                  className="text-[11.5px] text-[#9ca3af]"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  {step.desc}
                </p>
              </div>
              {status === 'active' && (
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-[5px]"
                  style={{
                    backgroundColor: 'rgba(74,222,128,0.08)',
                    color: '#16a34a',
                    fontFamily: 'var(--font-dm-sans)',
                  }}
                >
                  Em andamento
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

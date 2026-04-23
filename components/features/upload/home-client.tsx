'use client';

import { useReducer, useCallback } from 'react';
import type { TranscriptionResult } from '@/lib/types';
import { transcribeAudio, validateAudioFile } from '@/lib/api/transcriptions';
import {
  UploadZone,
  ProcessingSteps,
  ResultCard,
  AnimatedHero,
  WaveformBackdrop,
  HowItWorks,
} from '@/components/features/upload';
import { WaveformIcon } from '@/components/ui/icons/waveform-icon';
import { useToast } from '@/components/ui/toast';

// ── State machine ────────────────────────────────────────────
type UploadState =
  | { phase: 'idle'; error: string | null }
  | { phase: 'processing'; file: File; step: number }
  | { phase: 'done'; result: TranscriptionResult }
  | { phase: 'error'; message: string };

type UploadAction =
  | { type: 'START'; file: File }
  | { type: 'STEP'; step: number }
  | { type: 'DONE'; result: TranscriptionResult }
  | { type: 'ERROR'; message: string }
  | { type: 'VALIDATE_ERROR'; message: string }
  | { type: 'RESET' };

function reducer(state: UploadState, action: UploadAction): UploadState {
  switch (action.type) {
    case 'START':
      return { phase: 'processing', file: action.file, step: 0 };
    case 'STEP':
      if (state.phase === 'processing') {
        return { ...state, step: action.step };
      }
      return state;
    case 'DONE':
      return { phase: 'done', result: action.result };
    case 'ERROR':
      return { phase: 'error', message: action.message };
    case 'VALIDATE_ERROR':
      return { phase: 'idle', error: action.message };
    case 'RESET':
      return { phase: 'idle', error: null };
    default:
      return { phase: 'idle', error: null };
  }
}

// ── Component ────────────────────────────────────────────────

interface HomeClientProps {
  isAuthenticated: boolean;
}

export function HomeClient({ isAuthenticated }: HomeClientProps) {
  const [state, dispatch] = useReducer(reducer, { phase: 'idle', error: null });
  const { toast } = useToast();

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateAudioFile(file);
      if (validationError) {
        dispatch({ type: 'VALIDATE_ERROR', message: validationError });
        return;
      }

      dispatch({ type: 'START', file });

      // Simulate step progression while API processes
      dispatch({ type: 'STEP', step: 0 }); // Recebendo arquivo
      await new Promise<void>((r) => setTimeout(r, 400));
      dispatch({ type: 'STEP', step: 1 }); // Transcrevendo

      try {
        const stepTimer = setTimeout(() => dispatch({ type: 'STEP', step: 2 }), 8000);
        const result = await transcribeAudio(file);
        clearTimeout(stepTimer);

        dispatch({ type: 'STEP', step: 3 }); // Salvando
        await new Promise<void>((r) => setTimeout(r, 300));
        dispatch({ type: 'DONE', result });
        toast('Transcrição concluída! Prompt pronto para usar.', 'success');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao processar o áudio.';
        dispatch({ type: 'ERROR', message });
        toast(message, 'error');
      }
    },
    [toast],
  );

  const isIdle = state.phase === 'idle';
  const showHowItWorks = !isAuthenticated && isIdle;

  // ── Estado idle: hero band Deep Forest no topo + upload em Soft Canvas ──
  if (isIdle) {
    return (
      <div className="flex flex-col">
        {/* ── Faixa superior — Deep Forest, brand + hero ── */}
        <section
          className="relative overflow-hidden px-6 pt-12 pb-16 md:px-12 md:pt-16 md:pb-24"
          style={{ backgroundColor: '#0d2218' }}
          aria-label="Apresentação do Voca"
        >
          <BrandBandArt />
          <div className="relative z-10 max-w-[860px] mx-auto flex flex-col gap-7">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-fade-up">
              <WaveformIcon size={30} color="#4ade80" />
              <span
                className="text-[24px] font-extrabold tracking-[-0.5px]"
                style={{ fontFamily: 'var(--font-syne)', color: '#f0fdf4' }}
              >
                Voca
              </span>
            </div>

            {/* Kicker + hero */}
            <div className="flex flex-col gap-4">
              <span
                className="text-[11px] font-medium tracking-[2.5px] uppercase animate-fade-up"
                style={{ fontFamily: 'var(--font-dm-sans)', color: '#4ade80' }}
              >
                AI-Powered
              </span>
              <AnimatedHero
                tone="light"
                headline="Turn voice into context."
                subline="Envie um áudio do WhatsApp, gravação ou reunião e receba um prompt estruturado, pronto para colar em qualquer LLM — ChatGPT, Claude, Gemini."
              />
            </div>
          </div>
        </section>

        {/* ── Área inferior — Soft Canvas, upload + how-it-works ── */}
        <section
          className="relative px-6 pt-12 pb-16 md:px-12 md:pt-16 md:pb-20"
          style={{ backgroundColor: '#f8f9f7' }}
          aria-live="polite"
        >
          <div className="max-w-[720px] mx-auto flex flex-col gap-12 relative z-10">
            <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <WaveformBackdrop />
              <div className="relative z-10">
                <UploadZone
                  onFile={handleFile}
                  error={state.error}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            </div>

            {showHowItWorks && <HowItWorks />}
          </div>
        </section>
      </div>
    );
  }

  // ── Estados processing/done/error: layout focado, coluna única ──
  return (
    <div className="px-6 py-12 md:px-12 md:py-20" style={{ backgroundColor: '#f8f9f7' }}>
      <div className="w-full max-w-[720px] mx-auto" aria-live="polite">
        {state.phase === 'processing' && (
          <div
            className="bg-white rounded-[18px] px-6 py-8 animate-pop-in"
            style={{
              border: '1px solid #e5e7eb',
              boxShadow: '0 12px 40px rgba(13,34,24,0.08)',
            }}
          >
            <ProcessingSteps filename={state.file.name} currentStep={state.step} />
          </div>
        )}

        {state.phase === 'done' && (
          <div className="animate-pop-in">
            <ResultCard
              result={state.result}
              onReset={() => dispatch({ type: 'RESET' })}
            />
          </div>
        )}

        {state.phase === 'error' && (
          <div
            className="flex flex-col gap-4 items-start bg-white rounded-[18px] px-6 py-8 animate-fade-up"
            style={{ border: '1px solid rgba(248,113,113,0.3)' }}
            role="alert"
          >
            <div className="flex flex-col gap-1.5">
              <p
                className="text-[15px] font-semibold text-[#111827]"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Algo deu errado
              </p>
              <p
                className="text-[13.5px] text-[#6b7280]"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                {state.message}
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="flex items-center gap-2 px-4 py-2 rounded-[9px] text-[13px] font-semibold
                bg-[#0d2218] text-[#f0fdf4]
                hover:bg-[#163528] hover:-translate-y-px
                transition-all duration-150
                focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Arte ambiente do hero band Deep Forest no topo da home.
 * Glows mint + waveform horizontal sutil. `aria-hidden`.
 */
function BrandBandArt() {
  const bars = [
    18, 30, 42, 26, 16, 32, 48, 28, 14, 24, 40, 32, 20, 12, 30, 44, 34, 18, 28, 22,
    16, 32, 46, 28, 20, 14, 26, 38, 32, 18, 28, 42, 34, 22, 16, 30, 44, 28, 18, 26,
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute"
        style={{
          top: '-30%',
          right: '-10%',
          width: 540,
          height: 540,
          background:
            'radial-gradient(circle at center, rgba(74,222,128,0.22) 0%, rgba(74,222,128,0.05) 45%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: '-40%',
          left: '-10%',
          width: 420,
          height: 420,
          background:
            'radial-gradient(circle at center, rgba(74,222,128,0.10) 0%, transparent 65%)',
          filter: 'blur(12px)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-6 flex items-end justify-center gap-[5px] animate-ambient-pan"
        style={{ opacity: 0.18 }}
      >
        {bars.map((h, i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{
              width: 2.5,
              height: h,
              background:
                i % 7 === 0
                  ? 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)'
                  : 'rgba(240,253,244,0.55)',
              opacity: 0.45 + (h / 80),
            }}
          />
        ))}
      </div>
    </div>
  );
}

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

  return (
    <div className="relative flex flex-col min-h-screen px-6 py-12 md:px-12 md:py-20">
      <div className="w-full max-w-[680px] mx-auto flex flex-col gap-10 relative z-10">
        {/* Hero — only visible in idle state, animates out otherwise */}
        {isIdle && (
          <AnimatedHero
            headline="Turn voice into context."
            subline="Envie um áudio do WhatsApp, gravação ou reunião e receba um prompt estruturado, pronto para colar em qualquer LLM — ChatGPT, Claude, Gemini."
          />
        )}

        {/* Main content area */}
        <main aria-live="polite" className="relative">
          {/* Decorative ambient backdrop only behind the upload state */}
          {isIdle && <WaveformBackdrop />}

          {state.phase === 'idle' && (
            <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <UploadZone
                onFile={handleFile}
                error={state.error}
                isAuthenticated={isAuthenticated}
              />
            </div>
          )}

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
        </main>

        {showHowItWorks && <HowItWorks />}
      </div>
    </div>
  );
}

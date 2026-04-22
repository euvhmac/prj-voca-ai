'use client';

import { useReducer, useCallback } from 'react';
import type { TranscriptionResult } from '@/lib/types';
import { transcribeAudio, validateAudioFile } from '@/lib/api/transcriptions';
import { UploadZone, ProcessingSteps, ResultCard } from '@/components/features/upload';

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
export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, { phase: 'idle', error: null });

  const handleFile = useCallback(async (file: File) => {
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
      // step 2 (Otimizando) fires ~halfway — approximate with timeout
      const stepTimer = setTimeout(() => dispatch({ type: 'STEP', step: 2 }), 8000);
      const result = await transcribeAudio(file);
      clearTimeout(stepTimer);

      dispatch({ type: 'STEP', step: 3 }); // Salvando
      await new Promise<void>((r) => setTimeout(r, 300));
      dispatch({ type: 'DONE', result });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao processar o áudio.';
      dispatch({ type: 'ERROR', message });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 md:px-12">
      <div className="w-full max-w-[600px] mx-auto flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-1.5 animate-fade-up">
          <h1
            className="text-[28px] font-extrabold tracking-[-0.8px]"
            style={{ fontFamily: 'var(--font-syne)', color: '#111827' }}
          >
            Turn voice into context.
          </h1>
          <p
            className="text-[14px]"
            style={{ fontFamily: 'var(--font-dm-sans)', color: '#6b7280' }}
          >
            Envie um áudio e receba um prompt estruturado, pronto para colar em qualquer LLM.
          </p>
        </header>

        {/* Main content area */}
        <main aria-live="polite">
          {state.phase === 'idle' && (
            <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <UploadZone onFile={handleFile} error={state.error} />
            </div>
          )}

          {state.phase === 'processing' && (
            <div
              className="bg-white rounded-[18px] px-6 py-8 animate-fade-up"
              style={{ border: '1px solid #e5e7eb' }}
            >
              <ProcessingSteps filename={state.file.name} currentStep={state.step} />
            </div>
          )}

          {state.phase === 'done' && (
            <ResultCard
              result={state.result}
              onReset={() => dispatch({ type: 'RESET' })}
            />
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
      </div>
    </div>
  );
}

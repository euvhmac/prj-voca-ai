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

  // ── Estado idle ────────────────────────────────────────────
  if (isIdle) {
    // Anônimo: split-screen igual ao login — alto impacto visual
    if (!isAuthenticated) {
      return (
        <div className="flex flex-col">
          {/* ── Split-screen — Deep Forest + Soft Canvas, min full viewport ── */}
          <div className="flex flex-col md:flex-row min-h-screen">
          {/* ── Painel esquerdo — Deep Forest, brand pane ── */}
          <aside
            className="relative overflow-hidden flex flex-col justify-between gap-10 px-7 py-10 md:w-[52%] md:px-12 md:py-14"
            style={{ backgroundColor: '#0d2218' }}
            aria-label="Apresentação do Voca"
          >
            <BrandPaneArt />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3 animate-fade-up">
              <WaveformIcon size={32} color="#4ade80" />
              <span
                className="text-[26px] font-extrabold tracking-[-0.6px]"
                style={{ fontFamily: 'var(--font-syne)', color: '#f0fdf4' }}
              >
                Voca
              </span>
            </div>

            {/* Hero */}
            <div className="relative z-10 flex flex-col gap-5">
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

            {/* Tagline rodapé do painel */}
            <div className="relative z-10 flex flex-col gap-2 animate-fade-up" style={{ animationDelay: '0.6s' }}>
              <p
                className="text-[12px] tracking-[0.5px]"
                style={{ fontFamily: 'var(--font-dm-sans)', color: 'rgba(240,253,244,0.45)' }}
              >
                .ogg · .mp3 · .m4a · .wav · .opus · .webm — até 25MB
              </p>
              <p
                className="text-[11.5px]"
                style={{ fontFamily: 'var(--font-dm-sans)', color: 'rgba(240,253,244,0.30)' }}
              >
                Processado pela OpenAI · sem armazenamento permanente do áudio
              </p>
            </div>
          </aside>

          {/* ── Painel direito — Soft Canvas, área de upload ── */}
          <section
            className="flex-1 flex items-start md:items-center justify-center px-6 py-10 md:px-10 md:py-16"
            style={{ backgroundColor: '#f8f9f7' }}
            aria-live="polite"
          >
            <div className="w-full max-w-[540px]">
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
            </div>
          </section>
          </div>

          {/* ── Como funciona — full-width, abaixo do fold ── */}
          <div
            className="px-6 py-16 md:px-12 md:py-20"
            style={{ backgroundColor: '#f8f9f7' }}
          >
            <div className="max-w-[960px] mx-auto">
              <HowItWorks />
            </div>
          </div>

          {/* Hint de rolagem para descobrir o footer institucional */}
          <ScrollHint />
        </div>
      );
    }

    // Autenticado: clean, coluna única larga (layout original)
    return (
      <div className="relative flex flex-col min-h-screen px-6 py-12 md:px-12 md:py-20">
        <div className="w-full max-w-[680px] mx-auto flex flex-col gap-10 relative z-10">
          <AnimatedHero
            headline="Turn voice into context."
            subline="Envie um áudio, gravação ou reunião e receba um prompt estruturado, pronto para colar em qualquer LLM."
          />
          <main aria-live="polite" className="relative">
            <WaveformBackdrop />
            <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <UploadZone
                onFile={handleFile}
                error={state.error}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </main>
        </div>
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
 * Hint flutuante no canto inferior — sinaliza ao usuário anônimo que há
 * informações institucionais (FAQ, privacidade, termos) abaixo do fold.
 * Rola suavemente até o footer ao clicar.
 */
function ScrollHint() {
  function scrollToFooter() {
    const footer = document.querySelector('footer');
    footer?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  return (
    <button
      type="button"
      onClick={scrollToFooter}
      aria-label="Ver informações institucionais"
      className="hidden md:flex fixed bottom-6 right-6 z-30 items-center gap-2 px-4 py-2.5 rounded-full
        bg-[#0d2218]/90 backdrop-blur-sm text-[#f0fdf4] text-[12.5px] font-medium
        shadow-[0_8px_24px_rgba(13,34,24,0.25)]
        hover:bg-[#0d2218] hover:-translate-y-0.5
        transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none
        animate-fade-up"
      style={{ fontFamily: 'var(--font-dm-sans)', animationDelay: '1.2s' }}
    >
      <span>Sobre · FAQ</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="animate-bounce-soft"
      >
        <path
          d="M7 2v9M3 7l4 4 4-4"
          stroke="#4ade80"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/**
 * Arte ambiente do painel esquerdo da home anônima (Deep Forest).
 * Apenas glows mint radiais — sem barras de waveform. `aria-hidden`.
 */
function BrandPaneArt() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute"
        style={{
          top: '-15%',
          right: '-20%',
          width: 480,
          height: 480,
          background:
            'radial-gradient(circle at center, rgba(74,222,128,0.22) 0%, rgba(74,222,128,0.06) 45%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: '-20%',
          left: '-15%',
          width: 360,
          height: 360,
          background:
            'radial-gradient(circle at center, rgba(74,222,128,0.10) 0%, transparent 65%)',
          filter: 'blur(12px)',
        }}
      />
    </div>
  );
}

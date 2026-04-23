'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { WaveformIcon } from '@/components/ui/icons/waveform-icon';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log para monitoramento — trocar por serviço real em produção
    console.error('[Voca] Unhandled error:', error);
  }, [error]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#0d2218' }}
    >
      {/* Icon */}
      <div className="mb-6 opacity-60">
        <WaveformIcon size={40} />
      </div>

      {/* Code */}
      <p
        className="mb-2 text-[13px] font-medium tracking-[0.15em] uppercase"
        style={{ fontFamily: 'var(--font-jetbrains-mono)', color: '#f87171' }}
      >
        Erro inesperado
      </p>

      {/* Headline */}
      <h1
        className="mb-3 text-[28px] font-bold tracking-[-0.5px]"
        style={{ fontFamily: 'var(--font-syne)', color: '#f0fdf4' }}
      >
        Algo deu errado
      </h1>

      {/* Description */}
      <p
        className="mb-8 max-w-[360px] text-[15px] leading-relaxed"
        style={{ fontFamily: 'var(--font-dm-sans)', color: 'rgba(240,253,244,0.55)' }}
      >
        Ocorreu um erro inesperado. Você pode tentar novamente ou voltar ao início.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-[14px] font-semibold transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80]"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            backgroundColor: '#4ade80',
            color: '#0d2218',
          }}
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-[14px] font-medium transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80]"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            border: '1px solid rgba(74,222,128,0.2)',
            color: 'rgba(240,253,244,0.7)',
          }}
        >
          Início
        </Link>
      </div>
    </div>
  );
}

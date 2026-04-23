'use client';

import Link from 'next/link';
import { WaveformIcon } from '@/components/ui/icons/waveform-icon';

export default function NotFound() {
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
        style={{ fontFamily: 'var(--font-jetbrains-mono)', color: '#4ade80' }}
      >
        404
      </p>

      {/* Headline */}
      <h1
        className="mb-3 text-[28px] font-bold tracking-[-0.5px]"
        style={{ fontFamily: 'var(--font-syne)', color: '#f0fdf4' }}
      >
        Página não encontrada
      </h1>

      {/* Description */}
      <p
        className="mb-8 max-w-[340px] text-[15px] leading-relaxed"
        style={{ fontFamily: 'var(--font-dm-sans)', color: 'rgba(240,253,244,0.55)' }}
      >
        O endereço que você tentou acessar não existe ou foi movido.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-[14px] font-semibold transition-all duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80]"
        style={{
          fontFamily: 'var(--font-dm-sans)',
          backgroundColor: '#4ade80',
          color: '#0d2218',
        }}
      >
        Voltar ao início
      </Link>
    </div>
  );
}

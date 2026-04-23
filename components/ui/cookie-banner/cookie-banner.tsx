'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'voca:cookie-consent';

// `useSyncExternalStore` é a forma idiomática de ler localStorage em React 19
// sem disparar `setState` dentro de `useEffect` (o que viola o lint
// `react-hooks/set-state-in-effect`).
function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  // No SSR ainda não sabemos — assumimos "consentido" para evitar flicker
  return '1';
}

/**
 * Banner de aviso de cookies.
 * Aparece somente no primeiro acesso; persiste a dispensa em `localStorage`.
 * Não bloqueia nenhum cookie funcional (sessão Auth.js é estritamente necessária).
 */
export function CookieBanner() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [locallyDismissed, setLocallyDismissed] = useState(false);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore — usuário poderá ver o banner novamente, mas a UX continua funcional
    }
    setLocallyDismissed(true);
  }

  if (dismissed || locallyDismissed) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-[420px] z-50 animate-fade-up"
      style={{
        backgroundColor: '#0d2218',
        color: '#f0fdf4',
        borderRadius: 14,
        padding: '16px 18px',
        boxShadow: '0 16px 40px rgba(13,34,24,0.28)',
        fontFamily: 'var(--font-dm-sans)',
      }}
    >
      <div className="flex flex-col gap-3">
        <p className="text-[13px] leading-[1.55]">
          O Voca usa cookies estritamente necessários para manter sua sessão
          (Auth.js). Não usamos cookies de rastreamento ou publicidade.{' '}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-white"
          >
            Saiba mais
          </Link>
          .
        </p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={dismiss}
            className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-semibold
              bg-[#4ade80] text-[#0d2218]
              hover:bg-[#22c55e] hover:-translate-y-px
              transition-all duration-150
              focus-visible:ring-2 focus-visible:ring-[#86efac] focus-visible:outline-none"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

type Provider = 'google';

interface SocialLoginButtonsProps {
  callbackUrl?: string;
}

export function SocialLoginButtons({ callbackUrl = '/' }: SocialLoginButtonsProps) {
  const [loading, setLoading] = useState<Provider | null>(null);

  async function handleSignIn(provider: Provider): Promise<void> {
    setLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      // signIn redireciona em caso de sucesso — erro aqui é inesperado
      setLoading(null);
    }
  }

  const btnClass =
    'flex items-center justify-center gap-3 w-full px-4 py-2.5 ' +
    'border border-[#e5e7eb] rounded-[8px] text-[13.5px] font-medium ' +
    'text-[#374151] bg-white ' +
    'transition-all duration-150 ' +
    'hover:border-[#4ade80] hover:bg-[#f0fdf4] hover:text-[#0d2218] ' +
    'focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none ' +
    'disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <div className="flex flex-col gap-3">
      {/* Google */}
      <button
        onClick={() => handleSignIn('google')}
        disabled={loading !== null}
        className={btnClass}
        style={{ fontFamily: 'var(--font-dm-sans)' }}
        aria-label="Entrar com Google"
      >
        {loading === 'google' ? <Spinner /> : <GoogleIcon />}
        Continuar com Google
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="animate-spin flex-shrink-0"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="#e5e7eb"
        strokeWidth="2"
      />
      <path
        d="M8 2a6 6 0 0 1 6 6"
        stroke="#0d2218"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

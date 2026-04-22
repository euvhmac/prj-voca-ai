'use client';

import { useState } from 'react';
import { SocialLoginButtons } from './social-login-buttons';

type AuthTab = 'login' | 'register';

const AUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked:
    'Este email já está associado a outra conta. Use o provedor original.',
  OAuthCallbackError: 'Erro ao autenticar. Tente novamente.',
  OAuthCreateAccount: 'Não foi possível criar a conta. Tente novamente.',
  Callback: 'Erro no callback de autenticação. Tente novamente.',
  Default: 'Ocorreu um erro ao entrar. Tente novamente.',
};

interface AuthCardProps {
  error?: string;
}

export function AuthCard({ error }: AuthCardProps) {
  const [tab, setTab] = useState<AuthTab>('login');

  const errorMessage = error
    ? (AUTH_ERRORS[error] ?? AUTH_ERRORS['Default'])
    : null;

  return (
    <div
      className="w-full max-w-[400px] animate-fade-up"
      style={{ animationDelay: '0.1s' }}
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1.5">
        <h2
          className="text-[22px] font-bold tracking-[-0.5px]"
          style={{
            fontFamily: 'var(--font-syne)',
            color: '#111827',
          }}
        >
          {tab === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p
          className="text-[14px]"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            color: '#6b7280',
          }}
        >
          {tab === 'login'
            ? 'Entre para acessar seu histórico e prompts.'
            : 'Comece a transformar seus áudios em contexto.'}
        </p>
      </div>

      {/* Erro OAuth */}
      {errorMessage && (
        <div
          className="mb-5 px-4 py-3 rounded-[8px] text-[13px]"
          style={{
            backgroundColor: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.25)',
            color: '#dc2626',
            fontFamily: 'var(--font-dm-sans)',
          }}
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {/* Tab toggle */}
      <div
        className="flex rounded-[10px] p-1 gap-0.5 mb-7 bg-[#eff1ee]"
        role="tablist"
        aria-label="Tipo de acesso"
      >
        <button
          role="tab"
          aria-selected={tab === 'login'}
          onClick={() => setTab('login')}
          style={{ fontFamily: 'var(--font-dm-sans)' }}
          className={`flex-1 py-2 rounded-[7px] text-[13.5px] transition-all duration-150
            focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none
            ${tab === 'login'
              ? 'bg-white text-[#0d2218] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]'
              : 'bg-transparent text-[#6b7280] font-medium hover:text-[#374151]'
            }`}
        >
          Entrar
        </button>
        <button
          role="tab"
          aria-selected={tab === 'register'}
          onClick={() => setTab('register')}
          style={{ fontFamily: 'var(--font-dm-sans)' }}
          className={`flex-1 py-2 rounded-[7px] text-[13.5px] transition-all duration-150
            focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none
            ${tab === 'register'
              ? 'bg-white text-[#0d2218] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]'
              : 'bg-transparent text-[#6b7280] font-medium hover:text-[#374151]'
            }`}
        >
          Criar conta
        </button>
      </div>

      {/* Formulário — Email + Senha (placeholder visual para MVP OAuth) */}
      <div className="flex flex-col gap-4 mb-6">
        {tab === 'register' && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-[12.5px] font-medium block"
              style={{ fontFamily: 'var(--font-dm-sans)', color: '#374151' }}
            >
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              disabled
              className="w-full px-3.5 py-2.5 border rounded-[8px] text-sm outline-none transition-[border-color,box-shadow] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                borderColor: '#e5e7eb',
                color: '#111827',
                backgroundColor: '#ffffff',
              }}
              aria-describedby="name-hint"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-[12.5px] font-medium block"
            style={{ fontFamily: 'var(--font-dm-sans)', color: '#374151' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            disabled
            className="w-full px-3.5 py-2.5 border rounded-[8px] text-sm outline-none transition-[border-color,box-shadow] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              borderColor: '#e5e7eb',
              color: '#111827',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-[12.5px] font-medium block"
            style={{ fontFamily: 'var(--font-dm-sans)', color: '#374151' }}
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            placeholder="••••••••"
            disabled
            className="w-full px-3.5 py-2.5 border rounded-[8px] text-sm outline-none transition-[border-color,box-shadow] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              borderColor: '#e5e7eb',
              color: '#111827',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        {tab === 'register' && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm-password"
              className="text-[12.5px] font-medium block"
              style={{ fontFamily: 'var(--font-dm-sans)', color: '#374151' }}
            >
              Confirmar senha
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              disabled
              className="w-full px-3.5 py-2.5 border rounded-[8px] text-sm outline-none transition-[border-color,box-shadow] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                borderColor: '#e5e7eb',
                color: '#111827',
                backgroundColor: '#ffffff',
              }}
            />
          </div>
        )}

        <p
          className="text-[11.5px] -mt-1"
          style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
        >
          Login por email disponível em breve. Use os provedores abaixo.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ backgroundColor: '#e9ebe8' }} />
        <span
          className="text-[12px] whitespace-nowrap"
          style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
        >
          ou continue com
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: '#e9ebe8' }} />
      </div>

      {/* OAuth buttons */}
      <SocialLoginButtons />

      {/* Footer */}
      <p
        className="text-center text-[12px] mt-6"
        style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
      >
        Ao continuar, você concorda com os{' '}
        <span className="underline cursor-pointer" style={{ color: '#6b7280' }}>
          Termos de Uso
        </span>{' '}
        e a{' '}
        <span className="underline cursor-pointer" style={{ color: '#6b7280' }}>
          Política de Privacidade
        </span>
        .
      </p>
    </div>
  );
}

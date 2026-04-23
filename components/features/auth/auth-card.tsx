'use client';

import { useState, useReducer } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SocialLoginButtons } from './social-login-buttons';

type AuthTab = 'login' | 'register';

const AUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked:
    'Este email já está associado a outra conta. Use o provedor original.',
  OAuthCallbackError: 'Erro ao autenticar. Tente novamente.',
  OAuthCreateAccount: 'Não foi possível criar a conta. Tente novamente.',
  Callback: 'Erro no callback de autenticação. Tente novamente.',
  CredentialsSignin: 'Email ou senha incorretos.',
  Default: 'Ocorreu um erro ao entrar. Tente novamente.',
};

// ─── Form state machine ────────────────────────────────────────────────────

type FormStatus = 'idle' | 'loading' | 'error' | 'success';
interface FormState { status: FormStatus; error: string | null; }
type FormAction =
  | { type: 'SUBMIT' }
  | { type: 'ERROR'; payload: string }
  | { type: 'SUCCESS' };

function formReducer(_state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SUBMIT':  return { status: 'loading', error: null };
    case 'ERROR':   return { status: 'error', error: action.payload };
    case 'SUCCESS': return { status: 'success', error: null };
  }
}
const initialFormState: FormState = { status: 'idle', error: null };

// ─── Component ─────────────────────────────────────────────────────────────

interface AuthCardProps {
  error?: string;
  callbackUrl?: string;
}

export function AuthCard({ error, callbackUrl = '/' }: AuthCardProps) {
  const [tab, setTab] = useState<AuthTab>('login');
  const [loginState, loginDispatch] = useReducer(formReducer, initialFormState);
  const [registerState, registerDispatch] = useReducer(formReducer, initialFormState);
  const router = useRouter();

  const oauthError = error ? (AUTH_ERRORS[error] ?? AUTH_ERRORS['Default']) : null;

  // ── Login com email/senha ───────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    loginDispatch({ type: 'SUBMIT' });

    const result = await signIn('credentials', {
      email: form.get('email') as string,
      password: form.get('password') as string,
      redirect: false,
    });

    if (result?.error) {
      loginDispatch({ type: 'ERROR', payload: AUTH_ERRORS['CredentialsSignin'] ?? 'Email ou senha incorretos.' });
      return;
    }

    loginDispatch({ type: 'SUCCESS' });
    router.push(callbackUrl);
    router.refresh();
  }

  // ── Cadastro com email/senha ─────────────────────────────────────────────
  async function handleRegister(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    if (password.length < 8) {
      registerDispatch({ type: 'ERROR', payload: 'Senha deve ter no mínimo 8 caracteres.' });
      return;
    }

    registerDispatch({ type: 'SUBMIT' });

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.get('name') as string, email, password }),
    });

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      registerDispatch({ type: 'ERROR', payload: data.error ?? 'Erro ao criar conta.' });
      return;
    }

    // Após cadastro bem-sucedido, faz login automático
    const result = await signIn('credentials', { email, password, redirect: false });

    if (result?.error) {
      registerDispatch({ type: 'ERROR', payload: 'Conta criada! Faça login para continuar.' });
      setTab('login');
      return;
    }

    registerDispatch({ type: 'SUCCESS' });
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div
      className="w-full max-w-[400px] animate-fade-up"
      style={{ animationDelay: '0.1s' }}
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1.5">
        <h2
          className="text-[22px] font-bold tracking-[-0.5px]"
          style={{ fontFamily: 'var(--font-syne)', color: '#111827' }}
        >
          {tab === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p
          className="text-[14px]"
          style={{ fontFamily: 'var(--font-dm-sans)', color: '#6b7280' }}
        >
          {tab === 'login'
            ? 'Entre para acessar seu histórico e prompts.'
            : 'Comece a transformar seus áudios em contexto.'}
        </p>
      </div>

      {/* Erro OAuth */}
      {oauthError && (
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
          {oauthError}
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

      {/* ── Formulário de Login ──────────────────────────────────────── */}
      {tab === 'login' && (
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-5" noValidate>
          {loginState.error && <ErrorBanner message={loginState.error} />}
          <Field label="Email" name="email" type="email" placeholder="seu@email.com" autoComplete="email" />
          <Field label="Senha" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          <SubmitButton loading={loginState.status === 'loading'}>Entrar</SubmitButton>
        </form>
      )}

      {/* ── Formulário de Cadastro ───────────────────────────────────── */}
      {tab === 'register' && (
        <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-5" noValidate>
          {registerState.error && <ErrorBanner message={registerState.error} />}
          <Field label="Nome" name="name" type="text" placeholder="Seu nome" autoComplete="name" />
          <Field label="Email" name="email" type="email" placeholder="seu@email.com" autoComplete="email" />
          <Field label="Senha" name="password" type="password" placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
          <SubmitButton loading={registerState.status === 'loading'}>Criar conta</SubmitButton>
        </form>
      )}

      {/* Divisor */}
      <div className="flex items-center gap-3 mb-5">
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
      <SocialLoginButtons callbackUrl={callbackUrl} />

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

// ─── Sub-components ────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
}

function Field({ label, name, type, placeholder, autoComplete }: FieldProps) {
  const inputId = `field-${name}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-[13px] font-medium"
        style={{ fontFamily: 'var(--font-dm-sans)', color: '#374151' }}
      >
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full px-3.5 py-2.5 rounded-[8px] text-[14px] outline-none transition-all duration-150
          border border-[#e5e7eb] bg-white text-[#111827] placeholder:text-[#9ca3af]
          focus:border-[#4ade80] focus:ring-2 focus:ring-[#4ade80]/20"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      />
    </div>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2.5 rounded-[8px] text-[14px] font-semibold transition-all duration-150
        focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none
        disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ fontFamily: 'var(--font-dm-sans)', backgroundColor: '#0d2218', color: '#f8f9f7' }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="animate-spin">
            <circle cx="7" cy="7" r="5" stroke="rgba(248,249,247,0.3)" strokeWidth="2" />
            <path d="M7 2a5 5 0 0 1 5 5" stroke="#f8f9f7" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Aguarde...
        </span>
      ) : children}
    </button>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="px-4 py-3 rounded-[8px] text-[13px]"
      style={{
        backgroundColor: 'rgba(248,113,113,0.08)',
        border: '1px solid rgba(248,113,113,0.25)',
        color: '#dc2626',
        fontFamily: 'var(--font-dm-sans)',
      }}
      role="alert"
    >
      {message}
    </div>
  );
}

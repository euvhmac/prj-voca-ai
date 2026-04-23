'use client';

import { useToast, type Toast } from './toast-context';

const VARIANT_STYLES: Record<Toast['variant'], { icon: string; bg: string; border: string; color: string }> = {
  success: {
    icon: '✓',
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.25)',
    color: '#16a34a',
  },
  error: {
    icon: '✕',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.25)',
    color: '#dc2626',
  },
  info: {
    icon: 'i',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.20)',
    color: '#2563eb',
  },
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none"
      aria-live="polite"
      aria-label="Notificações"
      role="region"
    >
      {toasts.map((t) => {
        const s = VARIANT_STYLES[t.variant];
        return (
          <div
            key={t.id}
            className="flex items-start gap-3 px-4 py-3 rounded-[10px] shadow-md animate-fade-up pointer-events-auto
              max-w-[340px] min-w-[240px]"
            style={{
              backgroundColor: s.bg,
              border: `1px solid ${s.border}`,
              backdropFilter: 'blur(8px)',
            }}
            role="status"
          >
            {/* Icon */}
            <span
              className="flex-shrink-0 mt-px w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={{ backgroundColor: s.border, color: s.color }}
              aria-hidden="true"
            >
              {s.icon}
            </span>

            {/* Message */}
            <p
              className="flex-1 text-[13.5px] leading-snug"
              style={{ fontFamily: 'var(--font-dm-sans)', color: '#111827' }}
            >
              {t.message}
            </p>

            {/* Dismiss */}
            <button
              onClick={() => dismiss(t.id)}
              className="flex-shrink-0 mt-px w-5 h-5 flex items-center justify-center rounded-full opacity-40 hover:opacity-70 transition-opacity
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80]"
              aria-label="Fechar notificação"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                <path d="M1 1l6 6M7 1l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}

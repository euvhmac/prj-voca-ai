'use client';

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

type ToastAction =
  | { type: 'ADD'; payload: Toast }
  | { type: 'REMOVE'; id: string };

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id);
  }
}

// ─── Context ───────────────────────────────────────────────────────────────

interface ToastContextValue {
  toasts: Toast[];
  toast: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const counterRef = useRef(0);

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    counterRef.current += 1;
    const id = `toast-${counterRef.current}`;
    dispatch({ type: 'ADD', payload: { id, message, variant } });

    // Auto-dismiss após 4s
    setTimeout(() => {
      dispatch({ type: 'REMOVE', id });
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

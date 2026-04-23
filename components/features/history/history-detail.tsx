'use client';

import { useReducer, useEffect, useCallback } from 'react';
import type { TranscriptionResult } from '@/lib/types';
import { fetchTranscriptionById } from '@/lib/api/history';
import { ResultCard } from '@/components/features/upload';

interface HistoryDetailProps {
  selectedId: string | null;
  onClose: () => void;
}

// ── State machine ────────────────────────────────────────────
type DetailState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; result: TranscriptionResult }
  | { status: 'error'; message: string };

type DetailAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; result: TranscriptionResult }
  | { type: 'FETCH_ERROR'; message: string }
  | { type: 'RESET' };

function reducer(_state: DetailState, action: DetailAction): DetailState {
  switch (action.type) {
    case 'FETCH_START':  return { status: 'loading' };
    case 'FETCH_SUCCESS': return { status: 'success', result: action.result };
    case 'FETCH_ERROR':  return { status: 'error', message: action.message };
    case 'RESET':        return { status: 'idle' };
  }
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 3L13 13M13 3L3 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Meta bar skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-6 w-20 rounded-[6px] bg-[#eff1ee]" />
        <div className="h-6 w-36 rounded-[6px] bg-[#eff1ee]" />
        <div className="h-6 w-16 rounded-[6px] bg-[#eff1ee]" />
      </div>
      {/* Card skeleton */}
      <div className="bg-white rounded-[18px] border border-[#e5e7eb] overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 gap-3">
          <div className="h-8 w-48 rounded-[10px] bg-[#eff1ee]" />
          <div className="h-7 w-16 rounded-[6px] bg-[#eff1ee]" />
        </div>
        <div className="px-5 py-4 min-h-[180px] flex flex-col gap-2.5">
          {[100, 90, 75, 95, 60, 80].map((w, i) => (
            <div
              key={i}
              className="h-3.5 rounded-full bg-[#eff1ee]"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#f3f4f2]">
          <div className="flex gap-2">
            <div className="h-7 w-14 rounded-[7px] bg-[#eff1ee]" />
            <div className="h-7 w-14 rounded-[7px] bg-[#eff1ee]" />
          </div>
          <div className="h-8 w-32 rounded-[9px] bg-[#eff1ee]" />
        </div>
      </div>
    </div>
  );
}

export function HistoryDetail({ selectedId, onClose }: HistoryDetailProps) {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' });

  useEffect(() => {
    if (!selectedId) return;

    let cancelled = false;
    dispatch({ type: 'FETCH_START' });

    fetchTranscriptionById(selectedId)
      .then((result) => { if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', result }); })
      .catch((err: unknown) => {
        if (!cancelled) dispatch({
          type: 'FETCH_ERROR',
          message: err instanceof Error ? err.message : 'Erro ao carregar transcrição',
        });
      });

    return () => { cancelled = true; };
  }, [selectedId]);

  const handleRetry = useCallback(() => {
    if (!selectedId) return;
    let cancelled = false;
    dispatch({ type: 'FETCH_START' });
    fetchTranscriptionById(selectedId)
      .then((result) => { if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', result }); })
      .catch((err: unknown) => {
        if (!cancelled) dispatch({
          type: 'FETCH_ERROR',
          message: err instanceof Error ? err.message : 'Erro ao carregar transcrição',
        });
      });
    return () => { cancelled = true; };
  }, [selectedId]);

  const handleReset = useCallback(() => { onClose(); }, [onClose]);

  if (!selectedId) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full min-h-[320px] text-center gap-3"
        aria-hidden="true"
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="opacity-20" aria-hidden="true">
          <rect x="4" y="10" width="4" height="20" rx="2" fill="#0d2218" />
          <rect x="12" y="4" width="4" height="32" rx="2" fill="#0d2218" />
          <rect x="20" y="7" width="4" height="26" rx="2" fill="#0d2218" />
          <rect x="28" y="12" width="4" height="16" rx="2" fill="#0d2218" />
        </svg>
        <p className="text-[13.5px]" style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}>
          Selecione uma transcrição para ver os detalhes
        </p>
      </div>
    );
  }

  if (state.status === 'loading' || state.status === 'idle') return <DetailSkeleton />;

  if (state.status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3">
        <p className="text-[13.5px] text-center" style={{ fontFamily: 'var(--font-dm-sans)', color: '#f87171' }}>
          {state.message}
        </p>
        <button
          onClick={handleRetry}
          className="text-[13px] font-medium px-4 py-2 rounded-[8px] border border-[#e5e7eb]
            hover:border-[#4ade80] hover:bg-[#f0fdf4] hover:text-[#0d2218]
            transition-all focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none"
          style={{ fontFamily: 'var(--font-dm-sans)', color: '#374151' }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onClose}
        aria-label="Fechar detalhes"
        className="absolute -top-1 right-0 md:hidden p-1.5 rounded-[8px]
          text-[#6b7280] hover:text-[#0d2218] hover:bg-[#f3f4f2]
          transition-all focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none"
      >
        <CloseIcon />
      </button>
      <ResultCard result={state.result} onReset={handleReset} />
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import type { TranscriptionListItem } from '@/lib/types';
import { deleteTranscription } from '@/lib/api/history';

interface HistoryItemProps {
  item: TranscriptionListItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2 3.5H12M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M11 3.5L10.3 11a.75.75 0 01-.75.7H4.45A.75.75 0 013.7 11L3 3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatRelativeDate(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return 'agora mesmo';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `há ${mins} minuto${mins > 1 ? 's' : ''}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'ontem';
  if (days < 7) return `há ${days} dias`;
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null;
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  return `${Math.round(seconds)}s`;
}

export function HistoryItem({ item, isSelected, onSelect, onDelete }: HistoryItemProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!confirming) {
        setConfirming(true);
        // Auto-cancel confirmation after 3 seconds
        setTimeout(() => setConfirming(false), 3000);
        return;
      }
      setDeleting(true);
      deleteTranscription(item.id)
        .then(() => onDelete(item.id))
        .catch(() => {
          setDeleting(false);
          setConfirming(false);
        });
    },
    [confirming, item.id, onDelete],
  );

  const handleCancelDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirming(false);
  }, []);

  const duration = formatDuration(item.durationSeconds);
  const relDate = formatRelativeDate(item.createdAt);

  return (
    <div
      role="row"
      aria-selected={isSelected}
      className="w-full text-left group relative flex items-start gap-3 px-4 py-3.5 rounded-[14px]
        transition-all duration-150 cursor-pointer"
      style={{
        backgroundColor: isSelected ? 'rgba(74,222,128,0.07)' : 'white',
        border: isSelected ? '1px solid rgba(74,222,128,0.25)' : '1px solid #e5e7eb',
      }}
      onClick={() => onSelect(item.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(item.id); } }}
      tabIndex={0}
      aria-label={`Abrir transcrição ${item.filename}`}
    >
      {/* Waveform indicator */}
      <div
        className="mt-0.5 shrink-0 w-8 h-8 rounded-[8px] flex items-center justify-center"
        style={{
          backgroundColor: isSelected ? 'rgba(74,222,128,0.12)' : '#f3f4f2',
        }}
      >
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
          <rect x="0" y="3" width="2" height="6" rx="1" fill={isSelected ? '#16a34a' : '#9ca3af'} />
          <rect x="3.5" y="1" width="2" height="10" rx="1" fill={isSelected ? '#16a34a' : '#9ca3af'} />
          <rect x="7" y="0" width="2" height="12" rx="1" fill={isSelected ? '#4ade80' : '#6b7280'} />
          <rect x="10.5" y="2" width="2" height="8" rx="1" fill={isSelected ? '#16a34a' : '#9ca3af'} />
          <rect x="14" y="4" width="2" height="4" rx="1" fill={isSelected ? '#16a34a' : '#9ca3af'} />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[13.5px] font-medium truncate leading-snug"
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            color: isSelected ? '#0d2218' : '#374151',
          }}
        >
          {item.filename}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {duration && (
            <span
              className="text-[11.5px]"
              style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
            >
              {duration}
            </span>
          )}
          <span
            className="text-[11.5px]"
            style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
          >
            {item.wordCount} palavras
          </span>
          <span
            className="text-[11.5px]"
            style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
          >
            {relDate}
          </span>
        </div>
      </div>

      {/* Delete / confirm */}
      <div
        className="shrink-0 flex items-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {confirming ? (
          <>
            <button
              onClick={handleDeleteClick}
              disabled={deleting}
              aria-label="Confirmar exclusão"
              className="px-2.5 py-1 rounded-[6px] text-[11.5px] font-semibold
                transition-all focus-visible:ring-2 focus-visible:ring-[#f87171] focus-visible:outline-none
                disabled:opacity-50"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                backgroundColor: deleting ? '#fef2f2' : '#fef2f2',
                color: '#ef4444',
                border: '1px solid #fecaca',
              }}
            >
              {deleting ? '…' : 'Excluir'}
            </button>
            <button
              onClick={handleCancelDelete}
              aria-label="Cancelar exclusão"
              className="px-2 py-1 rounded-[6px] text-[11.5px] font-medium
                transition-all focus-visible:ring-2 focus-visible:ring-[#e5e7eb] focus-visible:outline-none"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                backgroundColor: '#f3f4f2',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
              }}
            >
              Não
            </button>
          </>
        ) : (
          <button
            onClick={handleDeleteClick}
            aria-label={`Excluir ${item.filename}`}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-[6px]
              transition-all duration-150
              focus-visible:ring-2 focus-visible:ring-[#f87171] focus-visible:outline-none
              focus-visible:opacity-100 hover:text-[#ef4444]"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              color: '#9ca3af',
            }}
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  );
}

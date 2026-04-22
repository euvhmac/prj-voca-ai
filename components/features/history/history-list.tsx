'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import type { TranscriptionListItem } from '@/lib/types';
import { fetchHistory } from '@/lib/api/history';
import { HistoryItem } from '@/components/features/history/history-item';
import { HistoryDetail } from '@/components/features/history/history-detail';

interface HistoryListProps {
  initialItems: TranscriptionListItem[];
  initialHasMore: boolean;
  initialTotal: number;
}

export function HistoryList({ initialItems, initialHasMore, initialTotal }: HistoryListProps) {
  const [items, setItems] = useState<TranscriptionListItem[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setMobileDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedId(null);
    setMobileDetailOpen(false);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setMobileDetailOpen(false);
    }
  }, [selectedId]);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchHistory({ page: nextPage, limit: 20 });
      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch {
      // silently ignore — user can retry
    } finally {
      setLoadingMore(false);
    }
  }, [page]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div
          className="w-14 h-14 rounded-[18px] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.15)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              stroke="#4ade80"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="text-center flex flex-col gap-1">
          <p
            className="text-[15px] font-semibold"
            style={{ fontFamily: 'var(--font-display)', color: '#0d2218' }}
          >
            Nenhuma transcrição ainda
          </p>
          <p
            className="text-[13.5px]"
            style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
          >
            Suba seu primeiro áudio para começar.
          </p>
        </div>
        <Link
          href="/"
          className="mt-1 flex items-center gap-2 px-5 py-2.5 rounded-[9px] text-[13.5px] font-semibold
            bg-[#0d2218] text-[#f0fdf4]
            hover:bg-[#163528] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(13,34,24,0.12)]
            transition-all focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none"
          style={{ fontFamily: 'var(--font-dm-sans)' }}
        >
          Processar áudio
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Mobile detail overlay */}
      {mobileDetailOpen && selectedId && (
        <div
          className="fixed inset-0 z-50 bg-[#f8f9f7] overflow-y-auto px-4 py-6 md:hidden"
          style={{ paddingTop: '24px' }}
        >
          <button
            onClick={handleCloseDetail}
            className="mb-4 flex items-center gap-1.5 text-[13px] font-medium text-[#6b7280]
              hover:text-[#0d2218] transition-colors focus-visible:ring-2 focus-visible:ring-[#4ade80]
              focus-visible:outline-none rounded"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voltar ao histórico
          </button>
          <HistoryDetail selectedId={selectedId} onClose={handleCloseDetail} />
        </div>
      )}

      {/* Desktop two-column layout */}
      <div className="flex gap-6 items-start">
        {/* List column */}
        <div className="flex flex-col gap-2 w-full md:w-[360px] lg:w-[400px] shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p
              className="text-[12px] font-medium uppercase tracking-[2px]"
              style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
            >
              {initialTotal} transcrição{initialTotal !== 1 ? 'ões' : ''}
            </p>
          </div>

          <div className="flex flex-col gap-2" role="list" aria-label="Histórico de transcrições">
            {items.map((item) => (
              <div key={item.id} role="listitem">
                <HistoryItem
                  item={item}
                  isSelected={selectedId === item.id}
                  onSelect={handleSelect}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="mt-2 w-full py-2.5 rounded-[10px] text-[13px] font-medium
                border border-[#e5e7eb] bg-white text-[#374151]
                hover:border-[#4ade80] hover:bg-[#f0fdf4] hover:text-[#0d2218]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              {loadingMore ? 'Carregando…' : 'Carregar mais'}
            </button>
          )}
        </div>

        {/* Detail column (desktop only) */}
        <div className="hidden md:block flex-1 min-w-0">
          <HistoryDetail selectedId={selectedId} onClose={handleCloseDetail} />
        </div>
      </div>
    </>
  );
}

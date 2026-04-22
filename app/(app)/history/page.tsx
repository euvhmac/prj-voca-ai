import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { transcriptionRepository } from '@/lib/db/transcriptions';
import { HistoryList } from '@/components/features/history/history-list';
import type { TranscriptionListItem } from '@/lib/types';

export const metadata = {
  title: 'Histórico — Voca',
};

const ITEMS_PER_PAGE = 20;

export default async function HistoryPage() {
  const session = await auth();
  if (!session) redirect('/login');

  // Fetch first page directly from DB — avoids HTTP round-trip in Server Component
  let initialItems: TranscriptionListItem[] = [];
  let initialHasMore = false;
  let initialTotal = 0;

  try {
    const { items, total } = await transcriptionRepository.findByUser(
      session.user.id,
      1,
      ITEMS_PER_PAGE,
    );
    initialTotal = total;
    initialHasMore = total > ITEMS_PER_PAGE;
    initialItems = items.map((t) => ({
      id: t.id,
      filename: t.filename,
      durationSeconds: t.durationSeconds,
      wordCount: t.wordCount ?? 0,
      createdAt: t.createdAt.toISOString(),
    }));
  } catch {
    // Render with empty state — graceful degradation
  }

  return (
    <div
      className="px-6 py-10 max-w-[960px]"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Page header */}
      <div className="mb-8 animate-fade-up">
        <p
          className="text-[11px] font-medium uppercase tracking-[2.5px] mb-2"
          style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
        >
          Histórico
        </p>
        <h1
          className="text-[24px] font-extrabold leading-tight tracking-[-0.5px]"
          style={{ fontFamily: 'var(--font-display)', color: '#0d2218' }}
        >
          Suas transcrições
        </h1>
        <p
          className="mt-1 text-[13.5px]"
          style={{ fontFamily: 'var(--font-dm-sans)', color: '#6b7280' }}
        >
          Acesse, revise e exporte todos os seus prompts gerados anteriormente.
        </p>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: '0.08s' }}>
        <HistoryList
          initialItems={initialItems}
          initialHasMore={initialHasMore}
          initialTotal={initialTotal}
        />
      </div>
    </div>
  );
}

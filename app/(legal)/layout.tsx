import type { Metadata } from 'next';
import Link from 'next/link';
import { WaveformIcon } from '@/components/ui/icons/waveform-icon';
import { Footer } from '@/components/ui/footer/footer';

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

interface LegalLayoutProps {
  children: React.ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#f8f9f7' }}
    >
      {/* Header simples — apenas logo, sem sidebar */}
      <header
        className="w-full"
        style={{ borderBottom: '1px solid #e5e7eb' }}
      >
        <div className="max-w-[820px] mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80] rounded-md"
            aria-label="Voltar para a home do Voca"
          >
            <WaveformIcon size={22} color="#0d2218" />
            <span
              className="text-[18px] font-extrabold tracking-[-0.4px]"
              style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
            >
              Voca
            </span>
          </Link>
          <nav
            className="flex items-center gap-5 text-[13px]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
            aria-label="Navegação institucional"
          >
            <Link href="/faq" className="text-[#4b5563] hover:text-[#0d2218] transition-colors">FAQ</Link>
            <Link href="/privacy" className="text-[#4b5563] hover:text-[#0d2218] transition-colors">Privacidade</Link>
            <Link href="/terms" className="text-[#4b5563] hover:text-[#0d2218] transition-colors">Termos</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[820px] mx-auto px-6 py-12 md:py-16">
        <article className="prose-voca">{children}</article>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WaveformIcon } from '@/components/ui/icons/waveform-icon';

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 9.5L10 3L17 9.5V17H13V13H7V17H3V9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 7V10.5L12.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M13 15l4-5-4-5M17 10H7M7 4H4a1 1 0 00-1 1v10a1 1 0 001 1h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  isActive: boolean;
  showDot?: boolean;
  children: React.ReactNode;
}

function NavItem({ href, label, isActive, showDot, children }: NavItemProps) {
  return (
    <div className="relative group">
      <Link
        href={href}
        aria-label={label}
        className={`relative flex items-center justify-center w-11 h-11 rounded-[12px] transition-all duration-150
          focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none
          ${isActive
            ? 'bg-[rgba(74,222,128,0.12)] text-[#4ade80]'
            : 'text-[rgba(240,253,244,0.45)] hover:bg-[rgba(74,222,128,0.08)] hover:text-[rgba(240,253,244,0.85)]'
          }`}
      >
        {children}
        {showDot && (
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#4ade80]"
            aria-hidden="true"
          />
        )}
      </Link>
      {/* Tooltip */}
      <div
        className="pointer-events-none absolute left-[54px] top-1/2 -translate-y-1/2
          px-2.5 py-1.5 rounded-[7px] text-[12px] font-medium whitespace-nowrap
          bg-[#0d2218] text-[#f0fdf4] border border-[rgba(74,222,128,0.15)]
          opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50
          shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
        role="tooltip"
      >
        {label}
      </div>
    </div>
  );
}

function LegalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2L17 5V10C17 14 13.5 17.5 10 18.5C6.5 17.5 3 14 3 10V5L10 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const initials = session?.user?.name
    ? session.user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <aside
      className="fixed left-0 top-0 flex flex-col items-center py-5 gap-2 z-50"
      style={{
        backgroundColor: '#0d2218',
        borderRight: '1px solid rgba(74,222,128,0.08)',
        width: '64px',
        height: '100vh',
      }}
      aria-label="Navegação principal"
    >
      {/* Logo */}
      <div className="mb-4 flex items-center justify-center w-11 h-11">
        <WaveformIcon size={26} color="#4ade80" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        <NavItem href="/" label="Início" isActive={pathname === '/'}>
          <HomeIcon />
        </NavItem>
        <NavItem href="/history" label="Histórico" isActive={pathname === '/history'} showDot>
          <HistoryIcon />
        </NavItem>
      </nav>

      {/* Footer — legal + avatar + sign out */}
      <div className="flex flex-col items-center gap-2 mt-auto">
        {/* Legal & FAQ */}
        <NavItem href="/faq" label="Legal & FAQ" isActive={pathname === '/faq' || pathname === '/privacy' || pathname === '/terms'}>
          <LegalIcon />
        </NavItem>

        {/* Sign out */}
        <div className="relative group">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            aria-label="Sair"
            className="flex items-center justify-center w-11 h-11 rounded-[12px] transition-all duration-150
              text-[rgba(240,253,244,0.35)] hover:bg-[rgba(248,113,113,0.08)] hover:text-[#f87171]
              focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none"
          >
            <SignOutIcon />
          </button>
          <div
            className="pointer-events-none absolute left-[54px] top-1/2 -translate-y-1/2
              px-2.5 py-1.5 rounded-[7px] text-[12px] font-medium whitespace-nowrap
              bg-[#0d2218] text-[#f0fdf4] border border-[rgba(74,222,128,0.15)]
              opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50
              shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
            role="tooltip"
          >
            Sair
          </div>
        </div>

        {/* Avatar */}
        <div
          className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[11px] font-bold
            border border-[rgba(74,222,128,0.35)] text-[#4ade80]"
          style={{
            backgroundColor: 'rgba(74,222,128,0.08)',
            fontFamily: 'var(--font-syne)',
          }}
          title={session?.user?.name ?? 'Usuário'}
          aria-label={`Avatar de ${session?.user?.name ?? 'usuário'}`}
        >
          {initials}
        </div>
      </div>
    </aside>
  );
}

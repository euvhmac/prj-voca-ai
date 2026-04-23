import Link from 'next/link';
import { WaveformIcon } from '@/components/ui/icons/waveform-icon';

const GITHUB_URL = 'https://github.com/euvhmac/prj-voca-ai';
const CONTACT_EMAIL = 'victor@vhmac.com';

interface FooterProps {
  /** Quando `true`, renderiza versão compacta de uma linha — ideal para colunas estreitas (ex.: painel direito do login). */
  compact?: boolean;
}

/**
 * Footer institucional — visível em todas as páginas autenticadas, públicas e legais.
 * Server Component: sem JS no cliente.
 */
export function Footer({ compact = false }: FooterProps = {}) {
  const year = new Date().getFullYear();

  if (compact) {
    return (
      <footer
        className="w-full"
        style={{
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f8f9f7',
          fontFamily: 'var(--font-dm-sans)',
        }}
      >
        <div className="px-6 py-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-[12px] text-[#6b7280]">
          <span>© {year} Voca · Open-source MIT</span>
          <nav className="flex items-center gap-4 flex-wrap">
            <Link href="/privacy" className="hover:text-[#0d2218] transition-colors">
              Privacidade
            </Link>
            <Link href="/terms" className="hover:text-[#0d2218] transition-colors">
              Termos
            </Link>
            <Link href="/faq" className="hover:text-[#0d2218] transition-colors">
              FAQ
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0d2218] transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="w-full"
      style={{
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f8f9f7',
        fontFamily: 'var(--font-dm-sans)',
      }}
    >
      <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* Brand */}
        <div className="flex flex-col gap-3 max-w-[320px]">
          <div className="flex items-center gap-2">
            <WaveformIcon size={20} color="#0d2218" />
            <span
              className="text-[16px] font-extrabold tracking-[-0.3px]"
              style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
            >
              Voca
            </span>
          </div>
          <p className="text-[12.5px] leading-[1.55] text-[#6b7280]">
            Projeto pessoal open-source que transforma áudios em prompts estruturados
            para qualquer LLM. Feito com cuidado e responsabilidade.
          </p>
        </div>

        {/* Links — Produto */}
        <FooterColumn title="Produto">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/faq">FAQ</FooterLink>
        </FooterColumn>

        {/* Links — Legal */}
        <FooterColumn title="Legal">
          <FooterLink href="/privacy">Privacidade</FooterLink>
          <FooterLink href="/terms">Termos de uso</FooterLink>
        </FooterColumn>

        {/* Links — Contato */}
        <FooterColumn title="Contato">
          <FooterLink href={`mailto:${CONTACT_EMAIL}`} external>
            {CONTACT_EMAIL}
          </FooterLink>
          <FooterLink href={GITHUB_URL} external>
            Repositório no GitHub
          </FooterLink>
        </FooterColumn>
      </div>

      <div
        className="border-t"
        style={{ borderColor: '#e5e7eb' }}
      >
        <div className="max-w-[1100px] mx-auto px-6 py-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-[12px] text-[#9ca3af]">
          <span>© {year} Voca. Open-source sob licença MIT.</span>
          <span>
            Áudio processado pela{' '}
            <a
              href="https://openai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#374151] transition-colors"
            >
              OpenAI
            </a>
            . Sem armazenamento permanente do arquivo de áudio.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3
        className="text-[11px] font-semibold tracking-[1.5px] uppercase"
        style={{ color: '#9ca3af' }}
      >
        {title}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {children}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <li>
        <a
          href={href}
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          className="text-[13px] text-[#4b5563] hover:text-[#0d2218] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80] rounded-sm"
        >
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link
        href={href}
        className="text-[13px] text-[#4b5563] hover:text-[#0d2218] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80] rounded-sm"
      >
        {children}
      </Link>
    </li>
  );
}

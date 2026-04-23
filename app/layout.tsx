import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider, ToastContainer } from '@/components/ui/toast';
import { CookieBanner } from '@/components/ui/cookie-banner/cookie-banner';
import './globals.css';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['700', '800'],
  preload: true,
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ?? 'https://voca.vhmac.com'
  ),
  title: 'Voca — Turn voice into context',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  description:
    'Transforme mensagens de voz em prompts estruturados, prontos para colar em qualquer LLM. Transcrição com Whisper + otimização GPT.',
  keywords: ['voca', 'transcrição', 'áudio', 'prompt', 'LLM', 'OpenAI', 'WhatsApp'],
  authors: [{ name: 'Voca' }],
  openGraph: {
    title: 'Voca — Turn voice into context',
    description:
      'Transforme mensagens de voz em prompts estruturados, prontos para colar em qualquer LLM.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Voca',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Voca — Turn voice into context' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voca — Turn voice into context',
    description:
      'Transforme mensagens de voz em prompts estruturados, prontos para colar em qualquer LLM.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SessionProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
            <CookieBanner />
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

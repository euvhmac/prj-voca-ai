import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/ui/sidebar/sidebar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Não há mais redirect aqui — a home (`/`) é pública e usa o intent-first
  // flow: o login só é exigido no momento em que o usuário tenta processar
  // um áudio. Páginas autenticadas (ex: /history) seguem protegidas pelo
  // middleware.
  const session = await auth();
  const isAuthenticated = !!session;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f8f9f7' }}>
      {isAuthenticated && <Sidebar />}
      <main
        className={`flex-1 min-h-screen ${isAuthenticated ? 'md:ml-16' : ''}`}
      >
        {children}
      </main>
    </div>
  );
}

import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/ui/sidebar/sidebar';
import { Footer } from '@/components/ui/footer/footer';

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
    <div className="flex" style={{ backgroundColor: '#f8f9f7' }}>
      {isAuthenticated && <Sidebar />}
      <div className={`flex-1 flex flex-col ${isAuthenticated ? 'md:ml-16' : ''}`}>
        <main className="min-h-screen">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

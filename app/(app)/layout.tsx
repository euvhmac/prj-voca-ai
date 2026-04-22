import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/ui/sidebar/sidebar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f8f9f7' }}>
      <Sidebar />
      {/* Main area — offset by sidebar width on md+ */}
      <main className="flex-1 md:ml-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}

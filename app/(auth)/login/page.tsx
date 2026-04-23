import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AuthCard } from '@/components/features/auth/auth-card';

interface LoginPageProps {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const { error, callbackUrl } = await searchParams;

  // callbackUrl precisa ser um caminho relativo seguro — nunca uma URL absoluta
  // controlada pelo usuário (mitigação de open redirect).
  const safeCallbackUrl =
    callbackUrl && callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')
      ? callbackUrl
      : '/';

  if (session) {
    redirect(safeCallbackUrl);
  }

  return <AuthCard error={error} callbackUrl={safeCallbackUrl} />;
}

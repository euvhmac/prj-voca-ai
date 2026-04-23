import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AuthCard } from '@/components/features/auth/auth-card';

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  const { error } = await searchParams;

  return <AuthCard error={error} />;
}

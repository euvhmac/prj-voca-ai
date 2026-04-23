import { auth } from '@/lib/auth';
import { HomeClient } from '@/components/features/upload';

/**
 * Home page (intent-first):
 * - Public route — visitor can see the upload zone without authenticating.
 * - The upload-zone itself intercepts the file submission and redirects
 *   anonymous users to /login?callbackUrl=/ before any audio is processed.
 */
export default async function HomePage() {
  const session = await auth();
  return <HomeClient isAuthenticated={!!session} />;
}
import NextAuth from 'next-auth';
import type { DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/client';
import { authConfig } from './config';

// Extende o tipo Session para expor o user.id — necessário porque o tipo padrão
// do Auth.js não inclui `id` em session.user.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  // JWT strategy: sessões lidas do cookie sem query ao DB —
  // compatível com edge middleware e reduz latência.
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      // No primeiro sign-in, persiste o ID do DB no JWT
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expõe o user.id do JWT para o objeto de sessão
      if (typeof token.id === 'string') {
        session.user.id = token.id;
      }
      return session;
    },
    authorized: authConfig.callbacks.authorized,
  },
});

import NextAuth from 'next-auth';
import type { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/client';
import { rateLimit } from '@/lib/security/rate-limit';
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
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== 'string' || typeof password !== 'string') {
          return null;
        }

        // Rate limit por email: 5 tentativas / 15min
        // Defesa contra brute-force (A07: Identification & Auth Failures).
        // Usar email como chave evita que um atacante distribuído via IPs
        // diferentes contorne o limite — o custo é falha de auth para o
        // usuário legítimo se atacado, mas isso é preferível a permitir
        // brute-force.
        const limit = rateLimit({
          key: `login:${email.toLowerCase()}`,
          max: 5,
          windowMs: 15 * 60_000,
        });
        if (!limit.allowed) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
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

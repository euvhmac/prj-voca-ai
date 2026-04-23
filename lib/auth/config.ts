import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// Configuração edge-compatible — sem imports de Prisma/Node.js.
// Usada pelo middleware.ts para verificar sessão no Edge runtime.
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith('/login');

      // Já autenticado — redireciona para fora da página de auth
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // Não autenticado — bloqueia rotas protegidas (middleware redireciona para /login)
      if (!isLoggedIn && !isAuthPage) {
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

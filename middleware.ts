import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/config';

// Usa config edge-compatible (sem Prisma) para verificar sessão no middleware
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    /*
     * Protege todas as rotas exceto:
     * - _next/static  (arquivos estáticos)
     * - _next/image   (otimização de imagens)
     * - favicon.ico
     * - api/auth      (rotas internas do Auth.js)
     * - arquivos públicos (.svg, .png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

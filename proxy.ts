import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/config';

// Usa config edge-compatible (sem Prisma) para verificar sessão no proxy
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    /*
     * Protege todas as rotas exceto:
     * - / (home pública — landing intent-first)
     * - _next/static  (arquivos estáticos)
     * - _next/image   (otimização de imagens)
     * - favicon.ico
     * - api/auth      (rotas internas do Auth.js)
     * - login         (página de autenticação)
     * - privacy/terms/faq (páginas legais públicas)
     * - arquivos públicos (.svg, .png, .jpg, etc.)
     *
     * A home (`/`) é pública: o visitante pode ver a landing.
     * O upload-zone redireciona para /login somente quando o usuário
     * tenta enviar um áudio sem sessão ativa.
     */
    '/((?!$|_next/static|_next/image|favicon\\.ico|api/auth|login|privacy|terms|faq|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

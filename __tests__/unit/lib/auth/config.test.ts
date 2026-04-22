/**
 * Testes Sprint 01 — Auth Config
 *
 * Testa a lógica do callback `authorized` sem depender de sessão real,
 * banco de dados ou OAuth. Usa apenas objetos JS puros.
 */
import { describe, it, expect } from 'vitest';
import { authConfig } from '@/lib/auth/config';

// Helper para construir um NextUrl falso
function makeUrl(pathname: string): URL {
  return new URL(`http://localhost:3000${pathname}`);
}

// Helper para invocar o callback authorized diretamente
type AuthorizedParams = Parameters<
  NonNullable<typeof authConfig.callbacks>['authorized']
>[0];

function callAuthorized(isLoggedIn: boolean, pathname: string): boolean | Response {
  const auth = isLoggedIn ? { user: { id: 'user-1', email: 'a@b.com' } } : null;
  const params = {
    auth,
    request: { nextUrl: makeUrl(pathname) },
  } as unknown as AuthorizedParams;

  return authConfig.callbacks!.authorized!(params);
}

describe('authConfig.callbacks.authorized', () => {
  describe('usuário autenticado', () => {
    it('redireciona para / quando tenta acessar /login', () => {
      const result = callAuthorized(true, '/login');

      expect(result).toBeInstanceOf(Response);
      const redirect = result as Response;
      expect(redirect.status).toBe(302);
      expect(redirect.headers.get('location')).toBe('http://localhost:3000/');
    });

    it('permite acesso a rota protegida /', () => {
      const result = callAuthorized(true, '/');
      expect(result).toBe(true);
    });

    it('permite acesso a sub-rota protegida /history', () => {
      const result = callAuthorized(true, '/history');
      expect(result).toBe(true);
    });
  });

  describe('usuário não autenticado', () => {
    it('bloqueia acesso a / retornando false', () => {
      const result = callAuthorized(false, '/');
      expect(result).toBe(false);
    });

    it('bloqueia acesso a /history', () => {
      const result = callAuthorized(false, '/history');
      expect(result).toBe(false);
    });

    it('permite acesso à página de login /login', () => {
      const result = callAuthorized(false, '/login');
      expect(result).toBe(true);
    });

    it('permite acesso a sub-rotas de /login', () => {
      const result = callAuthorized(false, '/login/callback');
      expect(result).toBe(true);
    });
  });
});

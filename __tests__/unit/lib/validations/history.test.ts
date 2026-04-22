/**
 * Testes Sprint 04 — listQuerySchema
 *
 * Valida os schemas Zod para query params da History API:
 * - page e limit defaults corretos
 * - limites min/max
 * - rejeição de valores inválidos
 */
import { describe, it, expect } from 'vitest';
import { listQuerySchema } from '@/lib/validations/history';

describe('listQuerySchema', () => {
  describe('valores padrão', () => {
    it('usa page=1 quando ausente', () => {
      const result = listQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.page).toBe(1);
    });

    it('usa limit=20 quando ausente', () => {
      const result = listQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.limit).toBe(20);
    });
  });

  describe('page válido', () => {
    it('aceita page="1"', () => {
      const result = listQuerySchema.safeParse({ page: '1' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.page).toBe(1);
    });

    it('aceita page="100"', () => {
      const result = listQuerySchema.safeParse({ page: '100' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.page).toBe(100);
    });
  });

  describe('page inválido', () => {
    it('rejeita page="0"', () => {
      const result = listQuerySchema.safeParse({ page: '0' });
      expect(result.success).toBe(false);
    });

    it('rejeita page="-1"', () => {
      const result = listQuerySchema.safeParse({ page: '-1' });
      expect(result.success).toBe(false);
    });

    it('rejeita page="abc"', () => {
      const result = listQuerySchema.safeParse({ page: 'abc' });
      expect(result.success).toBe(false);
    });
  });

  describe('limit válido', () => {
    it('aceita limit="1"', () => {
      const result = listQuerySchema.safeParse({ limit: '1' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.limit).toBe(1);
    });

    it('aceita limit="50" (máximo)', () => {
      const result = listQuerySchema.safeParse({ limit: '50' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.limit).toBe(50);
    });
  });

  describe('limit inválido', () => {
    it('rejeita limit="51" (excede máximo)', () => {
      const result = listQuerySchema.safeParse({ limit: '51' });
      expect(result.success).toBe(false);
    });

    it('rejeita limit="0"', () => {
      const result = listQuerySchema.safeParse({ limit: '0' });
      expect(result.success).toBe(false);
    });

    it('rejeita limit="-5"', () => {
      const result = listQuerySchema.safeParse({ limit: '-5' });
      expect(result.success).toBe(false);
    });
  });

  it('aceita page e limit juntos', () => {
    const result = listQuerySchema.safeParse({ page: '3', limit: '10' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(10);
    }
  });
});

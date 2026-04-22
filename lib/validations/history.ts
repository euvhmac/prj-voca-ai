import { z } from 'zod';

export const listQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(1, 'page deve ser >= 1')),
  limit: z
    .string()
    .optional()
    .default('20')
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(1, 'limit deve ser >= 1').max(50, 'limit não pode exceder 50')),
});

export type ListQueryInput = z.infer<typeof listQuerySchema>;

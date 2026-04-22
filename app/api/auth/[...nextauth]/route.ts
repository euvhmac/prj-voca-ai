import { handlers } from '@/lib/auth';

// Auth.js v5 — delega todas as rotas /api/auth/* ao handler interno
export const { GET, POST } = handlers;

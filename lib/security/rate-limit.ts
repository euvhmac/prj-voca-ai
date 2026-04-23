/**
 * In-memory token-bucket rate limiter.
 *
 * Adequado para deploy single-region em Vercel (cada lambda mantém seu próprio
 * bucket — não há shared state). Para multi-region/horizontal scale, migrar
 * para Upstash Redis ou similar. Este limiter é a primeira linha de defesa
 * contra brute-force e abuso de API.
 *
 * Strategy: sliding window — armazena timestamps das últimas requisições
 * por chave (IP, userId, etc.) e descarta as fora da janela.
 */

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();

// Janela de limpeza: remove buckets sem hits recentes para evitar memory leak.
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 60_000;

function cleanup(now: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  // Limite máximo de retenção: 1h
  const expiresBefore = now - 3_600_000;
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.hits.every((t) => t < expiresBefore)) {
      buckets.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimitOptions {
  /** Identificador único (ex.: IP, userId, "ip:email"). */
  key: string;
  /** Máximo de requisições permitidas dentro da janela. */
  max: number;
  /** Janela em milissegundos. */
  windowMs: number;
}

/**
 * Verifica e registra uma tentativa. Retorna `allowed: false` se a chave
 * excedeu o limite na janela atual.
 *
 * Uso:
 * ```ts
 * const result = rateLimit({ key: `transcribe:${userId}`, max: 10, windowMs: 60_000 });
 * if (!result.allowed) return Response.json({ error: 'Too many requests' }, { status: 429 });
 * ```
 */
export function rateLimit(options: RateLimitOptions): RateLimitResult {
  const { key, max, windowMs } = options;
  const now = Date.now();
  cleanup(now);

  const cutoff = now - windowMs;
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => t > cutoff);

  if (bucket.hits.length >= max) {
    buckets.set(key, bucket);
    const oldest = bucket.hits[0] ?? now;
    return { allowed: false, remaining: 0, resetAt: oldest + windowMs };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);

  return {
    allowed: true,
    remaining: max - bucket.hits.length,
    resetAt: now + windowMs,
  };
}

/**
 * Extrai o IP do cliente do request, respeitando o proxy chain do Vercel.
 * Cai para 'unknown' se nenhum cabeçalho confiável estiver presente —
 * mas nesse caso o caller pode rejeitar ou agrupar todas as requisições
 * sob o mesmo bucket.
 */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

/** Apenas para testes — limpa o estado interno. */
export function __resetRateLimit(): void {
  buckets.clear();
  lastCleanup = 0;
}

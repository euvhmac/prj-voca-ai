import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit, clientIp, __resetRateLimit } from '@/lib/security/rate-limit';

describe('rate-limit', () => {
  beforeEach(() => {
    __resetRateLimit();
  });

  it('allows up to max requests, blocks the next', () => {
    const opts = { key: 'test:user', max: 3, windowMs: 60_000 };
    expect(rateLimit(opts).allowed).toBe(true);
    expect(rateLimit(opts).allowed).toBe(true);
    expect(rateLimit(opts).allowed).toBe(true);
    const blocked = rateLimit(opts);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetAt).toBeGreaterThan(Date.now());
  });

  it('isolates buckets by key', () => {
    const a = { key: 'a', max: 1, windowMs: 60_000 };
    const b = { key: 'b', max: 1, windowMs: 60_000 };
    expect(rateLimit(a).allowed).toBe(true);
    expect(rateLimit(a).allowed).toBe(false);
    expect(rateLimit(b).allowed).toBe(true);
  });

  it('decrements remaining as hits are added', () => {
    const opts = { key: 'rem', max: 5, windowMs: 60_000 };
    expect(rateLimit(opts).remaining).toBe(4);
    expect(rateLimit(opts).remaining).toBe(3);
    expect(rateLimit(opts).remaining).toBe(2);
  });
});

describe('clientIp', () => {
  it('extracts the first IP from x-forwarded-for', () => {
    const req = new Request('http://x', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    });
    expect(clientIp(req)).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip', () => {
    const req = new Request('http://x', {
      headers: { 'x-real-ip': '9.9.9.9' },
    });
    expect(clientIp(req)).toBe('9.9.9.9');
  });

  it('returns "unknown" when no header is present', () => {
    const req = new Request('http://x');
    expect(clientIp(req)).toBe('unknown');
  });
});

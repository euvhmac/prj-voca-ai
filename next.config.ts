import type { NextConfig } from "next";

// Cabeçalhos de segurança aplicados a todas as respostas.
// Cobre A05 (Security Misconfiguration) do OWASP Top 10.
const SECURITY_HEADERS = [
  // Bloqueia clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Impede browsers de "adivinhar" o MIME type (XSS via upload de arquivo)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Não vaza URL completa em referer cross-origin
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Força HTTPS no browser por 2 anos (apenas em produção)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Limita acesso a APIs sensíveis do navegador
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  // Bloqueia carregamento cross-origin sem opt-in explícito
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  // CSP mínima e segura: sem scripts inline, sem objetos, frame-ancestors none
  // 'unsafe-inline' em style é necessário para Tailwind v4 + Next.js styled-jsx
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.openai.com https://accounts.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  // Aumenta o limite de body para route handlers e Server Actions.
  // Necessário para upload de áudios (default ~4 MB, nossa validação permite 25 MB).
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;

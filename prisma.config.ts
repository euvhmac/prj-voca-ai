import "dotenv/config";
import { defineConfig } from "prisma/config";

// Configuração do Prisma CLI v7 — geração de migrações e acesso ao DB.
// DATABASE_URL_UNPOOLED = conexão direta ao Neon (sem PgBouncer) — necessário para DDL.
// DATABASE_URL = conexão pooled — usada pelo app em runtime (lib/db/client.ts).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Usa a URL direta (sem pooling) para migrações — PgBouncer não suporta DDL.
    // Usa process.env diretamente para não falhar em `prisma generate` sem a variável.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
});

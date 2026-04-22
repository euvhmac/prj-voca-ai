import "dotenv/config";
import { defineConfig } from "prisma/config";

// Configuração do Prisma CLI v7 — geração de migrações e acesso ao DB.
// DATABASE_URL deve ser a connection string pooled do Neon.
// Para rodar migrações localmente: certifique-se de ter DATABASE_URL em .env.local
// ou exporte a variável antes de rodar `npx prisma migrate dev`.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Usa process.env diretamente para não falhar em `prisma generate` sem DATABASE_URL
    url: process.env.DATABASE_URL ?? "",
  },
});

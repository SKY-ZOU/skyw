import path from 'path';
import { PrismaClient } from '../app/generated/prisma/client';

// In production, use a singleton to avoid multiple connections.
// In dev, always create a fresh client to avoid stale schema issues
// when the Turbopack module loader evaluates this module before or after migrations.
function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    // Production (Netlify): remote Turso — must use web adapter (no native bindings)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require('@prisma/adapter-libsql/web');
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken });
    return new PrismaClient({ adapter });
  }

  // Local dev: use absolute path to avoid relative-path resolution issues in Next.js
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require('@prisma/adapter-libsql');
  const dbUrl = 'file:' + path.resolve(process.cwd(), 'dev.db');
  const adapter = new PrismaLibSql({ url: dbUrl });
  return new PrismaClient({ adapter });
}

type GlobalWithPrisma = typeof globalThis & { _skyWPrisma?: PrismaClient };
const g = globalThis as GlobalWithPrisma;

export const prisma = g._skyWPrisma ?? (g._skyWPrisma = createPrismaClient());

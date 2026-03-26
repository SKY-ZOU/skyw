import path from 'path';
import { PrismaClient } from '../app/generated/prisma/client';

function makePrisma(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    // Production (Netlify) or local dev with TURSO_DATABASE_URL set:
    // use web adapter (no native bindings in serverless/Turbopack RSC)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require('@prisma/adapter-libsql/web');
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken });
    return new PrismaClient({ adapter });
  }

  // Local dev without Turso — use absolute path to avoid CWD issues in Turbopack
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require('@prisma/adapter-libsql');
  const dbUrl = 'file:' + path.resolve(process.cwd(), 'dev.db');
  const adapter = new PrismaLibSql({ url: dbUrl });
  return new PrismaClient({ adapter });
}

// Singleton for production; fresh per module evaluation in dev
// (avoids Turbopack hot-reload stale client issues)
const _g = globalThis as { _skyWPrisma?: PrismaClient };

export const prisma: PrismaClient =
  process.env.NODE_ENV === 'production'
    ? (_g._skyWPrisma ??= makePrisma())
    : makePrisma();

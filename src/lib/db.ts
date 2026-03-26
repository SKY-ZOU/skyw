import path from 'path';
import { PrismaClient } from '../app/generated/prisma/client';

function makePrisma(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require('@prisma/adapter-libsql/web');
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken });
    return new PrismaClient({ adapter });
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require('@prisma/adapter-libsql');
  const dbUrl = 'file:' + path.resolve(process.cwd(), 'dev.db');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('fs').appendFileSync('/tmp/db-debug.txt', `makePrisma: dbUrl=${dbUrl}, cwd=${process.cwd()}\n`);
  const adapter = new PrismaLibSql({ url: dbUrl });
  return new PrismaClient({ adapter });
}

// Singleton for production (serverless — avoid connection churn)
// Fresh client for dev (avoids Turbopack module-init context issues)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const _fs = require('fs');
_fs.appendFileSync('/tmp/db-debug.txt', 'db.ts module eval\n');
let _prismaInstance: PrismaClient;
try {
  _prismaInstance = makePrisma();
  _fs.appendFileSync('/tmp/db-debug.txt', 'makePrisma() succeeded\n');
} catch (e: any) {
  _fs.appendFileSync('/tmp/db-debug.txt', `makePrisma() THREW: ${e?.message}\n`);
  throw e;
}
export const prisma: PrismaClient = _prismaInstance;

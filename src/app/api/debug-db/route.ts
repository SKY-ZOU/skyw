import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require('fs');
  const gp = (globalThis as any).prisma;
  const p = prisma as any;
  const adapterUrl = p?._adapter?.client?.config?.url ?? p?._adapter?.config?.url ?? 'unknown';
  fs.appendFileSync('/tmp/db-debug.txt', `[debug-db] adapter url=${adapterUrl}, same=${prisma === gp}\n`);
  try {
    const setting = await prisma.setting.findFirst({
      select: { id: true, companyName: true, ogImage: true, geoAllowBots: true }
    });
    return NextResponse.json({ ok: true, cwd: process.cwd(), setting });
  } catch (e: any) {
    return NextResponse.json({ ok: false, cwd: process.cwd(), error: e.message });
  }
}

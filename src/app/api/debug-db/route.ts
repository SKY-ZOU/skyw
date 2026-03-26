import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const setting = await prisma.setting.findFirst({
      select: { id: true, companyName: true, ogImage: true, geoAllowBots: true }
    });
    return NextResponse.json({ ok: true, cwd: process.cwd(), setting });
  } catch (e: any) {
    return NextResponse.json({ ok: false, cwd: process.cwd(), error: e.message });
  }
}

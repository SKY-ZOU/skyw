import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const setting = await prisma.setting.findFirst();
  const metrics = await prisma.metric.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ setting, metrics });
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { setting, metrics } = await request.json();

  if (setting) {
    await prisma.setting.update({
      where: { id: setting.id },
      data: {
        companyName: setting.companyName,
        companyFull: setting.companyFull,
        email: setting.email,
        phone: setting.phone,
      },
    });
  }

  if (metrics) {
    for (const m of metrics) {
      await prisma.metric.update({
        where: { id: m.id },
        data: {
          valueZhCN: m.valueZhCN,
          valueZhTW: m.valueZhTW,
          valueEn: m.valueEn,
          labelZhCN: m.labelZhCN,
          labelZhTW: m.labelZhTW,
          labelEn: m.labelEn,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}

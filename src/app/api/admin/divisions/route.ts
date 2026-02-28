import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const divisions = await prisma.businessDivision.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(divisions);
}

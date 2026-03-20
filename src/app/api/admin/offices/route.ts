import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const offices = await prisma.office.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(offices);
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const data = await request.json();
  const office = await prisma.office.create({ data });
  return NextResponse.json(office, { status: 201 });
}

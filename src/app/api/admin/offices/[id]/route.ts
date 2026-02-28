import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/api-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const data = await request.json();
  const office = await prisma.office.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(office);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  await prisma.office.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}

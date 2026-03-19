import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(submissions);
}

export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id, read } = await request.json();
  const updated = await prisma.contactSubmission.update({
    where: { id },
    data: { read },
  });
  return NextResponse.json(updated);
}

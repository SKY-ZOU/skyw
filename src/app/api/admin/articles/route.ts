import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const articles = await prisma.article.findMany({
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const data = await request.json();
  const article = await prisma.article.create({ data });
  return NextResponse.json(article, { status: 201 });
}

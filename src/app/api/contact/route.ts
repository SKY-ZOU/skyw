import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const { name, email, company, subject, message } = await request.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const submission = await prisma.contactSubmission.create({
    data: { name, email, company: company ?? '', subject: subject ?? '', message },
  });

  return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
}

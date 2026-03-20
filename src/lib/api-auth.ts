import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get('admin-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const valid = await verifyToken(token);
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

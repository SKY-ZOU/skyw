import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { verifyToken } from './lib/auth';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API admin routes — handled by route handlers (api-auth.ts)
  if (pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  // Admin login page — always allow
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Admin pages — check JWT cookie
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const valid = await verifyToken(token);
    if (!valid) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Everything else — i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(zh-CN|zh-TW|en)/:path*', '/admin/:path*', '/api/admin/:path*'],
};

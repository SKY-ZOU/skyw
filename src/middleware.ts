import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { verifyToken } from './lib/auth';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── CMS Admin routes (JWT cookie) ──────────────────────────
  if (pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }
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

  // ── LP Portal routes (NextAuth JWT) ────────────────────────
  if (pathname === '/lp/login') {
    return NextResponse.next();
  }
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  if (pathname.startsWith('/lp') || pathname.startsWith('/lp-admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL('/lp/login', request.url));
    }

    // lp-admin requires admin or fund_manager role
    if (pathname.startsWith('/lp-admin')) {
      const role = token.role as string;
      if (role !== 'admin' && role !== 'fund_manager') {
        return NextResponse.redirect(new URL('/lp', request.url));
      }
    }

    return NextResponse.next();
  }

  // ── Everything else — i18n ──────────────────────────────────
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(zh-CN|zh-TW|en)/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/lp/:path*',
    '/lp-admin/:path*',
    '/api/auth/:path*',
  ],
};

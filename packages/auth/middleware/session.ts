import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
  '/',
  '/about',
  '/services',
  '/products',
  '/portfolio',
  '/blog',
  '/careers',
  '/contact',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth',
  '/api/blogs',
  '/api/contacts',
  '/api/jobs',
];

const authPaths = ['/account', '/admin'];

export function sessionMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  if (isAuthPath) {
    const session = request.cookies.get('appSession');
    if (!session) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/profile', '/admin'];
const AUTH_ONLY_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );
  const isAuthOnly = AUTH_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
// middleware.ts (root project)
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;
  const userStr = request.cookies.get('user')?.value;
  const expiry = request.cookies.get('tokenExpiry')?.value;

  // Không có token → login
  if (!token || !userStr || !expiry) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Token hết hạn → logout
  if (new Date() > new Date(expiry)) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('accessToken');
    response.cookies.delete('user');
    response.cookies.delete('tokenExpiry');
    return response;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Không phải admin → về home
  if (user.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes yang memerlukan autentikasi (prefix matching)
const PROTECTED_ROUTES = [
  '/dashboard',
  '/scanner',
  '/booking',
  '/bank-sampah',
  '/jejak-hijau',
  '/edukasi',
  '/notifikasi',
  '/settings',
  '/leaderboard',
  '/profile',
];

// Routes publik (tidak perlu token)
const PUBLIC_ROUTES = ['/login', '/register', '/', '/api/auth/login', '/api/auth/register'];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Tambahkan security headers ke semua response
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(self), geolocation=(self), microphone=()');

  // 2. Skip auth check untuk route publik dan asset
  if (!isProtectedRoute(pathname)) {
    return response;
  }

  // 3. Cek token dari cookie atau Authorization header
  const tokenFromCookie = request.cookies.get('sirkula_auth_token')?.value;
  const tokenFromHeader = request.headers.get('Authorization')?.replace('Bearer ', '');
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    // Tidak ada token → redirect ke login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Verifikasi token JWT
  try {
    const jwtSecret =
      process.env.JWT_SECRET ||
      (process.env.NODE_ENV === 'production'
        ? null
        : 'sirkula-dev-only-fallback-jwt-secret-do-not-use-in-production');

    if (!jwtSecret) {
      // Production tanpa JWT_SECRET → reject
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const secret = new TextEncoder().encode(jwtSecret);
    await jwtVerify(token, secret);

    // Token valid → lanjutkan request
    return response;
  } catch {
    // Token invalid/expired → redirect ke login, hapus cookie
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('expired', '1');
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.cookies.delete('sirkula_auth_token');
    return redirectResponse;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon, assets, public files
     */
    '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

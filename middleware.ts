import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isSignedIn = Boolean(token);

  if (pathname.startsWith('/orders') && !isSignedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign';
    url.searchParams.set('s', 'signin');
    url.searchParams.set('callbackUrl', '/orders');
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/sign') && isSignedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/orders/:path*', '/sign/:path*'],
};

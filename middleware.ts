import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  let isSignedIn = false;
  const sessionCookie = req.cookies.get('connect.sid');

  if (sessionCookie) {
    try {
      const response = await fetch(`${process.env.API_URL}/api/users/me`, {
        headers: { Cookie: `connect.sid=${sessionCookie.value}` },
        cache: 'no-store',
      });

      if (!response.ok && response.status !== 401) {
        return new NextResponse('Unable to verify your session. Please try again.', {
          status: 503,
        });
      }

      isSignedIn = response.ok;
    } catch {
      return new NextResponse('Unable to verify your session. Please try again.', {
        status: 503,
      });
    }
  }

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

// @/middleware.ts
// https://medium.com/@sazzadur/implementing-google-authentication-in-a-nextjs-14-application-with-authjs-5-mongodb-and-prisma-bbfcb38b3eea

import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';

import { authConfig } from '@/lib/auth.config';

import { API_AUTH_PREFIX, AUTH_ROUTES, PROTECTED_ROUTES } from '@/routes';

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  // manage route protection
  const isAuth = !!req.auth;

  const isAccessingApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);
  const isAccessingAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAccessingProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  console.debug('middleware auth req', {
    pathname: pathname,
    isAuth: isAuth,
    isAccessingApiAuthRoute: isAccessingApiAuthRoute,
    isAccessingAuthRoute: isAccessingAuthRoute,
    isAccessingProtectedRoute: isAccessingProtectedRoute,
    req: JSON.stringify(req),
  });

  if (isAccessingApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAccessingAuthRoute) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  }

  if (!isAuth && isAccessingProtectedRoute) {
    console.log(
      `middleware redirecting to /login cuz not auth'd for: "${pathname}"`
    );
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

// "matcher allows you to filter Middleware to run on specific paths."
// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// This means that middleware will not run on requests that match below.
// tested: server logs only have console.log above on /my-account when user has logged in.
/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
 * '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
 *
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    '/my-account',
    //'/components',
  ],
};
*/

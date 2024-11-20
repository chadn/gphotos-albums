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
  console.log('middleware auth req', {
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

//import { auth } from '@/auth';

// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   console.log(`middleware orig pathname: "${request.nextUrl.pathname}"`);
//   if (request.nextUrl.pathname.startsWith('/m')) {
//     console.log(`middleware rewriting pathname`);
//     return NextResponse.rewrite(new URL('/my_account', request.url))
//   }
//   if (request.nextUrl.pathname == '/') {
//     if (isAuthenticated(request)) {
//       console.log(`middleware isAuthenticated, going to /my_account`);
//       return NextResponse.rewrite(new URL('/my_account', request.url));
//     } else {
//       console.log(`middleware NOT isAuthenticated, going to /login`);
//       return NextResponse.rewrite(new URL('/login', request.url));
//     }
//   } else {
//     return NextResponse;
//   }
// }

console.log('middleware greetings, yo. matcher: /my-account');

// Or like this if you need to do something here.
// export default auth((req) => {
//   console.log(req.auth) //  { session: { user: { ... } } }
// })

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
// chad testing https://authjs.dev/getting-started/session-management/protecting
// export default auth((req) => {
//   console.log(`middleware.ts:req.auth: ${JSON.stringify(req.auth)}`);
//   if (!req.auth && req.nextUrl.pathname !== '/') {
//     console.log('middleware.ts:redirect to /login');
//     const newUrl = new URL('/login', req.nextUrl.origin);
//     return Response.redirect(newUrl);
//   }
// });

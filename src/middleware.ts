// use the following line if not customizing
// export { auth as middleware } from '@/auth';

import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log(`middleware pathname: "${request.nextUrl.pathname}"`);
  //return NextResponse.redirect(new URL('/login', request.url));
}

/*
export function middleware(request: NextRequest) {
  console.log(`middleware pathname: "${request.nextUrl.pathname}"`);
  if (request.nextUrl.pathname.startsWith('/m')) {
    console.log(`middleware rewriting pathname`);
    return NextResponse.rewrite(new URL('/my_account', request.url))
  }
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
*/
console.log('middleware greetings, yo');

// Or like this if you need to do something here.
// export default auth((req) => {
//   console.log(req.auth) //  { session: { user: { ... } } }
// })

// Prevent access to any path listed in 'matcher' below
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    //'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    '/my-account',
    //'/components',
  ],
};
console.log('middleware greetings, bu-bye.');

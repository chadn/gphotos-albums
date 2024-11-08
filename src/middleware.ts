import { NextResponse, NextRequest } from 'next/server'
 
//export { auth as middleware } from "@/auth"

export function middleware(request: NextRequest) {
  console.log(`middleware pathname: "${request.nextUrl.pathname}"`);
  if (request.nextUrl.pathname.startsWith('/m')) {
    return NextResponse.rewrite(new URL('/my_account', request.url))
  }
  /*
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
  */
}

console.log("middleware greetings, yo");

// Or like this if you need to do something here.
// export default auth((req) => {
//   console.log(req.auth) //  { session: { user: { ... } } }
// })

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // don't run middleware on api, / , static, image, or favicon.ico 
    "/((?!api|/|_next/static|_next/image|favicon.ico).*)",

    "/my-account"
  ],
}

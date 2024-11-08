export { auth as middleware } from "@/auth"

console.log("middleware greetings!");

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

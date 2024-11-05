import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// more at https://authjs.dev/getting-started/providers/google
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
  ],
})

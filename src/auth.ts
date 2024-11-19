import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

// more at https://authjs.dev/getting-started/providers/google
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  providers: [
    Google({
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      /*
      // must define types for profile variables that will be used, see types/next-auth.d.ts
      async profile(profile) {
        return { ...profile };
      },
      */
    }),
  ],
  trustHost: true,
});

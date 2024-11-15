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
      async profile(profile) {
        // ! Does this work? cannot access google profile info like given_name
        // ! and user.image is empty 
        return { ...profile };
      },
      */
    }),
  ],
  /*
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
  /*
  */
  trustHost: true,
});

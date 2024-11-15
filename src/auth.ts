import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

// Extending User object to include Google Profile using Typescript's Module Augmentation
// https://authjs.dev/getting-started/typescript#module-augmentation
// https://stackoverflow.com/questions/74425533/property-role-does-not-exist-on-type-user-adapteruser-in-nextauth
// https://github.com/nextauthjs/next-auth/issues/6455

declare module 'next-auth' {
  interface User {
    // Adding additional properties here for Google profile:
    //id?: string | null;
    //email?: string | null;
    //image?: string | null;
    //name?: string | null;
    given_name: string;
    family_name: string;
    picture: string;
    email_verified: boolean;
  }
}

/*
declare module '@auth/core/adapters' {
  interface AdapterUser {
    // Adding additional properties here for Google profile:
    //id?: string | null;
    //email?: string | null;
    //image?: string | null;
    //name?: string | null;
    given_name: string;
    family_name: string;
    picture: string;
    email_verified: boolean;
  }
}
*/
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
      // must define types for profile variables that will be used, see types/next-auth.d.ts
      async profile(profile) {
        return { ...profile };
      },
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

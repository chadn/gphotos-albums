import NextAuth, { type DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      given_name: string;
      family_name: string;
      picture: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user'];
  }
}

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
/* Hide below despite stackoverflow comment to use it, because:
   Type error: Invalid module name in augmentation, module '@auth/core/adapters' cannot be found.
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
  callbacks: {
    session({ session, user }) {
      // `session.user.given_name` is now a valid property, and will be type-checked
      // in places like `useSession().data.user` or `auth().user`
      return {
        ...session,
        user: {
          ...session.user,
          given_name: user.given_name,
          picture: user.picture,
        },
      };
    },
  },
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

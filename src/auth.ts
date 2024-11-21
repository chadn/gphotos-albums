// @/auth.ts

import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth';

import { authConfig } from '@/lib/auth.config';

//import type { AdapterUser } from 'next-auth/core/adapters';

// https://authjs.dev/getting-started/typescript#module-augmentation
declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's given name. */
      given_name: string;
      /** The user's access_token for subsequent calls to Google API */
      access_token: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user'];
  }
}

export const config = {
  ...authConfig,
  debug: !!process.env.AUTH_DEBUG,
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // the following is also logged if AUTH_DEBUG is true
      console.log(
        'auth.ts jwt cb',
        JSON.stringify({
          token: token,
          user: user,
          account: account,
          profile: profile,
        })
      );

      // add what we need to use to token, token info stored in cookies.
      // only assign access_token if not already assigned - this cb gets called lots.
      // https://authjs.dev/guides/extending-the-session
      token.given_name ??= profile?.given_name ? profile.given_name : null;
      token.access_token ??= account?.access_token
        ? account.access_token
        : null;
      console.log('auth.ts jwt returning: token', JSON.stringify(token));
      return token;
    },
    session({ session, token, user }) {
      if (token) {
        // set the token data to session
        //
        // below doesn't work, cannot build, gives this error
        // Property 'access_token' does not exist on type 'AdapterUser & User'.
        //
        //session.user.access_token ??= token?.access_token || null;
        //session.user.given_name ??= token?.given_name || null;
      }
      if (session.user && token.given_name) {
        // TODO: figure out how to fix this
        // @ts-expect-error: Should be assignable
        session.user.given_name = token.given_name;
      }
      if (session.user && token.access_token) {
        // TODO: figure out how to fix this
        // @ts-expect-error: Should be assignable
        session.user.access_token = token.access_token;
      }
      console.log(
        'auth.ts session',
        JSON.stringify({
          token: token,
          user: user,
          session: session,
        })
      );
      // `session.user.given_name` is now a valid property, and will be type-checked
      // in places like `useSession().data.user` or `auth().user`
      return {
        ...session,
        user: {
          ...session.user,
          //given_name: user.given_name,
        },
      };
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);

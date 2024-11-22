// @/lib/auth.config.ts

import { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// more at https://authjs.dev/getting-started/providers/google
// object defined by this in the following file: export interface AuthConfig
// https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/index.ts
export const authConfig: NextAuthConfig = {
  debug: !!process.env.AUTH_DEBUG,
  trustHost: true,
  providers: [
    Google({
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope:
            'openid profile email https://www.googleapis.com/auth/photoslibrary.readonly',
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
  callbacks: {
    async jwt({ token, account, profile }) {
      // add what we need to use to token, token info stored in cookies.
      // https://authjs.dev/guides/extending-the-session
      token.given_name ??= profile?.given_name ? profile.given_name : null;
      if (token && account?.access_token) {
        token.access_token ??= account.access_token;
      }
      console.debug('auth.ts jwt returning: token', JSON.stringify(token));
      return token;
    },
    session({ session, token }) {
      if (session.user && token.given_name) {
        // TODO: figure out how to fix: Type error: Type '{}' is not assignable to type 'string'.
        // TODO: resolve after next-auth 5 is out of beta
        // @ts-expect-error: Should be assignable
        session.user.given_name = token.given_name;
      }
      if (session.user && token.access_token) {
        // TODO: figure out how to fix: Type error: Type '{}' is not assignable to type 'string'.
        // TODO: resolve after next-auth 5 is out of beta
        // similar fixed: https://github.com/nextauthjs/next-auth/issues/9253#issuecomment-2314104438
        // @ts-expect-error: Should be assignable
        session.user.access_token = token.access_token;
      }
      console.debug(
        'auth.ts session',
        JSON.stringify({
          token: token,
          session: session,
        })
      );
      return session;
    },
  },
};

// import { type DefaultSession } from 'next-auth';
//import type { AdapterUser } from 'next-auth/core/adapters';
// Below module augmentation did not work for me, still had typescript errors with access_token
// TODO: resolve after next-auth 5 is out of beta
// similar fixed: https://github.com/nextauthjs/next-auth/issues/9253#issuecomment-2314104438
//
// https://authjs.dev/getting-started/typescript#module-augmentation
// declare module 'next-auth' {
//   /**
//    * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user: {
//       /** The user's given name. */
//       given_name: string;
//       /** The user's access_token for subsequent calls to Google API */
//       access_token: string;
//       /**
//        * By default, TypeScript merges new interface properties and overwrites existing ones.
//        * In this case, the default session user properties will be overwritten,
//        * with the new ones defined above. To keep the default session user properties,
//        * you need to add them back into the newly declared interface.
//        */
//     } & DefaultSession['user'];
//   }
// }

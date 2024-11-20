// @/auth.ts

import NextAuth from 'next-auth';

import { authConfig } from '@/lib/auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  debug: !!process.env.AUTH_DEBUG,
  trustHost: true,
  callbacks: {
    async jwt({ token, account, profile }) {
      // the following is also logged if AUTH_DEBUG is true
      // so commenting out.

      /*
    async jwt({ token, user, account, profile }) {
      console.log(
        'auth.ts jwt cb',
        JSON.stringify({
          token: token,
          user: user,
          account: account,
          profile: profile,
        })
      );
      */
      // add what we need to use to token, token info stored in cookies.
      // only assign access_token if not already assigned - this cb gets called lots.
      token.given_name ??= profile?.given_name ? profile.given_name : null;
      token.access_token ??= account?.access_token
        ? account.access_token
        : null;
      console.log('auth.ts jwt returning: token', JSON.stringify(token));
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // set the token data to session
      }
      console.log(
        'auth.ts session cb',
        JSON.stringify({
          token: token,
          session: session,
        })
      );

      return session;
    },
  },
});

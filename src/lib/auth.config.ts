// @/lib/auth.config.ts

import { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// more at https://authjs.dev/getting-started/providers/google
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      // returns     "scope": "https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email",
      // need to add  scope  'https://www.googleapis.com/auth/photoslibrary.readonly',

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
};

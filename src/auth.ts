// @/auth.ts

import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  debug: !!process.env.AUTH_DEBUG,
  trustHost: true,
});

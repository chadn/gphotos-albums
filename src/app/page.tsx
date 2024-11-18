import { redirect } from 'next/navigation';

import { auth } from '@/auth';

export default async function rootpage() {
  const session = await auth();
  session?.user ? redirect('/albums') : redirect('/login');
}

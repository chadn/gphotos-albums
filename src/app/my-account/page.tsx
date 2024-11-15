import React from 'react';

import { auth } from '@/auth';

async function page() {
  const session = await auth();
  const user = session?.user;

  const userInfo = {
    name: user?.name,
    email: user?.email,
    image: user?.image,
    /*
    given_name: session?.profile?.given_name || '-',
    family_name: session?.profile?.family_name || '-',
    picture: session?.profile?.picture || '-',
    */
  };
  return (
    <>
      <div>This is my account page</div>
      <pre className='p-2 rounded-md'>{JSON.stringify(userInfo, null, 2)}</pre>
    </>
  );
}

export default page;

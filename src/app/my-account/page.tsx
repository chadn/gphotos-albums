import React from 'react';

import { auth } from '@/auth';

async function page() {
  const session = await auth();
  const user = session?.user;

  const userInfo = {
    name: user?.name,
    email: user?.email,
    picture: user?.picture,
    given_name: user?.given_name,
    family_name: user?.family_name,
  };
  return (
    <>
      <div>This is my account page</div>
      <pre className='p-2 rounded-md'>{JSON.stringify(userInfo, null, 2)}</pre>
    </>
  );
}

export default page;

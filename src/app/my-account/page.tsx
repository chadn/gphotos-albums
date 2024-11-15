import React from 'react';

import { auth } from '@/auth';

async function page() {
  const session = await auth();
  const user = session?.user;

  const userInfo = {
    name: user?.name,
    email: user?.email,
    image: user?.image,
    // TODO: Need to update user type like here
    // https://stackoverflow.com/questions/74425533/property-role-does-not-exist-on-type-user-adapteruser-in-nextauth
    // https://github.com/nextauthjs/next-auth/issues/6455
    //picture: user?.picture,
    // given_name: user?.given_name,
    // family_name: user?.family_name,
  };
  return (
    <>
      <div>This is my account page</div>
      <pre className='p-2 rounded-md'>{JSON.stringify(userInfo, null, 2)}</pre>
    </>
  );
}

export default page;

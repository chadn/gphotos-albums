import React from 'react';

import { auth } from '@/auth';

async function page() {
  const session = await auth();
  const user = session?.user;

  const userInfo = {
    name: user?.name,
    email: user?.email,
    image: user?.image,
    user: JSON.stringify(user),
  };
  return (
    <>
      <div>This is my account page</div>
      <pre className='p-2 rounded-md'>{JSON.stringify(userInfo, null, 2)}</pre>
      <p>
        Also see <a href='/homepage'>original boilerplate homepage</a> or the{' '}
        <a href='/components'>boilerplate components</a>.
      </p>
    </>
  );
}

export default page;

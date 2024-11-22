import React from 'react';

import { auth } from '@/auth';

async function page() {
  const session = await auth();
  const user = session?.user;

  const userInfo = {
    // TODO: figure out how to fix: Property 'given_name' does not exist on type 'User'.
    // TODO: resolve after next-auth 5 is out of beta
    // @ts-expect-error: Property 'given_name' should exist on type 'User'.
    given_name: user?.given_name,
    name: user?.name,
    email: user?.email,
    image: user?.image,
  };
  const linkStyle = [
    'animated-underline inline-flex items-center font-medium text-primary-500 ',
    'focus-visible:ring-primary-500 focus:outline-none focus-visible:rounded focus-visible:ring focus-visible:ring-offset-2',
    'hover:text-primary-600 active:text-primary-700 disabled:text-primary-200',
  ].join(' ');
  return (
    <div className='layout min-h-screen py-10'>
      <div>This is my account page</div>
      <pre className='p-2 rounded-md'>{JSON.stringify(userInfo, null, 2)}</pre>
      <p>
        Also see{' '}
        <a href='/components' className={`${linkStyle}`}>
          boilerplate components
        </a>{' '}
        or the{' '}
        <a href='/homepage' className={`${linkStyle}`}>
          original boilerplate homepage
        </a>
        .
      </p>
    </div>
  );
}

export default page;

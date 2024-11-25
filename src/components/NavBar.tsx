import * as React from 'react';

import { cn } from '@/lib/utils';

import { auth, signOut } from '@/auth';

export default async function NavBar() {
  const session = await auth();
  return (
    <nav className='flex items-center justify-between flex-wrap bg-primary-600 p-4'>
      <div className='flex items-center flex-shrink-0 text-white mr-6'>
        <a className='font-semibold text-xl tracking-tight' href='/'>
          GPhotos Albums
        </a>
      </div>
      <div className='w-full block flex-grow lg:flex lg:items-center lg:w-auto'>
        <div className='text-sm lg:flex-grow'></div>
        <div>
          {session?.user ? (
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <div className='flex items-center gap-2 text-white'>
                <a href='/my-account'>
                  <img
                    alt={session.user.email || ''}
                    src={session.user.image || 'no-img-src'}
                    className='rounded-full object-cover'
                    width={30}
                    height={30}
                  />
                </a>
                {/* @ts-expect-error: Property 'given_name' does not exist on type 'User'. */}
                <span>{session.user.given_name || ''}</span>
                <button
                  className={cn(
                    'inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white',
                    'hover:border-transparent hover:text-primary-600 hover:bg-white mt-4 lg:mt-0'
                  )}
                >
                  Logout
                </button>
              </div>
            </form>
          ) : (
            // TODO: replace this href=/login with div and button from login/page.tsx
            <a
              className={cn(
                'inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white',
                'hover:border-transparent hover:text-primary-600 hover:bg-white mt-4 lg:mt-0'
              )}
              href='/login'
            >
              LOGIN
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

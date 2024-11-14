'use client';
import { signIn } from 'next-auth/react';
import React from 'react';

import Button from '@/components/buttons/Button';

function page() {
  return (
    <div>
      <div className='flex flex-wrap gap-2 items-center justify-center'>
        <Button
          variant='primary'
          type='submit'
          onClick={() =>
            signIn('google', {
              callbackUrl: '/my-account',
            })
          }
        >
          Login with Google
        </Button>
        to retreive information on your Google Photos Albums
      </div>
    </div>
  );
}

export default page;

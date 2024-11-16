'use client';
import { signIn } from 'next-auth/react';
import React from 'react';

import Button from '@/components/buttons/Button';

export default function LoginButton() {
  return (
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
    </div>
  );
}

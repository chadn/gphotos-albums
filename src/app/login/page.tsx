'use client';
import React from 'react';

import LoginButton from '@/components/LoginButton';

function page() {
  return (
    <div>
      <div className='flex flex-wrap gap-2 items-center justify-center'>
        <LoginButton />
        to retreive information on your Google Photos Albums
      </div>
    </div>
  );
}

export default page;

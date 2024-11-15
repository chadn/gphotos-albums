'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import ButtonLink from '@/components/links/ButtonLink';

export default function HomePage() {
  return (
    <main>
      <Head>
        <title>Waddup</title>
      </Head>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <ButtonLink className='mt-6' href='/albums' variant='light'>
            See Google Photos Albums
          </ButtonLink>

          <ButtonLink className='mt-6' href='/homepage' variant='light'>
            See original homepage
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}

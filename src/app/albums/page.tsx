'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

//import { cn } from '@/lib/utils';
import AlbumsTable from '@/components/AlbumsTable';
import ItemsCount from '@/components/ItemsCount';

export default function AlbumsPage() {
  return (
    <main>
      <Head>
        <title>Waddup</title>
      </Head>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center py-2 text-center'>
          <h2>Album Details</h2>
          <ItemsCount />
          <AlbumsTable />
          <a
            href='/albumCacheReset'
            className='animated-underline inline-flex items-center font-medium text-primary-500  focus-visible:ring-primary-500 focus:outline-none focus-visible:rounded focus-visible:ring focus-visible:ring-offset-2 hover:text-primary-600 active:text-primary-700 disabled:text-primary-200'
          >
            Force Refresh of Album Data
          </a>
        </div>
      </section>
    </main>
  );
}

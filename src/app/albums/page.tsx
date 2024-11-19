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
        <div className='layout relative flex min-h-screen flex-col items-center py-12 text-center'>
          <h2>Album Details</h2>
          <p className='subhead mdl-color-text--grey-700'>
            View details of Google Photos albums below. Click column header to
            sort.
            <a href='/albumCacheReset'>Force Refresh of Album Data</a>
          </p>
          <ItemsCount />
          <AlbumsTable />
        </div>
      </section>
    </main>
  );
}

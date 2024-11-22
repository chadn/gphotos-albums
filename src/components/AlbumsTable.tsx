// import * as React from 'react';
// https://nextjs.org/docs/pages/building-your-application/optimizing/scripts
import Script from 'next/script';
import React from 'react';

// https://nextjs.org/docs/pages/building-your-application/styling/css
import '@/styles/handsontable.full.min.css';

// import { cn } from '@/lib/utils';
// import { auth, signOut } from '@/auth';

export default function AlbumsDetail() {
  return (
    <>
      <div className='grid grid-cols-1 xl:grid-cols-1 gap-6 px-4'>
        <p className='w-600 h-0 text-white bg-white'>
          --------- --------- --------- --------- --------- --------- ---------
        </p>
        <div id='album-details' className='w-600'>
          Click table column header to sort.
        </div>
      </div>
      <Script
        src='https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js'
        onLoad={() => {
          window.handsontableJsLoaded = true;
          console.log('handsontable.full.min.js has loaded');
        }}
      />
      <Script
        src='/js/common.js'
        strategy='afterInteractive'
        onLoad={() => {
          console.log('common.js has loaded');
        }}
      />
      <Script
        src='/js/album-details.js'
        strategy='lazyOnload'
        onLoad={() => {
          console.log('album-details.js has loaded');
        }}
      />
    </>
  );
}

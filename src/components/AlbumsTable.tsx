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
      <div className='flex items-center flex-shrink-0 text-white mr-6'>
        <div id='album-details'>Table HERE</div>
      </div>
      <Script
        //src='/js/jquery.js'
        src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js'
        integrity='sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg=='
        crossOrigin='anonymous'
        strategy='beforeInteractive'
        onLoad={() => {
          console.log('jquery.js has loaded');
        }}
        // To load a distributed library, copy and paste the HTML snippet for that library in your web page.
        // For instance, to load jQuery, embed the snippet in your web page:
      />
      <Script src='https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js' />
      <Script
        src='/js/common.js'
        strategy='afterInteractive'
        onLoad={() => {
          console.log('common.js has loaded');
        }}
      />
      <Script
        src='/js/album-details.js'
        strategy='afterInteractive'
        onLoad={() => {
          console.log('album-details.js has loaded');
        }}
      />
    </>
  );
}

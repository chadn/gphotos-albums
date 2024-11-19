import React, { useState } from 'react';
// import * as React from 'react';

// import { cn } from '@/lib/utils';
// import { auth, signOut } from '@/auth';

export default function AlbumsDetail() {
  // Declare a new state variable, which we'll call "count"
  // React hooks - since ver 16.8, can use state in functional component
  const [loaded, setLoaded] = useState(0);

  if (!loaded) {
    // photos api
    0 && setLoaded(1);
  }

  /* where to put this
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.css'
        />
        <script
          type='text/javascript'
          src='https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js'
        ></script>

        <script src='/js/album-details.js'></script>
    */
  return (
    <>
      <div className='flex items-center flex-shrink-0 text-white mr-6'>
        <div id='album-details'>Table HERE</div>
      </div>
    </>
  );
}

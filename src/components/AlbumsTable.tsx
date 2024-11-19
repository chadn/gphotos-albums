// import * as React from 'react';
// https://nextjs.org/docs/pages/building-your-application/optimizing/scripts
import Script from 'next/script';
import React, { useEffect, useState } from 'react';

// https://nextjs.org/docs/pages/building-your-application/styling/css
import '@/styles/handsontable.full.min.css';

// import { cn } from '@/lib/utils';
// import { auth, signOut } from '@/auth';

export default function AlbumsDetail() {
  // Declare a new state variable, which we'll call "count"
  // React hooks - since ver 16.8, can use state in functional component
  //const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/getAlbums')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then((data) => {
        //setData(data);
        console.log(`/api/getAlbums: ${JSON.stringify(data)}`);
        setIsLoading(false);
      })
      .catch((e) => {
        if (typeof e === 'string') setError(e);
        else if (e instanceof Error) setError(e.message);
        else setError('Error');
        setIsLoading(false);
      });
  }, []); // The empty array ensures this effect runs only once after the initial render

  if (error) {
    /*
    if (typeof error !== 'never') {
      const errMsg = error.message
        ? error.message
        : 'unknown error fetching data';
    }
        */
    return <p>{error}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className='flex items-center flex-shrink-0 text-white mr-6'>
        <div id='album-details'>Table HERE</div>
        <Script src='https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js' />
        <Script src='/js/album-details.js' />
      </div>
    </>
  );
}

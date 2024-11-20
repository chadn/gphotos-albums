import React, { useState } from 'react';

export default function ItemsCount() {
  // Declare a new state variable, which we'll call "count"
  // React hooks - since ver 16.8, can use state in functional component
  const [count] = useState(0);

  return (
    <div className='flex flex-wrap gap-2 items-center justify-center'>
      <p className='subhead mdl-color-text--grey-700'>
        <span id='total-num-items'>{count}</span>
        == Total Number of items (photos and videos)
      </p>
    </div>
  );
}

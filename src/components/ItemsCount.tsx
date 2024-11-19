import React, { useState } from 'react';

import Button from '@/components/buttons/Button';

export default function ItemsCount() {
  // Declare a new state variable, which we'll call "count"
  // React hooks - since ver 16.8, can use state in functional component
  const [count, setCount] = useState(0);

  return (
    <div className='flex flex-wrap gap-2 items-center justify-center'>
      <p className='subhead mdl-color-text--grey-700'>
        {count} == Total Number of Items, photos + videos.
      </p>
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
    </div>
  );
}

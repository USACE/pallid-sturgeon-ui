// for testing

import React from 'react';
import { newMoRiverEntry } from '@src/offline/db';
import { createMoRiver } from '@src/offline/api';

export default function QuickCreate() {
  const handleClick = async () => {
    const draft = newMoRiverEntry({
      setdate: '2025-10-01',
      gear_type: 'N',
      recorder: 'ABC',
      temp: 20.5,
      // can add more fields if wanted
    });
    const res = await createMoRiver(draft);
    console.log('create result', res);
  };

  return <button onClick={handleClick}>Quick Create (test)</button>;
}

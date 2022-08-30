import React from 'react';

import Card from 'app-components/card/card';
import FindDataSheet from './pages/find-data-sheet';

const DataSheets = () => (
  <div className='container-fluid'>
    <Card className='mb-3'>
      <Card.Header text='Find Data Sheet by ID' />
      <Card.Body>
        <FindDataSheet/>
      </Card.Body>
    </Card>
  </div>
);

export default DataSheets;

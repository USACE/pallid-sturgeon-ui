import React from 'react';

import Card from 'app-components/card/card';

import DataSheetResults from './components/data-sheet-results';
import FindDataSheet from './components/find-data-sheet';

const DataSheets = () => (
  <div className='container-fluid'>
    <Card className='mb-3'>
      <Card.Header text='Find Data Sheet by ID' />
      <Card.Body>
        <FindDataSheet/>
      </Card.Body>
    </Card>
    <Card className='mb-3'>
      <Card.Header text='Datasheet Results' />
      <Card.Body>
        <DataSheetResults/>
      </Card.Body>
    </Card>
  </div>
);

export default DataSheets;

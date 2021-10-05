import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

const MrIdCellRenderer = connect(
  'doFetchMoRiverDataEntry',
  ({ doFetchMoRiverDataEntry, value }) => (
    <Button
      size='small'
      variant='link'
      className='p-0 mb-1'
      text={value}
      handleClick={() => doFetchMoRiverDataEntry({ tableId: value })}
    />
  )
);

export default MrIdCellRenderer;

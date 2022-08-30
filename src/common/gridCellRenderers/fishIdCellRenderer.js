import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

const fishIdCellRenderer = connect(
  'doFetchFishDataEntry',
  ({ doFetchFishDataEntry, data, value }) => (
    <Button
      size='small'
      variant='link'
      className='p-0 mb-1'
      text={value}
      handleClick={() => doFetchFishDataEntry({ mrId: data.mrId })}
    />
  ));

export default fishIdCellRenderer;

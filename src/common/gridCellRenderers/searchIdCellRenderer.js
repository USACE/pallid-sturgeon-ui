import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

const SearchIdCellRenderer = connect(
  'doFetchSearchDataEntry',
  ({
    doFetchSearchDataEntry,
    value,
  }) => (
    <Button
      size='small'
      variant='link'
      className='p-0 mb-1'
      text={value}
      handleClick={() => doFetchSearchDataEntry({ tableId: value })}
    />
  ));

export default SearchIdCellRenderer;

import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

const SearchIdCellRenderer = connect(
  'doFetchSearchDataEntry',
  'doUpdateUrl',
  ({
    doFetchSearchDataEntry,
    doUpdateUrl,
    uri,
    value,
  }) => {
    const params = { tableId: value };

    return (
      <Button
        size='small'
        variant='link'
        className='p-0 mb-1'
        text={value}
        handleClick={() => doFetchSearchDataEntry(params, () => doUpdateUrl(uri), false)}
      />
    );
  });

export default SearchIdCellRenderer;

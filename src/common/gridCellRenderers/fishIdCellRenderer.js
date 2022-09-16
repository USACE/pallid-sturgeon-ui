import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

const fishIdCellRenderer = connect(
  'doFetchFishDataEntry',
  'doUpdateUrl',
  ({
    doFetchFishDataEntry,
    doUpdateUrl,
    uri,
    paramType,
    data,
    value,
  }) => {
    const params = paramType === 'tableId' ? { tableId: value } : { mrId: data.mrId };

    return (
      <Button
        size='small'
        variant='link'
        className='p-0 mb-1'
        text={value}
        handleClick={() => doFetchFishDataEntry(params, doUpdateUrl(uri))}
      />
    );
  });

export default fishIdCellRenderer;

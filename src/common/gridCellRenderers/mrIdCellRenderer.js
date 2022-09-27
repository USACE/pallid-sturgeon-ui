import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

const MrIdCellRenderer = connect(
  'doFetchMoRiverDataEntry',
  'doUpdateUrl',
  ({
    doFetchMoRiverDataEntry,
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
        handleClick={() => doFetchMoRiverDataEntry(params, doUpdateUrl(uri))}
      />
    );
  });

export default MrIdCellRenderer;

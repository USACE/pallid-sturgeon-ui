import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

const SuppIdCellRenderer = connect(
  'doFetchSupplementalDataEntry',
  'doUpdateUrl',
  ({
    doFetchSupplementalDataEntry,
    doUpdateUrl,
    uri,
    paramType,
    value,
    data
  }) => {
    const params = paramType === 'tableId' ? { tableId: value } : { fId: data.fid };

    return (
      <Button
        size='small'
        variant='link'
        className='p-0 mb-1'
        text={value}
        handleClick={() => doFetchSupplementalDataEntry(params, doUpdateUrl(uri))}
      />
    );
  });

export default SuppIdCellRenderer;

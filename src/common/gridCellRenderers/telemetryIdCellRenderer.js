import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

const TelemetryIdCellRenderer = connect(
  'doFetchTelemetryDataEntry',
  'doUpdateUrl',
  ({
    doFetchTelemetryDataEntry,
    doUpdateUrl,
    uri,
    paramType,
    value,
    data
  }) => {
    const params = paramType === 'tableId' ? { tableId: value } : { seId: data.seId };

    return (
      <Button
        size='small'
        variant='link'
        className='p-0 mb-1'
        text={value}
        handleClick={() => doFetchTelemetryDataEntry(params, doUpdateUrl(uri))}
      />
    );
  });

export default TelemetryIdCellRenderer;

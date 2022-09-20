import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

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
      <>
        {paramType === 'tableId' &&
          (<Button
            size='small'
            variant='link'
            className='p-0 mb-1'
            text={value}
            handleClick={() => doFetchTelemetryDataEntry(params, doUpdateUrl(uri))}
          />)
        }
        {paramType !== 'tableId' &&
          (<Button
            isOutline
            size='small'
            variant='info'
            title='Associated Telemetry Data Entries'
            text='View Data'
            icon={<Icon icon='dots-horizontal' />}
            handleClick={() => doFetchTelemetryDataEntry(params, doUpdateUrl(uri))}
          />)
        }
      </>
    );
  });

export default TelemetryIdCellRenderer;

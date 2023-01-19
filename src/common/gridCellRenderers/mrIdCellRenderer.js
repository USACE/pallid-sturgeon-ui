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
    data,
    type
  }) => {
    const params = { tableId: data.mrId };

    const getTypeText = () => {
      switch (type) {
        case 'missouriRiver':
          return data.mrId;
        case 'fish':
          return data.fishCount;
        case 'supplemental':
          return data.suppCount;
        // case 'searchEffort':
        //   return <>Search Effort</>;
        // case 'telemetry':
        //   return <>Telemetry</>;
        // case 'procedure':
        //   return <>Procedure</>;
        default:
          return <>Unknown data type.</>;
      }
    };

    return (
      <Button
        size='small'
        variant='link'
        className='p-0 mb-1'
        text={getTypeText()}
        handleClick={() => doFetchMoRiverDataEntry(params, () => doUpdateUrl(uri), false)}
      />
    );
  });

export default MrIdCellRenderer;


import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

const MrIdCellRenderer = connect(
  'doFetchMoRiverDataEntry',
  'doUpdateUrl',
  'doUpdateCurrentTab',
  ({
    doFetchMoRiverDataEntry,
    doUpdateUrl,
    doUpdateCurrentTab,
    uri,
    data,
    type,
    tab = 0,
  }) => {
    const handleChange = () => {
      doUpdateCurrentTab(tab);
      doFetchMoRiverDataEntry({ tableId: getMrId()}, () => doUpdateUrl(uri), false);
    };

    const getMrId = () => {
      switch (type) {
        case 'home':
          return data.mrID;
        default:
          return data.mrId;
      }
    };

    const getTypeText = () => {
      switch (type) {
        case 'missouriRiver':
          return data.mrId;
        case 'fish':
          return data.fishCount;
        case 'supplemental':
          return data.suppCount;
        case 'procedure':
          return data.procCount;
        case 'home':
          return data.mrID;
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
        handleClick={handleChange}
      />
    );
  });

export default MrIdCellRenderer;


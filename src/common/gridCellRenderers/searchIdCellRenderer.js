import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

const SearchIdCellRenderer = connect(
  'doFetchSearchDataEntry',
  'doUpdateUrl',
  'doUpdateCurrentTab',
  ({
    doFetchSearchDataEntry,
    doUpdateUrl,
    doUpdateCurrentTab,
    uri,
    data,
    type,
    tab
  }) => {
    const params = { tableId: data.seId };

    const handleChange = () => {
      doUpdateCurrentTab(tab);
      doFetchSearchDataEntry(params, () => doUpdateUrl(uri), false);
    };

    const getTypeText = () => {
      switch (type) {
        case 'searchEffort':
          return data.seId;
        case 'telemetry':
          return data.telemetryCount;
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

export default SearchIdCellRenderer;

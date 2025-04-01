import { connect } from 'redux-bundler-react';

import Button from '@components/button';

const SearchIdCellRenderer = connect(
  'doFetchSearchDataEntry',
  'doUpdateCurrentTab',
  'doUpdateComplexStateField',
  ({ doFetchSearchDataEntry, doUpdateCurrentTab, doUpdateComplexStateField, data, type, tab }) => {
    const params = { tableId: data.seId };

    const typeText = {
      searchEffort: data.seId,
      telemetry: data.telemetryCount,
    };

    const handleChange = () => {
      doUpdateCurrentTab(tab);
      doUpdateComplexStateField({ name: 'isEditForm', value: true });
      doFetchSearchDataEntry(params, false, true, true);
    };

    return <Button size='small' variant='link' className='p-0 mb-1' text={typeText[type]} handleClick={handleChange} />;
  }
);

export default SearchIdCellRenderer;

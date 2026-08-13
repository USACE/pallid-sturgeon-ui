import { connect } from 'redux-bundler-react';

import Button from '@components/button';

const SearchIdCellRenderer = connect(
  'doFetchSearchDataEntry',
  'doUpdateCurrentTab',
  'doUpdateComplexStateField',
  ({ doFetchSearchDataEntry, doUpdateCurrentTab, doUpdateComplexStateField, data, type, tab }) => {
    const searchEffortId = data?.seId ?? data?.se_id ?? data?.seFid ?? data?.se_fid;
    const searchEffortLinkId = data?.seId ?? data?.se_id ?? String(data?.seFid ?? data?.se_fid ?? '').slice(-3);
    const params = { tableId: searchEffortId };

    const typeText = {
      searchEffort: searchEffortLinkId,
      telemetry: data.telemetryCount,
    };

    const handleChange = () => {
      doUpdateCurrentTab(tab ?? 0);
      doUpdateComplexStateField({ name: 'isEditForm', value: true });
      doFetchSearchDataEntry(params, false, true, true);
    };

    return <Button size='small' variant='link' className='p-0 mb-1' text={typeText[type]} handleClick={handleChange} />;
  }
);

export default SearchIdCellRenderer;

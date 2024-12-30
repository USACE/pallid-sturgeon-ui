import { connect } from 'redux-bundler-react';

import Button from '@components/button';

const SearchIdCellRenderer = connect(
  'doFetchSearchDataEntry',
  'doUpdateUrl',
  'doUpdateCurrentTab',
  'doUpdateComplexStateField',
  'selectRouteParams',
  ({
    doFetchSearchDataEntry,
    doUpdateUrl,
    doUpdateCurrentTab,
    doUpdateComplexStateField,
    routeParams,
    data,
    type,
    tab,
  }) => {
    const siteID = routeParams?.id;
    const uri = `/sites-list/${siteID}/search-effort`;

    const params = { tableId: data.seId };

    const handleChange = () => {
      doUpdateCurrentTab(tab);
      doUpdateComplexStateField({ name: 'isEditForm', value: true });
      doFetchSearchDataEntry(params, false, true);
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

    return <Button size='small' variant='link' className='p-0 mb-1' text={getTypeText()} handleClick={handleChange} />;
  }
);

export default SearchIdCellRenderer;

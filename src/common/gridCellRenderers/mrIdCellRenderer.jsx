import { connect } from 'redux-bundler-react';

import Button from '@components/button';

const MrIdCellRenderer = connect(
  'doFetchMoRiverDataEntry',
  'doUpdateUrl',
  'doUpdateCurrentTab',
  'doUpdateComplexStateField',
  'selectRouteParams',
  ({
    doFetchMoRiverDataEntry,
    doUpdateUrl,
    doUpdateCurrentTab,
    doUpdateComplexStateField,
    routeParams,
    data,
    type,
    tab = 0,
  }) => {
    const siteID = routeParams?.id;
    const uri = `/sites-list/${siteID}/missouri-river`;

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

    const handleClick = () => {
      doUpdateCurrentTab(tab);
      doUpdateComplexStateField({ name: 'isEditForm', value: true });
      doFetchMoRiverDataEntry({ tableId: getMrId() }, false, true);
    };

    return <Button size='small' variant='link' className='p-0 mb-1' text={getTypeText()} handleClick={handleClick} />;
  }
);

export default MrIdCellRenderer;

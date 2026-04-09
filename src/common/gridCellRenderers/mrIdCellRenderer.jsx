import { connect } from 'redux-bundler-react';

import Button from '@components/button';

const MrIdCellRenderer = connect(
  'doFetchMoRiverDataEntry',
  'doResetMoRiverDataEntryData',
  'doUpdateCurrentTab',
  'doUpdateComplexStateField',
  ({
    doFetchMoRiverDataEntry,
    doResetMoRiverDataEntryData,
    doUpdateCurrentTab,
    doUpdateComplexStateField,
    data,
    type,
    tab = 0,
  }) => {
    const mrId = type === 'home' ? data.mrID : data.mrId;
    const typeText = {
      missouriRiver: data.mrId,
      fish: data.fishCount,
      supplemental: data.suppCount,
      procedure: data.procCount,
      home: data.mrID,
    };

    const handleClick = () => {
      doUpdateCurrentTab(tab);
      doUpdateComplexStateField({ name: 'isEditForm', value: true });
      doResetMoRiverDataEntryData();
      doFetchMoRiverDataEntry({ tableId: mrId }, false, true, true);
    };

    return <Button size='small' variant='link' className='p-0 mb-1' text={typeText[type]} handleClick={handleClick} />;
  }
);

export default MrIdCellRenderer;

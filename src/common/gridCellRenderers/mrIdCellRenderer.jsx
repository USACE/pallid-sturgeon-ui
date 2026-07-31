import { connect } from 'redux-bundler-react';

import Button from '@components/button';

const MrIdCellRenderer = connect(
  'doFetchMoRiverDataEntry',
  'doResetFormData',
  'doUpdateCurrentTab',
  'doUpdateComplexStateField',
  ({
    doFetchMoRiverDataEntry,
    doResetFormData,
    doUpdateCurrentTab,
    doUpdateComplexStateField,
    data,
    type,
    tab = 0,
  }) => {
    const mrId = type === 'home' ? data.mrID : (data.mrId ?? data.mr_id ?? data.mrFid ?? data.mr_fid);
    const mrDisplayId =
      type === 'home' ? data.mrID : (data.mrId ?? data.mr_id ?? String(data.mrFid ?? data.mr_fid ?? '').slice(-3));
    const typeText = {
      missouriRiver: mrDisplayId,
      fish: data.fishCount,
      supplemental: data.suppCount,
      procedure: data.procCount,
      home: data.mrID,
    };

    const handleClick = () => {
      doUpdateCurrentTab(tab);
      doUpdateComplexStateField({ name: 'isEditForm', value: true });
      // Reset form data
      doResetFormData();
      doFetchMoRiverDataEntry({ tableId: mrId }, false, true, true);
    };

    return <Button size='small' variant='link' className='p-0 mb-1' text={typeText[type]} handleClick={handleClick} />;
  }
);

export default MrIdCellRenderer;

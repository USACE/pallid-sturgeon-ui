import { connect } from 'redux-bundler-react';
import { mdiDotsHorizontal, mdiPlus } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

const SuppLinkCellRenderer = connect(
  'doUpdateBaseData',
  'doUpdateCurrentTab',
  'selectDataEntrySupplemental',
  ({ doUpdateBaseData, doUpdateCurrentTab, dataEntrySupplemental, data, setIsAddRow, setRowId }) => {
    const fId = data.fid;
    const hasSuppData = !!dataEntrySupplemental?.items?.filter((data) => data.fid === fId)?.length;
    const isNewRow = Object.keys(data).length === 0;

    const handleAddRow = (add) => {
      doUpdateCurrentTab(2);
      if (add) {
        setIsAddRow(true);
        setRowId(fId);
      }
    };

    const handleClick = (e) => {
      // Store condition, length, weight, species in baseData
      doUpdateBaseData('condition', data?.condition);
      doUpdateBaseData('length', data?.length);
      doUpdateBaseData('weight', data?.weight);
      doUpdateBaseData('species', data?.species);
      doUpdateBaseData('fid', data?.fid);
      doUpdateBaseData('ffid', data?.ffid);
      // Add row in Supplemental tab
      handleAddRow(true);
    };

    const isButtonDisabled = () => {
      if (isNewRow || !data.fid) {
        return true;
      } else {
        if (data.supplink === null || data.supplink === undefined || data.supplink === false) {
          return false;
        } else {
          return true;
        }
      }
    };

    return (
      <Button
        isOutline
        size='small'
        variant={hasSuppData ? 'info' : 'success'}
        title='Associated Supplemental Data Entries'
        text={hasSuppData ? 'View Data' : 'Add Data'}
        icon={<Icon path={hasSuppData ? mdiDotsHorizontal : mdiPlus} />}
        handleClick={handleClick}
        isDisabled={isButtonDisabled()}
      />
    );
  }
);

export default SuppLinkCellRenderer;

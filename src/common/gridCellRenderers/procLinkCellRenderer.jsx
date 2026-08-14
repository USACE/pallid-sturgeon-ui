import { connect } from 'redux-bundler-react';
import { mdiDotsHorizontal, mdiPlus } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

const ProcLinkCellRenderer = connect(
  'doUpdateCurrentTab',
  'selectDataEntryProcedure',
  ({ doUpdateCurrentTab, dataEntryProcedure, data, setIsAddRow, setRowId }) => {
    const fId = data?.fid ?? data?.fId ?? data?.f_id;
    const fFid = data?.fFid ?? data?.f_fid ?? data?.ffid;
    const hasProcData =
      dataEntryProcedure.items.some((data) => {
        const rowFId = data?.fid ?? data?.fId ?? data?.f_id;
        const rowFFid = data?.fFid ?? data?.f_fid ?? data?.ffid;

        return (
          (fId != null && rowFId != null && String(rowFId) === String(fId)) ||
          (fFid && rowFFid && String(rowFFid) === String(fFid))
        );
      }) ?? false;

    const isNewRow = Object.keys(data).length === 0;

    const handleAddRow = (add) => {
      doUpdateCurrentTab(3);

      setIsAddRow(add);
      setRowId({ fid: fId, fFid: fFid });
    };

    const isButtonDisabled = () => {
      return isNewRow || fId == null;
    };

    return (
      <>
        {hasProcData ? (
          <Button
            isOutline
            size='small'
            variant='info'
            title='Associated Procedure Data Entries'
            text={'View Data'}
            icon={<Icon path={mdiDotsHorizontal} />}
            handleClick={() => handleAddRow(false)}
            isDisabled={isButtonDisabled()}
          />
        ) : (
          <Button
            isOutline
            size='small'
            variant='success'
            title='Associated Procedure Data Entries'
            text={'Add Data'}
            icon={<Icon path={mdiPlus} />}
            handleClick={() => handleAddRow(true)}
            isDisabled={isButtonDisabled()}
          />
        )}
      </>
    );
  }
);

export default ProcLinkCellRenderer;

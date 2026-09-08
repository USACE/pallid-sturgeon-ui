import { connect } from 'redux-bundler-react';
import { mdiEye, mdiPlusBox } from '@mdi/js';
import { Button } from '@trussworks/react-uswds';

import Icon from '@components/icon/icon';
import SupplementalProcedureModal from '@src/app-pages/data-entry/edit-data-sheet/forms/supplemental-procedure/SupplementalProcedureModal';
import { OfflineStatuses } from '@src/utils/enums';
import { useEffect, useMemo, useState } from 'react';
import { siteDatasheetUpdated } from '@src/app-pages/data-entry/offline/datasheet-refresh';

const FishLinkTableCell = connect('doModalOpen', ({ doModalOpen, getValue, row }) => {
  const value = getValue();
  const isPlaceholderRow = row?.original?._isPlaceholderRow === true;
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const handleDatasheetRefresh = () => {
      setRefreshCounter((current) => current + 1);
    };

    window.addEventListener(siteDatasheetUpdated, handleDatasheetRefresh);
    return () => {
      window.removeEventListener(siteDatasheetUpdated, handleDatasheetRefresh);
    };
  }, []);

  const rowFid = useMemo(() => row?.original?.fid ?? row?.original?.fId ?? row?.original?.f_id, [row]);
  const rowFfid = useMemo(() => row?.original?.fFid ?? row?.original?.f_fid, [row]);
  const hasFishId =
    (rowFid !== null && rowFid !== undefined && String(rowFid) !== '') ||
    (rowFfid !== null && rowFfid !== undefined && String(rowFfid) !== '');
  const isUnsavedNewFish = row?.original?._status === OfflineStatuses.New || !hasFishId;
  const hasOfflineSupplementalDraft = useMemo(() => {
    if (!rowFfid) {
      return false;
    }

    const draftKey = `currentSupplementalDraft:${rowFfid}`;
    const draftJson = sessionStorage.getItem(draftKey);
    if (!draftJson) {
      return false;
    }

    try {
      const draft = JSON.parse(draftJson);
      const draftFfid = draft?.fFid ?? draft?.f_fid;

      return draftFfid != null && String(draftFfid) === String(rowFfid);
    } catch {
      return false;
    }
  }, [rowFfid, refreshCounter]);

  if (isPlaceholderRow) {
    return null;
  }

  // Check if supplemental data exists for Fish using current render value.
  const hasSupplemental = Number(value ?? 0) > 0 || hasOfflineSupplementalDraft;
  const isEdit = !!hasSupplemental;
  const disabledMessage = 'Please submit Fish data first to add Supplemental & Procedure Data for this fish';
  const buttonTitle = isUnsavedNewFish ? disabledMessage : 'Add Supplemental & Procedure Data';

  const handleButtonClick = () => {
    if (isUnsavedNewFish) {
      window.alert(disabledMessage);
      return;
    }

    doModalOpen(SupplementalProcedureModal, {
      data: row.original,
      edit: isEdit,
      rowIndex: row.index,
      row: row.original,
    });
  };

  return (
    <div className='button-container'>
      <Button
        className='primary-btn'
        title={buttonTitle}
        aria-disabled={isUnsavedNewFish ? 'true' : 'false'}
        style={isUnsavedNewFish ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
        onClick={() => handleButtonClick()}
        type='button'
      >
        <Icon
          aria-label={`${isEdit ? 'View' : 'Add'} Supplemental & Procedure Data`}
          focusable={false}
          path={isEdit ? mdiEye : mdiPlusBox}
          size={'15px'}
        />
      </Button>
    </div>
  );
});

export default FishLinkTableCell;

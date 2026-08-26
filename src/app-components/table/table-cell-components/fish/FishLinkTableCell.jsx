import { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { mdiEye, mdiPlusBox } from '@mdi/js';
import { Button } from '@trussworks/react-uswds';

import Icon from '@components/icon/icon';
import SupplementalProcedureModal from '@src/app-pages/data-entry/edit-data-sheet/forms/supplemental-procedure/SupplementalProcedureModal';

const FishLinkTableCell = connect('doModalOpen', ({ doModalOpen, getValue, row }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const isPlaceholderRow = row?.original?._isPlaceholderRow === true;

  if (isPlaceholderRow) {
    return null;
  }

  // Check if supplemental data exists for Fish
  const hasSupplemental = value > 0;
  const isEdit = !!hasSupplemental;

  const handleButtonClick = () => {
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
        title='Add Supplemental & Procedure Data Entry'
        onClick={() => handleButtonClick()}
        type='button'
      >
        <Icon
          aria-label={`${isEdit ? 'View' : 'Add'} Supplemental & Procedure Data Entry`}
          focusable={false}
          path={isEdit ? mdiEye : mdiPlusBox}
          size={'15px'}
        />
      </Button>
    </div>
  );
});

export default FishLinkTableCell;

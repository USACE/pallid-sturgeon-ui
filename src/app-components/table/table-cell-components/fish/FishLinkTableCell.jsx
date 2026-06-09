import { connect } from 'redux-bundler-react';
import Icon from '@components/icon/icon';
import { mdiEye, mdiPlusBox } from '@mdi/js';
import { Button } from '@trussworks/react-uswds';

const getModalProps = ({ row, isEdit }) => ({
  data: row.original,
  edit: isEdit,
  rowIndex: row.index,
  row: row.original,
});

const FishLinkTableCell = connect('doModalOpen', ({ doModalOpen, modalComponent, row }) => {
  const isEdit = !!(row.original.fFid || row.original.fid);
  const modalProps = getModalProps({ row, isEdit });

  const handleButtonClick = () => doModalOpen(modalComponent, modalProps);

  return (
    <div className='button-container'>
      <Button
        className='button-small text-normal'
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

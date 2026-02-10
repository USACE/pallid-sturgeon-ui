import { connect } from 'redux-bundler-react';
import { useState } from 'react';
import { Button } from '@trussworks/react-uswds';

const DeleteButton = connect(
  'doSecondaryModalClose',
  ({ doSecondaryModalClose, deleteText, handleDelete, customClosingLogic }) => {
    const [isConfirming, setIsConfirming] = useState(false);

    const onDelete = (e) => {
      setIsConfirming(false);
      handleDelete(e);
      if (!customClosingLogic) doSecondaryModalClose();
    };

    return isConfirming ? (
      <>
        <Button secondary onClick={onDelete}>
          Confirm
        </Button>
        <Button onClick={() => setIsConfirming(false)}>Cancel</Button>
      </>
    ) : (
      <Button secondary onClick={() => setIsConfirming(true)}>
        {deleteText}
      </Button>
    );
  }
);

export default DeleteButton;

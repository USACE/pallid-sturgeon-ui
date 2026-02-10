import { connect } from 'redux-bundler-react';
import { Button } from '@trussworks/react-uswds';
import DeleteButton from './DeleteButton';

const SecondaryModalFooter = connect(
  'doSecondaryModalClose',
  ({
    doSecondaryModalClose,
    cancelText = 'Cancel',
    customClosingLogic = false,
    deleteText = 'Delete',
    onCancel = null,
    onDelete = null,
    onSave = null,
    saveIsDisabled = false,
    saveIsSubmit = false,
    saveText = 'Save',
    showCancelButton = false,
    showSaveButton = true,
  }) => {
    const saveButtonProps = {
      disabled: saveIsDisabled,
      children: saveText,
      ...(saveIsSubmit
        ? {
            type: 'submit',
          }
        : {
            onClick: (e) => {
              if (onSave) onSave(e);
              if (!customClosingLogic) doSecondaryModalClose();
            },
          }),
    };

    return (
      <footer className='primary-modal-footer'>
        {(showCancelButton || onCancel) && (
          <Button
            variant='secondary'
            text={cancelText}
            base
            onClick={(e) => {
              if (onCancel) onCancel(e);
              doSecondaryModalClose();
            }}
          >
            {cancelText}
          </Button>
        )}
        {onDelete && (
          <DeleteButton deleteText={deleteText} handleDelete={onDelete} customClosingLogic={customClosingLogic} />
        )}
        {showSaveButton && <Button {...saveButtonProps} />}
      </footer>
    );
  }
);

export default SecondaryModalFooter;

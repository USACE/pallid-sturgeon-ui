import { connect } from 'redux-bundler-react';
import { Button } from '@trussworks/react-uswds';
import LoaderButton from '@src/app-components/loader/LoaderButton';

import '@styles/_buttons.scss';
import './modal.scss';

const ModalFooter = connect(
  'doModalClose',
  ({
    doModalClose,
    cancelText = 'Cancel',
    customClosingLogic = false,
    onCancel = null,
    onSave,
    saveIsDisabled = false,
    saveText = 'Save',
    showCancelButton = false,
    showSaveButton = true,
    isSaveButtonLoading = false,
    children,
  }) => {
    const handleClick = (e) => {
      if (onSave) onSave(e);
      if (!customClosingLogic) doModalClose();
    };

    return (
      <footer className={`primary-modal-footer ${children ? 'has-extra-actions' : ''}`}>
        <div className='left-group'>
          {showSaveButton && (
            <LoaderButton disabled={saveIsDisabled} isLoading={isSaveButtonLoading} onClick={handleClick} type='button'>
              {saveText}
            </LoaderButton>
          )}
          {children && <div className='extra-actions'>{children}</div>}
        </div>
        {(showCancelButton || onCancel) && (
          <Button
            base
            onClick={(e) => {
              if (onCancel) onCancel(e);
              doModalClose();
            }}
          >
            {cancelText}
          </Button>
        )}
      </footer>
    );
  }
);
export default ModalFooter;

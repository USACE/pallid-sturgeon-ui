import { connect } from 'redux-bundler-react';
import { Button } from '@trussworks/react-uswds';
import LoaderButton from '@src/app-components/loader/LoaderButton';

import '@styles/_buttons.scss';
import './modal.scss';

const ModalFooter = connect(
  'doModalClose',
  ({
    doModalClose,
    cancelText = 'Close',
    onCancel = null,
    onSave,
    saveIsDisabled = false,
    saveText = 'Save',
    showCancelButton = false,
    showSaveButton = true,
    isSaveButtonLoading = false,
    children,
    showSecondarySaveButton = null,
    onSecondarySave,
    secondarySaveText = 'Save & Close',
  }) => {
    return (
      <footer className={`primary-modal-footer ${children ? 'has-extra-actions' : ''}`}>
        <div className='left-group'>
          {showSaveButton && (
            <LoaderButton
              disabled={saveIsDisabled}
              isLoading={isSaveButtonLoading}
              onClick={onSave}
              type='button'
              className='add-btn'
            >
              {saveText}
            </LoaderButton>
          )}
          {children && <div className='extra-actions'>{children}</div>}
        </div>
        {(showSecondarySaveButton || onSecondarySave) && (
          <LoaderButton
            disabled={saveIsDisabled}
            isLoading={isSaveButtonLoading}
            onClick={onSecondarySave}
            type='button'
            className='add-btn'
          >
            {secondarySaveText}
          </LoaderButton>
        )}
        {(showCancelButton || onCancel) && (
          <Button
            base
            className='close-btn'
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

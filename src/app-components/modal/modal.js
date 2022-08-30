import React, { useCallback, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

const Modal = connect(
  'doModalClose',
  'selectModalContent',
  'selectModalProps',
  ({
    doModalClose,
    modalContent: ModalContent,
    modalProps,
    closeWithEscape = false,
  }) => {
    const closeModalWithEscape = useCallback((e) => {
      if (e.keyCode === 27) doModalClose();
    }, [doModalClose]);

    useEffect(() => {
      if (closeWithEscape) {
        document.addEventListener('keydown', closeModalWithEscape);

        if (!ModalContent) {
          document.removeEventListener('keydown', closeModalWithEscape);
        }
      }
    }, [ModalContent, closeWithEscape, closeModalWithEscape]);

    return (
      !!ModalContent && (
        <>
          <div
            onClick={doModalClose}
            className='modal fade show'
            style={{ display: 'block', backgroundColor: '#ccc', opacity: 0.5 }}
          />
          <div className='modal fade show' style={{ display: 'block' }}>
            <ModalContent {...modalProps} />
          </div>
        </>
      )
    );
  }
);

export default Modal;

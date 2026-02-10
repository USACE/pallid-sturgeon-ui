import { connect } from 'redux-bundler-react';

const Modal = connect(
  'selectModalContent',
  'selectModalProps',
  ({ modalContent: ModalContent, modalProps, closeWithEscape = false }) => {
    return !!ModalContent ? <ModalContent closeWithEscape={closeWithEscape} {...modalProps} /> : null;
  }
);

export default Modal;

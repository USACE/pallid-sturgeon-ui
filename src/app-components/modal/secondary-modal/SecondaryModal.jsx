import { connect } from 'redux-bundler-react';

const SecondaryModal = connect(
  'selectSecondaryModalContent',
  'selectSecondaryModalProps',
  ({ secondaryModalContent: ModalContent, secondaryModalProps, closeWithEscape = false }) => {
    return !!ModalContent ? <ModalContent closeWithEscape={closeWithEscape} {...secondaryModalProps} /> : null;
  }
);

export default SecondaryModal;

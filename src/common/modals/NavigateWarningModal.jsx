import { connect } from 'redux-bundler-react';
import ModalContent from '@src/app-components/modal/primary-modal/PrimaryModal.content';
import ModalFooter from '@src/app-components/modal/primary-modal/PrimaryModal.footer';

const NavigateWarningModal = connect('doUpdateUrl', 'doModalClose', ({ doUpdateUrl, doModalClose, url }) => {
  const handleNavigation = () => {
    doModalClose();
    doUpdateUrl(url);
  };

  return (
    <ModalContent size='md' title='Warning!'>
      <section className='modal-body'>
        <h6>
          You are about to navigate away from the data entry page; any unsaved work will be lost! <br /> <br />
          Press Cancel to go back and save your data, or OK to proceed.
        </h6>
      </section>
      <ModalFooter onSave={() => handleNavigation()} onCancel={() => doModalClose()} saveText='OK' customSaveLogic />
    </ModalContent>
  );
});

export default NavigateWarningModal;

import { connect } from 'redux-bundler-react';
import ModalContent from '@src/app-components/modal/primary-modal/PrimaryModal.content';
import ModalFooter from '@src/app-components/modal/primary-modal/PrimaryModal.footer';

const SupplementalProcedureModal = connect('doModalClose', ({ doModalClose }) => {
  return (
    <ModalContent size='lg' title='Supplemental & Procedure Data Entry'>
      <section className='modal-body'>
        <h6>Placeholder Form Modal</h6>
      </section>
      <ModalFooter onSave={() => {}} onCancel={() => doModalClose()} saveText='Submit' customSaveLogic />
    </ModalContent>
  );
});

export default SupplementalProcedureModal;

import ModalContent from '../modal/primary-modal/PrimaryModal.content';
import Spinner from './Spinner';
import './loader.scss';

const ModalLoader = ({ title = '', hasCloseButton = true }) => (
  <ModalContent title={title} hasCloseButton={hasCloseButton}>
    <div className='modal-loader-container'>
      <Spinner className='modal-loader' />
    </div>
  </ModalContent>
);
export default ModalLoader;

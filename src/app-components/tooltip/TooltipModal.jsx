import ModalContent from '../modal/secondary-modal/SecondaryModal.content';
import './tooltip.scss';

const TooltipModal = ({ msg, title, isError, size = 'lg' }) => (
  <ModalContent hasCloseButton={true} hasIcon isError={isError} size={size} title={title}>
    <div className='tooltip-modal-contents'>{msg}</div>
  </ModalContent>
);
export default TooltipModal;

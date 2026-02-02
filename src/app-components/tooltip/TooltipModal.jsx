import { ModalFooter } from '@trussworks/react-uswds';
import { ModalContent, ModalHeader } from '../modal';

import './tooltip.scss';

const TooltipModal = ({ msg, title, isError, size = 'lg' }) => (
  <ModalContent hasCloseButton={true} hasIcon isError={isError} size={size} title={title}>
    <ModalHeader title={title} />
    <div className='tooltip-modal-contents'>{msg}</div>
    <ModalFooter showCancelButton />
  </ModalContent>
);
export default TooltipModal;

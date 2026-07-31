import { connect } from 'redux-bundler-react';
import { Modal } from '@trussworks/react-uswds';
import ModalHeader from './PrimaryModal.header';
import useListener from '@src/customHooks/useListener';
import classNames from 'classnames';

import './modal.scss';

const sizeMap = {
  sm: false,
  md: true,
  lg: true,
  xl: true,
};

const ModalContent = connect(
  'doModalClose',
  ({ doModalClose, children, className = '', hasCloseButton = false, size = 'lg', title, ...customProps }) => {
    const modalClasses = classNames(className, {
      'modal-md': size === 'md',
      'modal-xl': size === 'xl',
    });

    useListener('keydown', (e) => {
      if (hasCloseButton && (e.key === 'Esc' || e.key === 'Escape')) {
        doModalClose();
      }
    });

    useListener('click', (e) => {
      const isOverlayClick = e.target.getAttribute('data-testId') === 'modalOverlay';
      const isCloseBtnClick = e.target.getAttribute('data-close-modal') === 'true';
      const isPrimaryModal = !!e.target?.closest('[role=dialog]')?.querySelector('[data-primary-modal]');

      if (isPrimaryModal && hasCloseButton && (isOverlayClick || isCloseBtnClick)) {
        doModalClose();
      }
    });

    return (
      <Modal
        aria-describedby='primary-modal-content'
        aria-labelledby='primary-modal-header'
        className={modalClasses}
        data-primary-modal='true'
        forceAction={!hasCloseButton}
        isInitiallyOpen
        isLarge={sizeMap[size || 'lg']}
        {...customProps}
      >
        {title && <ModalHeader title={title} />}
        <div id='primary-modal-content' className='primary-modal-content modal-body'>
          {children}
        </div>
      </Modal>
    );
  }
);

export default ModalContent;

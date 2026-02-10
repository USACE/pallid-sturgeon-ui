import { connect } from 'redux-bundler-react';
import { Modal } from '@trussworks/react-uswds';
import ModalHeader from './SecondaryModal.header';
import useListener from '@hooks/useListener';
import classNames from 'classnames';

import '../primary-modal/modal.scss';

const sizeMap = {
  sm: false,
  md: true,
  lg: true,
};

const SecondaryModalContent = connect(
  'doSecondaryModalClose',
  ({
    doSecondaryModalClose,
    children,
    className,
    hasCloseButton = false,
    hasIcon = false,
    isError = false,
    size = 'lg',
    title,
    ...customProps
  }) => {
    const modalClasses = classNames(className, size === 'md' && 'modal-md');

    useListener(
      'keyup',
      (e) => {
        e.stopPropagation();

        if (hasCloseButton && e.key === 'Escape') {
          doSecondaryModalClose();
        }
      },
      window,
      { passive: false, capture: true }
    );

    useListener('click', (e) => {
      const isOverlayClick = e.target.getAttribute('data-testId') === 'modalOverlay';
      const isCloseBtnClick = e.target.getAttribute('data-close-modal') === 'true';
      const isSecondaryModal = !!e.target?.closest('[role=dialog]')?.querySelector('[data-secondary-modal]');

      if (isSecondaryModal && hasCloseButton && (isOverlayClick || isCloseBtnClick)) {
        doSecondaryModalClose();
      }
    });

    return (
      <Modal
        aria-describedby='secondary-modal-content'
        aria-labelledby='secondary-modal-header'
        className={modalClasses}
        data-secondary-modal='true'
        forceAction={!hasCloseButton}
        isInitiallyOpen
        isLarge={sizeMap[size || 'lg']}
        {...customProps}
      >
        <ModalHeader hasIcon={hasIcon} isError={isError} title={title} />
        <div id='secondary-modal-content'>{children}</div>
      </Modal>
    );
  }
);

export default SecondaryModalContent;

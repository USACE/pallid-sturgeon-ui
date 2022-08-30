import React from 'react';

import { classArray } from 'utils';

/**
 * 
 * @param {String} size - Set the size of the modal content. One of ['sm', null, 'lg', 'xl']. Default null (medium).
 * @param {Element} children - React Element displayed in the modal dialog.
 */
const ModalContent = ({ size, className, modalContentClassName, children, ...customProps }) => {
  const modalCls = classArray([
    'modal-dialog',
    'modal-dialog-scrollable',
    'modal-dialog-centered',
    `modal-${size}`,
    className,
  ]);

  const modalContentCls = classArray([
    'modal-content',
    modalContentClassName,
  ]);

  return (
    <div className={modalCls}>
      <div className={modalContentCls} {...customProps}>
        {children}
      </div>
    </div>
  );
};

export default ModalContent;
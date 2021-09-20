import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import DropdownContext from './dropdownContext';
import useOutsideEventHandle from '../../customHooks/useOutsideEventHandle';
import useWindowListener from '../../customHooks/useWindowListener';
import { classArray } from 'utils';

import './dropdown.scss';

const DropdownMenu = forwardRef(({
  id = 'dropdown',
  dropdownClass = '',
  buttonClass = '',
  menuClass = '',
  withToggleArrow = true,
  closeOnSelect = true,
  buttonContent = null,
  customContent = null,
  children = null,
  closeWithEscape = true,
  containerRefs = [],
  onToggle = () => {},
  customElementProps = {},
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const dropdownClasses = classArray(['dropdown', dropdownClass]);
  const buttonClasses = classArray(['btn', withToggleArrow && 'dropdown-toggle', buttonClass]);
  const menuClasses = classArray(['dropdown-menu', isOpen && 'show', menuClass]);

  useImperativeHandle(ref, () => ({
    openDropdown: () => setIsOpen(true),
    closeDropdown: () => setIsOpen(false),
    toggleDropdown: () => setIsOpen(!isOpen),
  }));

  useOutsideEventHandle(
    'click',
    [menuRef, ...containerRefs],
    isOpen ? () => setIsOpen(false) : () => { }
  );

  useWindowListener('keyup', (e) => {
    if (closeWithEscape && (e.key === 'Esc' || e.key === 'Escape') && isOpen) {
      setIsOpen(false);
    }
  });

  useEffect(() => {
    onToggle(isOpen);
  }, [isOpen, onToggle]);

  const commonProps = {
    onClick: () => setIsOpen(!isOpen),
    'aria-haspopup': true,
    'aria-expanded': isOpen,
    ...customElementProps,
  };

  return (
    <DropdownContext.Provider value={{ closeDropdown: () => closeOnSelect ? setIsOpen(false) : () => {} }}>
      <div className={dropdownClasses} id={id}>
        {customContent
          ? React.cloneElement(customContent, commonProps)
          : (
            <button className={buttonClasses} id={`${id}MenuButton`} title='Toggle Dropdown' {...commonProps}>
              {buttonContent}
            </button>
          )
        }
        <div className={menuClasses} aria-labelledby={`${id}MenuButton`} ref={menuRef} style={{ maxHeight: '400px', overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </DropdownContext.Provider>
  );
});

export default DropdownMenu;

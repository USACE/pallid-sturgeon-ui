import React from 'react';

import DropdownContext from './dropdownContext';

const DropdownItem = ({
  onClick = () => { },
  href = null,
  className = '',
  children = null,
}) => (
  <DropdownContext.Consumer>
    {({ closeDropdown }) => (
      href
        ? <a className={`dropdown-item text-primary ${className}`} href={href} onClick={() => closeDropdown()}>{children}</a>
        : (
          <button 
            className={`dropdown-item text-primary ${className}`}
            onClick={(e) => {
              closeDropdown();
              onClick(e);
            }}
          >
            {children}
          </button>
        )
    )}
  </DropdownContext.Consumer>
);

export default DropdownItem;

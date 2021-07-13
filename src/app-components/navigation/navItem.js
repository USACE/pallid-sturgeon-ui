import React from 'react';
import { connect } from 'redux-bundler-react';

import Dropdown from 'app-components/dropdown';
import { classArray, hrefAsString } from 'utils';

const NavItem = connect(
  'selectPathname',
  ({ pathname, href, children, icon, className, handler, isHidden }) => {
    const cls = classArray([
      'nav-item',
      href && href.includes(pathname) && 'active',
      className,
    ]);

    const isDropdown = href && href.length > 1;

    const handleClick = (e) => {
      if (handler && typeof handler === 'function') handler(e);
    };

    const ItemContent = () => (
      <>
        {icon}
        {icon && <>&nbsp;</>}
        {children}
      </>
    );

    return !isHidden ? (
      handler ? (
        <li className={cls} onClick={handleClick}>
          <span className='nav-link'>
            <ItemContent />
          </span>
        </li>
      ) : (
        <li className={cls}>
          {isDropdown ? (
            <Dropdown.Menu
              withToggleArrow={false}
              menuClasses={['dropdown-menu-right']}
              buttonClasses={['btn-small p-0 nav-dropdown-button']}
              buttonContent={(
                <a className='nav-link'>
                  <ItemContent />
                </a>
              )}
            >
              {href.map(link => (
                <Dropdown.Item key={link} href={link} className={link === pathname ? 'active' : ''}>
                  {hrefAsString(link)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          ) : (
            <a className='nav-link' href={href}>
              <ItemContent />
            </a>
          )}
        </li>
      )
    ) : null;
  }
);

export default NavItem;

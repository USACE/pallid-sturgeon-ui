import React from 'react';
import { connect } from 'redux-bundler-react';

import Dropdown from 'app-components/dropdown';
import { classArray, hrefAsString } from 'utils';

const NavItem = connect(
  'selectPathname',
  ({ pathname, href, children, icon, className, handler, isHidden, asDropdown, inlcudedLinks = [] }) => {
    const cls = classArray([
      'nav-item',
      href && (href.includes(pathname) || inlcudedLinks.includes(pathname)) && 'active',
      className,
    ]);

    const isDropdown = asDropdown || (href && href.length > 1);

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
              menuClass='dropdown-menu-right'
              buttonClass='btn-small p-0 nav-dropdown-button'
              buttonContent={(
                <a className='nav-link'>
                  <ItemContent />
                </a>
              )}
            >
              {href.map(link => {
                if (typeof link === 'string') {
                  return (
                    <Dropdown.Item key={link} href={link} className={link === pathname ? 'active' : ''}>
                      {hrefAsString(link)}
                    </Dropdown.Item>
                  );
                } else {
                  const { text, uri } = link;
                  return (
                    <Dropdown.Item key={text} href={uri} className={uri === pathname ? 'active' : ''}>
                      {text}
                    </Dropdown.Item>
                  );
                }
              })}
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

import React from 'react';
import { connect } from 'redux-bundler-react';

import Dropdown from 'app-components/dropdown';
import { classArray } from '../../utils';

const hrefAsString = href => {
  const str = href.replace('/', '');
  const words = str.split('-');
  const upperWords = words.map(word => word.substring(0, 1).toUpperCase() + word.substring(1));
  
  return upperWords.join(' ');
};

const NavItem = connect(
  'selectPathname',
  ({ pathname, href, children, icon, className, handler, isHidden }) => {
    const cls = classArray([
      'pointer',
      'nav-item',
      href && href.includes(pathname) && 'active',
      className,
    ]);

    const isDropdown = href && href.length > 1;

    const handleClick = (e) => {
      if (handler && typeof handler === 'function') handler(e);
    };

    const navClasses = classArray([
      'nav-link',
      'm-2',
    ]);

    return !isHidden ? (
      handler ? (
        <li className={cls} onClick={handleClick}>
          <span className={navClasses}>
            {icon}
            {children}
          </span>
        </li>
      ) : (
        <li className={cls}>
          {isDropdown ? (
            <Dropdown.Menu
              withToggleArrow={false}
              buttonClasses={['p-0']}
              buttonContent={(
                <a className={navClasses}>
                  {icon}
                  {children}
                </a>
              )}
            >
              {href.map(link => (
                <Dropdown.Item key={link} href={link}>
                  {hrefAsString(link)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          ) : (
            <a className={navClasses} href={href}>
              {icon}
              {children}
            </a>
          )}
        </li>
      )
    ) : null;
  }
);

export default NavItem;

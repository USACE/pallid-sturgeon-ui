import React from 'react';
import { connect } from 'redux-bundler-react';
import Icon from '../icon';

import { classArray } from '../../utils';

const NavItem = connect(
  'selectPathname',
  ({ pathname, href, children, hidden }) => {
    const cls = classArray([
      'pointer',
      'nav-item',
      href.includes(pathname) && 'active',
    ]);

    return !hidden ? (
      <li className={cls}>
        {(children === 'Home' || children === 'Map') &&
          (<a className='nav-link' href={href}>
            {children}
          </a>)}
        {children === 'Logout' &&
          (<a className='nav-link vl' href={href}>
            <Icon icon='logout'/>{children}
          </a>)}
        {children !== 'Home' && children !== 'Logout' && children !== 'Map' &&
         (<li class='nav-item dropdown'>
           <a class='nav-link' href='#' id='navbarDropdownMenuLink' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
             {children}
           </a>
           <div class='dropdown-menu' aria-labelledby='navbarDropdownMenuLink'>
             {href.map(function (object, i) {
               return <a class='dropdown-item' href={object}>{(object.charAt(1).toUpperCase() + object.slice(2)).split(/(?=[A-Z])/).join(' ')}</a>;
             })}
           </div>
         </li>)}
      </li>
    ) : null;
  }
);

export default NavItem;

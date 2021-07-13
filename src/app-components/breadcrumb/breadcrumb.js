import React from 'react';

import Icon from '../icon';

import './breadcrumb.scss';

const stringifyPathname = pathname => (
  pathname.charAt(1).toUpperCase() + pathname.slice(2).split(/(?=[A-Z])/).join(' ')
);

const Breadcrumb = ({
  home = true,
  pathname,
}) => (
  <div className='breadcrumb-container'>
    <nav aria-label='breadcrumb'>
      <ol className='breadcrumb-list'>
        {home && (
          <li className='breadcrumb-item'>
            <a href='/'>
              <Icon icon='home' className='pr-1' />
              Home
            </a>
          </li>
        )}
        <li className='breadcrumb-item active' aria-current='page'>
          {stringifyPathname(pathname)}
        </li>
      </ol>
    </nav>
  </div>
);

export default Breadcrumb;

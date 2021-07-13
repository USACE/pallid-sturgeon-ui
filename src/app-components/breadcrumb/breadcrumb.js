import React from 'react';

import Icon from '../icon';
import { hrefAsString } from 'utils';

import './breadcrumb.scss';

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
          {hrefAsString(pathname)}
        </li>
      </ol>
    </nav>
  </div>
);

export default Breadcrumb;

import React from 'react';

import Icon from '../icon';
import { hrefAsString } from 'utils';

import './breadcrumb.scss';

const Breadcrumb = ({
  home = true,
  pathname,
}) => {
  const paths = pathname.split('/');
  const pathLength = paths.length;

  return (
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
          {
            paths.map((p, i) => {
              if (!i || i === pathLength - 1) return null;
              return (
                <li className='breadcrumb-item' key={p}>
                  <a href={`/${p}`}>
                    {hrefAsString(p)}
                  </a>
                </li>
              );
            })
          }
          <li className='breadcrumb-item active' aria-current='page'>
            {hrefAsString(paths[pathLength - 1])}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;

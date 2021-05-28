import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import { classArray } from '../../utils';
import Icon from '../icon';

import './breadcrumb.scss';

const Breadcrumb = connect(
  'doAuthLogin',
  'selectAuthIsLoggedIn',
  'selectProjectsByRoute',
  'selectPathname',
  ({
    doAuthLogin,
    authIsLoggedIn,
    projectsByRoute: project,
    pathname,
  }) => {

    const breadcrumbClass = classArray([
      'breadcrumb',
    ]);

    return (
      <>
        {pathname != '/' && <div className={breadcrumbClass}>
          <nav aria-label='breadcrumb'>
            <ol class='breadcrumb'>
              <li class='breadcrumb-item'><a href='/'><Icon icon='home'/>Home</a></li>
              <li class='breadcrumb-item active' aria-current='page'>{(pathname.charAt(1).toUpperCase() + pathname.slice(2)).split(/(?=[A-Z])/).join(' ')}</li>
            </ol>
          </nav>
        </div>}
      </>
    );
  }
);

export default Breadcrumb;

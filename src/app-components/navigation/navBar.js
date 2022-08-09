import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Icon from '../icon';
import NavItem from './navItem';
import { classArray } from 'utils';
import RoleFilter from 'app-components/role-filter';

import './navigation.scss';

const dataSummaryLinks = [
  '/data-sheet',
  '/genetics-card-summary',
  '/search-reports',
  '/priority-fish',
  '/last-location',
  '/tag-replacement',
];

const administrationLinks = [
  '/data-query',
  '/multiple-record-approval',
  '/user-access-requests',
  '/edit-user',
];

const dataEntryLinks = [
  {
    uri: '/sites-list/create-new-site',
    text: 'Create New Site',
  },
  '/sites-list',
  '/find-data-sheet',
];

const utilityLinks = [
  '/error-log',
];

const NavBar = connect(
  'doAuthenticate',
  'selectAuthLoggedIn',
  'selectPathname',
  ({
    doAuthenticate,
    authLoggedIn,
    pathname,
  }) => {
    const [show, setShow] = useState(false);
    const isHome = pathname === '/';
    const navClasses = classArray([
      'navbar',
      'navbar-expand-lg',
      'navbar-light',
      'fixed-top-banner',
      'bg-white',
      !isHome && 'seperator',
    ]);

    const navCollapseClasses = classArray([
      'collapse',
      'navbar-collapse',
      show && 'show',
    ]);

    const toggleShow = () => setShow(!show);

    return (
      <nav className={navClasses}>
        <div className='navbar-brand'>
          <a href='/'>
            Pallid Sturgeon Population Assessment
          </a>
        </div>
        <button className='navbar-toggler' type='button' aria-expanded='false' aria-label='Toggle navigation' onClick={() => toggleShow()}>
          <span className='navbar-toggler-icon' />
        </button>
        <div className={navCollapseClasses}>
          <ul className='navbar-nav ml-auto'>
            {authLoggedIn ? (
              <RoleFilter
                allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER', 'READONLY']}>
                <NavItem href={['/']}>Home</NavItem>
                <NavItem href={dataSummaryLinks}>Data Summaries</NavItem>
                <RoleFilter
                  allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER']}>
                  <NavItem
                    href={dataEntryLinks}
                    inlcudedLinks={[
                      '/sites-list/create-new-site',
                      '/sites-list/edit-site',
                    ]}
                  >
                    Data Entry
                  </NavItem>
                </RoleFilter>
                <RoleFilter
                  allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER']}>
                  <NavItem href={['/data-upload']}>Data Upload</NavItem>
                </RoleFilter>
                <RoleFilter
                  allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER']}>
                  <NavItem href={utilityLinks} asDropdown>Utilities</NavItem>
                </RoleFilter>
                <RoleFilter
                  allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN']}>
                  <NavItem href={administrationLinks}>Admin</NavItem>
                </RoleFilter>
                <NavItem href={['/logout']} icon={<Icon icon='logout' />} className='vl'>Logout</NavItem>
              </RoleFilter>
            ) : (
              <NavItem handler={() => doAuthenticate()}>Login</NavItem>
            )}
          </ul>
        </div>
      </nav>
    );
  }
);

export default NavBar;

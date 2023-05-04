import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Dropdown from 'app-components/dropdown';
import Icon from '../icon';
import NavItem from './navItem';
import RoleFilter from 'app-components/role-filter';

import { classArray } from 'utils';
import { projectMap } from 'app-pages/data-entry/helpers';

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
  '/sites-list',
  '/find-data-sheet',
];

const utilityLinks = [
  '/error-log',
];

const NavBar = connect(
  'doAuthenticate',
  'selectAuthLoggedIn',
  'selectUserRole',
  'selectPathname',
  'selectUsersData',
  ({
    doAuthenticate,
    authLoggedIn,
    userRole,
    pathname,
    usersData,
  }) => {
    const [show, setShow] = useState(false);
    const isHome = pathname === '/';
    const user = userRole ? usersData.find(user => userRole.id === user.id) : {};

    const navClasses = classArray([
      'navbar',
      'navbar-expand-xl',
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
        <button 
          className='navbar-toggler' 
          type='button' 
          aria-expanded='false' 
          aria-label='Toggle navigation' 
          onClick={() => toggleShow()}
        >
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
                  allowRoles={['ADMINISTRATOR']}>
                  <NavItem href={administrationLinks}>Admin</NavItem>
                </RoleFilter>
                <li className='nav-item vl'>
                  <Dropdown.Menu
                    withToggleArrow={false}
                    menuClass='dropdown-menu-left'
                    buttonClass='btn-small p-0 nav-dropdown-button'
                    buttonContent={(
                      <span className='nav-link user'>
                        {userRole && (user.firstName + ' ' + user.lastName + ' (' + user.role + ')')}<br></br>
                        {userRole && (user.officeCode + ' - Project ' + user.projectCode + ' - ' + projectMap[userRole.projectCode])}
                        <>&nbsp;</>
                        <Icon icon='menu-down' />
                      </span>
                    )}
                  >
                    <Dropdown.Item href='/logout'><Icon icon='logout' /> Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </li>
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

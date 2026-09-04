import { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { mdiLogout, mdiMenu, mdiMenuDown } from '@mdi/js';

import Dropdown from '@components/dropdown';
import NavItem from './navItem';
import RoleFilter from '@components/role-filter';
import Icon from '@components/icon/icon';

import { classArray } from '@src/utils';
import { projectMap } from '@pages/data-entry/helpers';

import './navigation.scss';

const dataSummaryLinks = ['/data-sheet', '/genetics-card-summary', '/search-reports'];

const administrationLinks = ['/data-query', '/multiple-record-approval', '/user-access-requests', '/users'];

const dataEntryLinks = ['/sites-list', '/find-data-sheet'];

const NavBar = connect(
  'doAuthenticate',
  'selectAuthLoggedIn',
  'selectUserRole',
  'selectPathname',
  'selectUsersData',
  ({ doAuthenticate, authLoggedIn, userRole, pathname, usersData }) => {
    const [show, setShow] = useState(false);
    const isHome = pathname === '/';
    const user = userRole ? usersData.find((user) => userRole.id === user.id) : {};

    const navClasses = classArray([
      'navbar',
      'navbar-expand-xl',
      'navbar-light',
      'fixed-top-banner',
      !isHome && 'seperator',
    ]);

    const navCollapseClasses = classArray(['collapse', 'navbar-collapse', show && 'show']);

    const toggleShow = () => setShow(!show);

    return (
      <nav className={navClasses}>
        <div className='navbar-brand'>
          <a href='/'>Pallid Sturgeon Population Assessment</a>
        </div>
        <button
          className='navbar-hamburger-toggle-btn'
          type='button'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => toggleShow()}
        >
          <span>
            <Icon path={mdiMenu} size={'25px'} focusable={false} />
          </span>
        </button>
        <div className={navCollapseClasses}>
          <ul className='navbar-nav ml-auto'>
            {authLoggedIn ? (
              <RoleFilter allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER', 'READONLY']}>
                <NavItem href={['/']}>Home</NavItem>
                <NavItem href={dataSummaryLinks}>Data Summaries</NavItem>
                <RoleFilter allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER']}>
                  <NavItem
                    href={dataEntryLinks}
                    inlcudedLinks={['/sites-list/create-new-site', '/sites-list/edit-site']}
                  >
                    Data Entry
                  </NavItem>
                </RoleFilter>
                <RoleFilter allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER']}>
                  <NavItem href={['/data-upload']}>Data Upload</NavItem>
                </RoleFilter>
                {/* <RoleFilter allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER']}>
                  <NavItem href={utilityLinks} asDropdown>
                    Utilities
                  </NavItem>
                </RoleFilter> */}
                <RoleFilter allowRoles={['ADMINISTRATOR']}>
                  <NavItem href={administrationLinks}>Admin</NavItem>
                </RoleFilter>
                <li className='nav-item vl'>
                  <Dropdown.Menu
                    withToggleArrow={false}
                    menuClass='dropdown-menu-left'
                    buttonClass='btn-small p-0 nav-dropdown-button'
                    buttonContent={
                      <span className='nav-link user'>
                        {user &&
                          Object.keys(user).length > 0 &&
                          user.firstName + ' ' + user.lastName + ' (' + user.role + ')'}
                        <br></br>
                        {user &&
                          Object.keys(user).length > 0 &&
                          user.officeCode + ' - Project ' + user.projectCode + ' - ' + projectMap[userRole.projectCode]}
                        <>&nbsp;</>
                        <Icon path={mdiMenuDown} />
                      </span>
                    }
                  >
                    <Dropdown.Item href='/logout'>
                      <Icon path={mdiLogout} /> Logout
                    </Dropdown.Item>
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

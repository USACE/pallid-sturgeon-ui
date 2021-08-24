import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Icon from '../icon';
import NavItem from './navItem';
import { classArray } from '../../utils';

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
  '/multiple-check-by',
  '/multiple-record-approval',
  '/user-access-requests',
];

const dataEntryLinks = [
  '/sites-list',
  '/find-data-sheet',
];

const utilityLinks = [
  '/error-log',
];

const NavBar = connect(
  'doAuthLogin',
  'selectAuthIsLoggedIn',
  'selectPathname',
  ({
    doAuthLogin,
    authIsLoggedIn,
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
            Pallid Sturgeon Poulation Assessment
          </a>
        </div>
        <button className='navbar-toggler' type='button' aria-expanded='false' aria-label='Toggle navigation' onClick={() => toggleShow()}>
          <span className='navbar-toggler-icon' />
        </button>
        <div className={navCollapseClasses}>
          <ul className='navbar-nav ml-auto'>
            {/* {authIsLoggedIn ? ( */}
            <>
              <NavItem href={['/']}>Home</NavItem>
              <NavItem href={dataSummaryLinks}>Data Summaries</NavItem>
              <NavItem href={dataEntryLinks}>Data Entry</NavItem>
              <NavItem href={['/data-upload']}>Data Upload</NavItem>
              <NavItem href={utilityLinks} asDropdown>Utilities</NavItem>
              <NavItem href={administrationLinks}>Admin</NavItem>
              <NavItem href={['/logout']} icon={<Icon icon='logout' />} className='vl'>Logout</NavItem>
            </>
            {/* ) : (
              <NavItem handler={() => doAuthLogin()}>Login</NavItem>
            )} */}
          </ul>
        </div>
      </nav>
    );
  }
);

export default NavBar;

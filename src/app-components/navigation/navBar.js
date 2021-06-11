import React from 'react';
import { connect } from 'redux-bundler-react';

import Icon from '../icon';
import NavItem from './navItem';
import { classArray } from '../../utils';

import './navigation.scss';

const dataSummaryLinks = [
  '/missouri-river-data-sheet',
  '/fish-data-sheet',
  '/supplemental-data-sheet',
  '/genetic-card',
];

const dataEntryLinks = [
  '/sites-list',
  '/site-search',
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
    const navClass = classArray([
      'navbar',
      'navbar-expand-lg',
      'navbar-light',
      'fixed-top-banner',
      'bg-white',
    ]);

    return (
      <nav className={navClass}>
        <div className='navbar-brand'>
          <strong>
            <a href='/' className='text-dark'>
              Pallid Sturgeon Poulation Assessment
            </a>
          </strong>
        </div>
        <div className='collapse navbar-collapse'>
          <ul className='navbar-nav ml-auto'>
            {authIsLoggedIn ? (
              <>
                <NavItem href={['/']}>Home</NavItem>
                <NavItem href={dataSummaryLinks}>Data Summaries</NavItem>
                <NavItem href={dataEntryLinks}>Data Entry</NavItem>
                <NavItem href={['/dataUpload']}>Data Upload</NavItem>
                <NavItem href={['/map']}>Map</NavItem>
                {/* <NavItem href={['/profile']}>Administration</NavItem> */}
                <NavItem href={['/logout']} icon={<Icon icon='logout' />} className='vl'>Logout</NavItem>
              </>
            ) : (
              <NavItem handler={() => doAuthLogin()}>Login</NavItem>
            )}
          </ul>

        </div>
      </nav>
    );
  }
);

export default NavBar;

import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Dropdown from '../dropdown';
import Icon from '../icon';
import NavItem from './navItem';
// import RoleFilter from '../role-filter';
import { classArray } from '../../utils';

import './navigation.scss';

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
      <>
        <nav className={navClass}>
          <span className='navbar-brand'>
            <strong>
              <a href='/' className='text-dark'>
                Pallid Sturgeon Poulation Assessment
              </a>
            </strong>
          </span>
          <button
            className='navbar-toggler'
            type='button'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon' />
          </button>

          <div className='collapse navbar-collapse'>
            <ul className='navbar-nav mr-auto' />
            {authIsLoggedIn && (<ul className='navbar-nav'>
              <NavItem href={['/']}>Home</NavItem>
              <NavItem href={['/missouriRiverDataSheet', '/fishDataSheet', '/supplementalDataSheet', '/geneticCard']}>Data Summaries</NavItem>
              <NavItem href={['/sitesList', '/siteSearch', '/errorLog']}>Data Entry</NavItem>
              <NavItem href={['/dataUpload']}>Data Upload</NavItem>
              <NavItem href={['/map']}>Map</NavItem>
              <NavItem href={['/profile']}>Administration</NavItem>
              <NavItem href={['/logout']}>Logout</NavItem>
            </ul>)}
          </div>
        </nav>
      </>
    );
  }
);

export default NavBar;

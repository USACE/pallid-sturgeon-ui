import React from 'react';
import { connect } from 'redux-bundler-react';

import Hero from 'app-components/hero';
import Accounts from './components/accounts/accounts';
import HomeReports from './components/homeReports/homeReports';

const Home = connect(
  'selectAuthData',
  'selectAuthRoles',
  'selectUserRole',
  ({
    authData,
    authRoles,
    userRole,
  }) => (
    <>
      <Hero />
      {(!userRole && authRoles.length > 1) && (
        <Accounts accounts={authRoles} />
      )}
      {userRole && (<>
        {/* @TODO: Remove text */}
        <p className='user-text'>Logged in as: <b>{authData ? authData.name : ''}</b></p>
        <p className='role-text'>({ authRoles && userRole ? authRoles[0].role + ' - ' + userRole.officeCode + ' - Project ' + userRole.projectCode : ''})</p>
        {/* <p className='role-text'>({ userRole ? userRole.officeCode : ''})</p> */}
        <HomeReports />
      </>)}
    </>
  )
);

export default Home;

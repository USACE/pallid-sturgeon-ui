import React from 'react';
import { connect } from 'redux-bundler-react';

import Hero from 'app-components/hero';
import Accounts from './components/accounts/accounts';
import HomeReports from './components/homeReports/homeReports';

const Home = connect(
  'selectAuthRoles',
  'selectUserRole',
  ({
    authRoles,
    userRole,
  }) => (
    <>
      <Hero />
      {((!userRole && authRoles) && (authRoles.length > 1)) && (
        <Accounts accounts={authRoles} />
      )}
      {userRole && (<HomeReports />)}
    </>
  )
);

export default Home;

import React from 'react';
import { connect } from 'redux-bundler-react';

import Hero from 'app-components/hero';
import Accounts from './components/accounts/accounts';
import HomeReports from './components/homeReports/homeReports';
import RoleFilter from 'app-components/role-filter';
import RoleRequestSentMessage from 'app-components/role-request-sent';

const Home = connect(
  'selectAuthRoles',
  'selectUserRole',
  ({
    authRoles,
    userRole,
  }) => {
    console.log('userRole: ', userRole);
    return (
      <>
        <RoleFilter
          allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER', 'READONLY']}
        >
          <Hero />
        </RoleFilter>
        {/* {((!userRole && authRoles) && (authRoles.length > 1)) && (
          <>
            <Accounts accounts={authRoles} />
          </>
        )} */}
        {/* {(authRoles && authRoles.length > 0) ? (
          <>
            <Accounts accounts={authRoles} />
          </>
        ) : (

        )} */}
      </>
    );}
);

export default Home;

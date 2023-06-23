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
    const getAccountView = () => {
      if (!userRole) {
        if (authRoles && authRoles.length > 0) {
          // Multiple accounts
          return (
            <>
              <Accounts accounts={authRoles} />;
            </>
          );
        } else {
          // New accounts
          return (
            <RoleFilter
              allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER', 'READONLY']}
              alt={() => <RoleRequestSentMessage className='p-2' />}>
              <Hero />
              <HomeReports />
            </RoleFilter>
          );
        }
      } else {
        // Single accounts
        return (
          <RoleFilter
            allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER', 'READONLY']}
            alt={() => <RoleRequestSentMessage className='p-2' />}>
            <Hero />
            <HomeReports />
          </RoleFilter>
        );
      }
    };

    return (
      <>
        {getAccountView()}
      </>
    );}
);

export default Home;

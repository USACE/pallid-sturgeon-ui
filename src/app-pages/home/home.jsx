import React from 'react';
import { connect } from 'redux-bundler-react';

import Hero from '@components/hero';
import Accounts from './components/accounts/accounts';
import HomeReports from './components/homeReports/homeReports';
import RoleFilter from '@components/role-filter';
import RoleRequestSentMessage from '@components/role-request-sent';
import { usePwaMode } from '../data-entry/offline/pwa-mode';
import OfflineSetupButton from '../data-entry/offline/initiate-offline-setup/OfflineSetupButton';

const Home = connect('selectAuthRoles', 'selectUserRole', ({ authRoles, userRole }) => {
  const pwaMode = usePwaMode();

  // install PWA home
  if (pwaMode && userRole) {
    return (
      <RoleFilter
        allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER', 'READONLY']}
        alt={() => <RoleRequestSentMessage className='p-2' />}
      >
        <Hero />
        <div className='container d-flex justify-content-center align-items-center' style={{ minHeight: '300px' }}>
          <div className='text-center'>
            <h3>Offline Field Setup</h3>
            <p>Download data needed before starting field data collection</p>
            <OfflineSetupButton />
          </div>
        </div>
      </RoleFilter>
    );
  }

  const getAccountView = () => {
    if (!userRole) {
      if (authRoles && authRoles.length > 0) {
        // Multiple accounts
        return (
          <>
            <Accounts accounts={authRoles} />;
          </>
        );
      }
      return (
        <RoleFilter
          allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER', 'READONLY']}
          alt={() => <RoleRequestSentMessage className='p-2' />}
        >
          <Hero />
          <HomeReports />
        </RoleFilter>
      );
    }

    // Single accounts
    return (
      <RoleFilter
        allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER', 'READONLY']}
        alt={() => <RoleRequestSentMessage className='p-2' />}
      >
        <Hero />
        <HomeReports />
      </RoleFilter>
    );
  };

  return <>{getAccountView()}</>;
});

export default Home;

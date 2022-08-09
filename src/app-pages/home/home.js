import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Accordion from 'app-components/accordion';
import Hero from 'app-components/hero';
import UsgNoVialNumbersTable from './tables/usgNoVialNumberTable';
import UncheckedDataTable from './tables/uncheckedDataTable';
import OfficeErrorLogTable from './tables/officeErrorLog';
import RoleFilter from 'app-components/role-filter';

const Home = connect(
  'doHomeFetch',
  ({
    doHomeFetch,
  }) => {
    useEffect(() => {
      doHomeFetch();
    }, [doHomeFetch]);

    return (
      <RoleFilter
        allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER', 'READONLY']}
        alt={() => <RoleRequestSentMessage className='p-2' />}>
        <Hero />
        <div className='container pt-4'>
          <Accordion.List>
            <RoleFilter allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER']}>
              <Accordion.Item headingText='USG Species with No Vial Number'>
                <UsgNoVialNumbersTable />
              </Accordion.Item>
            </RoleFilter>
            <RoleFilter allowRoles={['OFFICE ADMIN']}>
              <Accordion.Item headingText='Unchecked Data Sheet Records'>
                <UncheckedDataTable />
              </Accordion.Item>
            </RoleFilter>
            <RoleFilter allowRoles={['OFFICE ADMIN', 'OFFICE USER']}>
              <Accordion.Item headingText='Office Error Log'>
                <OfficeErrorLogTable />
              </Accordion.Item>
            </RoleFilter>
          </Accordion.List>
        </div>
      </RoleFilter>
    );
  }
);

export default Home;

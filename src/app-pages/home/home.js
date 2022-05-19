import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Accordion from 'app-components/accordion';
import Hero from 'app-components/hero';
import UsgNoVialNumbersTable from './tables/usgNoVialNumberTable';
import UncheckedDataTable from './tables/uncheckedDataTable';
import RoleFilter from 'app-components/role-filter';
import RoleRequestSentMessage from 'app-components/role-request-sent';

const Home = connect(
  'doHomeFetch',
  'selectErrorLog',
  ({
    doHomeFetch,
    errorLog,
  }) => {
    useEffect(() => {
      doHomeFetch();
    }, [doHomeFetch]);

    return (
      <RoleFilter
        allowRoles={['ADMINISTRATOR']}
        alt={() => <RoleRequestSentMessage className='p-2' />}
      >
        <Hero />
        <div className='container pt-4'>
          <Accordion.List>
            <Accordion.Item headingText='USG Species with No Vial Number'>
              <UsgNoVialNumbersTable />
            </Accordion.Item>
            <Accordion.Item headingText='Unchecked Data Sheet Records'>
              <UncheckedDataTable />
            </Accordion.Item>
            <Accordion.Item headingText='Office Error Log'>
              {errorLog && errorLog.data.length ? errorLog.data : 'No Errors at this time.'}
            </Accordion.Item>
          </Accordion.List>
        </div>
      </RoleFilter>
    );
  }
);

export default Home;

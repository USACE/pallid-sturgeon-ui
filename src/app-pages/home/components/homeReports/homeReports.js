import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Accordion from 'app-components/accordion';
import BafiDataTable from 'app-pages/home/tables/bafiDataTable';
import OfficeErrorLogTable from 'app-pages/home/tables/officeErrorLog';
import RoleFilter from 'app-components/role-filter';
import RoleRequestSentMessage from 'app-components/role-request-sent';
import UnapprovedDataTable from 'app-pages/home/tables/unapprovedDataTable';
import UncheckedDataTable from 'app-pages/home/tables/uncheckedDataTable';
import UsgNoVialNumbersTable from 'app-pages/home/tables/usgNoVialNumberTable';

const HomeReports = connect(
  'doHomeFetch',
  ({
    doHomeFetch,
  }) => {
    useEffect(() => {
      doHomeFetch();
    }, [doHomeFetch]);

    return (
      <RoleFilter
        allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER', 'READONLY', '']}
        alt={() => <RoleRequestSentMessage className='p-2' />}>
        <div className='container pt-4'>
          <Accordion.List>
            <RoleFilter allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN', 'OFFICE USER']}>
              <Accordion.Item headingText='USG Species with No Vial Number'>
                <UsgNoVialNumbersTable />
              </Accordion.Item>
            </RoleFilter>
            <RoleFilter allowRoles={['ADMINISTRATOR']}>
              <Accordion.Item headingText='Datasheet Records for Approval'>
                <UnapprovedDataTable />
              </Accordion.Item>
            </RoleFilter>
            <RoleFilter allowRoles={['ADMINISTRATOR', 'OFFICE USER']}>
              <Accordion.Item headingText='BAFI Datasheets'>
                <BafiDataTable />
              </Accordion.Item>
            </RoleFilter>
            <RoleFilter allowRoles={['OFFICE ADMIN', 'OFFICE USER']}>
              <Accordion.Item headingText='Office Error Log'>
                <OfficeErrorLogTable />
              </Accordion.Item>
            </RoleFilter>
            <RoleFilter allowRoles={['OFFICE ADMIN']}>
              <Accordion.Item headingText='Unchecked Data Sheet Records'>
                <UncheckedDataTable />
              </Accordion.Item>
            </RoleFilter>
          </Accordion.List>
        </div>
      </RoleFilter>
    );
  }
);

export default HomeReports;
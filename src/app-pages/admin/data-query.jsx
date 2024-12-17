import { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload, mdiHelpCircle } from '@mdi/js';

import Button from '@components/button';
import Card from '@components/card';
import Select from '@components/select';
import RoleFilter from '@components/role-filter';
import Icon from '@components/icon/icon';

import { dropdownYearsToNow } from '@src/utils';
import { dataQueries, NoRoleAccessMessage } from './helper';
import { createDropdownOptions } from '@pages/data-entry/helpers';

export default connect('doDomainProjectsFetch', 'selectDomains', ({ doDomainProjectsFetch, domains }) => {
  useEffect(() => {
    doDomainProjectsFetch();
  }, []);

  const { projects } = domains;

  return (
    <RoleFilter allowRoles={['ADMINISTRATOR', 'OFFICE ADMIN']} alt={() => <NoRoleAccessMessage className='p-2' />}>
      <div className='container-fluid'>
        <h4>Data Query</h4>
        <Card className='mt-3'>
          <Card.Header text='Filters' />
          <Card.Body>
            <Icon path={mdiHelpCircle} />
            <span className='info-message ml-2'>
              Click the "Export as CSV" link at the top of the report to download the query results for the year and
              filters selected. The displayed report below only shows a portion of the fields that are included in the
              downloaded report.
            </span>
            <div className='row mt-3'>
              <div className='col-md-4 col-xs-8'>
                <Select label='Select Query:' options={dataQueries} />
              </div>
              <div className='col-2'>
                <Select label='Select Year:' options={dropdownYearsToNow(2002)} />
              </div>
              <div className='col-md-6 col-xs-12'>
                <Select label='Select Project:' options={createDropdownOptions(projects)} />
              </div>
            </div>
            <div className='mt-2'>
              <Button
                isOutline
                variant='info'
                size='small'
                className='mr-2'
                text='Apply Filters'
                // handleClick={() => doDatasheetFetch()}
              />
              <Button
                isOutline
                variant='secondary'
                size='small'
                text='Clear All Filters'
                // handleClick={() => clearAllFilters()}
              />
            </div>
          </Card.Body>
        </Card>
        <Card className='mt-3'>
          <Card.Header text='Query Results' />
          <Card.Body>
            <Button
              isOutline
              size='small'
              variant='info'
              text='Export as CSV'
              icon={<Icon path={mdiDownload} />}
              // handleClick={() => doFetchAllGeneticCardSummary('genetic-card-summary')}
            />
            <div className='ag-theme-balham mt-3' style={{ width: '100%', height: '600px' }}>
              <AgGridReact
                // rowData={geneticCardSummaryData}
                defaultColDef={{
                  width: 125,
                }}
              ></AgGridReact>
            </div>
          </Card.Body>
        </Card>
      </div>
    </RoleFilter>
  );
});

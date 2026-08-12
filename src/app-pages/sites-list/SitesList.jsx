import { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import SitesListFilter from './SitesListFilters';
import SitesListTable from './sites-list-table/SitesListTable';
import Breadcrumb from '@src/app-components/breadcrumb';
import Pagination from '@components/pagination';
import Card from '@src/app-components/card';
import { usePwaMode } from '../data-entry/offline/pwa-mode';

import './sitesList.scss';

const breadcrumbLinks = [
  {
    text: 'Sites List',
    current: true,
  },
];

const SitesList = connect(
  'doDomainBendsFetch',
  'doDataEntryLoadData',
  'doDomainFieldOfficesFetch',
  'doDomainSeasonsFetch',
  'doDomainSegmentsFetch',
  'doSetSitesPagination',
  'selectSitesTotalResults',
  ({
    doDomainBendsFetch,
    doDataEntryLoadData,
    doDomainFieldOfficesFetch,
    doDomainSeasonsFetch,
    doDomainSegmentsFetch,
    doSetSitesPagination,
    sitesTotalResults,
    office,
    project,
  }) => {
    // Load data
    useEffect(() => {
      doDataEntryLoadData();
      doDomainFieldOfficesFetch();
      doDomainSegmentsFetch({ office, project });
      doDomainSeasonsFetch();
      doDomainBendsFetch();
    }, []);

    return (
      <div className='container-fluid'>
        <Breadcrumb paths={breadcrumbLinks} />
        <SitesListFilter />
        <Card>
          <Card.Header text='Sites List' />
          <Card.Body>
            <SitesListTable />
            <Pagination
              className='margin-top-2'
              itemCount={sitesTotalResults}
              defaultItemsPerPage={20}
              handlePageChange={(pageNumber, pageSize) => doSetSitesPagination({ pageNumber, pageSize })}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default SitesList;

import { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import SitesListFilter from './SitesListFilters';
import SitesListTable from './sites-list-table/SitesListTable';
import Breadcrumb from '@src/app-components/breadcrumb';
import Pagination from '@components/pagination';
import Card from '@src/app-components/card';

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
  'doDomainSeasonsFetch',
  'doDomainSegmentsFetch',
  'doSetSitesPagination',
  'selectSitesTotalResults',
  ({
    doDomainBendsFetch,
    doDataEntryLoadData,
    doDomainSeasonsFetch,
    doDomainSegmentsFetch,
    doSetSitesPagination,
    sitesTotalResults,
  }) => {
    // Load data
    useEffect(() => {
      doDataEntryLoadData();
      doDomainSegmentsFetch();
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
              className='mt-3'
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

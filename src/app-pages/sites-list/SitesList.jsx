import { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import SitesListFilter from './SitesListFilters';
import SitesListTable from './sites-list-table/SitesListTable';
import Breadcrumb from '@src/app-components/breadcrumb';
import Pagination from '@components/pagination';
import Card from '@src/app-components/card';
import { usePwaMode } from '../data-entry/offline/pwa-mode';
import { getCurrentFieldStudyYear } from '../data-entry/offline/lookup-cache';

import './sitesList.scss';

const breadcrumbLinks = [
  {
    text: 'Sites List',
    current: true,
  },
];

const SitesList = connect(
  'doSitesLoadData',
  'doDomainBendsFetch',
  'doDataEntryLoadData',
  'doDomainFieldOfficesFetch',
  'doDomainSeasonsFetch',
  'doDomainSegmentsFetch',
  'doSetSitesPagination',
  'selectSitesTotalResults',
  ({
    doSitesLoadData,
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
    const pwaMode = usePwaMode();
    const fieldStudyYear = getCurrentFieldStudyYear();

    // Load data
    useEffect(() => {
      doSitesLoadData();
      // doDataEntryLoadData();

      if (navigator.onLine) {
        doDataEntryLoadData();
        doDomainFieldOfficesFetch();
        doDomainSegmentsFetch({ office, project });
        doDomainSeasonsFetch();
        doDomainBendsFetch();
      }
    }, []);

    return (
      <div className='container-fluid'>
        <Breadcrumb paths={breadcrumbLinks} />
        {!pwaMode && <SitesListFilter />}
        {pwaMode && (
          <div className='margin-bottom-2'>
            <strong>Field Study Year: {fieldStudyYear}</strong>
          </div>
        )}
        <Card>
          <Card.Header text='Sites List' />
          <Card.Body>
            <SitesListTable />
            {!pwaMode && (
              <Pagination
                className='margin-top-2'
                itemCount={sitesTotalResults}
                defaultItemsPerPage={20}
                handlePageChange={(pageNumber, pageSize) => doSetSitesPagination({ pageNumber, pageSize })}
              />
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default SitesList;

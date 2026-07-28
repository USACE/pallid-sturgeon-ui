import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import SitesListFilter from './SitesListFilters';
import SitesListTable from './sites-list-table/SitesListTable';
import Breadcrumb from '@src/app-components/breadcrumb';
import Pagination from '@components/pagination';
import Card from '@src/app-components/card';

import { Alert } from '@trussworks/react-uswds';
import { downloadLookupsForOffline } from '../data-entry/offline/lookup-cache';

import './sitesList.scss';
import LoaderButton from '@src/app-components/loader/LoaderButton';

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
  'selectAuth',
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
    auth,
  }) => {
    const [lookupDownloadStatus, setLookupDownloadStatus] = useState(null);
    const [lookupDownloading, setLookupDownloading] = useState(false);

    const handleDownloadLookups = async () => {
      setLookupDownloading(true);
      setLookupDownloadStatus(null);

      try {
        const result = await downloadLookupsForOffline(auth?.token);

        setLookupDownloadStatus({
          type: 'success',
          message: `Offline lookups downloaded successfully. Saved ${result.count ?? 0} lookup rows.`,
        });
      } catch (error) {
        console.error('Lookup download failed:', error);

        setLookupDownloadStatus({
          type: 'error',
          message:
            'Lookup API worked, but saving to IndexedDB failed. Check db.ts schema/version and IndexedDB stores.',
        });
      } finally {
        setLookupDownloading(false);
      }
    };
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
          <div className='margin-top-2 margin-bottom-1'>
            <LoaderButton
              className='margin-left-2 primary-btn'
              disabled={lookupDownloading}
              isLoading={lookupDownloading}
              onClick={handleDownloadLookups}
              type='button'
            >
              <span className='text-bold'>Download Offline Lookups</span>
            </LoaderButton>
            {lookupDownloadStatus && (
              <div className='margin-top-1'>
                <Alert type={lookupDownloadStatus.type} headingLevel='h4' slim>
                  {lookupDownloadStatus.message}
                </Alert>
              </div>
            )}
          </div>
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

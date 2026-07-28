import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import SitesListFilter from './SitesListFilters';
import SitesListTable from './sites-list-table/SitesListTable';
import Breadcrumb from '@src/app-components/breadcrumb';
import Pagination from '@components/pagination';
import Card from '@src/app-components/card';

import { Button, Alert } from '@trussworks/react-uswds';
import { downloadLookupsForOffline } from '../data-entry/offline/lookup-cache';

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
          <div className='mt-3 mb-3'>
            <Button type='button' onClick={handleDownloadLookups} disabled={lookupDownloading}>
              {lookupDownloading ? 'Downloading Lookups...' : 'Download Offline Lookups'}
            </Button>
            {lookupDownloadStatus && (
              <div className='mt-2'>
                <Alert type={lookupDownloadStatus.type} headingLevel='h4' slim>
                  {lookupDownloadStatus.message}
                </Alert>
              </div>
            )}
          </div>
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

import { useState } from 'react';
import { connect } from 'redux-bundler-react';
import Card from '@src/app-components/card';
import DataHeader from '../components/data-header/dataHeader';
import TabContainer from '@src/app-components/tab';
// import TelemetryDsTable from '../tables/telemetryDsTable';
import TelemetryDataEntry from '../tables/telemetry/TelemetryDataEntry';
import Breadcrumb from '@src/app-components/breadcrumb';
import { Button, Alert } from '@trussworks/react-uswds';
import { downloadLookupsForOffline } from '../../offline/lookup-cache';

import SearchEffortDataEntryForm from '../../edit-data-sheet/forms/search-effort/SearchEffortDataEntryForm';
import '../../../data-summaries/data-summary.scss';

const SearchEffortOverview = connect(
  'doUpdateCurrentTab',
  'selectDataEntryData',
  'selectDataEntryTelemetryTotalCount',
  'selectCurrentTab',
  'selectRouteParams',
  'selectIsEditForm',
  'selectAuth',
  ({ doUpdateCurrentTab, dataEntryData, dataEntryTelemetryTotalCount, currentTab, routeParams, isEditForm, auth }) => {
    const siteId = routeParams?.siteId;
    const seId = routeParams?.seId;
    const [lookupDownloadStatus, setLookupDownloadStatus] = useState(null);
    const [lookupDownloading, setLookupDownloading] = useState(false);

    const breadcrumbLinks = [
      { text: 'Sites List', href: '/sites-list', current: false },
      { text: siteId, href: `/sites-list/${siteId}`, current: false },
      { text: `Search Effort - ${seId ? seId : 'Create'}`, current: true },
    ];

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

    return (
      <div className='container-fluid'>
        <Breadcrumb paths={breadcrumbLinks} />

        <div className='row'>
          <div className='col-9'>
            <h4>{isEditForm ? '' : 'Create'} Search Effort Datasheet</h4>
          </div>
        </div>

        {/* Top Level Info */}
        <DataHeader type='search-effort' />

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

        {/* Form */}
        <Card className='mt-3'>
          <Card.Header text='Search Effort and Related Data' />
          <Card.Body>
            <p>
              Select any tab to view Search Effort and Telemetry datasheet data for Search Effort ID:{' '}
              {dataEntryData?.seId}
            </p>

            <TabContainer
              tabs={[
                {
                  title: 'Search Effort',
                  content: <SearchEffortDataEntryForm />,
                },
                {
                  title: `Telemetry (${dataEntryTelemetryTotalCount})`,
                  content: <TelemetryDataEntry />,
                },
              ]}
              onTabChange={(_str, ind) => doUpdateCurrentTab(ind)}
              defaultTab={currentTab}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default SearchEffortOverview;

import { connect } from 'redux-bundler-react';
import Card from '@src/app-components/card';
import DataHeader from '../components/data-header/dataHeader';
import TabContainer from '@src/app-components/tab';
import TelemetryDataEntry from '../tables/telemetry/TelemetryDataEntry';
import Breadcrumb from '@src/app-components/breadcrumb';

import SearchEffortDataEntryForm from '../../edit-data-sheet/forms/search-effort/SearchEffortDataEntryForm';
import Approval from '../components/approval/approval';
import { isOnline } from '../../offline/sync';

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
    const online = isOnline();
    const searchDraftKey = `currentSearchEffortDraft:${siteId}`;
    const savedSearchDraft = sessionStorage.getItem(searchDraftKey);
    const searchSaved = Boolean(seId) || Boolean(savedSearchDraft);

    const breadcrumbLinks = [
      { text: 'Sites List', href: '/sites-list', current: false },
      { text: siteId, href: `/sites-list/${siteId}`, current: false },
      { text: `Search Effort - ${seId ? seId : 'Create'}`, current: true },
    ];

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

        {/* Approval Fields */}
        {online && <Approval />}

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
                ...(searchSaved
                  ? [
                      {
                        title: `Telemetry (${dataEntryTelemetryTotalCount})`,
                        content: <TelemetryDataEntry />,
                      },
                    ]
                  : []),
              ]}
              onTabChange={(_str, ind) => {
                if (ind === 1 && !searchSaved) return;
                doUpdateCurrentTab(ind);
              }}
              defaultTab={searchSaved ? currentTab : 0}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default SearchEffortOverview;

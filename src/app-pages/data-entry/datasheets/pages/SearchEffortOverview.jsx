import { connect } from 'redux-bundler-react';
import Card from '@src/app-components/card';
import DataHeader from '../components/dataHeader';
import TabContainer from '@src/app-components/tab';
// import TelemetryDsTable from '../tables/telemetryDsTable';
import TelemetryDataEntry from '../tables/telemetry/TelemetryDataEntry';
import Breadcrumb from '@src/app-components/breadcrumb';

import SearchEffortDataEntryForm from '../../edit-data-sheet/forms/search-effort/SearchEffortDataEntryForm';
import '../../../data-summaries/data-summary.scss';

const SearchEffortOverview = connect(
  'doUpdateCurrentTab',
  'selectDataEntryData',
  'selectDataEntryTelemetryTotalCount',
  'selectCurrentTab',
  'selectRouteParams',
  'selectIsEditForm',
  ({ doUpdateCurrentTab, dataEntryData, dataEntryTelemetryTotalCount, currentTab, routeParams, isEditForm }) => {
    const siteId = routeParams?.siteId;
    const seId = routeParams?.seId;

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
            <h4>
              {isEditForm ? '' : 'Create'} Search Effort Datasheet {isEditForm ? `Overview (ID: ${seId})` : ''}
            </h4>
          </div>
        </div>

        {/* Top Level Info */}
        <DataHeader />

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

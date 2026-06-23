import { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from '@components/card';
import DataHeader from '@pages/data-entry/datasheets/components/dataHeader';
import Approval from '@pages/data-entry/datasheets/components/approval';
import TabContainer from '@components/tab';
import Breadcrumb from '@src/app-components/breadcrumb';
import MissouriRiverDataEntryForm from '../../edit-data-sheet/forms/missouri-river/MissouriRiverDataEntryForm';
import FishDataEntry from '../tables/fish/FishDataEntry';

import '../../../data-summaries/data-summary.scss';

const MissouriRiverOverview = connect(
  'doUpdateCurrentTab',
  'selectDataEntryData',
  'selectDataEntryFishTotalCount',
  'selectDataEntrySupplementalTotalCount',
  'selectDataEntryProcedureTotalCount',
  'selectCurrentTab',
  'selectRouteParams',
  'selectIsEditForm',
  ({
    doUpdateCurrentTab,
    dataEntryData,
    dataEntryFishTotalCount,
    dataEntrySupplementalTotalCount,
    dataEntryProcedureTotalCount,
    currentTab,
    routeParams,
    isEditForm,
  }) => {
    const [isAddSuppRow, setIsAddSuppRow] = useState(false);
    const [suppRowId, setSuppRowId] = useState(null);

    const [isAddProcRow, setIsAddProcRow] = useState(false);
    const [procRowId, setProcRowId] = useState(null);

    const siteId = routeParams?.siteId;
    const mrId = routeParams.mrId;

    const breadcrumbLinks = [
      {
        text: 'Sites List',
        href: '/sites-list',
        current: false,
      },
      {
        text: siteId,
        href: `/sites-list/${siteId}`,
        current: false,
      },
      {
        text: `Missouri River - ${mrId ? mrId : 'Create'}`,
        current: true,
      },
    ];

    return (
      <div className='container-fluid'>
        <Breadcrumb paths={breadcrumbLinks} />
        <div className='row'>
          <div className='col-9'>
            <h4>{isEditForm ? '' : 'Create'} Missouri River Datasheet</h4>
          </div>
        </div>
        {/* Top Level Info */}
        <DataHeader type='missouri-river' />
        {/* Approval Fields */}
        <Approval />
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Missouri River and Related Data' />
          <Card.Body>
            <p>
              Select any tab to view Missouri River, Fish, Supplemental, and Procedure datasheet data for Missouri River
              ID: {dataEntryData?.mrId}
            </p>
            <TabContainer
              tabs={[
                {
                  title: 'Missouri River',
                  content: <MissouriRiverDataEntryForm />,
                },
                {
                  title: `Fish (${dataEntryFishTotalCount})`,
                  content: <FishDataEntry />,
                  isDisabled: !!!dataEntryData?.mrId, // Disable tab when no Missouri River data exists yet
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

export default MissouriRiverOverview;

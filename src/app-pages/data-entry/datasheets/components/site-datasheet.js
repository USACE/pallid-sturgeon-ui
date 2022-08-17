import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import Card from 'app-components/card';
import Button from 'app-components/button';
import TabContainer from 'app-components/tab/tabContainer';

import MissouriRiverTable from 'app-pages/data-summaries/datasheet/tables/missouriRiverTable';
import FishTable from 'app-pages/data-summaries/datasheet/tables/fishTable';
import SupplementalTable from 'app-pages/data-summaries/datasheet/tables/supplementalTable';
import ProcedureTable from 'app-pages/data-summaries/datasheet/tables/procedureTable';
import SearchTable from 'app-pages/data-summaries/datasheet/tables/searchTable';
import TelemetryTable from 'app-pages/data-summaries/datasheet/tables/telemetryTable';

const SiteDatasheet = connect(
  'doFetchSitesDatasheets',
  'doSetSitesDatasheetPagination',
  'doUpdateSitesDatasheetParams',
  'selectSitesDatasheetData',
  'selectSitesData',
  ({
    doFetchSitesDatasheets,
    doSetSitesDatasheetPagination,
    doUpdateSitesDatasheetParams,
    sitesDatasheetData,
    sitesData
  }) => {
    const [currentTab, setCurrentTab] = useState(0);

    const {
      siteId,
      siteYear,
      fieldOffice,
      project,
      segment,
      season,
      sampleUnitTypeCode,
      bendrn,
      bendRiverMile
    } = sitesData[0];

    const {
      missouriRiverData = {},
    } = sitesDatasheetData;

    useEffect(() => {
      const params = {
        tab: currentTab,
        siteId: siteId
      };
      doUpdateSitesDatasheetParams(params);
    }, [currentTab, doUpdateSitesDatasheetParams]);

    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-7'>
            <h4>Datasheets</h4>
          </div>
        </div>
        {/* Top Level Info */}
        <Card className='mb-3'>
          <Card.Body>
            <div className='row mt-2'>
              <div className='col-2'>
                <b className='mr-2'>Year:</b>
                {siteYear || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Field Office:</b>
                {fieldOffice || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Project:</b>
                {project || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Segment:</b>
                {segment || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Season:</b>
                {season || '--'}
              </div>
            </div>
            <hr />
            <div className='row mt-2'>
              <div className='col-2'>
                <b className='mr-2'>Sample Unit Type:</b>
                {sampleUnitTypeCode || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Sample Unit:</b>
                {'--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>R/N:</b>
                {bendrn || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Bend River Mile:</b>
                {bendRiverMile || '--'}
              </div>
            </div>
          </Card.Body>
        </Card>
        {/* Tab Container */}
        <Card>
          <Card.Header text='Datasheets' />
          <Card.Body>
            <TabContainer
              tabs={[
                {
                  title: 'Missouri River',
                  content: <>
                    <Button
                      isOutline
                      size='small'
                      variant='info'
                      text='Create Missouri River Datasheet'
                      title='Create Missouri River Datasheet'
                      className='float-right mr-2'
                    // handleClick={() => doDataEntrySetActiveType('fish')}
                    />
                    <MissouriRiverTable rowData={missouriRiverData.items} />
                  </>,
                }, {
                  title: 'Fish',
                  // content: <FishTable rowData={fishData.items} />,
                  isDisabled: true,
                }, {
                  title: 'Supplemental',
                  // content: <SupplementalTable rowData={suppData.items} />,
                  isDisabled: true,
                },
                {
                  title: 'Telemetry',
                  // content: <TelemetryTable rowData={telemetryData.items} />,
                  isDisabled: true,
                },
                {
                  title: 'Procedure',
                  // content: <ProcedureTable rowData={procedureData.items} />,
                  isDisabled: true,
                },
                {
                  title: 'Search Effort',
                  // content: <SearchTable rowData={searchData.items} />
                },
              ]}
              onTabChange={(_str, ind) => setCurrentTab(ind)}
            />
          </Card.Body>
        </Card>
      </div>
    );
  });

export default SiteDatasheet;

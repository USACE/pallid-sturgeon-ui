import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';
import TabContainer from 'app-components/tab/tabContainer';
import DataHeader from '../components/dataHeader';

import MissouriDsTable from '../tables/missouriDsTable';
import SearchDsTable from '../tables/searchDsTable';

const SiteDatasheet = connect(
  'doUpdateSitesDatasheetParams',
  'selectSitesDatasheetData',
  'selectSitesData',
  ({
    doUpdateSitesDatasheetParams,
    sitesDatasheetData,
    sitesData
  }) => {
    const [currentTab, setCurrentTab] = useState(0);

    console.log('sitedata: ', sitesData);
    const {
      siteId,
      year,
      fieldOfficeDescription,
      projectDescription,
      segmentDescription,
      seasonDescription,
      sampleUnitType,
      bend,
      bendrn,
      bendRiverMile
    } = sitesData[0];

    const {
      missouriRiverData = {},
      searchData = {},
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
        <DataHeader 
          type='Site'
          id={siteId} 
          year={year} 
          fieldOffice={fieldOfficeDescription}
          project={projectDescription}
          segment={segmentDescription}
          season={seasonDescription}
          sampleUnitType={sampleUnitType}
          sampleUnit={bend}
          bendrn={bendrn}
          bendRiverMile={bendRiverMile}
        />
        {/* Tab Container */}
        <Card>
          <Card.Header text='Datasheets' />
          <Card.Body>
            <TabContainer
              tabs={[
                {
                  title: `Missouri River (${missouriRiverData.totalCount ? missouriRiverData.totalCount : '0'})`,
                  content: <MissouriDsTable rowData={missouriRiverData.items} />,
                },
                {
                  title: `Search Effort (${searchData.totalCount ? searchData.totalCount : '0'})`,
                  content: <SearchDsTable rowData={searchData.items} />
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

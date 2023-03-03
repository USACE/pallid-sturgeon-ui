import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';
import TabContainer from 'app-components/tab/tabContainer';
import DataHeader from '../components/dataHeader';

import MissouriDsTable from '../tables/missouriDsTable';
import SearchDsTable from '../tables/searchDsTable';

const SiteDatasheet = connect(
  'doSitesDatasheetLoadData',
  'doUpdateSitesDatasheetParams',
  'selectSitesData',
  'selectMoriverSitesDatasheetTotalResults',
  'selectSearchEffortSitesDatasheetTotalResults',
  ({
    doSitesDatasheetLoadData,
    doUpdateSitesDatasheetParams,
    sitesData,
    moriverSitesDatasheetTotalResults,
    searchEffortSitesDatasheetTotalResults,
  }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const { siteId } = sitesData[0];

    useEffect(() => {
      const params = { siteId: siteId };
      doUpdateSitesDatasheetParams(params);
    }, [siteId, currentTab, doUpdateSitesDatasheetParams]);

    useEffect(() => {
      doSitesDatasheetLoadData();
    }, [siteId, currentTab]);

    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-7'>
            <h4>Datasheets for Site ID: {siteId}</h4>
          </div>
        </div>
        {/* Top Level Info */}
        <DataHeader id={siteId} />
        {/* Tab Container */}
        <Card>
          <Card.Header text='Datasheet Workflows' />
          <Card.Body>
            <p>Select any tab to view Missouri River or Search Effort datasheet data for Site ID: {siteId}. Click on the datasheet ID number to view/edit data and any related data.</p>
            <TabContainer
              tabs={[
                {
                  title: `Missouri River (${moriverSitesDatasheetTotalResults})`,
                  content: <MissouriDsTable />,
                },
                {
                  title: `Search Effort (${searchEffortSitesDatasheetTotalResults})`,
                  content: <SearchDsTable />
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

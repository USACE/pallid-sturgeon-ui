import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';
import FindDataSheet from './components/find-data-sheet';
import NewSite from './components/new-site';
import SitesListTable from './components/sites-list-table';

import './dataentry.scss';

export default connect(
  ({ }) => {
    const [sitesList, setSitesList] = useState([]);

    useEffect(() => {
      setSitesList([
        {
          id: 1,
          fieldOffice: 'NE-Nebraska Game and Parks Commission',
          project: '1 - Pallid Sturgeon Poulation Assessment',
          segment: '8 - Ponca to Platte River Confluence',
          season: 'MR-Mark Recapture',
          sampleUnit: 17,
          sampleUnitType: 5,
          bendRN: 'R',
          bendRiverMile: 742.5
        },
        {
          id: 2,
          fieldOffice: 'NE-Nebraska Game and Parks Commission2',
          project: '1 - Pallid Sturgeon Poulation Assessment',
          segment: '8 - Ponca to Platte River Confluence',
          season: 'MR-2',
          sampleUnit: 17,
          sampleUnitType: 5,
          bendRN: 'R',
          bendRiverMile: 742.5
        }
      ]);
    }, []);

    return (
      <div className='container-fluid'>
        <Card className='mb-3'>
          <Card.Header text='Create New Site' />
          <Card.Body>
            <NewSite />
          </Card.Body>
        </Card>
        <Card className='mb-3'>
          <Card.Header text='Find Data Sheet by ID' />
          <Card.Body>
            <FindDataSheet/>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header text='Site Search Filter' />
          <Card.Body>
            <SitesListTable sitesList={sitesList} />
          </Card.Body>
        </Card>
      </div>
    );
  }
);

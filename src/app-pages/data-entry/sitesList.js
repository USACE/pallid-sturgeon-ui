import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Accordion from './components/accordion';
import NewSite from './components/new-site';

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
        <NewSite />
        <Accordion />
      </div>
    );
  }
);

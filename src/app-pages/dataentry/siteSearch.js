import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';
import Accordion from './components/accordion';
import User from '../../app-components/user/user';
import Breadcrumb from '../../app-components/breadcrumb/breadcrumb';
import NewSite from './components/newSite';

import './dataentry.scss';

export default connect(
  'selectProjectsByRoute',
  'selectInstrumentsItems',
  'doModalOpen',
  ({
    doModalOpen,
  }) => {
    const [sitesList, setSitesList] = useState([]);


    useEffect(() => {
      setSitesList([{id: 1,
        fieldOffice: 'NE-Nebraska Game and Parks Commission',
        project: '1 - Pallid Sturgeon Poulation Assessment',
        segment: '8 - Ponca to Platte River Confluence',
        season: 'MR-Mark Recapture',
        sampleUnit: 17,
        sampleUnitType: 5,
        bendRN: 'R',
        bendRiverMile: 742.5
      },
      {id: 2,
        fieldOffice: 'NE-Nebraska Game and Parks Commission2',
        project: '1 - Pallid Sturgeon Poulation Assessment',
        segment: '8 - Ponca to Platte River Confluence',
        season: 'MR-2',
        sampleUnit: 17,
        sampleUnitType: 5,
        bendRN: 'R',
        bendRiverMile: 742.5
      }]);
    }, []);

    return (
      <div className='container pt-1 mb-5'>
        <div className='row'>
          <div className='col-8'>
            <Breadcrumb />
          </div>
          <div className='col-4'>
            <User />
          </div>
        </div>
        <NewSite />
        <Accordion />
      </div>
    );
  }
);

import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import SitesListTable from './sites-list-table';
import FindDataSheet from './find-data-sheet';

import '../../../css/accordion.scss';

const Accordion = connect(
  ({
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
      <>
        <div>
          <div id='accordion' class='accordion'>
            <div class='card mb-0'>
              <div class='card-header' data-toggle='collapse' href='#collapseOne'>
                <a class='card-title'> Find Data Sheet by ID </a>
              </div>
              <div id='collapseOne' class='card-body' data-parent='#accordion'>
                <FindDataSheet/>
              </div>
              <div class='card-header' data-toggle='collapse' data-parent='#accordion' href='#collapseTwo'>
                <a class='card-title'> Site Search Filter </a>
              </div>
              <div id='collapseTwo' class='card-body' data-parent='#accordion'>
                <SitesListTable sitesList={sitesList} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default Accordion;

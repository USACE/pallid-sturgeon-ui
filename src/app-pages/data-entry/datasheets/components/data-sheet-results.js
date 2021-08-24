import React from 'react';
import { connect } from 'redux-bundler-react';

import FishTable from '../tables/fishTable';
import MissouriRiverTable from '../tables/missouriRiverTable';
import SupplementalTable from '../tables/supplementalTable';

const ActiveTable = ({ type }) => (
  <>
    {type === 'missouriRiver' && (
      <MissouriRiverTable />
    )}
    {type === 'supplemental' && (
      <SupplementalTable />
    )}
    {type === 'fish' && (
      <FishTable />
    )}
  </>
);

const DataSheetResults = connect(
  'selectDataEntryActiveType',
  ({
    dataEntryActiveType,
  }) => (
    <div>
      {dataEntryActiveType ? (
        <ActiveTable type={dataEntryActiveType} />
      ) : (
        <span>
          Search for data sheets using the above criteria to display the results here.
        </span>
      )}
    </div>
  )
);

export default DataSheetResults;


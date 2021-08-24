import React from 'react';
import { connect } from 'redux-bundler-react';

import FishTable from '../tables/fishTable';
import MissouriRiverTable from '../tables/missouriRiverTable';
import SupplementalTable from '../tables/supplementalTable';

const ActiveTable = ({ type, data }) => (
  <>
    {type === 'missouriRiver' && (
      <MissouriRiverTable rowData={data} />
    )}
    {type === 'supplemental' && (
      <SupplementalTable rowData={data} />
    )}
    {type === 'fish' && (
      <FishTable rowData={data} />
    )}
  </>
);

const DataSheetResults = connect(
  'selectDataEntryRowData',
  'selectDataEntryActiveType',
  ({
    dataEntryRowData,
    dataEntryActiveType,
  }) => (
    <div>
      {dataEntryActiveType ? (
        <ActiveTable type={dataEntryActiveType} data={dataEntryRowData} />
      ) : (
        <span>
          Search for data sheets using the above criteria to display the results here.
        </span>
      )}
    </div>
  )
);

export default DataSheetResults;


import React from 'react';
import { connect } from 'redux-bundler-react';

import FishTable from '../tables/fishTable';
import MissouriRiverTable from '../tables/missouriRiverTable';
import SupplementalTable from '../tables/supplementalTable';

const ActiveTable = ({ type, data, itemCount }) => (
  <>
    {type === 'missouriRiver' && (
      <MissouriRiverTable rowData={data} itemCount={itemCount} />
    )}
    {type === 'supplemental' && (
      <SupplementalTable rowData={data} itemCount={itemCount} />
    )}
    {type === 'fish' && (
      <FishTable rowData={data} itemCount={itemCount} />
    )}
  </>
);

const DataSheetResults = connect(
  'selectDataEntryRowData',
  'selectDataEntryRowCount',
  'selectDataEntryActiveType',
  ({
    dataEntryRowData,
    dataEntryRowCount,
    dataEntryActiveType,
  }) => (
    <div>
      {dataEntryActiveType ? (
        <ActiveTable type={dataEntryActiveType} data={dataEntryRowData} itemCount={dataEntryRowCount} />
      ) : (
        <span>
          Search for data sheets using the above criteria to display the results here.
        </span>
      )}
    </div>
  )
);

export default DataSheetResults;


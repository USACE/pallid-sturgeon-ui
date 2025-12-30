import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';
import { defaultColDef } from '@src/utils/helpers';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const columnDefs = [
  { field: 'fishCode' },
  { field: 'length' },
  { field: 'weight' },
  { field: 'condition' },
  { field: 'fishId', headerName: 'Fish ID' },
  { field: 'uniqueID' },
  { field: 'year' },
  { field: 'suppId', headerName: 'Supp ID' },
  { field: 'project' },
  { field: 'segment' },
  { field: 'season' },
  { field: 'bend' },
  { field: 'bendrn', headerName: 'Bend R/N' },
  { field: 'bendRiverMile' },
  { field: 'netRiverMile' },
  { field: 'hatcheryOrigin' },
  { field: 'checkedby' },
];

const SupplementalTable = connect(
  'doFetchAllDatasheet',
  'selectSuppDataSummary',
  ({ doFetchAllDatasheet, suppDataSummary }) => {
    const { data } = suppDataSummary;

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon path={mdiDownload} />}
          handleClick={() => doFetchAllDatasheet('supplemental-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact rowData={data} defaultColDef={defaultColDef} columnDefs={columnDefs} />
        </div>
      </>
    );
  }
);

export default SupplementalTable;

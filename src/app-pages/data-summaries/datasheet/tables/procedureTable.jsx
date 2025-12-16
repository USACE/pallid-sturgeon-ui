import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import { defaultColDef } from '@src/utils/helpers';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const columnDefs = [
  { field: 'year' },
  { field: 'fieldOffice' },
  { field: 'project' },
  { field: 'segment' },
  { field: 'season' },
  { field: 'bend' },
  { field: 'bendrn', headerName: 'Bend R/N' },
  { field: 'bendRiverMile' },
  { field: 'id', headerName: 'Procedure ID' },
  { field: 'uniqueId', headerName: 'MR ID' },
  { field: 'purposeCode' },
  { field: 'newRadioTagNum' },
  { field: 'newFrequencyId' },
  { field: 'spawnCode' },
  { field: 'expectedSpawnYear' },
];

const ProcedureTable = connect(
  'doFetchAllDatasheet',
  'selectProcedureDataSummary',
  ({ doFetchAllDatasheet, procedureDataSummary }) => {
    const { data } = procedureDataSummary;

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon path={mdiDownload} />}
          handleClick={() => doFetchAllDatasheet('procedure-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact rowData={data} defaultColDef={defaultColDef} columnDefs={columnDefs} />
        </div>
      </>
    );
  }
);

export default ProcedureTable;

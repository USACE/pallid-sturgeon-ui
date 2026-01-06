import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import { dateFormatter } from '@common/gridHelpers/ag-grid-helper';
import { commonColDef } from '@src/utils/helpers';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const columnDefs = [
  { field: 'year' },
  { field: 'fieldOffice' },
  { field: 'project' },
  { field: 'segment' },
  { field: 'season' },
  { field: 'bend' },
  { field: 'bendrn', headerName: 'Bend R/N' },
  { field: 'bendRiverMile' },
  { field: 'subsample' },
  { field: 'pass' },
  { field: 'uniqueID' },
  { field: 'setDate', valueGetter: (params) => dateFormatter(params.data.setDate) },
  { field: 'conductivity' },
  { field: 'checkedby' },
];

const MissouriRiverTable = connect(
  'doFetchAllDatasheet',
  'selectMissouriDataSummary',
  ({ doFetchAllDatasheet, missouriDataSummary }) => {
    const { data } = missouriDataSummary;

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon path={mdiDownload} />}
          handleClick={() => doFetchAllDatasheet('missouri-river-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact rowData={data} defaultColDef={commonColDef} columnDefs={columnDefs} />
        </div>
      </>
    );
  }
);

export default MissouriRiverTable;

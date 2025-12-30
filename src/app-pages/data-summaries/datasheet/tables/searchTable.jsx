import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import { dateFormatter } from '@common/gridHelpers/ag-grid-helper';
import { defaultColDef } from '@src/utils/helpers';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const columnDefs = [
  { field: 'year' },
  { field: 'fieldOffice' },
  { field: 'projectId' },
  { field: 'segmentId' },
  { field: 'season' },
  { field: 'bend' },
  { field: 'bendRiverMile' },
  { field: 'bendrn', headerName: 'Bend R/N' },
  { field: 'seId', headerName: 'Search Effort ID' },
  { field: 'searchDate', valueGetter: (params) => dateFormatter(params.data.searchDate) },
  { field: 'searchDay' },
  { field: 'recorder' },
  { field: 'searchTypeCode' },
  { field: 'startTime' },
  { field: 'startLattitude' },
  { field: 'startLongitude' },
  { field: 'stopTime' },
  { field: 'stopLattitude' },
  { field: 'stopLongitude' },
  { field: 'temp' },
  { field: 'conductivity' },
  { field: 'checkby' },
];

const SearchTable = connect(
  'doFetchAllDatasheet',
  'selectSearchDataSummary',
  ({ doFetchAllDatasheet, searchDataSummary }) => {
    const { data } = searchDataSummary;

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon path={mdiDownload} />}
          handleClick={() => doFetchAllDatasheet('search-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact rowData={data} defaultColDef={defaultColDef} columnDefs={columnDefs} />
        </div>
      </>
    );
  }
);

export default SearchTable;

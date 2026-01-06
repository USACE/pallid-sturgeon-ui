import { AgGridReact } from 'ag-grid-react';
import { commonColDef } from '@src/utils/helpers';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const columnDefs = [
  { field: 'seId' },
  { field: 'searchDate' },
  { field: 'recorder' },
  { field: 'searchTypeCode' },
  { field: 'startTime' },
  { field: 'startLatitude' },
  { field: 'startLongitude' },
  { field: 'stopTime' },
  { field: 'stopLatitude' },
  { field: 'stopLongitude' },
  { field: 'seFid' },
  { field: 'dsId' },
  { field: 'siteFid' },
  { field: 'temp' },
  { field: 'conductivity' },
];

const DSSearchReportTable = ({ rowData }) => (
  <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
    <AgGridReact rowData={rowData} defaultColDef={commonColDef} columnDefs={columnDefs} />
  </div>
);

export default DSSearchReportTable;

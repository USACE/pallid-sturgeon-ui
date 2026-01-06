import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';

import { dateFormatter } from '@src/common/gridHelpers/ag-grid-helper';
import { commonColDef } from '@src/utils/helpers';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const defaultColDef = { ...commonColDef, width: 100 };

const columnDefs = [
  { field: 'elId', headerName: 'Error Log ID' },
  { field: 'errorEntryDate', width: 150, valueGetter: (params) => dateFormatter(params.data.errorEntryDate) },
  { field: 'errorDescription', width: 350, resizable: true },
  { field: 'errorFixed', width: 130 },
  { field: 'siteId', headerName: 'Site ID' },
  { field: 'year' },
  { field: 'worksheetId', headerName: 'Worksheet ID' },
  { field: 'worksheetTypeId', headerName: 'Worksheet Type ID' },
  { field: 'fieldId', headerName: 'Field ID' },
  { field: 'formId', headerName: 'Form ID' },
  { field: 'errorFixedDate', width: 150, valueGetter: (params) => dateFormatter(params.data.errorFixedDate) },
];

const OfficeErrorLogTable = connect('selectErrorLogData', ({ errorLogData }) => (
  <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
    <AgGridReact defaultColDef={defaultColDef} rowData={errorLogData} columnDefs={columnDefs} />
  </div>
));

export default OfficeErrorLogTable;

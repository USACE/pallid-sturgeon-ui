import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';

import MrIdCellRenderer from '@common/gridCellRenderers/mrIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const defaultColDef = { width: 100, sortable: true, unSortIcon: true };
const frameworkComponents = { mrIdCellRenderer: MrIdCellRenderer };
const missouriRiverFormUri = '/sites-list/datasheet/missouriRiver-edit';

const columnDefs = [
  {
    field: 'mrID',
    headerName: 'MR ID',
    cellRenderer: 'mrIdCellRenderer',
    cellRendererParams: {
      uri: missouriRiverFormUri,
      type: 'home',
    },
  },
  { field: 'fp', headerName: 'Full Project', resizable: true, width: 400 },
  { field: 'speciesCode', width: 125 },
  { field: 'fId', headerName: 'fId' },
  { field: 'mrsiteId', headerName: 'mrSiteId' },
  { field: 'sSiteID', headerName: 'sSiteId' },
  { field: 'GeneticsVialNumber', width: 250 },
];

const UsgNoVialNumbersTable = connect('selectUsgNoVialNumbersData', ({ usgNoVialNumbersData }) => (
  <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
    <AgGridReact
      rowData={usgNoVialNumbersData}
      frameworkComponents={frameworkComponents}
      defaultColDef={defaultColDef}
      columnDefs={columnDefs}
    />
  </div>
));

export default UsgNoVialNumbersTable;

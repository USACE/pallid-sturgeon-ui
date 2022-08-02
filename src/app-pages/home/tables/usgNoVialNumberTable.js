import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import MrIdCellRenderer from 'common/gridCellRenderers/mrIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const UsgNoVialNumbersTable = connect(
  'selectUsgNoVialNumbersData',
  ({
    usgNoVialNumbersData,
  }) => (
    <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
      <AgGridReact
        rowData={usgNoVialNumbersData}
        frameworkComponents={{
          mrIdCellRenderer: MrIdCellRenderer,
        }}
      >
        <AgGridColumn field='fp' headerName='Full Project' resizable width={300} sortable unSortIcon />
        <AgGridColumn field='speciesCode' width={125} sortable unSortIcon />
        <AgGridColumn field='fId' headerName='fId' width={150} sortable unSortIcon />
        <AgGridColumn field='mrID' headerName='mrId' width={150} cellRenderer='mrIdCellRenderer' sortable unSortIcon />
        <AgGridColumn field='mrsiteId' headerName='mrSiteId' width={150} sortable unSortIcon />
        <AgGridColumn field='sSiteID' headerName='sSiteId' width={150} sortable unSortIcon />
        <AgGridColumn field='GeneticsVialNumber' width={250} sortable unSortIcon />
      </AgGridReact>
    </div>
  )
);

export default UsgNoVialNumbersTable;

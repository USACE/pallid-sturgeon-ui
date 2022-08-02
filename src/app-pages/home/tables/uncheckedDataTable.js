import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import MrIdCellRenderer from 'common/gridCellRenderers/mrIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const UncheckedDataTable = connect(
  'selectUncheckedDataSheetsData',
  ({
    uncheckedDataSheetsData,
  }) => (
    <>
      <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
        <AgGridReact
          rowData={uncheckedDataSheetsData}
          frameworkComponents={{
            mrIdCellRenderer: MrIdCellRenderer,
          }}
        >
          <AgGridColumn field='psb' headerName='Project : Segment : Bend' resizable width={300} sortable unSortIcon />
          <AgGridColumn field='fieldoffice' headerName='Field Office' width={125} sortable unSortIcon />
          <AgGridColumn field='recorder' width={150} sortable unSortIcon />
          <AgGridColumn field='mrID' headerName='mrId' width={150} cellRenderer='mrIdCellRenderer' sortable unSortIcon />
          <AgGridColumn field='siteId' width={150} sortable unSortIcon />
          <AgGridColumn field='projectId' width={150} sortable unSortIcon />
          <AgGridColumn field='season' width={150} sortable unSortIcon />
          <AgGridColumn field='segmentId' headerName='Segment' width={150} sortable unSortIcon />
          <AgGridColumn field='subsample' width={150} sortable unSortIcon />
          <AgGridColumn field='gear' width={150} sortable unSortIcon />
          <AgGridColumn field='netrivermile' headerName='Net River Mile' width={150} sortable unSortIcon />
          <AgGridColumn field='cb' headerName='Checked?' width={150} sortable unSortIcon />
          <AgGridColumn field='checkby' width={150} sortable unSortIcon />
        </AgGridReact>
      </div>
    </>
  )
);

export default UncheckedDataTable;

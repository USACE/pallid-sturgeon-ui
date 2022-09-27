import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import Pagination from 'app-components/pagination';
import MrIdCellRenderer from 'common/gridCellRenderers/mrIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const UnapprovedDataTable = connect(
  'doSetHomePagination',
  'selectUnapprovedDataSheets',
  ({
    doSetHomePagination,
    unapprovedDataSheets
  }) => {
    const { data, totalResults } = unapprovedDataSheets;

    return (
      <>
        <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            rowData={data}
            frameworkComponents={{
              mrIdCellRenderer: MrIdCellRenderer,
            }}
          >
            <AgGridColumn field='ch' width={100} sortable unSortIcon />
            <AgGridColumn field='mrId' width={100} cellRenderer='mrIdCellRenderer' cellRendererParams={{ uri: '/sites-list/datasheet/missouriRiver-edit'}} sortable unSortIcon />
            <AgGridColumn field='fp' width={400} resizable sortable unSortIcon />
            <AgGridColumn field='segmentDescription' width={350} resizable sortable unSortIcon />
            <AgGridColumn field='bend' width={100} sortable unSortIcon />
            <AgGridColumn field='subsample' width={120} sortable unSortIcon />
            <AgGridColumn field='recorder' width={100} sortable unSortIcon />
            <AgGridColumn field='checkby' width={100} sortable unSortIcon />
            <AgGridColumn field='netrivermile' width={120} sortable unSortIcon />
            <AgGridColumn field='siteId' width={100} sortable unSortIcon />
            <AgGridColumn field='projectId' width={120} sortable unSortIcon />
            <AgGridColumn field='segmentId' width={120} sortable unSortIcon />
            <AgGridColumn field='season' width={100} sortable unSortIcon />
            <AgGridColumn field='fieldoffice' width={120} sortable unSortIcon />
            <AgGridColumn field='sampleUnitType' width={150} sortable unSortIcon />
            <AgGridColumn field='gear' width={100} sortable unSortIcon />
          </AgGridReact>
        </div>
        <Pagination
          className='mt-2'
          itemCount={totalResults}
          defaultItemsPerPage='100'
          handlePageChange={(pageNumber, pageSize) => doSetHomePagination({ pageSize, pageNumber })} />
      </>
    );
  }
);

export default UnapprovedDataTable;

import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import Pagination from 'app-components/pagination';
import MrIdCellRenderer from 'common/gridCellRenderers/mrIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const BafiDataTable = connect(
  'doSetHomePagination',
  'selectBafiDataSheets',
  ({
    doSetHomePagination,
    bafiDataSheets
  }) => {
    const { data, totalResults } = bafiDataSheets;

    return (
      <>
        <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            rowData={data}
            frameworkComponents={{
              mrIdCellRenderer: MrIdCellRenderer,
            }}
          >
            <AgGridColumn field='mrId' width={100} cellRenderer='mrIdCellRenderer' sortable unSortIcon />
            <AgGridColumn field='fId' width={100} sortable unSortIcon />
            <AgGridColumn field='psb' width={400} resizable sortable unSortIcon />
            <AgGridColumn field='year' width={100} sortable unSortIcon />
            <AgGridColumn field='fieldoffice' width={120} resizable sortable unSortIcon />
            <AgGridColumn field='segmentId' width={120} sortable unSortIcon />
            <AgGridColumn field='bend' width={100} sortable unSortIcon />
            <AgGridColumn field='bendrn' width={100} sortable unSortIcon />
            <AgGridColumn field='bendrivermile' width={150} sortable unSortIcon />
            <AgGridColumn field='panelhook' width={120} sortable unSortIcon />
            <AgGridColumn field='recorder' width={100} sortable unSortIcon />
            <AgGridColumn field='subsample' width={120} sortable unSortIcon />
            <AgGridColumn field='gear' width={100} sortable unSortIcon />
            <AgGridColumn field='fishcount' width={100} sortable unSortIcon />
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

export default BafiDataTable;

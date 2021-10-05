import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import Pagination from 'app-components/pagination';
import MrIdCellRenderer from 'common/gridCellRenderers/mrIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const UncheckedDataTable = connect(
  'doUpdateUncheckedData',
  'selectUncheckedDataSheets',
  ({
    doUpdateUncheckedData,
    uncheckedDataSheets,
  }) => {
    const { data, totalResults } = uncheckedDataSheets;

    return (
      <>
        <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            rowData={data}
            frameworkComponents={{
              mrIdCellRenderer: MrIdCellRenderer,
            }}
          >
            <AgGridColumn field='psb' headerName='Project : Segment : Bend' resizable width={300} />
            <AgGridColumn field='fieldOffice' width={125} />
            <AgGridColumn field='recorder' width={150} />
            <AgGridColumn field='mrId' headerName='mrId' width={150} cellRenderer='mrIdCellRenderer' />
            <AgGridColumn field='siteId' width={150} />
            <AgGridColumn field='projectCode' width={150} />
            <AgGridColumn field='seasonCode' width={150} />
            <AgGridColumn field='segmentCode' width={150} />
            <AgGridColumn field='subsample' width={150} />
            <AgGridColumn field='gearCode' width={150} />
            <AgGridColumn field='netRiver' width={150} />
            <AgGridColumn field='setDate' resizable width={150} />
            <AgGridColumn field='cb' headerName='Checked?' width={150} />
            <AgGridColumn field='checkby' width={150} />
          </AgGridReact>
        </div>
        <Pagination
          className='mt-2'
          itemCount={totalResults}
          handlePageChange={(pageNumber, pageSize) => doUpdateUncheckedData({ pageSize, pageNumber })}
        />
      </>
    );
  }
);

export default UncheckedDataTable;

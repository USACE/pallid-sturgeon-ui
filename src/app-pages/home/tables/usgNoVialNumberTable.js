import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import MrIdCellRenderer from 'common/gridCellRenderers/mrIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const UsgNoVialNumbersTable = connect(
  'selectUsgNoVialNumbers',
  ({
    usgNoVialNumbers,
  }) => {
    const { data } = usgNoVialNumbers;

    return (
      <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
        <AgGridReact
          rowData={data}
          frameworkComponents={{
            mrIdCellRenderer: MrIdCellRenderer,
          }}
        >
          <AgGridColumn field='fp' headerName='Full Project' resizable width={300} />
          <AgGridColumn field='speciesCode' width={125} />
          <AgGridColumn field='fId' headerName='fId' width={150} />
          <AgGridColumn field='mrID' headerName='mrId' width={150} cellRenderer='mrIdCellRenderer' />
          <AgGridColumn field='mrsiteId' headerName='mrSiteId' width={150} />
          <AgGridColumn field='sSiteID' headerName='sSiteId' width={150} />
          <AgGridColumn field='GeneticsVialNumber' width={250} />
        </AgGridReact>
      </div>
    );
  }
);

export default UsgNoVialNumbersTable;

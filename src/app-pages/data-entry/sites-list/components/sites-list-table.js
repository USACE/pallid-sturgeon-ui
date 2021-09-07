import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import DownloadAsCSV from 'app-components/downloadAsCSV';
import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SitesListTable = connect(
  'doModalOpen',
  'selectSitesData',
  ({
    doModalOpen,
    sitesData,
  }) => (
    <div className='pt-3'>
      <DownloadAsCSV filePrefix='site-table' content={sitesData} />
      <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
        <AgGridReact
          suppressClickEdit
          rowHeight={35}
          defaultColDef={{
            editable: true,
            lockPinned: true,
          }}
          rowData={sitesData}
          editType='fullRow'
          frameworkComponents={{
            editCellRenderer: EditCellRenderer,
          }}
        >
          <AgGridColumn
            field='edit'
            width={90}
            pinned
            lockPosition
            cellRenderer='editCellRenderer'
            editable={false}
          />
          <AgGridColumn field='fieldOffice' />
          <AgGridColumn field='project' />
          <AgGridColumn field='segment' />
          <AgGridColumn field='season' />
          <AgGridColumn field='sampleUnitTypeCode' headerName='Sample Unit Type' />
          <AgGridColumn field='bendrn' headerName='Bend R/N' />
          <AgGridColumn field='bendRiverMile' />
          <AgGridColumn field='comments' />
        </AgGridReact>
      </div>
    </div>
  )
);

export default SitesListTable;

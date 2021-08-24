import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from 'app-components/downloadAsCSV';
import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import Pagination from 'app-components/pagination';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const MissouriRiverTable = ({ rowData = [], itemCount = 0, handleChange = () => {} }) => (
  <>
    <DownloadAsCSV content={rowData} filePrefix='missouri-river-datasheets' />
    <div className='ag-theme-balham' style={{ width: '100%', height: '400px' }}>
      <AgGridReact
        rowHeight={35}
        rowData={rowData}
        frameworkComponents={{
          editCellRenderer: EditCellRenderer,
        }}
      >
        <AgGridColumn field='edit' cellRenderer='editCellRenderer' width={75} />
        <AgGridColumn field='mrId' />
        <AgGridColumn field='siteId' />
        <AgGridColumn field='season' />
        <AgGridColumn field='gear' />
        <AgGridColumn field='gearType' />
        <AgGridColumn field='recorder' />
        <AgGridColumn field='setdate' headerName='Set Date' />
        <AgGridColumn field='fieldOffice' />
      </AgGridReact>
    </div>
    <Pagination
      className='mt-2'
      defaultItemsPerPage={20}
      itemCount={itemCount}
      handlePageChange={(pageNumber, pageSize) => handleChange(pageNumber, pageSize)}
    />
  </>
);

export default MissouriRiverTable;
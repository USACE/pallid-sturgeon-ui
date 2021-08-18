import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from '../components/downloadAsCSV';
import Pagination from 'app-components/pagination';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const MissouriRiverTable = ({ rowData = [], itemCount = 0 }) => (
  <>
    <DownloadAsCSV content={rowData} filePrefix='missouri-river-data' />
    <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
      <AgGridReact rowData={rowData}>
        <AgGridColumn field='year' />
        <AgGridColumn field='fieldOffice' sortable />
        <AgGridColumn field='project' />
        <AgGridColumn field='segment' />
        <AgGridColumn field='season' />
        <AgGridColumn field='bend' />
        <AgGridColumn field='bendrn' headerName='Bend R/N' />
        <AgGridColumn field='bendRiverMile' />
        <AgGridColumn field='subsample' />
        <AgGridColumn field='pass' />
        <AgGridColumn field='uniqueID' sortable />
        <AgGridColumn field='setDate' sortable />
        <AgGridColumn field='conductivity' sortable />
        <AgGridColumn field='checkedby' sortable />
      </AgGridReact>
    </div>
    <Pagination
      className='mt-2'
      defaultItemsPerPage={20}
      itemCount={itemCount}
      handlePageChange={() => {}}
    />
  </>
);

export default MissouriRiverTable;

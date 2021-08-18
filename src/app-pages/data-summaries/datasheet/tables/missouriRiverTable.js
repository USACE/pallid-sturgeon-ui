import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from '../components/downloadAsCSV';
import Pagination from 'app-components/pagination';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const MissouriRiverTable = ({ rowData = [], itemCount = 0, handleChange = () => {} }) => (
  <>
    <DownloadAsCSV content={rowData} filePrefix='missouri-river-data' />
    <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
      <AgGridReact rowData={rowData}>
        <AgGridColumn field='year' />
        <AgGridColumn field='fieldOffice' sortable unSortIcon />
        <AgGridColumn field='project' />
        <AgGridColumn field='segment' />
        <AgGridColumn field='season' />
        <AgGridColumn field='bend' />
        <AgGridColumn field='bendrn' headerName='Bend R/N' />
        <AgGridColumn field='bendRiverMile' />
        <AgGridColumn field='subsample' />
        <AgGridColumn field='pass' />
        <AgGridColumn field='uniqueID' sortable unSortIcon />
        <AgGridColumn field='setDate' sortable unSortIcon />
        <AgGridColumn field='conductivity' sortable unSortIcon />
        <AgGridColumn field='checkedby' sortable unSortIcon />
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

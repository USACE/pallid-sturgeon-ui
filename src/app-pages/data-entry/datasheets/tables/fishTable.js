import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from 'app-components/downloadAsCSV';
import Pagination from 'app-components/pagination/pagination';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const FishTable = ({ rowData = [], itemCount = 0, handleChange = () => {} }) => (
  <>
    <DownloadAsCSV content={rowData} filePrefix='fish-datasheets' />
    <div className='ag-theme-balham' style={{ width: '100%', height: '400px' }}>
      <AgGridReact rowData={rowData}>
        <AgGridColumn field='uniqueID' sortable unSortIcon />
        <AgGridColumn field='fishId' sortable unSortIcon />
        <AgGridColumn field='year' />
        <AgGridColumn field='fieldOffice' sortable unSortIcon />
        <AgGridColumn field='project' />
        <AgGridColumn field='segment' />
        <AgGridColumn field='season' />
        <AgGridColumn field='bend' />
        <AgGridColumn field='bendrn' headerName='Bend R/N' />
        <AgGridColumn field='bendRiverMile' />
        <AgGridColumn field='panelhook' headerName='Panel/Hook' />
        <AgGridColumn field='species' />
        <AgGridColumn field='hatcheryOrigin' />
        <AgGridColumn field='checkedby' />
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

export default FishTable;

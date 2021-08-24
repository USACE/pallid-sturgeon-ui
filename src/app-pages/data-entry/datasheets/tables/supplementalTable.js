import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from 'app-components/downloadAsCSV';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SupplementalTable = ({ rowData = [], itemCount = 0, handleChange = () => {} }) => (
  <>
    <DownloadAsCSV content={rowData} filePrefix='supplemental-datasheets' />
    <div className='ag-theme-balham' style={{ width: '100%', height: '400px' }}>
      <AgGridReact rowData={rowData}>
        <AgGridColumn field='fishCode' />
        <AgGridColumn field='fishId' sortable unSortIcon />
        <AgGridColumn field='uniqueID' sortable unSortIcon />
        <AgGridColumn field='year' />
        <AgGridColumn field='suppId' sortable unSortIcon />
        <AgGridColumn field='fieldOffice' sortable unSortIcon />
        <AgGridColumn field='project' />
        <AgGridColumn field='segment' />
        <AgGridColumn field='season' />
        <AgGridColumn field='bend' />
        <AgGridColumn field='bendrn' headerName='Bend R/N' />
        <AgGridColumn field='bendRiverMile' />
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

export default SupplementalTable;

import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from '../components/downloadAsCSV';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SupplementalTable = ({ rowData = [] }) => (
  <>
    <DownloadAsCSV content={rowData} filePrefix='supplemental-data' />
    <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
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
  </>
);

export default SupplementalTable;

import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from 'app-components/downloadAsCSV';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const FishTable = ({ rowData = [] }) => (
  <>
    <DownloadAsCSV content={rowData} filePrefix='fish-data' />
    <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
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
  </>
);

export default FishTable;

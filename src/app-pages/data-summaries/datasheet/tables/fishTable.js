import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from '../components/downloadAsCSV';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const FishTable = ({ rowData = [] }) => (
  <>
    <DownloadAsCSV />
    <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
      <AgGridReact rowData={rowData}>
        <AgGridColumn field='uniqueID' sortable />
        <AgGridColumn field='fishId' sortable />
        <AgGridColumn field='year' />
        <AgGridColumn field='fieldOffice' sortable />
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

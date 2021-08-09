import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from '../components/downloadAsCSV';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const DSSearchReportTable = () => (
  <>
    <DownloadAsCSV />
    <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
      <AgGridReact rowData={[]}>
        <AgGridColumn field='Link' sortable />
        <AgGridColumn field='Se ID' sortable />
        <AgGridColumn field='Search Date' sortable />
        <AgGridColumn field='Recorder' sortable />
        <AgGridColumn field='Search Type Code' sortable />
        <AgGridColumn field='Start Time' sortable />
        <AgGridColumn field='Start Latitude' sortable />
        <AgGridColumn field='Start Longitude' sortable />
        <AgGridColumn field='Stop Time' sortable />
        <AgGridColumn field='Stop Latitude' sortable />
        <AgGridColumn field='Stop Longitude' sortable />
        <AgGridColumn field='Se Fid' sortable />
        <AgGridColumn field='DS ID' sortable />
        <AgGridColumn field='Site ID' sortable />
        <AgGridColumn field='Site Fid' sortable />
        <AgGridColumn field='Temp' sortable />
        <AgGridColumn field='Conductivity' sortable />
      </AgGridReact>
    </div>
  </>
);

export default DSSearchReportTable;

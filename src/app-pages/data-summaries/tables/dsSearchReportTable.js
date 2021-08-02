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
        <AgGridColumn field='Link' />
        <AgGridColumn field='Se ID' />
        <AgGridColumn field='Search Date' />
        <AgGridColumn field='Recorder' />
        <AgGridColumn field='Search Type Code' />
        <AgGridColumn field='Start Time' />
        <AgGridColumn field='Start Latitude' />
        <AgGridColumn field='Start Longitude' />
        <AgGridColumn field='Stop Time' />
        <AgGridColumn field='Stop Latitude' />
        <AgGridColumn field='Stop Longitude' />
        <AgGridColumn field='Se Fid' />
        <AgGridColumn field='DS ID' />
        <AgGridColumn field='Site ID' />
        <AgGridColumn field='Site Fid' />
        <AgGridColumn field='Temp' />
        <AgGridColumn field='Conductivity' />
      </AgGridReact>
    </div>
  </>
);

export default DSSearchReportTable;

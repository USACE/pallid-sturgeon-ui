import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from '../components/downloadAsCSV';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const TelemetryTable = () => (
  <>
    <DownloadAsCSV />
    <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
      <AgGridReact rowData={[]}>
        <AgGridColumn field='Bend' />
        <AgGridColumn field='Conductivity' sortable />
        <AgGridColumn field='Radio Tag Number' />
        <AgGridColumn field='Frequency' />
        <AgGridColumn field='Capture Time' />
        <AgGridColumn field='Capture Latitude' />
        <AgGridColumn field='Capture Longitude' />
        <AgGridColumn field='Position Confidence' />
        <AgGridColumn field='Macro Habitat Code' />
        <AgGridColumn field='Meso Habitat Code' />
        <AgGridColumn field='Depth' />
        <AgGridColumn field='Last Updated' />
      </AgGridReact>
    </div>
  </>
);

export default TelemetryTable;

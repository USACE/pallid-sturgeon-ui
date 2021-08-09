import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from '../components/downloadAsCSV';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const FishTable = () => (
  <>
    <DownloadAsCSV />
    <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
      <AgGridReact rowData={[]}>
        <AgGridColumn field='Unique ID' sortable />
        <AgGridColumn field='Fish ID' sortable />
        <AgGridColumn field='Year' />
        <AgGridColumn field='Field Office' sortable />
        <AgGridColumn field='Project' />
        <AgGridColumn field='Segment' />
        <AgGridColumn field='Season' />
        <AgGridColumn field='Bend' />
        <AgGridColumn field='Bend R/N' />
        <AgGridColumn field='Bend River Mile' />
        <AgGridColumn field='Panel/Hook' />
        <AgGridColumn field='Species' />
        <AgGridColumn field='Hatchery Origin' />
        <AgGridColumn field='Checkby' />
      </AgGridReact>
    </div>
  </>
);

export default FishTable;

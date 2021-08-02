import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const FishTable = () => (
  <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
    <AgGridReact rowData={[]}>
      <AgGridColumn field='Unique ID' />
      <AgGridColumn field='Fish ID' />
      <AgGridColumn field='Year' />
      <AgGridColumn field='Field Office' />
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
);

export default FishTable;

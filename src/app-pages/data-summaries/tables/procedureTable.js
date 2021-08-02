import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from '../components/downloadAsCSV';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const ProcedureTable = () => (
  <>
    <DownloadAsCSV />
    <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
      <AgGridReact rowData={[]}>
        <AgGridColumn field='Last Updated' />
        <AgGridColumn field='Purpose Code' />
        <AgGridColumn field='Procedure Date' />
        <AgGridColumn field='Procedure Start Time' />
        <AgGridColumn field='Procedure End Time' />
        <AgGridColumn field='Procedure By' />
        <AgGridColumn field='Antibiotic Injection Ind' />
        <AgGridColumn field='Photo Dorsal Ind' />
        <AgGridColumn field='Photo Ventral Ind' />
        <AgGridColumn field='Photo Left Ind' />
        <AgGridColumn field='Old Radio Tag Num' />
        <AgGridColumn field='Old Frequency ID' />
        <AgGridColumn field='DST Serial Num' />
        <AgGridColumn field='DST Start Date' />
        <AgGridColumn field='DST Start Time' />
        <AgGridColumn field='DST Reimplant ID' />
        <AgGridColumn field='New Radio Tag Num' />
        <AgGridColumn field='New Frequency ID' />
        <AgGridColumn field='Sex Code' />
        <AgGridColumn field='Fish Health Comments' />
        <AgGridColumn field='Spawn Code' />
        <AgGridColumn field='Eval Location Code' />
        <AgGridColumn field='Blood Sample Ind' />
        <AgGridColumn field='Egg Sample Ind' />
        <AgGridColumn field='Visual Repro Status Code' />
        <AgGridColumn field='Ultrasound Repro Status Code' />
        <AgGridColumn field='Ultrasound Gonad Length' />
        <AgGridColumn field='Gonad Condition' />
        <AgGridColumn field='Expected Spawn Year' />
      </AgGridReact>
    </div>
  </>
);

export default ProcedureTable;

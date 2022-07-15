import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const ProcedureTable = ({ doFetchAllDatasheet, rowData = [] }) => (
  <>
    <Button
      isOutline
      size='small'
      variant='info'
      text='Export as CSV'
      icon={<Icon icon='download' />}
      handleClick={() => doFetchAllDatasheet('procedure-datasheet')}
    />
    <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
      <AgGridReact rowData={rowData}>
        <AgGridColumn headerName='ID' field='id' />
        {/* <AgGridColumn headerName='UniqueID' field='uniqueId' />
        <AgGridColumn headerName='Year' field='year' />
        <AgGridColumn headerName='Field Office' field='fieldOffice' />
        <AgGridColumn headerName='Project' field='project' />
        <AgGridColumn headerName='Segment' field='segment' />
        <AgGridColumn headerName='Season' field='season' /> */}
        <AgGridColumn headerName='Purpose Code' field='purposeCode' />
        <AgGridColumn headerName='Procedure Date' field='procedureDate' />
        {/* <AgGridColumn headerName='Procedure Start Time' field='procedureStartTime' />
        <AgGridColumn headerName='Procedure End Time' field='procedureEndTime' />
        <AgGridColumn headerName='Procedure By' field='procedureBy' />
        <AgGridColumn headerName='Antibiotic Injection Ind' field='antibioticInjectionInd' />
        <AgGridColumn headerName='Photo Dorsal Ind'  field='photoDorsalInd' />
        <AgGridColumn headerName='Photo Ventral Ind' field='photoVentralInd' />
        <AgGridColumn headerName='Photo Left Ind' field='photoLeftInd' />
        <AgGridColumn headerName='Old Radio Tag Num' field='oldRadioTagNum' />
        <AgGridColumn headerName='Old Frequency ID' field='oldFrequencyId' />
        <AgGridColumn headerName='DST Serial Num' field='dstSerialNum' />
        <AgGridColumn headerName='DST Start Date' field='dstStartDate' />
        <AgGridColumn headerName='DST Start Time' field='dstStartTime' />
        <AgGridColumn headerName='DST Reimplant ID' field='dstReimplantInd' /> */}
        <AgGridColumn headerName='New Radio Tag Num' field='newRadioTagNum' />
        <AgGridColumn headerName='New Frequency ID' field='newFrequencyId' />
        {/* <AgGridColumn headerName='Sex Code' field='sexCode' />
        <AgGridColumn headerName='Fish Health Comments' field='fishHealthComments' /> */}
        <AgGridColumn headerName='Spawn Code' field='spawnCode' />
        {/* <AgGridColumn headerName='Eval Location Code' field='evalLocationCode' />
        <AgGridColumn headerName='Blood Sample Ind' field='bloodSampleInd' />
        <AgGridColumn headerName='Egg Sample Ind' field='eggSampleInd' />
        <AgGridColumn headerName='Visual Repro Status Code' field='visualReproStatusCode' />
        <AgGridColumn headerName='Ultrasound Repro Status Code' field='ultrasoundReproStatusCode' />
        <AgGridColumn headerName='Ultrasound Gonad Length' field='ultrasoundGonadLength' />
        <AgGridColumn headerName='Gonad Condition' field='gonadCondition' /> */}
        <AgGridColumn headerName='Expected Spawn Year' field='expectedSpawnYear' />
      </AgGridReact>
    </div>
  </>
);

export default connect('doFetchAllDatasheet', ProcedureTable);

import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const ProcedureTable = connect(
  'doFetchAllDatasheet',
  'selectProcedureDataSummary',
  ({ 
    doFetchAllDatasheet, 
    procedureDataSummary
  }) => {
    const { data } = procedureDataSummary;

    return (
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
          <AgGridReact rowData={data}>
            <AgGridColumn headerName='ID' field='id' sortable unSortIcon />
            <AgGridColumn headerName='UniqueID' field='uniqueId' sortable unSortIcon />
            <AgGridColumn headerName='Year' field='year' />
            <AgGridColumn headerName='Field Office' field='fieldOffice' />
            <AgGridColumn headerName='Project' field='project' />
            <AgGridColumn headerName='Segment' field='segment' />
            <AgGridColumn headerName='Season' field='season' />
            <AgGridColumn headerName='Purpose Code' field='purposeCode' sortable unSortIcon />
            <AgGridColumn headerName='New Radio Tag Num' field='newRadioTagNum' sortable unSortIcon />
            <AgGridColumn headerName='New Frequency ID' field='newFrequencyId' sortable unSortIcon />
            <AgGridColumn headerName='Spawn Code' field='spawnCode' sortable unSortIcon />
            <AgGridColumn headerName='Expected Spawn Year' field='expectedSpawnYear' sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );});

export default ProcedureTable;

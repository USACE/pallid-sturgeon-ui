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
          <AgGridReact 
            rowData={data}
            defaultColDef={{
              width: 150,
            }}
          >
            {/* @TODO: Confirm with Coral about the displayed fields vs Apex */}
            <AgGridColumn field='year' />
            <AgGridColumn field='fieldOffice' />
            <AgGridColumn field='project' />
            <AgGridColumn field='segment' />
            <AgGridColumn field='season' />
            <AgGridColumn field='bend' />
            <AgGridColumn field='bendrn' />
            <AgGridColumn field='bendRiverMile' />
            <AgGridColumn headerName='Procedure ID' field='id' sortable unSortIcon />
            <AgGridColumn headerName='MR ID' field='uniqueId' sortable unSortIcon />
            <AgGridColumn field='purposeCode' sortable unSortIcon />
            <AgGridColumn field='newRadioTagNum' sortable unSortIcon />
            <AgGridColumn field='newFrequencyId' sortable unSortIcon />
            <AgGridColumn headerName='Spawn Code' field='spawnCode' sortable unSortIcon />
            <AgGridColumn headerName='Expected Spawn Year' field='expectedSpawnYear' sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );});

export default ProcedureTable;

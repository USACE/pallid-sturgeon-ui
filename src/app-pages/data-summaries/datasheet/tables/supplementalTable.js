import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SupplementalTable = connect(
  'doFetchAllDatasheet',
  'selectSuppDataSummary',
  ({
    doFetchAllDatasheet,
    suppDataSummary
  }) => {
    const { data } = suppDataSummary;

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon icon='download' />}
          handleClick={() => doFetchAllDatasheet('supplemental-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact 
            rowData={data}
            defaultColDef={{
              width: 150,
            }}
          >
            <AgGridColumn field='fishCode' />
            <AgGridColumn field='fishId' headerName='Fish ID' sortable unSortIcon />
            <AgGridColumn field='uniqueID' sortable unSortIcon />
            <AgGridColumn field='year' />
            <AgGridColumn field='suppId' headerName='Supp ID' sortable unSortIcon />
            <AgGridColumn field='project' />
            <AgGridColumn field='segment' />
            <AgGridColumn field='season' />
            <AgGridColumn field='bend' />
            <AgGridColumn field='bendrn' headerName='Bend R/N' />
            <AgGridColumn field='bendRiverMile' />
            <AgGridColumn field='hatcheryOrigin' />
            <AgGridColumn field='checkedby' />
          </AgGridReact>
        </div>
      </>
    );}
);

export default SupplementalTable;

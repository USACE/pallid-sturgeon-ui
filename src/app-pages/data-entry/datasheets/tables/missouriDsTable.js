import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const MissouriDsTable = connect(
  'doUpdateUrl',
  ({
    doUpdateUrl,
    rowData = [],
  }) => (
    <>
      <Button
        isOutline
        size='small'
        variant='info'
        text='Export as CSV'
        icon={<Icon icon='download' />}
      // handleClick={() => doFetchAllDatasheet('missouri-river-datasheet')}
      />
      <Button
        isOutline
        size='small'
        variant='info'
        text='Create Missouri River Datasheet'
        title='Create Missouri River Datasheet'
        className='float-right mr-2'
        handleClick={() => doUpdateUrl('/sites-list/datasheet/missouriRiver/create')}
      />
      <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
        <AgGridReact
          suppressClickEdit
          rowHeight={35}
          rowData={rowData}
          editType='fullRow'
          // onRowValueChanged={({ data }) => doUpdateRoleOffice(data)}
          defaultColDef={{
            width: 150,
            editable: true,
            lockPinned: true,
          }}
          frameworkComponents={{
            editCellRenderer: EditCellRenderer,
          }}
        >
          <AgGridColumn
            field='edit'
            width={90}
            pinned
            lockPosition
            cellRenderer='editCellRenderer'
            editable={false}
          />
          <AgGridColumn field='mrId' headerName='MR ID' sortable unSortIcon />
          <AgGridColumn field='fieldOffice' sortable unSortIcon />
          <AgGridColumn field='project' />
          <AgGridColumn field='segment' />
          <AgGridColumn field='season' />
          {/* <AgGridColumn field='bend' />
          <AgGridColumn field='bendrn' headerName='Bend R/N' />
          <AgGridColumn field='bendRiverMile' /> */}
          <AgGridColumn field='subsample' />
          <AgGridColumn field='subsamplepass' />
          {/* <AgGridColumn field='setDate' sortable unSortIcon /> */}
          <AgGridColumn field='conductivity' sortable unSortIcon />
          <AgGridColumn field='checkedby' sortable unSortIcon />
        </AgGridReact>
      </div>
    </>
  )
);

export default MissouriDsTable;

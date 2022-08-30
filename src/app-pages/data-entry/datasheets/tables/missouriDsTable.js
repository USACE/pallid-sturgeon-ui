import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import FishIdCellRenderer from 'common/gridCellRenderers/fishIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const MissouriDsTable = connect(
  'doUpdateUrl',
  ({
    doUpdateUrl,
    rowData = [],
  }) => {

    const fishCellStyle = (params) => ({
      backgroundColor: params.data.bkgColor,
    });

    // const suppCellStyle = (params) => ({
    //   backgroundColor: params.data.suppBkgColor,
    // });

    return (
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
            rowHeight={35}
            rowData={rowData}
            // onRowValueChanged={({ data }) => doUpdateRoleOffice(data)}
            defaultColDef={{
              width: 150,
            }}
            frameworkComponents={{
              editCellRenderer: EditCellRenderer,
              fishIdCellRenderer: FishIdCellRenderer
            }}
          >
            <AgGridColumn field='mrId' sortable unSortIcon />
            <AgGridColumn field='mrFid' sortable unSortIcon />
            <AgGridColumn field='fishCount' headerName='# of Fish' cellStyle={fishCellStyle} cellRenderer='fishIdCellRenderer' sortable unSortIcon />
            <AgGridColumn field='subsample' />
            <AgGridColumn field='subsamplepass' />
            <AgGridColumn field='conductivity' sortable unSortIcon />
            <AgGridColumn field='checkedby' sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default MissouriDsTable;

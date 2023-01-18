import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import FishIdCellRenderer from 'common/gridCellRenderers/fishIdCellRenderer';
import MrIdCellRenderer from 'common/gridCellRenderers/mrIdCellRenderer';

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

    const suppCellStyle = (params) => ({
      backgroundColor: params.data.suppBkgColor,
    });

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon icon='download' />}
          isDisabled
        />
        <Button
          isOutline
          size='small'
          variant='info'
          text='Create Missouri River Datasheet'
          title='Create Missouri River Datasheet'
          className='float-right mr-2'
          handleClick={() => doUpdateUrl('/sites-list/datasheet/missouriRiver-create')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            rowHeight={35}
            rowData={rowData}
            defaultColDef={{
              width: 150,
            }}
            frameworkComponents={{
              editCellRenderer: EditCellRenderer,
              fishIdCellRenderer: FishIdCellRenderer,
              mrIdCellRenderer: MrIdCellRenderer
            }}
          >
            <AgGridColumn field='fishCount' headerName='Fish Datasheet' cellStyle={fishCellStyle} cellRenderer='fishIdCellRenderer' cellRendererParams={{ paramType: 'mrId', uri: '/sites-list/datasheet/fish'}} sortable unSortIcon />
            <AgGridColumn field='suppCount' headerName='Supplemental Datasheet' cellStyle={suppCellStyle} width={200} sortable unSortIcon />
            <AgGridColumn field='procCount' headerName='Procedure Datasheet' width={200} sortable unSortIcon />
            <AgGridColumn field='mrId' headerName='MR ID' cellRenderer='mrIdCellRenderer' cellRendererParams={{ uri: '/sites-list/datasheet/missouriRiver-edit'}} sortable unSortIcon />
            <AgGridColumn field='mrFid' headerName='Field ID' sortable unSortIcon />
            <AgGridColumn field='setDateTime' headerName='Date' sortable unSortIcon />
            <AgGridColumn field='subsample' sortable unSortIcon />
            <AgGridColumn field='gear' headerName='Gear Code' sortable unSortIcon />
            <AgGridColumn field='recorder' headerName='Recorder' sortable unSortIcon />
            <AgGridColumn field='checkby' headerName='Checked?' sortable unSortIcon />
            {/* @TDOD: Check with Tisha on approved field. */}
            <AgGridColumn headerName='Approved?' sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default MissouriDsTable;
